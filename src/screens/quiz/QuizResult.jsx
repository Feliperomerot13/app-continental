import { useState, useEffect } from 'react'
import TopBar from '../shared/TopBar.jsx'
import { getProductById } from '../../data/products.js'
import { labelFor } from '../../data/quizData.js'

const CONFIDENCE_BADGE = {
  alto:  { label: 'Alta coincidencia',   bg: 'bg-green-900/40',  border: 'border-green-500/40',  dot: 'bg-green-400',  text: 'text-green-400'  },
  medio: { label: 'Coincidencia media',  bg: 'bg-yellow-900/30', border: 'border-yellow-500/40', dot: 'bg-yellow-400', text: 'text-yellow-400' },
  bajo:  { label: 'Baja coincidencia',   bg: 'bg-red-900/20',    border: 'border-red-500/30',    dot: 'bg-red-400',    text: 'text-red-400'    },
}

export default function QuizResult({ recommendation, answers, onViewProduct, onAdvise, onCatalog, onBack }) {
  const [ready, setReady] = useState(false)
  useEffect(() => { setTimeout(() => setReady(true), 120) }, [])

  const product = getProductById(recommendation.productId)
  const alt     = getProductById(recommendation.altId)
  const badge   = CONFIDENCE_BADGE[recommendation.confidence] || CONFIDENCE_BADGE.medio

  if (!product) return null

  const answerKeys = ['proceso', 'sustrato', 'necesidad', 'aplicacion']

  return (
    <div className="screen bg-c-navy bg-dots">
      <TopBar onHome={onBack} label="Tu recomendación" />

      <div className={`flex-1 min-h-0 flex flex-col items-center px-6 sm:px-10 py-5 pb-10 scroll transition-all duration-500
        ${ready ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-full max-w-3xl">

          {/* Badge análisis */}
          <div className={`inline-flex items-center gap-2 ${badge.bg} border ${badge.border} rounded-full px-5 py-2 mb-5`}>
            <span className={`w-2 h-2 rounded-full ${badge.dot} animate-pulse`} />
            <span className={`${badge.text} text-sm font-bold`}>{badge.label} · Diagnóstico completado</span>
          </div>

          {/* Tarjeta principal */}
          <div className="bg-c-navy-card border border-c-navy-border rounded-3xl overflow-hidden card-glow-blue mb-5">
            <div className="bg-c-blue px-8 py-4 flex items-center justify-between">
              <span className="text-white font-black text-lg uppercase tracking-wide">Tu solución ideal</span>
              <span className="text-blue-200 text-sm">{product.familyLabel}</span>
            </div>
            <div className="p-8">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-c-navy-mid rounded-2xl flex items-center justify-center text-4xl shrink-0">
                  {product.icon}
                </div>
                <div className="flex-1">
                  <div className="text-c-blue-mid text-xs font-bold uppercase tracking-widest mb-1">{product.familyLabel}</div>
                  <h2 className="text-3xl font-black text-c-light mb-2">{product.name}</h2>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-c-muted text-sm">Proceso:</span>
                    <span className="bg-c-navy-mid border border-c-navy-border rounded-lg px-3 py-1 text-c-light text-sm font-medium">
                      {product.processLabel}
                    </span>
                  </div>
                  <p className="text-c-muted leading-relaxed">{recommendation.message}</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-c-muted">
                    <span className="w-5 h-5 bg-c-blue/20 rounded-full flex items-center justify-center text-c-blue-mid text-xs shrink-0">✓</span>
                    {b}
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-5 border-t border-c-navy-border">
                <p className="text-c-muted/70 text-sm">
                  <span className="text-c-muted font-medium">Aplicación: </span>{product.application}
                  <span className="mx-3 opacity-40">·</span>
                  <span className="text-c-muted font-medium">Presentaciones: </span>{product.presentations.join(' · ')}
                </p>
              </div>
            </div>
          </div>

          {/* Alterno */}
          {alt && alt.id !== product.id && (
            <div className="bg-c-navy-card border border-c-navy-border rounded-2xl p-5 flex items-center gap-4 mb-5">
              <span className="text-3xl">{alt.icon}</span>
              <div className="flex-1">
                <p className="text-c-muted text-xs font-semibold uppercase tracking-wide mb-0.5">También puede ser adecuado</p>
                <p className="text-c-light font-bold">{alt.name}</p>
                <p className="text-c-muted text-sm">{alt.keyBenefit}</p>
              </div>
              <button onClick={() => onViewProduct(alt.id)}
                className="btn text-c-blue font-semibold text-sm hover:text-c-blue-mid min-h-0 px-3 py-2">
                Ver →
              </button>
            </div>
          )}

          {/* Resumen de respuestas */}
          <div className="bg-c-navy-card/60 border border-c-navy-border rounded-2xl p-5 mb-5">
            <p className="text-c-muted text-xs font-bold uppercase tracking-widest mb-3">Basado en tus respuestas</p>
            <div className="flex flex-wrap gap-2">
              {answerKeys.map(k => answers[k] && (
                <span key={k} className="bg-c-navy-mid border border-c-navy-border rounded-xl px-3 py-1.5 text-c-muted text-sm">
                  {labelFor(k, answers[k])}
                </span>
              ))}
            </div>
          </div>

          {/* CTAs */}
          {recommendation.needsAdvisor && (
            <div className="bg-c-yellow/10 border border-c-yellow/30 rounded-2xl p-4 flex items-center gap-3 mb-5">
              <span className="text-2xl">⚠️</span>
              <p className="text-c-yellow/90 text-sm leading-relaxed">
                Tu caso tiene particularidades que conviene revisar con un asesor técnico para asegurar la mejor recomendación.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button onClick={() => onViewProduct(product.id)}
              className="btn bg-c-navy-card border border-c-navy-border text-c-light font-bold text-base py-4 rounded-2xl hover:border-c-blue/50 transition-all">
              📋 Ver ficha completa
            </button>
            <button onClick={onCatalog}
              className="btn bg-c-navy-card border border-c-navy-border text-c-light font-bold text-base py-4 rounded-2xl hover:border-c-blue/50 transition-all">
              📚 Explorar catálogo
            </button>
            <button onClick={onAdvise}
              className="btn bg-c-blue hover:bg-c-blue-dark text-white font-black text-base py-4 rounded-2xl card-glow-blue transition-all">
              💬 Hablar con asesor
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
