import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { quizApi } from '../api'
import LoadingSpinner from '../components/LoadingSpinner'

export default function QuizPage() {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers]     = useState({})
  const [current, setCurrent]     = useState(0)
  const [loading, setLoading]     = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]         = useState(null)

  useEffect(() => {
    quizApi.getQuestions()
      .then(data => setQuestions(data.questions))
      .catch(() => setError('Não foi possível carregar as perguntas. Verifique se o backend está rodando.'))
      .finally(() => setLoading(false))
  }, [])

  const handleAnswer = (points) => {
    const q = questions[current]
    const newAnswers = { ...answers, [q.id]: points }
    setAnswers(newAnswers)

    if (current < questions.length - 1) {
      setTimeout(() => setCurrent(c => c + 1), 300)
    } else {
      submitQuiz(newAnswers)
    }
  }

  const submitQuiz = async (finalAnswers) => {
    setSubmitting(true)
    try {
      const result = await quizApi.evaluate(finalAnswers)
      navigate(`/portfolio/${result.profile}`, { state: { result } })
    } catch {
      setError('Erro ao avaliar respostas. Tente novamente.')
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner message="Carregando questionário..." />
  if (error)   return <ErrorCard message={error} />
  if (submitting) return <LoadingSpinner message="Analisando seu perfil..." />

  const q    = questions[current]
  const pct  = Math.round(((current) / questions.length) * 100)

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Descubra seu Perfil</h1>
        <p className="text-gray-400">Responda 8 perguntas e receba sua carteira personalizada</p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Pergunta {current + 1} de {questions.length}</span>
          <span>{pct}%</span>
        </div>
        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="card">
        <span className="badge bg-blue-900 text-blue-300 mb-4">{q.category}</span>
        <h2 className="text-xl font-semibold text-white mb-2">{q.question}</h2>
        <p className="text-gray-400 text-sm mb-6">{q.description}</p>

        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt.points)}
              className="w-full text-left px-4 py-3 rounded-lg border border-gray-700 hover:border-blue-500 hover:bg-blue-950 transition-all text-gray-200 text-sm"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Back button */}
      {current > 0 && (
        <button
          onClick={() => setCurrent(c => c - 1)}
          className="mt-4 text-gray-500 hover:text-gray-300 text-sm transition-colors"
        >
          Voltar pergunta anterior
        </button>
      )}
    </div>
  )
}

function ErrorCard({ message }) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="card border-red-800 text-center">
        <p className="text-red-400 font-medium mb-2">Erro</p>
        <p className="text-gray-400 text-sm">{message}</p>
      </div>
    </div>
  )
}
