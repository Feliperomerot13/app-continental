import { useState, useEffect } from 'react'
import TopBar from '../shared/TopBar.jsx'
import { questions } from '../../data/quizData.js'

export default function QuizQuestion({ questionIndex, onAnswer, onBack }) {
  const [selected, setSelected] = useState(null)   // single: string | multi: string[]
  const [animKey, setAnimKey]   = useState(0)
  const q     = questions[questionIndex]
  const total = questions.length
  const isMulti = q.multiSelect === true

  useEffect(() => {
    setSelected(isMulti ? [] : null)
    setAnimKey(k => k + 1)
  }, [questionIndex, isMulti])

  // Single select: avanza automáticamente
  const pickSingle = (id) => {
    setSelected(id)
    setTimeout(() => onAnswer(id), 320)
  }

  // Multi select: toggle
  const toggleMulti = (id) => {
    setSelected(prev => {
      const arr = prev || []
      return arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id]
    })
  }

  const confirmMulti = () => {
    const arr = selected || []
    if (!arr.length) return
    onAnswer(arr)
  }

  const multiSelected = isMulti ? (selected || []) : []
  const progress = (questionIndex / total) * 100

  return (
    <div className="screen bg-c-navy">
      <TopBar onHome={onBack} label={`Pregunta ${questionIndex + 1} de ${total}`} />

      {/* Barra de progreso */}
      <div className="shrink-0 px-8 pt-3 pb-2">
        <div className="w-full h-1.5 bg-c-navy-border rounded-full overflow-hidden">
          <div
            className="h-full bg-c-blue rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          {questions.map((_, i) => (
            <span
              key={i}
              className={`text-xs font-semibold transition-colors
                ${i < questionIndex ? 'text-c-blue' : i === questionIndex ? 'text-c-light' : 'text-c-muted/40'}`}
            >
              {i + 1}
            </span>
          ))}
        </div>
      </div>

      {/* Pregunta */}
      <div key={animKey} className="flex-1 min-h-0 scroll flex flex-col px-8 py-5 animate-slide-in">
        <div className="text-center mb-5">
          <div className="text-5xl mb-3">{q.icon}</div>
          <h2 className="text-3xl font-black text-c-light leading-tight">{q.question}</h2>
          {q.hint && (
            <p className="text-c-muted text-sm mt-2 inline-flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-c-blue/30 text-c-blue-mid text-xs flex items-center justify-center font-bold">i</span>
              {q.hint}
            </p>
          )}
        </div>

        {/* Opciones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {q.options.map(opt => {
            const isActive = isMulti
              ? multiSelected.includes(opt.id)
              : selected === opt.id

            return (
              <button
                key={opt.id}
                onClick={() => isMulti ? toggleMulti(opt.id) : pickSingle(opt.id)}
                className={`btn min-h-44 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-5
                  font-semibold text-lg transition-all duration-150 relative
                  ${isActive
                    ? 'bg-c-blue border-c-blue text-white shadow-2xl card-glow-blue'
                    : 'bg-c-navy-card border-c-navy-border text-c-light hover:border-c-blue/60 hover:bg-c-navy-mid'}`}
              >
                {/* Checkmark para multi */}
                {isMulti && isActive && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    <span className="text-c-blue text-xs font-black">✓</span>
                  </div>
                )}
                <span className="text-4xl">{opt.icon}</span>
                <span className="leading-snug text-center text-base">{opt.label}</span>
              </button>
            )
          })}
        </div>

        {/* Botón confirmar (solo multi-select) */}
        {isMulti && (
          <div className="shrink-0 pt-4 pb-2 flex justify-center">
            <button
              onClick={confirmMulti}
              disabled={multiSelected.length === 0}
              className={`btn px-12 py-4 rounded-2xl font-black text-xl transition-all
                ${multiSelected.length > 0
                  ? 'bg-c-yellow hover:bg-c-yellow-d text-gray-900 animate-pulse-y'
                  : 'bg-c-navy-card border border-c-navy-border text-c-muted/50 cursor-not-allowed'}`}
            >
              {multiSelected.length === 0
                ? 'Selecciona al menos una opción'
                : `Continuar con ${multiSelected.length} selección${multiSelected.length > 1 ? 'es' : ''} →`}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
