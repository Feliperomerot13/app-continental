const text = (value) => String(value ?? '').trim()

export function normalizeTags(tags) {
  if (Array.isArray(tags)) return tags.map(text).filter(Boolean)
  if (typeof tags === 'string') return tags.split(',').map(text).filter(Boolean)
  return []
}

export function appLeadToDb(lead) {
  return {
    modulo: text(lead.modulo || lead.ruta),
    nombre: text(lead.nombre),
    empresa: text(lead.empresa),
    cargo: text(lead.cargo),
    celular: text(lead.celular),
    correo: text(lead.correo),
    ciudad: text(lead.ciudad),
    tipo_empresa: text(lead.tipoEmpresa),
    producto_interes: text(lead.productoInteres),
    comentario: text(lead.comentario),
    proceso: text(lead.proceso),
    sustrato: text(lead.sustrato),
    necesidad: text(lead.necesidad),
    aplicacion: text(lead.aplicacion),
    producto_recomendado: text(lead.productoRecomendado),
    producto_alterno: text(lead.productoAlterno),
    confianza: text(lead.confianza),
    premio: text(lead.premio),
    acepta_datos: Boolean(lead.aceptaDatos),
    acepta_contacto: Boolean(lead.aceptaContacto),
    tags: normalizeTags(lead.tags),
    payload: lead,
  }
}

export function dbLeadToApp(row) {
  return {
    id: row.id,
    timestamp: row.created_at,
    modulo: row.modulo || '',
    nombre: row.nombre || '',
    empresa: row.empresa || '',
    cargo: row.cargo || '',
    celular: row.celular || '',
    correo: row.correo || '',
    ciudad: row.ciudad || '',
    tipoEmpresa: row.tipo_empresa || '',
    productoInteres: row.producto_interes || '',
    comentario: row.comentario || '',
    proceso: row.proceso || '',
    sustrato: row.sustrato || '',
    necesidad: row.necesidad || '',
    aplicacion: row.aplicacion || '',
    productoRecomendado: row.producto_recomendado || '',
    productoAlterno: row.producto_alterno || '',
    confianza: row.confianza || '',
    premio: row.premio || '',
    aceptaDatos: Boolean(row.acepta_datos),
    aceptaContacto: Boolean(row.acepta_contacto),
    tags: normalizeTags(row.tags),
  }
}

export function normalizeLocalLead(lead) {
  return {
    ...lead,
    id: lead.id || (globalThis.crypto?.randomUUID?.() ?? String(Date.now())),
    timestamp: lead.timestamp || new Date().toISOString(),
    tags: normalizeTags(lead.tags),
  }
}
