import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * Hook de inactividad con cuenta regresiva de aviso.
 * @param onReset     — función a llamar al vencer el tiempo
 * @param totalMs     — tiempo total sin interacción antes del reset (default 75 s)
 * @param warningMs   — cuántos ms ANTES del reset mostrar la advertencia (default 15 s)
 */
export function useInactivity(onReset, totalMs = 75000, warningMs = 15000) {
  const [warningVisible, setWarningVisible] = useState(false)
  const [countdown, setCountdown] = useState(15)
  const mainTimer   = useRef(null)
  const warnTimer   = useRef(null)
  const countRef    = useRef(null)

  const clearAll = () => {
    clearTimeout(mainTimer.current)
    clearTimeout(warnTimer.current)
    clearInterval(countRef.current)
  }

  const reset = useCallback(() => {
    clearAll()
    setWarningVisible(false)
    setCountdown(Math.round(warningMs / 1000))

    // Programar la advertencia
    warnTimer.current = setTimeout(() => {
      setWarningVisible(true)
      let secs = Math.round(warningMs / 1000)
      setCountdown(secs)
      countRef.current = setInterval(() => {
        secs -= 1
        setCountdown(secs)
        if (secs <= 0) clearInterval(countRef.current)
      }, 1000)
    }, totalMs - warningMs)

    // Programar el reset total
    mainTimer.current = setTimeout(() => {
      setWarningVisible(false)
      onReset()
    }, totalMs)
  }, [onReset, totalMs, warningMs])

  useEffect(() => {
    const events = ['touchstart', 'touchmove', 'click', 'mousemove', 'keydown', 'scroll']
    const handler = () => reset()
    events.forEach(e => window.addEventListener(e, handler, { passive: true }))
    reset()
    return () => {
      clearAll()
      events.forEach(e => window.removeEventListener(e, handler))
    }
  }, [reset])

  return { warningVisible, countdown, resetTimer: reset }
}
