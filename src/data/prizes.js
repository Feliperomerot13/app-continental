/**
 * PREMIOS DE LA RULETA — Módulo 1 "Participa y gana"
 * Editar aquí para cambiar premios sin tocar componentes.
 */
export const prizes = [
  {
    id: 'kit_mundialista',
    label: 'Kit mundialista',
    description: 'Llévate un kit mundialista especial de Continental.',
    icon: '🏆',
    color: '#1A56DB',
    instruction: 'Acércate a nuestro equipo en el stand para reclamar tu kit.',
    crmTag: 'premio_kit_mundialista',
    probability: 10,
  },
  {
    id: 'kit_carpintero',
    label: 'Kit Carpintero',
    description: 'Recibe un kit pensado para acompañarte en el taller.',
    icon: '🧰',
    color: '#1338A8',
    instruction: 'Presenta esta pantalla al equipo Continental para reclamar tu kit.',
    crmTag: 'premio_kit_carpintero',
    probability: 14,
  },
  {
    id: 'balon',
    label: 'Balón',
    description: 'Ganaste un balón para disfrutar fuera del taller.',
    icon: '⚽',
    color: '#D97706',
    instruction: 'Acércate a la recepción del stand y muestra este resultado para reclamarlo.',
    crmTag: 'premio_balon',
    probability: 20,
  },
  {
    id: 'obsequio_sorpresa',
    label: 'Obsequio sorpresa Continental',
    description: 'Recibe un obsequio sorpresa de Continental.',
    icon: '🎒',
    color: '#1A56DB',
    instruction: 'Nuestro equipo te entregará tu obsequio sorpresa en el stand.',
    crmTag: 'premio_obsequio_sorpresa',
    probability: 30,
  },
  {
    id: 'muestra_conti_instantaneo',
    label: 'Muestra Gratis Conti Instantáneo',
    description: 'Llévate una muestra gratis de Conti Instantáneo.',
    icon: '🎁',
    color: '#065F46',
    instruction: 'Acércate a nuestro equipo en el stand para reclamar tu muestra.',
    crmTag: 'premio_muestra_conti_instantaneo',
    probability: 20,
  },
  {
    id: 'sigue_intentando',
    label: 'Sigue Intentando',
    description: 'Esta vez no hubo premio, pero gracias por participar con Continental.',
    icon: '🔁',
    color: '#44403C',
    instruction: 'Puedes acercarte al equipo Continental para conocer nuestras soluciones.',
    crmTag: 'sin_premio_sigue_intentando',
    isRetry: true,
    probability: 6,
  },
]

/**
 * Selección pseudo-aleatoria ponderada.
 * Distribución controlada de premios e intento.
 */
export function selectPrize() {
  const total = prizes.reduce((sum, prize) => sum + prize.probability, 0)
  let rand = Math.random() * total

  for (const prize of prizes) {
    if (rand < prize.probability) return prize
    rand -= prize.probability
  }

  return prizes[0]
}
