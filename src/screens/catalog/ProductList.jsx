import { useState, useEffect } from 'react'
import TopBar from '../shared/TopBar.jsx'
import { products, getByFamily, getByProcess } from '../../data/products.js'

function ProductThumb({ product }) {
  const [err, setErr] = useState(false)
  if (product.image && !err) {
    return (
      <img
        src={product.image}
        alt={product.name}
        onError={() => setErr(true)}
        className="w-full h-full object-contain p-2"
      />
    )
  }
  return <span className="text-3xl select-none">{product.icon}</span>
}

export default function ProductList({ filterType, filterKey, filterLabel, onSelect, onCatalogHome }) {
  const [ready, setReady] = useState(false)
  useEffect(() => { setTimeout(() => setReady(true), 80) }, [])

  let filtered = products
  if (filterType === 'process') filtered = getByProcess(filterKey)
  else if (filterType === 'family') filtered = getByFamily(filterKey)

  return (
    <div className="screen bg-c-bg-light">
      <TopBar onHome={onCatalogHome} label={filterLabel} light />

      <div className={`flex-1 min-h-0 flex flex-col overflow-hidden transition-all duration-400 ${ready ? 'opacity-100' : 'opacity-0'}`}>
        <div className="shrink-0 px-8 pt-4 pb-3 bg-white border-b border-c-border-l">
          <p className="text-gray-500 text-sm">
            {filtered.length} producto{filtered.length !== 1 ? 's' : ''} en esta categoría
          </p>
        </div>

        <div className="flex-1 min-h-0 px-8 py-5 scroll">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {filtered.map(product => (
              <button
                key={product.id}
                onClick={() => onSelect(product.id)}
                className="btn flex flex-col bg-white border border-c-border-l hover:border-c-blue/50 rounded-3xl p-6 text-left transition-all group overflow-hidden relative"
              >
                {product.tag && (
                  <div className="absolute top-4 right-4 bg-c-blue text-white text-xs font-bold px-3 py-1 rounded-full">
                    {product.tag}
                  </div>
                )}

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-c-bg-light border border-c-border-l rounded-2xl flex items-center justify-center shrink-0 overflow-hidden">
                    <ProductThumb product={product} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-0.5">
                      {product.familyLabel}
                    </div>
                    <h3 className="text-gray-900 font-black text-lg leading-tight">{product.name}</h3>
                  </div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">{product.keyBenefit}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {product.applications.slice(0, 3).map(app => (
                    <span key={app} className="text-xs bg-c-bg-light border border-c-border-l text-gray-600 px-2.5 py-1 rounded-lg font-medium">
                      {app}
                    </span>
                  ))}
                  {product.applications.length > 3 && (
                    <span className="text-xs text-gray-400 px-2.5 py-1">+{product.applications.length - 3} más</span>
                  )}
                </div>

                <div className="flex items-center text-c-blue font-bold text-sm">
                  Ver ficha completa
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-gray-700 font-bold text-xl mb-2">Sin productos en esta selección</h3>
              <p className="text-gray-500">Prueba con otra categoría o proceso.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
