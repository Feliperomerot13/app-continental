import { useState, useEffect } from 'react'

export default function HomeScreen({ onNavigate, onLogoTap }) {
  const [ready, setReady] = useState(false)
  useEffect(() => { setTimeout(() => setReady(true), 80) }, [])

  return (
    <div className="screen bg-c-navy overflow-hidden bg-dots">
      {/* Glow radial de fondo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-[25%] w-[700px] h-[700px] bg-c-blue opacity-[0.07] rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] bg-c-blue opacity-[0.05] rounded-full blur-3xl" />
      </div>

      {/* Contenido scrollable */}
      <div className={`relative flex-1 min-h-0 flex flex-col items-center scroll transition-all duration-600
        ${ready ? 'opacity-100' : 'opacity-0'}`}>

        {/* ── Logo principal — PROTAGONISTA ── */}
        <div className="shrink-0 flex flex-col items-center pt-10 pb-4">
          <button
            onClick={onLogoTap}
            className="focus:outline-none active:opacity-70 transition-opacity"
          >
            <img
              src="/logo-continental.png"
              alt="Continental de Pegantes y Soluciones"
              className="h-[16.8rem] w-auto drop-shadow-2xl"
              style={{ filter: 'brightness(0) invert(1) drop-shadow(0 8px 40px rgba(26,86,219,0.6))' }}
            />
          </button>
          <div className="mt-5 w-20 h-0.5 bg-c-blue/40 rounded-full" />
        </div>

        {/* ── Hero ── */}
        <div className="text-center px-12 pt-4 pb-4 max-w-3xl">
          <h1 className="text-5xl font-black text-c-light leading-[1.1] tracking-tight mb-3">
            Soluciones adhesivas<br />
            <span className="text-c-blue-mid">para la industria</span> de la madera
          </h1>
          <p className="text-c-muted text-xl leading-relaxed">
            Elige cómo quieres empezar tu experiencia en el stand.
          </p>
        </div>

        {/* ── Botones principales ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-3xl px-8 sm:px-12 pb-5">
          {/* Módulo 1 — Participa y gana */}
          <button
            onClick={() => onNavigate('roulette-intro')}
            className="btn group relative bg-c-yellow hover:bg-c-yellow-d rounded-3xl p-7 text-left overflow-hidden transition-all duration-200 animate-pulse-y"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl" />
            <div className="relative">
              <div className="text-5xl mb-4">🎡</div>
              <h2 className="text-gray-900 font-black text-2xl leading-tight mb-2">
                Participa<br />y gana
              </h2>
              <p className="text-gray-700 text-sm leading-snug mb-5">
                Registra tus datos y gira la ruleta
              </p>
              <div className="flex items-center gap-2 text-gray-900 font-bold text-base">
                Comenzar
                <svg className="w-4 h-4 group-active:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5-5 5M6 12h12" />
                </svg>
              </div>
            </div>
          </button>

          {/* Módulo 2 — Encuentra tu producto */}
          <button
            onClick={() => onNavigate('quiz-intro')}
            className="btn group relative bg-c-blue hover:bg-c-blue-dark rounded-3xl p-7 text-left overflow-hidden transition-all duration-200 card-glow-blue animate-pulse-b"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl" />
            <div className="relative">
              <div className="text-5xl mb-4">🔍</div>
              <h2 className="text-white font-black text-2xl leading-tight mb-2">
                Encuentra<br />tu producto ideal
              </h2>
              <p className="text-blue-200 text-sm leading-snug mb-5">
                Descubre la solución según tu proceso y materiales
              </p>
              <div className="flex items-center gap-2 text-white font-bold text-base">
                Empezar diagnóstico
                <svg className="w-4 h-4 group-active:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5-5 5M6 12h12" />
                </svg>
              </div>
            </div>
          </button>
        </div>

        {/* ── Botones secundarios — Catálogo + Brochure ── */}
        <div className="px-8 sm:px-12 pb-10 flex flex-col md:flex-row gap-4 w-full max-w-3xl">
          <button
            onClick={() => onNavigate('catalog')}
            className="btn flex-1 flex items-center gap-3 bg-c-navy-card border border-c-navy-border hover:border-c-blue/50 text-c-light rounded-2xl px-6 py-4 font-semibold text-base transition-all"
          >
            <span className="text-xl">📚</span>
            <span>Explorar catálogo</span>
          </button>
          <button
            onClick={() => onNavigate('brochure')}
            className="btn flex-1 flex items-center gap-3 bg-c-navy-card border border-c-navy-border hover:border-c-yellow/50 text-c-light rounded-2xl px-6 py-4 font-semibold text-base transition-all"
          >
            <span className="text-xl">📖</span>
            <span>Catálogo digital</span>
          </button>
        </div>
      </div>

      {/* Footer fijo */}
      <div className="shrink-0 px-12 py-3 border-t border-c-navy-border/50 flex items-center justify-between">
        <p className="text-c-muted/40 text-xs">Continental de Pegantes y Soluciones S.A.S. ®</p>
        <p className="text-c-muted/30 text-xs">Toca una opción para comenzar</p>
      </div>
    </div>
  )
}
