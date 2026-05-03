export default function InactivityWarning({ countdown, onStay }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-c-navy/80 backdrop-blur-md animate-fade-in">
      <div className="bg-c-navy-card border border-c-navy-border rounded-3xl p-12 max-w-sm w-full mx-6 text-center card-glow-blue">
        {/* Countdown ring */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="40" fill="none" stroke="#1A3A6B" strokeWidth="8" />
            <circle
              cx="48" cy="48" r="40" fill="none"
              stroke="#F59E0B" strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - countdown / 15)}`}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-c-yellow font-black text-3xl">{countdown}</span>
          </div>
        </div>

        <h3 className="text-c-light font-black text-2xl mb-2">¿Sigues ahí?</h3>
        <p className="text-c-muted text-base mb-8 leading-relaxed">
          La pantalla volverá al inicio en{' '}
          <span className="text-c-yellow font-bold">{countdown} segundo{countdown !== 1 ? 's' : ''}</span>.
        </p>

        <button
          onClick={onStay}
          className="btn w-full bg-c-blue hover:bg-c-blue-dark text-white font-black text-lg py-4 rounded-2xl transition-all card-glow-blue"
        >
          Continuar aquí
        </button>
      </div>
    </div>
  )
}
