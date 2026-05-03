import { useState, useCallback } from 'react'

const KEY = 'continental_feria_leads_v2'

const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] } }
const save = (d) => localStorage.setItem(KEY, JSON.stringify(d))

export function useLeads() {
  const [leads, setLeads] = useState(load)

  const addLead = useCallback((data) => {
    const lead = { id: Date.now(), timestamp: new Date().toISOString(), ...data }
    setLeads(prev => { const next = [lead, ...prev]; save(next); return next })
    return lead
  }, [])

  const clearLeads = useCallback(() => { setLeads([]); localStorage.removeItem(KEY) }, [])

  const exportCSV = useCallback(() => {
    const rows = load()
    if (!rows.length) return
    const headers = [
      'ID','Fecha','Hora','Módulo','Nombre','Empresa','Cargo','Celular','Correo','Ciudad',
      'Tipo empresa','Proceso','Sustrato','Necesidad','Tipo aplicación',
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
        l.proceso || '', l.sustrato || '', l.necesidad || '', l.aplicacion || '',
        l.productoRecomendado || '', l.productoAlterno || '',
        l.premio || '',
        l.aceptaDatos ? 'Sí' : 'No',
        l.aceptaContacto ? 'Sí' : 'No',
      ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')
    }
    const csv = [headers.join(','), ...rows.map(toRow)].join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `continental_leads_${new Date().toISOString().slice(0,10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  // Estadísticas para panel admin
  const stats = {
    total:        leads.length,
    ruleta:       leads.filter(l => l.modulo === 'ruleta').length,
    recomendador: leads.filter(l => l.modulo === 'recomendador').length,
    catalogo:     leads.filter(l => l.modulo === 'catalogo').length,
    asesoria:     leads.filter(l => l.modulo === 'asesoria').length,
    premios:      leads.reduce((acc, l) => { if (l.premio) acc[l.premio] = (acc[l.premio]||0)+1; return acc }, {}),
    productos:    leads.reduce((acc, l) => { if (l.productoRecomendado) acc[l.productoRecomendado] = (acc[l.productoRecomendado]||0)+1; return acc }, {}),
  }

  return { leads, addLead, clearLeads, exportCSV, stats }
}
