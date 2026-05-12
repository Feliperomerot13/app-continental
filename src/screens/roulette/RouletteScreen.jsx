import { useState, useRef, useEffect } from 'react'
import { prizes } from '../../data/prizes.js'
import TopBar from '../shared/TopBar.jsx'

// Colores alternos azul oscuro / amarillo para la ruleta
const SEG_COLORS  = ['#1A56DB','#0D2248','#1338A8','#091A38','#2563EB','#0A1A35','#1A56DB','#0D2248']
const SEG_COLORS2 = ['#F59E0B','#1A56DB','#D97706','#1338A8','#F59E0B','#1A56DB','#D97706','#1338A8']
const WHEEL_SIZE = 720

function drawWheel(canvas, rotation) {
  const ctx = canvas.getContext('2d')
  const W = canvas.width, H = canvas.height
  const scale = W / 430
  const cx = W / 2, cy = H / 2
  const r = Math.min(cx, cy) - (10 * scale)
  const n = prizes.length
  const seg = (2 * Math.PI) / n

  ctx.clearRect(0, 0, W, H)

  prizes.forEach((prize, i) => {
    const start = rotation + i * seg - Math.PI / 2
    const end   = start + seg

    // Segmento
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, r, start, end)
    ctx.closePath()
    ctx.fillStyle = (i % 2 === 0) ? SEG_COLORS2[i % SEG_COLORS2.length] : SEG_COLORS[i % SEG_COLORS.length]
    ctx.fill()
    ctx.strokeStyle = '#040E1F'
    ctx.lineWidth = 2
    ctx.stroke()

    // Texto dentro del segmento
    const mid = start + seg / 2
    const tr  = r * 0.63
    const tx  = cx + tr * Math.cos(mid)
    const ty  = cy + tr * Math.sin(mid)

    ctx.save()
    ctx.translate(tx, ty)
    ctx.rotate(mid + Math.PI / 2)
    ctx.fillStyle = '#FFFFFF'
    ctx.font = `bold ${Math.round(13 * scale)}px Inter, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const words = prize.label.split(' ')
    const lines = []
    let line = ''
    const maxChars = Math.round(14 * scale)
    words.forEach(w => {
      const t = line ? `${line} ${w}` : w
      if (t.length > maxChars) { if (line) lines.push(line); line = w } else line = t
    })
    if (line) lines.push(line)
    const lh = Math.round(15 * scale)
    lines.forEach((l, li) => ctx.fillText(l, 0, (li - (lines.length - 1) / 2) * lh))

    ctx.font = `${Math.round(21 * scale)}px serif`
    ctx.fillText(prize.icon, 0, -(lines.length * lh / 2) - (13 * scale))
    ctx.restore()
  })

  // Centro
  ctx.beginPath()
  ctx.arc(cx, cy, 30 * scale, 0, 2 * Math.PI)
  ctx.fillStyle = '#F59E0B'
  ctx.fill()
  ctx.strokeStyle = '#fff'
  ctx.lineWidth = 3 * scale
  ctx.stroke()
  ctx.fillStyle = '#040E1F'
  ctx.font = `bold ${Math.round(11 * scale)}px Inter, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('C', cx, cy)
}

export default function RouletteScreen({ prizeToWin, onPrize, onBack }) {
  const canvasRef = useRef(null)
  const rotRef    = useRef(0)
  const rafRef    = useRef(null)
  const [spinning, setSpinning] = useState(false)
  const [done,     setDone]     = useState(false)
  const [ready,    setReady]    = useState(false)

  useEffect(() => {
    setTimeout(() => setReady(true), 120)
    drawWheel(canvasRef.current, 0)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const spin = () => {
    if (spinning || done) return
    setSpinning(true)

    const idx      = prizes.findIndex(p => p.id === prizeToWin?.id)
    const target   = idx >= 0 ? idx : Math.floor(Math.random() * prizes.length)
    const n        = prizes.length
    const segAngle = (2 * Math.PI) / n
    const finalRot = -(target * segAngle + segAngle / 2) - 7 * 2 * Math.PI

    const start0   = rotRef.current
    const dist     = finalRot - start0
    const duration = 5200
    let t0 = null

    const ease = t => 1 - Math.pow(1 - t, 4)

    const frame = (now) => {
      if (!t0) t0 = now
      const t = Math.min((now - t0) / duration, 1)
      rotRef.current = start0 + dist * ease(t)
      drawWheel(canvasRef.current, rotRef.current)
      if (t < 1) { rafRef.current = requestAnimationFrame(frame) }
      else {
        setSpinning(false)
        setDone(true)
        setTimeout(() => onPrize(prizes[target]), 900)
      }
    }
    rafRef.current = requestAnimationFrame(frame)
  }

  return (
    <div className="screen bg-c-navy bg-dots">
      <TopBar onHome={onBack} label="Gira la ruleta" />

      <div className={`flex-1 min-h-0 scroll px-6 sm:px-10 py-6 transition-all duration-500
        ${ready ? 'opacity-100' : 'opacity-0'}`}>

        <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col items-center justify-start gap-6 pb-10">
        {/* Texto superior */}
        <div className="text-center">
          <h2 className="text-5xl font-black text-c-light leading-tight mb-3">
            {done
              ? <><span className="text-c-yellow">Resultado listo</span></>
              : <>Tu momento de <span className="text-c-yellow">ganar</span></>}
          </h2>
          {spinning && <p className="text-c-yellow font-bold text-lg animate-pulse">Girando…</p>}
          {!spinning && !done && <p className="text-c-muted text-lg">Toca el botón para girar</p>}
        </div>

        {/* Ruleta */}
        <div className="relative roulette-glow shrink-0">
          {/* Puntero */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10">
            <div className="w-0 h-0"
              style={{ borderLeft:'18px solid transparent', borderRight:'18px solid transparent', borderTop:'36px solid #F59E0B' }} />
          </div>
          <canvas
            ref={canvasRef}
            width={WHEEL_SIZE}
            height={WHEEL_SIZE}
            className="rounded-full"
            style={{ width: 'min(82vw, 62vh, 760px)', height: 'min(82vw, 62vh, 760px)' }}
          />
        </div>

        {/* Botón + lista inferior */}
        <div className="w-full max-w-3xl">
          {!done ? (
            <button
              onClick={spin}
              disabled={spinning}
              className={`btn mx-auto block w-full max-w-xl font-black text-3xl py-7 rounded-2xl transition-all
                ${spinning
                  ? 'bg-c-navy-mid text-c-muted cursor-not-allowed'
                  : 'bg-c-yellow hover:bg-c-yellow-d text-gray-900 shadow-2xl animate-pulse-y'}`}
            >
              {spinning ? '⏳ Girando…' : '🎡 ¡Girar!'}
            </button>
          ) : (
            <div className="text-center animate-fade-in">
              <div className="text-3xl animate-bounce">⬇️</div>
              <p className="text-c-muted mt-1 text-sm">Cargando tu premio…</p>
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {prizes.map((p, i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl border border-c-navy-border bg-c-navy-card/70 px-4 py-3">
                <div className="w-3 h-3 rounded-full shrink-0"
                  style={{ background: (i % 2 === 0) ? '#F59E0B' : '#1A56DB' }} />
                <span className="text-c-muted text-base font-semibold">{p.icon} {p.label}</span>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
