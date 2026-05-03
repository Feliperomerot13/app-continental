import { useState, useEffect } from 'react'
import TopBar from '../shared/TopBar.jsx'
import { getProductById, products } from '../../data/products.js'

/** Muestra imagen del producto si existe, o emoji como fallback */
function ProductImage({ product, className = '' }) {
  const [imgError, setImgError] = useState(false)
  if (product.image && !imgError) {
    return (
      <img
        src={product.image}
        alt={product.name}
        onError={() => setImgError(true)}
        className={`object-contain ${className}`}
      />
    )
  }
  return <span className="text-5xl select-none">{product.icon}</span>
}

export default function ProductDetail({ productId, onBack, onSimilar, onAdvise, onQuiz }) {
  const [ready, setReady] = useState(false)
  const product = getProductById(productId)
  useEffect(() => { setReady(false); setTimeout(() => setReady(true), 80) }, [productId])

  if (!product) return null

  const similar = products
    .filter(p => p.id !== product.id && p.family === product.family)
    .slice(0, 3)

  return (
    <div className="screen bg-c-bg-light">
      <TopBar onHome={onBack} label={product.shortName} light />

      <div className={`flex-1 scroll px-8 py-6 transition-all duration-400 ${ready ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-4xl mx-auto">

          {/* ── Header del producto ── */}
          <div className="flex items-start gap-6 mb-8">
            {/* Imagen / emoji */}
            <div className="w-44 h-44 bg-white border border-c-border-l rounded-3xl flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
              <ProductImage product={product} className="w-full h-full p-2" />
            </div>

            <div className="flex-1">
              <div className="flex items-center flex-wrap gap-2 mb-2">
                <span className="bg-c-blue text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  {product.familyLabel}
                </span>
                {product.tag && (
                  <span className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded-full border border-gray-200">
                    {product.tag}
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-black text-gray-900 leading-tight">{product.name}</h1>
              <p className="text-gray-500 text-lg mt-2 leading-snug">{product.keyBenefit}</p>
            </div>
          </div>

          {/* ── Grid contenido ── */}
          <div className="grid grid-cols-3 gap-6 mb-8">

            {/* Columna principal */}
            <div className="col-span-2 space-y-5">
              {/* Beneficios */}
              <div className="bg-white rounded-2xl p-6 border border-c-border-l">
                <h3 className="font-black text-gray-900 text-lg mb-4">✅ Beneficios clave</h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.benefits.map((b, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-c-blue rounded-full flex items-center justify-center shrink-0">
                        <span className="text-white text-xs font-black">✓</span>
                      </div>
                      <span className="text-gray-700 text-sm">{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Uso */}
              <div className="bg-white rounded-2xl p-6 border border-c-border-l">
                <h3 className="font-black text-gray-900 text-lg mb-3">📋 Recomendación de uso</h3>
                <p className="text-gray-700 leading-relaxed">{product.usageNote}</p>
              </div>

              {/* Aplicaciones */}
              <div className="bg-white rounded-2xl p-6 border border-c-border-l">
                <h3 className="font-black text-gray-900 text-lg mb-4">🏭 Aplicaciones</h3>
                <div className="flex flex-wrap gap-2">
                  {product.applications.map(app => (
                    <span key={app} className="bg-c-bg-light border border-c-border-l text-gray-700 px-4 py-2 rounded-xl text-sm font-medium">
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-c-border-l">
                <h4 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-3">Sustratos compatibles</h4>
                {product.substrates.map(s => (
                  <div key={s} className="flex items-center gap-2 text-sm text-gray-600 py-1 border-b border-gray-50 last:border-0">
                    <span className="text-c-blue font-bold">·</span> {s}
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl p-5 border border-c-border-l">
                <h4 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-2">Forma de aplicación</h4>
                <p className="text-gray-800 font-semibold text-sm">{product.application}</p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-c-border-l">
                <h4 className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-3">Presentaciones</h4>
                {product.presentations.map(p => (
                  <div key={p} className="flex items-center gap-2 text-sm text-gray-600 py-1 border-b border-gray-50 last:border-0">
                    <span className="text-c-blue font-bold">·</span> {p}
                  </div>
                ))}
              </div>

              <button
                onClick={() => onAdvise(product.id)}
                className="btn w-full bg-c-blue hover:bg-c-blue-dark text-white font-black text-base py-4 rounded-2xl transition-all card-glow-blue text-center"
              >
                💬 Quiero asesoría
              </button>

              <button
                onClick={onQuiz}
                className="btn w-full bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm py-3 rounded-xl transition-all text-center"
              >
                🔍 Hacer diagnóstico
              </button>
            </div>
          </div>

          {/* Similares */}
          {similar.length > 0 && (
            <div className="mb-6">
              <h3 className="font-black text-gray-900 text-xl mb-4">Productos de la misma familia</h3>
              <div className="grid grid-cols-3 gap-4">
                {similar.map(p => (
                  <button
                    key={p.id}
                    onClick={() => onSimilar(p.id)}
                    className="btn flex items-center gap-3 bg-white border border-c-border-l hover:border-c-blue/40 rounded-2xl p-4 text-left transition-all"
                  >
                    <div className="w-12 h-12 bg-c-bg-light rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                      <ProductImage product={p} className="w-full h-full p-1" />
                    </div>
                    <div>
                      <p className="text-gray-900 font-bold text-sm leading-tight">{p.shortName}</p>
                      <p className="text-gray-400 text-xs">{p.tag}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
