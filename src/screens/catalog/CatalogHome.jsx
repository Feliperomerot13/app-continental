import { useState, useEffect } from 'react'
import TopBar from '../shared/TopBar.jsx'

const byProcess = [
  { key: 'carpinteria', label: 'Carpintería y ebanistería',       icon: '🪚', desc: 'Ensamble y unión de madera sólida, MDF y derivados' },
  { key: 'laminacion',  label: 'Laminación y revestimiento',      icon: '🖼️', desc: 'Enchapes, laminados HPL, fórmica y paneles decorativos' },
  { key: 'postformado', label: 'Postformado',                     icon: '🌡️', desc: 'Encimeras y tableros curvos con laminado de alta presión' },
  { key: 'cantos',      label: 'Pegado de cantos',                icon: '📏', desc: 'Cantos PVC, ABS, poliéster y melamínicos en máquina' },
  { key: 'mixto',       label: 'Aplicaciones mixtas',             icon: '🔄', desc: 'Múltiples materiales y procesos, solución general' },
]

const byFamily = [
  { key: 'PVA',           label: 'Cola PVA',             icon: '🧴', desc: 'Base acuosa para carpintería y ebanistería' },
  { key: 'Solvente',      label: 'Solvente especializado', icon: '🔩', desc: 'Enchapes, laminación, postformado y cantos manuales' },
  { key: 'Hot Melt',      label: 'Hot Melt',             icon: '⚡', desc: 'Fundición en caliente para encoladoras de cantos' },
  { key: 'Multipropósito',label: 'Multipropósito',       icon: '🛠️', desc: 'Solución de respaldo para aplicaciones mixtas' },
]

const allProducts = [
  { key: 'cola-especial-pva',    label: 'Cola Especial PVA',           icon: '🧴' },
  { key: 'cola-pva-continental', label: 'Cola PVA Continental',        icon: '🧴' },
  { key: 'cola-max-pva',         label: 'Cola Max Continental PVA',    icon: '💧' },
  { key: 'plus-madera',          label: 'Plus Madera',                 icon: '🔩' },
  { key: 'super-madera',         label: 'Super Madera',                icon: '⏱️' },
  { key: 'spray-continental',    label: 'Spray Continental',           icon: '🌀' },
  { key: 'hc20',                 label: 'Hot Melt HC20',               icon: '⚡' },
  { key: 'hc38',                 label: 'Hot Melt HC38',               icon: '🔥' },
  { key: 'industrial-amarillo',  label: 'Industrial Continental Amarillo', icon: '🛠️' },
]

export default function CatalogHome({ onFilter, onSelectProduct, onBack, onBrochure }) {
  const [tab, setTab] = useState('process')
  const [ready, setReady] = useState(false)
  useEffect(() => { setTimeout(() => setReady(true), 80) }, [])

  return (
    <div className="screen bg-c-bg-light">
      <TopBar onHome={onBack} label="Catálogo de productos" light />

      <div className={`flex-1 min-h-0 flex flex-col overflow-hidden transition-all duration-400 ${ready ? 'opacity-100' : 'opacity-0'}`}>

        <div className="shrink-0 px-8 pt-5 pb-3 bg-white border-b border-c-border-l">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between mb-3">
            <h2 className="text-2xl font-black text-gray-900">Explora el portafolio de maderas</h2>
            {onBrochure && (
              <button
                onClick={onBrochure}
                className="btn flex items-center gap-2 bg-c-blue/10 hover:bg-c-blue/20 border border-c-blue/30 text-c-blue px-4 py-2 rounded-xl font-semibold text-sm transition-all"
              >
                <span>📖</span>
                Ver catálogo digital
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-2xl w-fit">
            {[
              { key: 'process', label: '⚙️ Por proceso' },
              { key: 'family',  label: '🧪 Por familia' },
              { key: 'product', label: '📦 Por producto' },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`btn px-5 py-2.5 rounded-xl font-semibold text-sm transition-all min-h-0
                  ${tab === t.key ? 'bg-c-blue text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-h-0 px-8 py-5 scroll">
          {tab === 'process' && (
            <div className="grid grid-cols-1 gap-4">
              {byProcess.map(item => (
                <button key={item.key} onClick={() => onFilter('process', item.key, item.label)}
                  className="btn flex items-center gap-5 bg-white hover:bg-c-bg-light border border-c-border-l hover:border-c-blue/40 rounded-2xl p-5 text-left transition-all group">
                  <div className="w-16 h-16 bg-c-bg-light border border-c-border-l rounded-2xl flex items-center justify-center text-3xl shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 font-black text-xl">{item.label}</h3>
                    <p className="text-gray-500 text-sm mt-0.5">{item.desc}</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-300 group-hover:text-c-blue shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          )}

          {tab === 'family' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {byFamily.map(item => (
                <button key={item.key} onClick={() => onFilter('family', item.key, item.label)}
                  className="btn flex flex-col items-start gap-3 bg-white hover:bg-c-bg-light border border-c-border-l hover:border-c-blue/40 rounded-2xl p-6 text-left transition-all">
                  <div className="text-4xl">{item.icon}</div>
                  <div>
                    <h3 className="text-gray-900 font-black text-xl">{item.label}</h3>
                    <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
                  </div>
                  <span className="text-c-blue font-semibold text-sm">Ver productos →</span>
                </button>
              ))}
            </div>
          )}

          {tab === 'product' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {allProducts.map(item => (
                <button key={item.key} onClick={() => onSelectProduct(item.key)}
                  className="btn flex items-center gap-4 bg-white hover:bg-c-bg-light border border-c-border-l hover:border-c-blue/40 rounded-2xl p-5 text-left transition-all">
                  <span className="text-3xl">{item.icon}</span>
                  <span className="text-gray-900 font-bold leading-snug">{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
