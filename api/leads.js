import { appLeadToDb, dbLeadToApp } from '../src/services/leadMapping.js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const ADMIN_PIN = process.env.SUPABASE_ADMIN_PIN

function send(res, status, body) {
  res.status(status).json(body)
}

function requireConfig(res) {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    send(res, 500, { error: 'Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en Vercel' })
    return false
  }
  return true
}

function requireAdmin(req, res) {
  if (!ADMIN_PIN) {
    send(res, 500, { error: 'Falta SUPABASE_ADMIN_PIN en Vercel' })
    return false
  }

  if (req.headers['x-admin-pin'] !== ADMIN_PIN) {
    send(res, 401, { error: 'PIN de administrador inválido' })
    return false
  }

  return true
}

function parseBody(req) {
  if (!req.body) return {}
  if (typeof req.body === 'string') return JSON.parse(req.body)
  return req.body
}

async function supabaseFetch(path, options = {}) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  const text = await response.text()
  const body = text ? JSON.parse(text) : null

  if (!response.ok) {
    throw new Error(body?.message || body?.error || 'Error consultando Supabase')
  }

  return body
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method === 'OPTIONS') {
    send(res, 204, {})
    return
  }

  if (!requireConfig(res)) return

  try {
    if (req.method === 'POST') {
      const lead = appLeadToDb(parseBody(req))
      const rows = await supabaseFetch('leads', {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify(lead),
      })

      send(res, 201, dbLeadToApp(rows[0]))
      return
    }

    if (req.method === 'GET') {
      if (!requireAdmin(req, res)) return
      const rows = await supabaseFetch('leads?select=*&order=created_at.desc')
      send(res, 200, rows.map(dbLeadToApp))
      return
    }

    if (req.method === 'DELETE') {
      if (!requireAdmin(req, res)) return
      await supabaseFetch('leads?id=not.is.null', {
        method: 'DELETE',
        headers: { Prefer: 'return=minimal' },
      })
      send(res, 200, { ok: true })
      return
    }

    res.setHeader('Allow', 'GET,POST,DELETE,OPTIONS')
    send(res, 405, { error: 'Método no permitido' })
  } catch (err) {
    send(res, 500, { error: err.message })
  }
}
