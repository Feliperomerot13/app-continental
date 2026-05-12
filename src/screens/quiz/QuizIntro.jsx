import { useState, useEffect } from 'react'
import TopBar from '../shared/TopBar.jsx'

export default function QuizIntro({ onStart, onBack }) {
  const [ready, setReady] = useState(false)
  useEffect(() => { setTimeout(() => setReady(true), 80) }, [])

  return (
    <div className="screen bg-c-navy bg-dots">
      <TopBar onHome={onBack} label="Encuentra tu producto ideal" />

      <div className={`flex-1 min-h-0 scroll flex flex-col items-center justify-center px-8 sm:px-16 py-8 transition-all duration-500
        ${ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

        <div className="mb-8 animate-bounce-in">
          <img
            src="/logo-continental.png"
            alt="Continental"
            className="h-28 w-auto drop-shadow-2xl"
            style={{ filter: 'brightness(0) invert(1) drop-shadow(0 4px 24px rgba(26,86,219,0.6))' }}
          />
        </div>

        <h1 className="text-5xl font-black text-c-light text-center leading-tight mb-4">
          Diagnóstico de <span className="text-c-blue-mid">adhesivo ideal</span>
        </h1>

        <p className="text-c-light/80 text-xl text-center max-w-lg leading-relaxed mb-4">
          4 preguntas rápidas sobre tu proceso, materiales y necesidades. El sistema aplica la <strong className="text-c-light">matriz de decisión de Continental</strong> y te muestra la solución más adecuada.
        </p>

        {/* Pasos */}
        <div className="flex items-center gap-3 mb-10">
          {[
            { icon: '⚙️', label: 'Proceso' },
            { icon: '🪵', label: 'Sustrato' },
            { icon: '🎯', label: 'Necesidad' },
            { icon: '🖌️', label: 'Aplicación' },
            { icon: '✅', label: 'Resultado' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border
                  ${i === 4 ? 'bg-c-blue border-c-blue text-white' : 'bg-white/10 border-white/20'}`}>
                  {s.icon}
                </div>
                <span className="text-c-light/70 text-xs font-semibold">{s.label}</span>
              </div>
              {i < 4 && <div className="w-6 h-px bg-white/20 mb-4" />}
            </div>
          ))}
        </div>

        <button
          onClick={onStart}
          className="btn bg-c-blue hover:bg-c-blue-dark text-white font-black text-2xl px-16 py-5 rounded-2xl shadow-2xl card-glow-blue transition-all animate-pulse-b"
        >
          Comenzar diagnóstico →
        </button>

        <p className="text-c-light/40 text-sm mt-5">Duración aproximada: 40–60 segundos</p>
      </div>
    </div>
  )
}
