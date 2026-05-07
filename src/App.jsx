import { useState, useCallback, useRef } from 'react'
import { useInactivity } from './hooks/useInactivity.js'
import { useLeads } from './hooks/useLeads.js'
import { getRecommendation, questions } from './data/quizData.js'
import { selectPrize } from './data/prizes.js'

// Shared
import InactivityWarning from './components/InactivityWarning.jsx'

// Home
import HomeScreen from './screens/HomeScreen.jsx'

// Módulo 1 — Participa y gana (Ruleta)
import RouletteIntro   from './screens/roulette/RouletteIntro.jsx'
import RegistrationForm from './screens/forms/RegistrationForm.jsx'
import RouletteScreen  from './screens/roulette/RouletteScreen.jsx'
import PrizeScreen     from './screens/roulette/PrizeScreen.jsx'

// Módulo 2 — Encuentra tu producto ideal (Recomendador)
import QuizIntro    from './screens/quiz/QuizIntro.jsx'
import QuizQuestion from './screens/quiz/QuizQuestion.jsx'
import QuizResult   from './screens/quiz/QuizResult.jsx'

// Módulo 3 — Catálogo
import CatalogHome   from './screens/catalog/CatalogHome.jsx'
import ProductList   from './screens/catalog/ProductList.jsx'
import ProductDetail from './screens/catalog/ProductDetail.jsx'

// Formulario de asesoría (transversal)
import AdvisoryForm from './screens/forms/AdvisoryForm.jsx'

// Brochure
import BrochureScreen from './screens/brochure/BrochureScreen.jsx'

// Panel admin
import AdminPanel from './screens/AdminPanel.jsx'

// ─── Constantes ────────────────────────────────────────────────────────────
const TOTAL_QUESTIONS = questions.length   // 4

export default function App() {
  // ── Pantalla activa ──────────────────────────────────────────────────────
  const [screen, setScreen] = useState('home')

  // ── Módulo 1: Ruleta ────────────────────────────────────────────────────
  const [prize, setPrize] = useState(null)

  // ── Módulo 2: Recomendador ─────────────────────────────────────────────
  const [quizStep,       setQuizStep]       = useState(0)
  const [quizAnswers,    setQuizAnswers]     = useState({})
  const [recommendation, setRecommendation] = useState(null)

  // ── Catálogo ─────────────────────────────────────────────────────────────
  const [catalogFilter,    setCatalogFilter]    = useState({ type: null, key: null, label: null })
  const [selectedProduct,  setSelectedProduct]  = useState(null)
  const [productBackScreen,setProductBackScreen]= useState('catalog-list')

  // ── Asesoría ──────────────────────────────────────────────────────────────
  const [advisoryCtx, setAdvisoryCtx] = useState(null)
  const [advisoryBack,setAdvisoryBack]= useState('home')

  // ── Leads ─────────────────────────────────────────────────────────────────
  const { leads, addLead, clearLeads, exportCSV, stats, storage, unlockAdmin, fetchLeads } = useLeads()

  // ── Admin (7 toques rápidos en el logo) ───────────────────────────────────
  const logoTap = useRef({ count: 0, timer: null })

  // ── Inactividad ───────────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    if (screen === 'admin') return
    setScreen('home')
    setQuizStep(0); setQuizAnswers({})
    setRecommendation(null); setPrize(null)
  }, [screen])

  const { warningVisible, countdown, resetTimer } = useInactivity(handleReset, 75000, 15000)

  // ── Handlers de navegación ────────────────────────────────────────────────
  const goHome = () => setScreen('home')

  const handleNavigate = (dest) => {
    if (dest === 'roulette-intro') setScreen('roulette-intro')
    else if (dest === 'quiz-intro') { setQuizStep(0); setQuizAnswers({}); setRecommendation(null); setScreen('quiz-intro') }
    else if (dest === 'catalog')   setScreen('catalog-home')
    else if (dest === 'brochure')  setScreen('brochure')
  }

  const handleLogoTap = () => {
    const r = logoTap.current
    r.count++
    if (r.timer) clearTimeout(r.timer)
    r.timer = setTimeout(() => { r.count = 0 }, 2500)
    if (r.count >= 7) { r.count = 0; setScreen('admin') }
  }

  // ── Módulo 1: Ruleta ──────────────────────────────────────────────────────
  const handleRegSubmit = (formData) => {
    const p = selectPrize()
    setPrize(p)
    // El registro se guarda al aterrizar en prize screen (cuando se confirma el premio)
    addLead({
      ...formData,
      modulo: 'ruleta',
      productoRecomendado: '',
      productoAlterno: '',
      premio: p.label,
      tags: ['lead_ruleta'],
    })
    setScreen('roulette')
  }

  const handlePrizeWon = (p) => {
    setPrize(p)
    setScreen('prize')
  }

  // ── Módulo 2: Recomendador ────────────────────────────────────────────────
  const handleQuizAnswer = (answerId) => {
    const qId = questions[quizStep].id
    const newAnswers = { ...quizAnswers, [qId]: answerId }
    setQuizAnswers(newAnswers)

    if (quizStep + 1 < TOTAL_QUESTIONS) {
      setQuizStep(s => s + 1)
    } else {
      const rec = getRecommendation(newAnswers)
      setRecommendation({ ...rec, answers: newAnswers })

      // Guardar lead del recomendador (sin datos personales aún — son CTAs)
      const sustrato = newAnswers.sustrato
      addLead({
        modulo: 'recomendador',
        proceso: newAnswers.proceso || '',
        sustrato: Array.isArray(sustrato) ? sustrato.join(', ') : (sustrato || ''),
        necesidad: newAnswers.necesidad || '',
        aplicacion: newAnswers.aplicacion || '',
        productoRecomendado: rec.productId || '',
        productoAlterno: rec.altId || '',
        confianza: rec.confidence || '',
        tags: (rec.tags || []).join(', '),
      })

      setScreen('quiz-result')
    }
  }

  const handleViewProduct = (id, backScreen = 'quiz-result') => {
    setSelectedProduct(id)
    setProductBackScreen(backScreen)
    setScreen('product-detail')
  }

  const handleQuizAdvise = () => {
    setAdvisoryCtx({ source: 'recomendador', productId: recommendation?.productId })
    setAdvisoryBack('quiz-result')
    setScreen('advisory')
  }

  // ── Catálogo ──────────────────────────────────────────────────────────────
  const handleCatalogFilter = (type, key, label) => {
    setCatalogFilter({ type, key, label })
    setScreen('catalog-list')
  }

  const handleSelectProductFromCatalog = (id) => {
    setSelectedProduct(id)
    setProductBackScreen('catalog-list')
    setScreen('product-detail')
  }

  const handleSelectProductFromHome = (id) => {
    setSelectedProduct(id)
    setProductBackScreen('catalog-home')
    setScreen('product-detail')
  }

  const handleProductAdvise = (productId) => {
    setAdvisoryCtx({ productId })
    setAdvisoryBack('product-detail')
    setScreen('advisory')
  }

  // ── Asesoría ──────────────────────────────────────────────────────────────
  const handleAdvisorySubmit = (formData) => {
    addLead({
      ...formData,
      modulo: 'asesoria',
      productoRecomendado: advisoryCtx?.productId || '',
      productoAlterno: '',
      tags: ['lead_asesoria'],
    })
  }

  // ── Render ────────────────────────────────────────────────────────────────
  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return <HomeScreen onNavigate={handleNavigate} onLogoTap={handleLogoTap} />

      // — Módulo 1 —
      case 'roulette-intro':
        return <RouletteIntro onStart={() => setScreen('registration')} onBack={goHome} />
      case 'registration':
        return <RegistrationForm onSubmit={handleRegSubmit} onBack={() => setScreen('roulette-intro')} />
      case 'roulette':
        return <RouletteScreen prizeToWin={prize} onPrize={handlePrizeWon} onBack={goHome} />
      case 'prize':
        return <PrizeScreen prize={prize} onHome={goHome}
          onAdvise={() => { setAdvisoryCtx(null); setAdvisoryBack('home'); setScreen('advisory') }} />

      // — Módulo 2 —
      case 'quiz-intro':
        return <QuizIntro onStart={() => setScreen('quiz-question')} onBack={goHome} />
      case 'quiz-question':
        return <QuizQuestion questionIndex={quizStep} onAnswer={handleQuizAnswer} onBack={goHome} />
      case 'quiz-result':
        return recommendation ? (
          <QuizResult
            recommendation={recommendation}
            answers={quizAnswers}
            onViewProduct={(id) => handleViewProduct(id, 'quiz-result')}
            onAdvise={handleQuizAdvise}
            onCatalog={() => setScreen('catalog-home')}
            onBack={goHome}
          />
        ) : null

      // — Catálogo —
      case 'catalog-home':
        return <CatalogHome
          onFilter={handleCatalogFilter}
          onSelectProduct={handleSelectProductFromHome}
          onBack={goHome}
          onBrochure={() => setScreen('brochure')}
        />
      case 'catalog-list':
        return <ProductList
          filterType={catalogFilter.type}
          filterKey={catalogFilter.key}
          filterLabel={catalogFilter.label}
          onSelect={handleSelectProductFromCatalog}
          onCatalogHome={() => setScreen('catalog-home')}
        />
      case 'product-detail':
        return <ProductDetail
          productId={selectedProduct}
          onBack={() => setScreen(productBackScreen)}
          onSimilar={(id) => { setSelectedProduct(id) /* stay on same screen */ }}
          onAdvise={(id) => { setAdvisoryCtx({ productId: id }); setAdvisoryBack('product-detail'); setScreen('advisory') }}
          onQuiz={() => { setQuizStep(0); setQuizAnswers({}); setScreen('quiz-intro') }}
        />

      // — Asesoría —
      case 'advisory':
        return <AdvisoryForm
          context={advisoryCtx}
          onSubmit={handleAdvisorySubmit}
          onBack={() => setScreen(advisoryBack || 'home')}
        />

      // — Brochure —
      case 'brochure':
        return <BrochureScreen onClose={goHome} />

      // — Admin —
      case 'admin':
        return <AdminPanel
          leads={leads}
          stats={stats}
          storage={storage}
          onUnlock={unlockAdmin}
          onRefresh={fetchLeads}
          onExport={exportCSV}
          onClear={clearLeads}
          onBack={goHome}
        />

      default:
        return <HomeScreen onNavigate={handleNavigate} onLogoTap={handleLogoTap} />
    }
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-c-navy relative">
      {renderScreen()}
      {warningVisible && screen !== 'admin' && (
        <InactivityWarning countdown={countdown} onStay={resetTimer} />
      )}
    </div>
  )
}
