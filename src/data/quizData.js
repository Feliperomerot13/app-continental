/**
 * MÓDULO 2 — "Encuentra tu producto ideal"
 * Motor de recomendación 100% basado en reglas predefinidas.
 * Para cambiar preguntas/opciones: editar `questions`.
 * Para ajustar lógica: editar `getRecommendation`.
 *
 * multiSelect: true  → el usuario puede elegir varias opciones (muestra botón Continuar)
 * multiSelect: false → selección única, avanza automáticamente
 */

export const questions = [
  {
    id: 'proceso',
    number: 1,
    question: '¿En qué proceso necesitas adhesivo?',
    icon: '⚙️',
    multiSelect: false,
    options: [
      { id: 'carpinteria', label: 'Carpintería y ebanistería',  icon: '🪚' },
      { id: 'laminacion',  label: 'Laminación y revestimiento', icon: '🖼️' },
      { id: 'postformado', label: 'Postformado',                icon: '🌡️' },
      { id: 'cantos',      label: 'Pegado de cantos',           icon: '📏' },
      { id: 'mixto',       label: 'Aplicación mixta / varios',  icon: '🔄' },
    ],
  },
  {
    id: 'sustrato',
    number: 2,
    question: '¿Qué materiales o sustratos trabajas?',
    hint: 'Puedes seleccionar varios',
    icon: '🪵',
    multiSelect: true,          // ← MULTI-SELECT
    options: [
      { id: 'madera',     label: 'Madera natural',                icon: '🌲' },
      { id: 'mdf',        label: 'MDF',                           icon: '📦' },
      { id: 'aglomerado', label: 'Aglomerado',                    icon: '🟫' },
      { id: 'triplex',    label: 'Triplex / Quíntuplex',          icon: '📐' },
      { id: 'hpl',        label: 'HPL / Fórmica / Laminado dec.', icon: '✨' },
      { id: 'cantos-mat', label: 'Cantos PVC / ABS / Poliéster',  icon: '⬛' },
      { id: 'varios-mat', label: 'Varios / No estoy seguro',      icon: '🗂️' },
    ],
  },
  {
    id: 'necesidad',
    number: 3,
    question: '¿Qué es lo más importante para ti?',
    icon: '🎯',
    multiSelect: false,
    options: [
      { id: 'humedad',        label: 'Mejor desempeño en humedad', icon: '💧' },
      { id: 'calor',          label: 'Resistencia al calor',       icon: '🔥' },
      { id: 'tiempo-abierto', label: 'Mayor tiempo abierto',       icon: '⏱️' },
      { id: 'rapidez',        label: 'Rapidez de aplicación',      icon: '⚡' },
      { id: 'maquina',        label: 'Trabajo en máquina',         icon: '🏭' },
      { id: 'multipropósito', label: 'Solución multipropósito',    icon: '🛠️' },
    ],
  },
  {
    id: 'aplicacion',
    number: 4,
    question: '¿Cómo aplicas el adhesivo?',
    icon: '🖌️',
    multiSelect: false,
    options: [
      { id: 'manual',  label: 'Manual — brocha / rodillo / espátula', icon: '🖌️' },
      { id: 'pistola', label: 'Pistola / aspersión',                  icon: '🔫' },
      { id: 'maquina', label: 'Máquina encoladora de cantos',         icon: '⚙️' },
      { id: 'no-se',   label: 'No estoy seguro',                      icon: '🤔' },
    ],
  },
]

// ─── Resuelve multi-sustrato a un valor único para la tabla de reglas ─────────
function resolveSubstrato(sustrato) {
  // sustrato puede ser string (single) o array (multi-select)
  const arr = Array.isArray(sustrato) ? sustrato : [sustrato]

  if (!arr.length || arr.includes('varios-mat')) return 'varios-mat'
  // Prioridad: el sustrato más específico determina la familia
  if (arr.includes('cantos-mat')) return 'cantos-mat'
  if (arr.includes('hpl'))        return 'hpl'
  if (arr.includes('triplex'))    return 'triplex'
  if (arr.includes('aglomerado')) return 'aglomerado'
  if (arr.includes('mdf'))        return 'mdf'
  return arr[0] || 'madera'
}

// ─── Motor de reglas ──────────────────────────────────────────────────────────
/**
 * Retorna: { productId, altId, confidence, message, proceso, needsAdvisor, tags }
 */
export function getRecommendation(answers) {
  const proceso    = answers.proceso
  const sustrato   = resolveSubstrato(answers.sustrato)
  const necesidad  = answers.necesidad
  const aplicacion = answers.aplicacion

  // ── Regla 1: Cantos + Máquina → Hot Melt ──────────────────────────────
  if (proceso === 'cantos' && aplicacion === 'maquina') {
    if (necesidad === 'maquina' || necesidad === 'rapidez') {
      return {
        productId: 'hc38', altId: 'hc20', confidence: 'alto',
        message: 'Tu operación de alta cadencia en máquina encoladora exige el HC38, formulado para velocidades ≥ 15 m/min con máxima resistencia térmica.',
        proceso: 'Pegado de cantos', needsAdvisor: false,
        tags: ['lead_recomendador', 'cantos', 'maquina_cantos'],
      }
    }
    return {
      productId: 'hc20', altId: 'hc38', confidence: 'alto',
      message: 'Para encoladoras de cantos en velocidad estándar (≥ 6 m/min), el HC20 ofrece fraguado rápido y limpio con buena adhesión en PVC y ABS.',
      proceso: 'Pegado de cantos', needsAdvisor: false,
      tags: ['lead_recomendador', 'cantos', 'maquina_cantos'],
    }
  }

  // ── Caso borde A: Cantos sin máquina ──────────────────────────────────
  if (proceso === 'cantos' && aplicacion !== 'maquina') {
    return {
      productId: 'plus-madera', altId: null, confidence: 'medio',
      message: 'Para pegar cantos sin máquina encoladora, Plus Madera puede ser una alternativa manual. Sin embargo, este caso conviene validarlo con nuestro asesor.',
      proceso: 'Pegado de cantos', needsAdvisor: true,
      tags: ['lead_recomendador', 'cantos'],
    }
  }

  // ── Regla 2: Carpintería → PVA ────────────────────────────────────────
  if (proceso === 'carpinteria') {
    if (necesidad === 'humedad') {
      return {
        productId: 'cola-max-pva', altId: 'cola-pva-continental', confidence: 'alto',
        message: 'Para carpintería en ambientes de alta humedad o estructuras exigentes, Cola Max Continental PVA es la opción más robusta de la línea acuosa.',
        proceso: 'Carpintería y ebanistería', needsAdvisor: false,
        tags: ['lead_recomendador', 'carpinteria', 'alta_humedad'],
      }
    }
    if (sustrato === 'mdf' || sustrato === 'aglomerado' || necesidad === 'multipropósito') {
      return {
        productId: 'cola-pva-continental', altId: 'cola-max-pva', confidence: 'alto',
        message: 'Para carpintería con MDF o aglomerado, Cola PVA Continental ofrece mejor resistencia a la hidrólisis que el PVA básico.',
        proceso: 'Carpintería y ebanistería', needsAdvisor: false,
        tags: ['lead_recomendador', 'carpinteria'],
      }
    }
    return {
      productId: 'cola-especial-pva', altId: 'cola-pva-continental', confidence: 'alto',
      message: 'Para carpintería y ebanistería en condiciones normales de humedad y temperatura, Cola Especial PVA es la solución base de alto rendimiento.',
      proceso: 'Carpintería y ebanistería', needsAdvisor: false,
      tags: ['lead_recomendador', 'carpinteria'],
    }
  }

  // ── Regla 3: Laminación / Postformado → Solventes ─────────────────────
  if (proceso === 'laminacion' || proceso === 'postformado') {
    if (aplicacion === 'pistola' || necesidad === 'rapidez') {
      return {
        productId: 'spray-continental', altId: 'plus-madera', confidence: 'alto',
        message: 'Para laminación de grandes superficies con pistola o cuando la productividad es clave, Spray Continental maximiza la velocidad de aplicación.',
        proceso: proceso === 'postformado' ? 'Postformado' : 'Laminación y revestimiento',
        needsAdvisor: false,
        tags: ['lead_recomendador', proceso === 'postformado' ? 'postformado' : 'laminacion', 'aplicacion_pistola'],
      }
    }
    if (necesidad === 'tiempo-abierto') {
      return {
        productId: 'super-madera', altId: 'plus-madera', confidence: 'alto',
        message: 'Cuando necesitas más tiempo para posicionar el material, Super Madera ofrece el mayor tiempo de trabajo abierto con excelente resistencia al calor.',
        proceso: proceso === 'postformado' ? 'Postformado' : 'Laminación y revestimiento',
        needsAdvisor: false,
        tags: ['lead_recomendador', proceso === 'postformado' ? 'postformado' : 'laminacion', 'tiempo_abierto'],
      }
    }
    return {
      productId: 'plus-madera', altId: 'super-madera', confidence: 'alto',
      message: 'Para laminación, enchapes y postformado en MDF, HPL y fórmica, Plus Madera es la referencia de alto desempeño con excelente resistencia al calor.',
      proceso: proceso === 'postformado' ? 'Postformado' : 'Laminación y revestimiento',
      needsAdvisor: false,
      tags: ['lead_recomendador', proceso === 'postformado' ? 'postformado' : 'laminacion', 'alta_temperatura'],
    }
  }

  // ── Regla 4: Mixto / varios materiales ─────────────────────────────────
  if (proceso === 'mixto' || sustrato === 'varios-mat') {
    return {
      productId: 'industrial-amarillo', altId: null, confidence: 'bajo',
      message: 'Para aplicaciones mixtas con varios materiales y procesos, Industrial Continental Amarillo es la solución más versátil. Te recomendamos complementar con asesoría técnica.',
      proceso: 'Aplicación mixta', needsAdvisor: true,
      tags: ['lead_recomendador'],
    }
  }

  // ── Caso C: Respuestas inconsistentes ────────────────────────────────────
  return {
    productId: 'industrial-amarillo', altId: null, confidence: 'medio',
    message: 'Tus respuestas combinan variables de distintos procesos. Para una recomendación precisa conviene hablar con nuestro asesor técnico.',
    proceso: 'Revisión técnica recomendada', needsAdvisor: true,
    tags: ['lead_recomendador'],
  }
}

// Etiqueta legible de una respuesta (incluye arrays)
export function labelFor(questionId, answerId) {
  const q = questions.find(q => q.id === questionId)
  if (!q) return answerId
  if (Array.isArray(answerId)) {
    return answerId
      .map(id => q.options.find(o => o.id === id)?.label || id)
      .join(', ')
  }
  return q.options.find(o => o.id === answerId)?.label || answerId
}
