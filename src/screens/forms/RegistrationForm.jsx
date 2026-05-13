import { useState } from 'react'
import TopBar from '../shared/TopBar.jsx'

// ─── Field FUERA del componente padre ── evita remount en cada render ────────
function Field({ label, value, onChange, error, placeholder, type = 'text', required }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-c-muted mb-1.5">
        {label}{required && <span className="text-c-yellow ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        className={`w-full bg-c-navy-mid border rounded-xl px-4 py-3.5 text-c-light text-base
          placeholder-c-muted/40 focus:outline-none focus:border-c-blue transition-colors
          ${error ? 'border-red-500' : 'border-c-navy-border'}`}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}

// ─── Chips de selección FUERA también ────────────────────────────────────────
function ChipGroup({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`btn px-4 py-2 rounded-xl border text-sm font-medium transition-all min-h-0
            ${value === opt
              ? 'bg-c-blue border-c-blue text-white'
              : 'bg-c-navy-card border-c-navy-border text-c-muted hover:border-c-blue/50'}`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

const PRODUCT_INTEREST_OPTIONS = [
  'Hotmelt Conti Cap 1',
  'Hotmelt Conti Foam 1',
  'Adhesivo Hotmelt ATHC-38',
  'adhesivo Hotmelt BTHC-Media',
  'adhesivo Hotmelt BTHC-20',
  'Hotmelt Contibox',
  'Pegante Continental Incoloro',
  'One Way',
  'One Way Plus',
  'One Way Plus Aerosol',
  'Aquoso One Way',
  'Plus Madera',
  'Spray',
  'Super Madera',
  'Cola Conti 30',
  'Cola Conti 40',
  'PVA Conti 40',
  'PVA Conti 50',
  'PVA Conti 50 Max',
  'Pegante Contigramilla',
  'Pegante Poliuretano Laminado',
  'Conti Instantaneo',
  'Conti Pur',
  'Conti Pur D4',
]
const OTHER_PRODUCT = 'Otro'

function formatProductInterest(selected, otherText) {
  const picked = selected.filter(item => item !== OTHER_PRODUCT)
  const custom = otherText.trim()
  return [...picked, ...(custom ? [custom] : [])].join(', ')
}

function ProductInterestMultiSelect({ onChange }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState([])
  const [otherText, setOtherText] = useState('')

  const emit = (nextSelected, nextOtherText = otherText) => {
    setSelected(nextSelected)
    onChange(formatProductInterest(nextSelected, nextOtherText))
  }

  const toggle = (option) => {
    const exists = selected.includes(option)
    const next = exists ? selected.filter(item => item !== option) : [...selected, option]

    if (option === OTHER_PRODUCT && exists) {
      setOtherText('')
      onChange(formatProductInterest(next, ''))
      setSelected(next)
      return
    }

    emit(next)
  }

  const handleOtherChange = (value) => {
    setOtherText(value)
    onChange(formatProductInterest(selected, value))
  }

  const clear = () => {
    setSelected([])
    setOtherText('')
    onChange('')
  }

  const selectedNames = selected.filter(item => item !== OTHER_PRODUCT)
  const visibleSelection = [
    ...selectedNames,
    ...(selected.includes(OTHER_PRODUCT) && otherText.trim() ? [otherText.trim()] : []),
  ]
  const count = visibleSelection.length

  return (
    <div>
      <label className="block text-sm font-semibold text-c-muted mb-1.5">
        Producto de interés <span className="text-c-muted/50 font-normal">(opcional)</span>
      </label>
      <button
        type="button"
        onClick={() => setOpen(value => !value)}
        className="btn w-full min-h-0 bg-c-navy-mid border border-c-navy-border rounded-xl px-4 py-3.5
          text-left text-c-light text-base focus:outline-none focus:border-c-blue transition-colors"
      >
        <span className="flex items-center justify-between gap-3">
          <span className={count ? 'text-c-light' : 'text-c-muted/70'}>
            {count
              ? `${count} producto${count > 1 ? 's' : ''} seleccionado${count > 1 ? 's' : ''}`
              : 'Selecciona uno o varios productos'}
          </span>
          <span className={`text-c-muted transition-transform ${open ? 'rotate-180' : ''}`}>⌄</span>
        </span>
      </button>

      {count > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {visibleSelection.map(item => (
            <span key={item} className="rounded-lg bg-c-blue/20 border border-c-blue/30 px-2.5 py-1 text-xs font-semibold text-c-light">
              {item}
            </span>
          ))}
          <button
            type="button"
            onClick={clear}
            className="btn min-h-0 rounded-lg border border-c-navy-border px-2.5 py-1 text-xs font-semibold text-c-muted hover:text-c-light"
          >
            Limpiar
          </button>
        </div>
      )}

      {open && (
        <div className="mt-3 rounded-2xl border border-c-navy-border bg-c-navy-card p-3">
          <div className="grid max-h-64 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
            {[...PRODUCT_INTEREST_OPTIONS, OTHER_PRODUCT].map(option => {
              const active = selected.includes(option)
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggle(option)}
                  className={`btn min-h-0 rounded-xl border px-3 py-2 text-left text-sm font-semibold transition-all
                    ${active
                      ? 'border-c-blue bg-c-blue text-white'
                      : 'border-c-navy-border bg-c-navy-mid text-c-muted hover:border-c-blue/50 hover:text-c-light'}`}
                >
                  {active ? '✓ ' : ''}{option}
                </button>
              )
            })}
          </div>

          {selected.includes(OTHER_PRODUCT) && (
            <input
              type="text"
              value={otherText}
              onChange={e => handleOtherChange(e.target.value)}
              placeholder="Escribe el otro producto"
              className="mt-3 w-full rounded-xl border border-c-navy-border bg-c-navy-mid px-4 py-3 text-c-light
                placeholder-c-muted/50 focus:outline-none focus:border-c-blue"
            />
          )}
        </div>
      )}
    </div>
  )
}

const tiposEmpresa = [
  'Fabricante de muebles', 'Carpintería / Ebanistería', 'Fabricante industrial',
  'Distribuidor', 'Arquitecto / Diseñador', 'Comprador', 'Otro',
]

// ─── Componente principal ─────────────────────────────────────────────────────
export default function RegistrationForm({ onSubmit, onBack }) {
  const [form, setForm] = useState({
    nombre: '', empresa: '', cargo: '', celular: '', correo: '',
    ciudad: '', tipoEmpresa: '', productoInteres: '', aceptaDatos: false, aceptaContacto: false,
  })
  const [errors, setErrors] = useState({})

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    if (errors[k]) setErrors(e => { const n = { ...e }; delete n[k]; return n })
  }

  const validate = () => {
    const e = {}
    if (!form.nombre.trim())  e.nombre  = 'Campo requerido'
    if (!form.empresa.trim()) e.empresa = 'Campo requerido'
    if (!form.cargo.trim())   e.cargo   = 'Campo requerido'
    if (!form.celular.trim() && !form.correo.trim()) e.celular = 'Ingresa celular o correo'
    if (!form.aceptaDatos)    e.aceptaDatos = 'Debes aceptar el tratamiento de datos'
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    onSubmit(form)
  }

  return (
    <div className="screen bg-c-navy">
      <TopBar onHome={onBack} label="Registro para participar" />

      <div className="flex-1 min-h-0 flex flex-col items-center px-6 sm:px-10 py-6 pb-12 scroll">
        <div className="w-full max-w-3xl">

          <div className="text-center mb-8">
            <div className="text-5xl mb-3">📝</div>
            <h2 className="text-4xl font-black text-c-light mb-2">Tus datos de contacto</h2>
            <p className="text-c-muted text-lg">Completa los campos y habilitamos la ruleta para ti</p>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="Nombre completo" value={form.nombre}
                onChange={e => set('nombre', e.target.value)}
                error={errors.nombre} placeholder="Tu nombre" required
              />
              <Field
                label="Empresa" value={form.empresa}
                onChange={e => set('empresa', e.target.value)}
                error={errors.empresa} placeholder="Nombre de tu empresa" required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="Cargo" value={form.cargo}
                onChange={e => set('cargo', e.target.value)}
                error={errors.cargo} placeholder="Tu cargo" required
              />
              <Field
                label="Ciudad" value={form.ciudad}
                onChange={e => set('ciudad', e.target.value)}
                placeholder="Tu ciudad"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="Celular" value={form.celular}
                onChange={e => set('celular', e.target.value)}
                error={errors.celular} placeholder="310 000 0000" type="tel"
              />
              <Field
                label="Correo electrónico" value={form.correo}
                onChange={e => set('correo', e.target.value)}
                placeholder="correo@empresa.com" type="email"
              />
            </div>
            {errors.celular && !errors.correo && (
              <p className="text-red-400 text-xs -mt-2">{errors.celular}</p>
            )}

            <ProductInterestMultiSelect onChange={v => set('productoInteres', v)} />

            {/* Tipo empresa — opcional */}
            <div>
              <label className="block text-sm font-semibold text-c-muted mb-2">
                Tipo de empresa{' '}
                <span className="text-c-muted/50 font-normal">(opcional)</span>
              </label>
              <ChipGroup
                options={tiposEmpresa}
                value={form.tipoEmpresa}
                onChange={v => set('tipoEmpresa', v)}
              />
            </div>

            {/* Checkboxes legales */}
            <div className="space-y-3 pt-1">
              <label
                className={`flex items-start gap-3 cursor-pointer p-3 rounded-xl border transition-colors
                  ${errors.aceptaDatos
                    ? 'border-red-500 bg-red-900/10'
                    : 'border-c-navy-border hover:border-c-blue/40'}`}
              >
                <div
                  onClick={() => set('aceptaDatos', !form.aceptaDatos)}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all
                    ${form.aceptaDatos ? 'bg-c-blue border-c-blue' : 'border-c-muted/50'}`}
                >
                  {form.aceptaDatos && <span className="text-white text-xs font-black">✓</span>}
                </div>
                <span className="text-c-muted text-sm leading-relaxed">
                  <strong className="text-c-light">Autorizo el tratamiento de mis datos personales</strong>{' '}
                  conforme a la Ley 1581 de 2012 y la política de privacidad de Continental de Pegantes y Soluciones.
                  <span className="text-c-yellow ml-1">*</span>
                </span>
              </label>
              {errors.aceptaDatos && (
                <p className="text-red-400 text-xs pl-1">{errors.aceptaDatos}</p>
              )}

              <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl border border-c-navy-border hover:border-c-blue/40 transition-colors">
                <div
                  onClick={() => set('aceptaContacto', !form.aceptaContacto)}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all
                    ${form.aceptaContacto ? 'bg-c-blue border-c-blue' : 'border-c-muted/50'}`}
                >
                  {form.aceptaContacto && <span className="text-white text-xs font-black">✓</span>}
                </div>
                <span className="text-c-muted text-sm leading-relaxed">
                  Acepto ser contactado por el equipo comercial de Continental para seguimiento posterior a la feria.
                </span>
              </label>
            </div>

            <button
              onClick={handleSubmit}
              className="btn w-full bg-c-yellow hover:bg-c-yellow-d text-gray-900 font-black text-xl py-5 rounded-2xl mt-2 transition-all animate-pulse-y"
            >
              🎡 ¡Ir a la ruleta! →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
