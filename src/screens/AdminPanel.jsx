import { useState } from 'react'
import { getProductById } from '../data/products.js'

export default function AdminPanel({ leads, stats, onExport, onClear, onBack }) {
  const [confirmClear, setConfirmClear] = useState(false)
  const [tab, setTab] = useState('leads')

  const moduleLabel = m => ({ ruleta:'🎡 Ruleta', recomendador:'🔍 Recomendador', catalogo:'📚 Catálogo', asesoria:'💬 Asesoría' })[m] || m || '—'

  return (
    <div className="screen bg-gray-950">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-8 py-4 bg-gray-900 border-b border-gray-800">
        <button onClick={onBack} className="text-gray-400 hover:text-white text-sm flex items-center gap-2 font-medium btn min-h-0 px-3 py-2">
          ← Salir
        </button>
        <div className="flex items-center gap-2">
          <img src="/logo-continental.png" alt="" className="h-7 w-auto logo-white opacity-70" />
          <span className="text-white font-bold text-sm">Panel de administración — Feria Madera</span>
        </div>
        <div className="flex gap-2">
          <button onClick={onExport} disabled={leads.length === 0}
            className="btn bg-green-800 hover:bg-green-700 disabled:opacity-40 text-white font-bold text-sm px-4 py-2 rounded-lg min-h-0">
            📥 Exportar CSV
          </button>
          {!confirmClear
            ? <button onClick={() => setConfirmClear(true)} disabled={leads.length === 0}
                className="btn bg-red-900 hover:bg-red-800 disabled:opacity-40 text-white font-bold text-sm px-4 py-2 rounded-lg min-h-0">
                🗑️ Limpiar
              </button>
            : <div className="flex gap-1.5">
                <button onClick={() => { onClear(); setConfirmClear(false) }}
                  className="btn bg-red-600 text-white font-bold text-xs px-3 py-2 rounded-lg min-h-0">Confirmar</button>
                <button onClick={() => setConfirmClear(false)}
                  className="btn bg-gray-700 text-white font-bold text-xs px-3 py-2 rounded-lg min-h-0">Cancelar</button>
              </div>}
        </div>
      </div>

      {/* Stats bar */}
      <div className="shrink-0 grid grid-cols-5 gap-0 bg-gray-900 border-b border-gray-800">
        {[
          { label: 'Total registros', val: stats.total,        color: 'text-white' },
          { label: 'Vía ruleta',      val: stats.ruleta,       color: 'text-yellow-400' },
          { label: 'Vía recomendador',val: stats.recomendador, color: 'text-blue-400' },
          { label: 'Vía catálogo',    val: stats.catalogo,     color: 'text-green-400' },
          { label: 'Asesorías',       val: stats.asesoria,     color: 'text-purple-400' },
        ].map(s => (
          <div key={s.label} className="text-center py-3 border-r border-gray-800 last:border-0">
            <div className={`text-3xl font-black ${s.color}`}>{s.val}</div>
            <div className="text-gray-500 text-xs mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tab nav */}
      <div className="shrink-0 flex gap-1 px-8 py-3 bg-gray-900 border-b border-gray-800">
        {[['leads','📋 Registros'], ['stats','📊 Estadísticas']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`btn px-4 py-2 rounded-lg text-sm font-medium min-h-0 transition-colors
              ${tab === k ? 'bg-c-blue text-white' : 'text-gray-400 hover:text-white'}`}>
            {l}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 scroll">
        {tab === 'leads' && (
          leads.length === 0
            ? <div className="flex flex-col items-center justify-center h-full"><div className="text-6xl mb-4">📭</div><p className="text-gray-500 text-xl">No hay registros aún</p></div>
            : <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-900 border-b border-gray-800">
                  <tr>
                    {['Fecha/Hora','Módulo','Nombre','Empresa','Cargo','Celular','Correo','Ciudad','Producto rec.','Premio','Datos'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-gray-400 font-semibold whitespace-nowrap text-xs">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leads.map((l, i) => {
                    const d = new Date(l.timestamp)
                    const prod = getProductById(l.productoRecomendado)
                    return (
                      <tr key={l.id} className={`border-b border-gray-900 ${i%2===0?'bg-gray-950':'bg-gray-900/50'} hover:bg-gray-800`}>
                        <td className="px-4 py-3 text-gray-400 whitespace-nowrap text-xs">
                          {d.toLocaleDateString('es-CO')}<br/>
                          <span className="text-gray-600">{d.toLocaleTimeString('es-CO',{hour:'2-digit',minute:'2-digit'})}</span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs">{moduleLabel(l.modulo)}</td>
                        <td className="px-4 py-3 text-white font-medium whitespace-nowrap">{l.nombre||'—'}</td>
                        <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{l.empresa||'—'}</td>
                        <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{l.cargo||'—'}</td>
                        <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{l.celular||'—'}</td>
                        <td className="px-4 py-3 text-gray-400 whitespace-nowrap text-xs">{l.correo||'—'}</td>
                        <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{l.ciudad||'—'}</td>
                        <td className="px-4 py-3 text-gray-300 whitespace-nowrap text-xs">{prod?.shortName||l.productoRecomendado||'—'}</td>
                        <td className="px-4 py-3 text-gray-400 whitespace-nowrap text-xs max-w-32 truncate">{l.premio||'—'}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`text-xs font-bold ${l.aceptaDatos ? 'text-green-400' : 'text-red-400'}`}>
                            {l.aceptaDatos ? '✓' : '✗'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
        )}

        {tab === 'stats' && (
          <div className="p-8 grid grid-cols-2 gap-6">
            {/* Premios */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-white font-black text-lg mb-4">🎁 Premios entregados</h3>
              {Object.entries(stats.premios).length === 0
                ? <p className="text-gray-500 text-sm">Sin datos aún</p>
                : Object.entries(stats.premios).sort((a,b)=>b[1]-a[1]).map(([k,v]) => (
                    <div key={k} className="flex items-center justify-between py-2 border-b border-gray-800">
                      <span className="text-gray-300 text-sm">{k}</span>
                      <span className="text-yellow-400 font-bold">{v}</span>
                    </div>
                  ))
              }
            </div>
            {/* Productos recomendados */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-white font-black text-lg mb-4">🔍 Productos más recomendados</h3>
              {Object.entries(stats.productos).length === 0
                ? <p className="text-gray-500 text-sm">Sin datos aún</p>
                : Object.entries(stats.productos).sort((a,b)=>b[1]-a[1]).map(([k,v]) => {
                    const p = getProductById(k)
                    return (
                      <div key={k} className="flex items-center justify-between py-2 border-b border-gray-800">
                        <span className="text-gray-300 text-sm">{p?.shortName || k}</span>
                        <span className="text-blue-400 font-bold">{v}</span>
                      </div>
                    )
                  })
              }
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
