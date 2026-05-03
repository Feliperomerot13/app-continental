import { useState, useEffect } from 'react'

export default function PrizeScreen({ prize, onHome, onAdvise }) {
  const [ph, setPh] = useState(0)
  useEffect(() => {
    const t1 = setTimeout(() => setPh(1), 150)
    const t2 = setTimeout(() => setPh(2), 600)
    const t3 = setTimeout(() => setPh(3), 1100)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  return (
    <div className="screen bg-c-navy overflow-hidden">
      {/* Destellos */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 inset-x-0 h-72 bg-gradient-to-b from-c-yellow/15 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(245,158,11,0.12)_0%,transparent_65%)]" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-12 relative">
        {/* Icono */}
        <div className={`text-9xl mb-6 transition-all duration-500 ${ph >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
          style={{ filter: 'drop-shadow(0 0 32px rgba(245,158,11,0.55))' }}>
          {prize.icon}
        </div>

        {/* Textos */}
        <div className={`text-center transition-all duration-500 delay-150 ${ph >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 bg-c-yellow/15 border border-c-yellow/40 rounded-full px-6 py-2 mb-4">
            <span className="text-c-yellow font-bold text-lg uppercase tracking-wider">¡Felicitaciones!</span>
          </div>

          <h1 className="text-5xl font-black text-c-light mb-3">Ganaste:</h1>
          <h2 className="text-4xl font-black text-c-yellow mb-4">{prize.label}</h2>
          <p className="text-c-muted text-xl max-w-lg mx-auto leading-relaxed mb-8">{prize.description}</p>

          <div className="bg-c-navy-card border border-c-navy-border rounded-3xl p-6 max-w-lg mx-auto mb-8">
            <p className="text-c-muted text-xs font-bold uppercase tracking-widest mb-2">¿Cómo reclamarlo?</p>
            <p className="text-c-light text-lg font-medium leading-relaxed">{prize.instruction}</p>
          </div>
        </div>

        {/* Botones */}
        <div className={`flex gap-5 transition-all duration-500 delay-300 ${ph >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <button
            onClick={onAdvise}
            className="btn bg-c-blue hover:bg-c-blue-dark text-white font-black text-xl px-10 py-4 rounded-2xl card-glow-blue transition-all"
          >
            💬 Hablar con asesor
          </button>
          <button
            onClick={onHome}
            className="btn bg-c-navy-card border border-c-navy-border text-c-muted font-bold text-xl px-10 py-4 rounded-2xl hover:border-c-blue/50 transition-all"
          >
            🏠 Ir al inicio
          </button>
        </div>

        <p className="text-c-muted/40 text-sm mt-6">
          ¡Gracias por participar! Nuestro equipo está a tu disposición.
        </p>
      </div>
    </div>
  )
}
