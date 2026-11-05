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

      <div className={`relative flex-1 min-h-0 flex flex-col items-center justify-center scroll transition-all duration-600
        ${ready ? 'opacity-100' : 'opacity-0'}`}>
        <div className="shrink-0 flex flex-col items-center pb-8">
          <button
            onClick={onLogoTap}
            className="focus:outline-none active:opacity-70 transition-opacity"
          >
            <img
              src="/logo-continental.png"
              alt="Continental de Pegantes y Soluciones"
              className="h-48 sm:h-56 w-auto drop-shadow-2xl"
              style={{ filter: 'brightness(0) invert(1) drop-shadow(0 8px 40px rgba(26,86,219,0.6))' }}
            />
          </button>
          <div className="mt-5 w-20 h-0.5 bg-c-blue/40 rounded-full" />
        </div>

        <div className="text-center px-6 pb-8 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-black text-c-light leading-[1.1] tracking-tight mb-3">
            Gran Salón Ferretero
          </h1>
          <p className="text-c-muted text-xl leading-relaxed">
            Conozcamos tu negocio y mantengámonos en contacto.
          </p>
        </div>

        <button
          onClick={() => onNavigate('registration')}
          className="btn bg-c-yellow hover:bg-c-yellow-d text-gray-900 font-black text-xl px-10 py-5 rounded-2xl transition-colors animate-pulse-y"
        >
          Registrar mis datos
        </button>
      </div>

      {/* Footer fijo */}
      <div className="shrink-0 px-12 py-3 border-t border-c-navy-border/50 flex items-center justify-between">
        <p className="text-c-muted/40 text-xs">Continental de Pegantes y Soluciones S.A.S. ®</p>
        <p className="text-c-muted/30 text-xs">Continental de Pegantes y Soluciones</p>
      </div>
    </div>
  )
}
