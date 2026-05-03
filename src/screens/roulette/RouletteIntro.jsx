import { useState, useEffect } from 'react'
import TopBar from '../shared/TopBar.jsx'

export default function RouletteIntro({ onStart, onBack }) {
  const [ready, setReady] = useState(false)
  useEffect(() => { setTimeout(() => setReady(true), 80) }, [])

  return (
    <div className="screen bg-c-navy bg-dots">
      <TopBar onHome={onBack} label="Participa y gana" />

      <div className={`flex-1 flex flex-col items-center justify-center px-16 transition-all duration-500
        ${ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

        <div className="w-28 h-28 bg-c-yellow rounded-3xl flex items-center justify-center text-6xl shadow-2xl mb-8 animate-bounce-in">
          🎡
        </div>

        <h1 className="text-5xl font-black text-c-light text-center leading-tight mb-4">
          Registra tus datos<br />y <span className="text-c-yellow">gira la ruleta</span>
        </h1>

        <p className="text-c-muted text-xl text-center max-w-lg leading-relaxed mb-8">
          Completa un formulario corto, acepta el tratamiento de datos y accede a la ruleta para ganar uno de nuestros beneficios.
        </p>

        {/* Pasos */}
        <div className="flex items-center gap-3 mb-10">
          {[
            { icon: '📝', label: 'Formulario' },
            { icon: '✅', label: 'Autorización' },
            { icon: '🎡', label: 'Ruleta' },
            { icon: '🎁', label: 'Premio' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-14 h-14 bg-c-navy-card border border-c-navy-border rounded-2xl flex items-center justify-center text-2xl">
                  {s.icon}
                </div>
                <span className="text-c-muted text-xs font-medium">{s.label}</span>
              </div>
              {i < 3 && <div className="w-8 h-px bg-c-navy-border mb-4" />}
            </div>
          ))}
        </div>

        <button
          onClick={onStart}
          className="btn bg-c-yellow hover:bg-c-yellow-d text-gray-900 font-black text-2xl px-16 py-5 rounded-2xl shadow-2xl transition-all animate-pulse-y"
        >
          ¡Participar ahora! →
        </button>

        <p className="text-c-muted/60 text-sm mt-5">Duración aproximada: 20–35 segundos</p>
      </div>
    </div>
  )
}
