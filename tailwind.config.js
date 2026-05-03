/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Brand blues — tomados del logo
        c: {
          blue:        '#1A56DB',   // azul principal Continental
          'blue-dark': '#1338A8',
          'blue-mid':  '#2563EB',
          // Fondos oscuros
          navy:        '#040E1F',   // fondo oscuro principal
          'navy-card': '#091A38',   // tarjetas sobre navy
          'navy-mid':  '#0D2248',   // hover / depth
          'navy-border':'#1A3A6B', // bordes sutiles
          // Acento activo — amarillo (máximo contraste sobre navy)
          yellow:      '#F59E0B',
          'yellow-l':  '#FCD34D',
          'yellow-d':  '#D97706',
          // Texto
          light:       '#F0F6FF',   // texto blanco-azulado
          muted:       '#7BA4D8',   // texto secundario
          // Fondos claros (catálogo)
          'bg-light':  '#F4F8FF',
          'card-light':'#FFFFFF',
          'border-l':  '#DAEAFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in':    'fadeIn 0.35s ease-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'slide-in':   'slideIn 0.35s ease-out',
        'bounce-in':  'bounceIn 0.55s cubic-bezier(0.36,0.07,0.19,0.97)',
        'pulse-y':    'pulseY 2.2s infinite',
        'pulse-b':    'pulseB 2.2s infinite',
      },
      keyframes: {
        fadeIn:    { from:{ opacity:0 },           to:{ opacity:1 } },
        slideUp:   { from:{ opacity:0, transform:'translateY(28px)' }, to:{ opacity:1, transform:'translateY(0)' } },
        slideIn:   { from:{ opacity:0, transform:'translateX(36px)' }, to:{ opacity:1, transform:'translateX(0)' } },
        bounceIn:  { '0%':{ transform:'scale(0.3)', opacity:0 }, '55%':{ transform:'scale(1.06)' }, '75%':{ transform:'scale(0.94)' }, '100%':{ transform:'scale(1)', opacity:1 } },
        pulseY:    { '0%,100%':{ boxShadow:'0 0 0 0 rgba(245,158,11,0.45)' }, '50%':{ boxShadow:'0 0 0 18px rgba(245,158,11,0)' } },
        pulseB:    { '0%,100%':{ boxShadow:'0 0 0 0 rgba(26,86,219,0.45)' }, '50%':{ boxShadow:'0 0 0 18px rgba(26,86,219,0)' } },
      },
      backgroundImage: {
        'grid-navy': "linear-gradient(rgba(26,86,219,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(26,86,219,0.06) 1px,transparent 1px)",
      },
      backgroundSize: {
        'grid': '56px 56px',
      },
    },
  },
  plugins: [],
}
