/**
 * TopBar — barra superior presente en todas las pantallas internas.
 * Logo continental visible y representativo en ambos modos (dark/light).
 */
export default function TopBar({ onHome, label, light = false }) {
  return (
    <div className={`shrink-0 flex items-center justify-between px-8 py-3 border-b
      ${light
        ? 'border-c-border-l bg-white/98 backdrop-blur-sm'
        : 'border-c-navy-border bg-c-navy/95 backdrop-blur-sm'}`}
    >
      {/* Botón volver */}
      <button
        onClick={onHome}
        className={`btn flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
          transition-colors min-h-0
          ${light
            ? 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            : 'text-c-muted hover:text-c-light hover:bg-c-navy-card'}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7 7-7M21 12H3" />
        </svg>
        Inicio
      </button>

      {/* Logo + label centrado */}
      <div className="flex flex-col items-center gap-1">
        <img
          src="/logo-continental.png"
          alt="Continental"
          className={`h-14 w-auto ${light ? 'opacity-90' : 'opacity-95'}`}
          style={light ? {} : { filter: 'brightness(0) invert(1)' }}
        />
        {label && (
          <span className={`text-xs font-bold tracking-wide
            ${light ? 'text-gray-600' : 'text-c-light/70'}`}>
            {label}
          </span>
        )}
      </div>

      {/* Espacio para alinear el botón de volver */}
      <div className="w-24" />
    </div>
  )
}
