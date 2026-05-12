import { useState, useEffect, useRef, useCallback } from 'react'
import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).href

// ── Página renderizada ──────────────────────────────────────────────────────
function Page({ src, pageNum }) {
  return (
    <div style={{ userSelect: 'none', overflow: 'hidden', background: '#fff', width: '100%', height: '100%' }}>
      {src ? (
        <img
          src={src}
          alt={`Página ${pageNum}`}
          draggable={false}
          style={{ width: '100%', height: '100%', objectFit: 'fill', display: 'block' }}
        />
      ) : (
        <div style={{ width: '100%', height: '100%' }}
          className="flex items-center justify-center bg-gray-50">
          <div className="w-6 h-6 border-2 border-c-blue border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
export default function BrochureScreen({ onClose }) {
  const [pages,        setPages]        = useState([])
  const [loading,      setLoading]      = useState(true)
  const [progress,     setProgress]     = useState(0)
  const [error,        setError]        = useState(null)
  // Tamaño nativo de las páginas renderizadas del PDF
  const [pageSize,     setPageSize]     = useState({ w: 530, h: 748 })
  // Escala visual para ajustar al contenedor disponible
  const [displayScale, setDisplayScale] = useState(1)
  const [currentPage,  setCurrentPage]  = useState(0)
  const [totalPages,   setTotalPages]   = useState(0)
  const [ready,        setReady]        = useState(false)

  const containerRef = useRef(null)       // mide el espacio disponible
  const dragStartX   = useRef(null)

  // ── Carga del PDF ──────────────────────────────────────────────────────────
  useEffect(() => { loadPDF() }, [])

  async function loadPDF() {
    try {
      const pdf      = await pdfjsLib.getDocument('/Brochure/catalogo-madera.pdf').promise
      const numPages = pdf.numPages
      setTotalPages(numPages)

      // Calcula escala de renderizado basado en la primera página
      const firstPage = await pdf.getPage(1)
      const vp0       = firstPage.getViewport({ scale: 1 })
      const targetH   = 1000                          // altura de renderizado interno
      const scale     = targetH / vp0.height
      const targetW   = Math.round(vp0.width * scale)
      setPageSize({ w: targetW, h: targetH })

      // Renderiza página a página (va apareciendo progresivamente)
      const arr = new Array(numPages).fill(null)
      setPages([...arr])

      for (let i = 1; i <= numPages; i++) {
        const page     = await pdf.getPage(i)
        const viewport = page.getViewport({ scale })
        const canvas   = document.createElement('canvas')
        canvas.width   = viewport.width
        canvas.height  = viewport.height
        await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise
        arr[i - 1] = canvas.toDataURL('image/jpeg', 0.88)
        setPages([...arr])
        setProgress(Math.round((i / numPages) * 100))
      }

      setLoading(false)
      setTimeout(() => setReady(true), 250)
    } catch (err) {
      console.error('Error cargando PDF:', err)
      setError(true)
      setLoading(false)
    }
  }

  // ── Cálculo de escala responsivo ───────────────────────────────────────────
  // Mide el contenedor disponible y calcula cuánto hay que escalar la página
  // para que quede dentro sin recortarse. Corre en mount y en cada resize.
  const recalcScale = useCallback(() => {
    if (!containerRef.current || !pageSize.w) return
    const { clientWidth: availW, clientHeight: availH } = containerRef.current
    const pageNativeW = pageSize.w
    const pageNativeH = pageSize.h
    const padH = 12   // espacio vertical para controles + margen
    const padW = 24   // margen lateral mínimo
    const scaleW = (availW - padW) / pageNativeW
    const scaleH = (availH - padH) / pageNativeH
    // Nunca agrandar más allá del render nativo; nunca encoger más del 20%
    const clamped = Math.min(scaleW, scaleH, 1.0)
    setDisplayScale(Math.max(0.2, clamped))
  }, [pageSize])

  useEffect(() => {
    if (loading || !containerRef.current) return
    recalcScale()
    const observer = new ResizeObserver(recalcScale)
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [loading, recalcScale])

  // ── Controles ──────────────────────────────────────────────────────────────
  const goNext  = () => setCurrentPage(p => Math.min(p + 1, totalPages - 1))
  const goPrev  = () => setCurrentPage(p => Math.max(p - 1, 0))

  const handlePointerDown = (e) => {
    dragStartX.current = e.clientX
  }

  const handlePointerUp = (e) => {
    if (dragStartX.current == null) return
    const delta = e.clientX - dragStartX.current
    dragStartX.current = null

    if (Math.abs(delta) < 60) return
    if (delta < 0) goNext()
    else goPrev()
  }

  const displayPage = currentPage + 1
  const pageLabel   = `Página ${displayPage} de ${totalPages}`

  // Dimensiones del "slot" visual que ocupa la página escalada
  const slotW = pageSize.w * displayScale
  const slotH = pageSize.h * displayScale

  return (
    <div className="screen bg-[#181818] flex flex-col">

      {/* ── Header ── */}
      <div className="shrink-0 flex items-center justify-between px-8 py-4 border-b border-white/10 bg-black/30">
        <button
          onClick={onClose}
          className="btn flex items-center gap-2 text-white/70 hover:text-white px-5 py-3 rounded-xl hover:bg-white/10 transition-colors font-semibold text-base"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7 7-7M21 12H3" />
          </svg>
          Volver
        </button>

        <img
          src="/logo-continental.png"
          alt="Continental"
          className="h-16 w-auto"
          style={{ filter: 'brightness(0) invert(1)', opacity: 0.9 }}
        />

        {!loading && !error && (
          <p className="text-white/35 text-xs text-right leading-snug w-32">
            Desliza la página<br />o usa las flechas
          </p>
        )}
        {(loading || error) && <div className="w-32" />}
      </div>

      {/* ── Área de contenido (ref para medir) ── */}
      <div
        ref={containerRef}
        className="flex-1 min-h-0 flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Cargando */}
        {loading && (
          <div className="text-center">
            <div className="w-14 h-14 border-4 border-c-blue border-t-transparent rounded-full animate-spin mx-auto mb-5" />
            <p className="text-white font-bold text-xl mb-4">Preparando catálogo…</p>
            <div className="w-56 h-2 bg-white/10 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-c-blue rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }} />
            </div>
            <p className="text-white/40 text-sm mt-2">{progress}%</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center px-8">
            <div className="text-6xl mb-4">📄</div>
            <p className="text-white font-bold text-xl mb-2">No se pudo cargar el catálogo</p>
            <p className="text-white/50 text-sm mb-6">
              Verifica que el archivo esté en<br />
              <code className="text-c-blue">public/Brochure/catalogo-madera.pdf</code>
            </p>
            <button onClick={onClose}
              className="btn bg-c-blue text-white px-8 py-3 rounded-2xl font-bold">
              Volver al inicio
            </button>
          </div>
        )}

        {/* ── Página + controles ── */}
        {!loading && !error && pages.length > 0 && (
          <div className={`flex flex-col items-center transition-all duration-500
            ${ready ? 'opacity-100' : 'opacity-0 scale-95'}`}
            style={{ gap: Math.max(12, 20 * displayScale) }}
          >
            {/*
              Truco responsivo:
              - El div exterior ocupa el espacio ESCALADO (slot) en el layout
              - La imagen se ajusta a una sola página para maximizar ancho útil
            */}
            <div
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              style={{
                width:    slotW,
                height:   slotH,
                position: 'relative',
                filter:   'drop-shadow(0 24px 48px rgba(0,0,0,0.9))',
              }}
            >
              <Page src={pages[currentPage]} pageNum={currentPage + 1} />
            </div>

            {/* Controles de navegación */}
            <div className="flex items-center gap-5">
              <button onClick={goPrev}
                disabled={currentPage === 0}
                className="btn w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-white/50 text-sm font-medium min-w-44 text-center">
                {pageLabel}
              </span>
              <button onClick={goNext}
                disabled={currentPage + 1 >= totalPages}
                className="btn w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
