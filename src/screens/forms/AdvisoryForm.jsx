import { useState } from 'react'
import TopBar from '../shared/TopBar.jsx'

// ─── Field FUERA del componente padre ────────────────────────────────────────
function Field({ label, value, onChange, error, placeholder, type = 'text', required }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-600 mb-1.5">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        className={`w-full bg-c-bg-light border rounded-xl px-4 py-3.5 text-gray-900 text-base
          placeholder-gray-400 focus:outline-none focus:border-c-blue transition-colors
          ${error ? 'border-red-400' : 'border-c-border-l'}`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

const interesOpts = [
  'Cotización', 'Muestra de producto', 'Visita técnica',
  'Información del portafolio', 'Prueba en planta', 'Otro',
]

// ─── Componente principal ─────────────────────────────────────────────────────
export default function AdvisoryForm({ context, onSubmit, onBack }) {
  const [form, setForm] = useState({
    nombre: '', empresa: '', cargo: '', celular: '', correo: '',
    ciudad: '', productoInteres: context?.productId ? `Producto: ${context.productId}` : '',
    comentario: '', aceptaDatos: false,
  })
  const [errors, setErrors] = useState({})
  const [done, setDone]     = useState(false)

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    if (errors[k]) setErrors(e => { const n = { ...e }; delete n[k]; return n })
  }

  const validate = () => {
    const e = {}
    if (!form.nombre.trim())  e.nombre  = 'Requerido'
    if (!form.empresa.trim()) e.empresa = 'Requerido'
    if (!form.cargo.trim())   e.cargo   = 'Requerido'
    if (!form.celular.trim()) e.celular = 'Requerido'
    if (!form.correo.trim())  e.correo  = 'Requerido'
    if (!form.ciudad.trim())  e.ciudad  = 'Requerido'
    if (!form.aceptaDatos)    e.aceptaDatos = 'Debes aceptar'
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    onSubmit(form)
    setDone(true)
  }

  if (done) {
    return (
      <div className="screen bg-c-bg-light">
        <TopBar onHome={onBack} label="Solicitud enviada" light />
        <div className="flex-1 flex flex-col items-center justify-center px-12">
          <div className="text-8xl mb-6">✅</div>
          <h2 className="text-4xl font-black text-gray-900 text-center mb-4">¡Solicitud registrada!</h2>
          <p className="text-gray-600 text-xl text-center max-w-md leading-relaxed mb-8">
            Un asesor de Continental te atenderá en el stand. También puedes acercarte directamente a nuestro equipo.
          </p>
          <button
            onClick={onBack}
            className="btn bg-c-blue hover:bg-c-blue-dark text-white font-black text-xl px-10 py-4 rounded-2xl transition-all"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="screen bg-c-bg-light">
      <TopBar onHome={onBack} label="Solicitar asesoría" light />

      <div className="flex-1 flex flex-col items-center px-12 py-6 scroll">
        <div className="w-full max-w-xl">

          <div className="text-center mb-8">
            <div className="text-5xl mb-3">💬</div>
            <h2 className="text-3xl font-black text-gray-900 mb-1.5">¿Cómo podemos ayudarte?</h2>
            <p className="text-gray-500">Déjanos tus datos y un asesor técnico te atenderá en el stand.</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Nombre completo" value={form.nombre}
                onChange={e => set('nombre', e.target.value)}
                error={errors.nombre} placeholder="Tu nombre" required />
              <Field label="Empresa" value={form.empresa}
                onChange={e => set('empresa', e.target.value)}
                error={errors.empresa} placeholder="Tu empresa" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Cargo" value={form.cargo}
                onChange={e => set('cargo', e.target.value)}
                error={errors.cargo} placeholder="Tu cargo" required />
              <Field label="Ciudad" value={form.ciudad}
                onChange={e => set('ciudad', e.target.value)}
                error={errors.ciudad} placeholder="Tu ciudad" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Celular" value={form.celular}
                onChange={e => set('celular', e.target.value)}
                error={errors.celular} placeholder="310 000 0000" type="tel" required />
              <Field label="Correo" value={form.correo}
                onChange={e => set('correo', e.target.value)}
                error={errors.correo} placeholder="correo@empresa.com" type="email" required />
            </div>

            {/* Interés */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">¿Qué necesitas?</label>
              <div className="flex flex-wrap gap-2">
                {interesOpts.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => set('productoInteres', opt)}
                    className={`btn px-4 py-2 rounded-xl border text-sm font-medium transition-all min-h-0
                      ${form.productoInteres === opt
                        ? 'bg-c-blue border-c-blue text-white'
                        : 'bg-white border-c-border-l text-gray-700 hover:border-c-blue/40'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Comentario */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                Comentario adicional <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <textarea
                value={form.comentario}
                onChange={e => set('comentario', e.target.value)}
                placeholder="Cuéntanos sobre tu proceso o necesidad específica…"
                rows={3}
                className="w-full bg-c-bg-light border border-c-border-l rounded-xl px-4 py-3.5
                  text-gray-900 text-base placeholder-gray-400 focus:outline-none
                  focus:border-c-blue transition-colors resize-none"
              />
            </div>

            {/* Legal */}
            <label
              className={`flex items-start gap-3 cursor-pointer p-3 rounded-xl border transition-colors
                ${errors.aceptaDatos ? 'border-red-400 bg-red-50' : 'border-c-border-l hover:border-c-blue/30'}`}
            >
              <div
                onClick={() => set('aceptaDatos', !form.aceptaDatos)}
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all
                  ${form.aceptaDatos ? 'bg-c-blue border-c-blue' : 'border-gray-400'}`}
              >
                {form.aceptaDatos && <span className="text-white text-xs font-black">✓</span>}
              </div>
              <span className="text-gray-600 text-sm">
                Autorizo el tratamiento de mis datos conforme a la Ley 1581 de 2012.
                <span className="text-red-500 ml-1">*</span>
              </span>
            </label>
            {errors.aceptaDatos && (
              <p className="text-red-500 text-xs pl-1">{errors.aceptaDatos}</p>
            )}

            <button
              onClick={handleSubmit}
              className="btn w-full bg-c-blue hover:bg-c-blue-dark text-white font-black text-xl py-4 rounded-2xl transition-all card-glow-blue"
            >
              Enviar solicitud →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
