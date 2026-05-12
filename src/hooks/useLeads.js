import { useCallback, useMemo, useState } from 'react'
import { appLeadToDb, dbLeadToApp, normalizeLocalLead } from '../services/leadMapping.js'

const KEY = 'continental_feria_leads_v2'
const PIN_KEY = 'continental_feria_admin_pin'

const clientSupabaseUrl = import.meta.env.VITE_SUPABASE_URL
const clientSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const configuredBackend = import.meta.env.VITE_LEADS_BACKEND
const hasClientSupabase = Boolean(clientSupabaseUrl && clientSupabaseAnonKey)
const backend = configuredBackend || (import.meta.env.PROD ? 'api' : hasClientSupabase ? 'supabase' : 'local')

const loadLocal = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]').map(normalizeLocalLead)
  } catch {
    return []
  }
}

const saveLocal = (data) => localStorage.setItem(KEY, JSON.stringify(data))

const csvValue = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`

async function parseResponse(response) {
  const text = await response.text()
  const body = text ? JSON.parse(text) : null

  if (!response.ok) {
    throw new Error(body?.error || body?.message || 'No se pudo sincronizar con Supabase')
  }

  return body
}

async function apiRequest(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  return parseResponse(response)
}

async function supabaseRequest(path, options = {}) {
  const response = await fetch(`${clientSupabaseUrl}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: clientSupabaseAnonKey,
      Authorization: `Bearer ${clientSupabaseAnonKey}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  return parseResponse(response)
}

export function useLeads() {
  const [leads, setLeads] = useState(() => backend === 'local' ? loadLocal() : [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [adminPin, setAdminPin] = useState(() => sessionStorage.getItem(PIN_KEY) || '')
  const [adminUnlocked, setAdminUnlocked] = useState(backend === 'local')

  const addLocalLead = useCallback((data) => {
    const lead = normalizeLocalLead(data)
    setLeads(prev => {
      const next = [lead, ...prev]
      saveLocal(next)
      return next
    })
    return lead
  }, [])

  const fetchLeads = useCallback(async (pin = adminPin) => {
    setLoading(true)
    setError('')

    try {
      if (backend === 'api') {
        if (!pin) throw new Error('Ingresa el PIN de administrador')
        const rows = await apiRequest('/api/leads', { headers: { 'x-admin-pin': pin } })
        setLeads(rows.map(normalizeLocalLead))
        setAdminUnlocked(true)
        sessionStorage.setItem(PIN_KEY, pin)
        return true
      }

      if (backend === 'supabase') {
        const rows = await supabaseRequest('leads?select=*&order=created_at.desc')
        setLeads(rows.map(dbLeadToApp).map(normalizeLocalLead))
        setAdminUnlocked(true)
        return true
      }

      setLeads(loadLocal())
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }, [adminPin])

  const unlockAdmin = useCallback(async (pin) => {
    setAdminPin(pin)
    return fetchLeads(pin)
  }, [fetchLeads])

  const addLead = useCallback(async (data) => {
    const localDraft = normalizeLocalLead(data)

    try {
      if (backend === 'api') {
        const saved = await apiRequest('/api/leads', {
          method: 'POST',
          body: JSON.stringify(data),
        })
        const lead = normalizeLocalLead(saved)
        setLeads(prev => adminUnlocked ? [lead, ...prev] : prev)
        return lead
      }

      if (backend === 'supabase') {
        const rows = await supabaseRequest('leads', {
          method: 'POST',
          headers: { Prefer: 'return=representation' },
          body: JSON.stringify(appLeadToDb(data)),
        })
        const lead = normalizeLocalLead(dbLeadToApp(rows[0]))
        setLeads(prev => adminUnlocked ? [lead, ...prev] : prev)
        return lead
      }

      return addLocalLead(localDraft)
    } catch (err) {
      const fallback = addLocalLead(localDraft)
      setError(`Guardado localmente, sin sincronizar: ${err.message}`)
      return fallback
    }
  }, [addLocalLead, adminUnlocked])

  const clearLeads = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      if (backend === 'api') {
        await apiRequest('/api/leads', {
          method: 'DELETE',
          headers: { 'x-admin-pin': adminPin },
        })
      } else if (backend === 'supabase') {
        await supabaseRequest('leads?id=not.is.null', {
          method: 'DELETE',
          headers: { Prefer: 'return=minimal' },
        })
      }

      setLeads([])
      localStorage.removeItem(KEY)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [adminPin])

  const exportCSV = useCallback(() => {
    if (!leads.length) return

    const headers = [
      'ID','Fecha','Hora','Módulo','Nombre','Empresa','Cargo','Celular','Correo','Ciudad',
      'Tipo empresa','Producto interés','Proceso','Sustrato','Necesidad','Tipo aplicación',
      'Producto recomendado','Producto alterno','Premio','Acepta datos','Acepta contacto',
    ]
    const toRow = l => {
      const d = new Date(l.timestamp)
      return [
        l.id,
        d.toLocaleDateString('es-CO'),
        d.toLocaleTimeString('es-CO', { hour:'2-digit', minute:'2-digit' }),
        l.modulo || l.ruta || '',
        l.nombre || '', l.empresa || '', l.cargo || '',
        l.celular || '', l.correo || '', l.ciudad || '',
        l.tipoEmpresa || '',
        l.productoInteres || '',
        l.proceso || '', l.sustrato || '', l.necesidad || '', l.aplicacion || '',
        l.productoRecomendado || '', l.productoAlterno || '',
        l.premio || '',
        l.aceptaDatos ? 'Sí' : 'No',
        l.aceptaContacto ? 'Sí' : 'No',
      ].map(csvValue).join(',')
    }
    const csv = [headers.join(','), ...leads.map(toRow)].join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `continental_leads_${new Date().toISOString().slice(0,10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [leads])

  const stats = useMemo(() => ({
    total:        leads.length,
    ruleta:       leads.filter(l => l.modulo === 'ruleta').length,
    recomendador: leads.filter(l => l.modulo === 'recomendador').length,
    catalogo:     leads.filter(l => l.modulo === 'catalogo').length,
    asesoria:     leads.filter(l => l.modulo === 'asesoria').length,
    premios:      leads.reduce((acc, l) => { if (l.premio) acc[l.premio] = (acc[l.premio]||0)+1; return acc }, {}),
    productos:    leads.reduce((acc, l) => { if (l.productoRecomendado) acc[l.productoRecomendado] = (acc[l.productoRecomendado]||0)+1; return acc }, {}),
  }), [leads])

  const storage = {
    backend,
    loading,
    error,
    adminUnlocked,
    needsAdminPin: backend === 'api',
    cloudEnabled: backend !== 'local',
  }

  return { leads, addLead, clearLeads, exportCSV, stats, storage, fetchLeads, unlockAdmin }
}
