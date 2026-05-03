/**
 * PREMIOS DE LA RULETA — Módulo 1 "Participa y gana"
 * Editar aquí para cambiar premios sin tocar componentes.
 */
export const prizes = [
  {
    id: 'muestra',
    label: 'Muestra de producto',
    description: 'Llévate una muestra del adhesivo Continental para tu proceso',
    icon: '🎁',
    color: '#1A56DB',
    instruction: 'Acércate a nuestro equipo en el stand y solicita tu muestra ahora.',
    crmTag: 'premio_muestra',
  },
  {
    id: 'asesoria',
    label: 'Asesoría técnica express',
    description: 'Sesión personalizada con nuestro experto técnico en el stand',
    icon: '🔬',
    color: '#065F46',
    instruction: 'Un asesor técnico de Continental te atenderá ahora mismo en el stand.',
    crmTag: 'premio_asesoria',
  },
  {
    id: 'guia',
    label: 'Guía del portafolio',
    description: 'Guía comparativa impresa de todas las soluciones Continental para madera',
    icon: '📖',
    color: '#1338A8',
    instruction: 'Recoge tu guía impresa en el stand. ¡También te la enviamos por correo!',
    crmTag: 'premio_guia',
  },
  {
    id: 'kit',
    label: 'Kit promocional Continental',
    description: 'Kit exclusivo de la feria con muestras y artículos de la marca',
    icon: '🎒',
    color: '#1A56DB',
    instruction: 'Pasa a la recepción del stand a recoger tu kit de bienvenida.',
    crmTag: 'premio_kit',
  },
  {
    id: 'sorteo',
    label: '¡Participas en el sorteo!',
    description: 'Quedas inscrito en el sorteo del gran premio al cierre de la feria',
    icon: '⭐',
    color: '#D97706',
    instruction: 'Tu participación ya está registrada. El sorteo se realiza el último día.',
    crmTag: 'premio_sorteo',
  },
  {
    id: 'bono',
    label: 'Bono prueba de producto',
    description: 'Bono especial para la primera compra o prueba de un adhesivo Continental',
    icon: '💡',
    color: '#065F46',
    instruction: 'Nuestro equipo comercial te contactará para coordinar la prueba.',
    crmTag: 'premio_bono',
  },
  {
    id: 'souvenir',
    label: 'Souvenir de taller',
    description: 'Artículo útil de Continental exclusivo para visitantes de la feria',
    icon: '🔨',
    color: '#44403C',
    instruction: 'Pasa por el stand y escoge tu souvenir. Disponible mientras haya stock.',
    crmTag: 'premio_souvenir',
  },
  {
    id: 'visita',
    label: 'Visita técnica gratuita',
    description: 'Un asesor Continental visitará tu taller o planta de producción',
    icon: '🏭',
    color: '#1338A8',
    instruction: 'Un asesor te contactará en los próximos 5 días para coordinar la visita.',
    crmTag: 'premio_visita',
  },
]

/**
 * Selección pseudo-aleatoria ponderada.
 * Todos los visitantes ganan algo; distribución controlada.
 */
export function selectPrize() {
  const weights = [18, 15, 20, 10, 10, 10, 9, 8]
  const total = weights.reduce((a, b) => a + b, 0)
  let rand = Math.floor(Math.random() * total)
  for (let i = 0; i < prizes.length; i++) {
    if (rand < weights[i]) return prizes[i]
    rand -= weights[i]
  }
  return prizes[0]
}
