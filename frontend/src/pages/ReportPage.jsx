import { useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { reportApi } from '../api'
import LoadingSpinner from '../components/LoadingSpinner'

const BRL = (v) => v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

export default function ReportPage() {
  const { profile }    = useParams()
  const location       = useLocation()
  const navigate       = useNavigate()
  const prevForm       = location.state?.form

  const [form, setForm] = useState({
    initial_amount:  prevForm?.initial_amount  ?? 100000,
    monthly_contrib: prevForm?.monthly_contrib ?? 1000,
    years:           prevForm?.years           ?? 10,
  })
  const [insight, setInsight]   = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    setInsight(null)
    try {
      const data = await reportApi.getInsight({ profile, ...form })
      setInsight(data.insight)
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Erro ao gerar análise. Verifique se a ANTHROPIC_API_KEY está configurada.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Análise com Inteligência Artificial</h1>
        <p className="text-gray-400 text-sm mt-1">
          Perfil: <span className="text-blue-400 capitalize">{profile}</span> — Powered by Claude (Anthropic)
        </p>
      </div>

      {/* Params */}
      <div className="card">
        <h2 className="text-base font-semibold mb-4 text-gray-300">Parâmetros para análise</h2>
        <div className="grid grid-cols-3 gap-4 mb-5">
          <ParamField label="Investimento inicial" prefix="R$" value={form.initial_amount}
            onChange={v => setForm(f => ({ ...f, initial_amount: +v }))} />
          <ParamField label="Aporte mensal" prefix="R$" value={form.monthly_contrib}
            onChange={v => setForm(f => ({ ...f, monthly_contrib: +v }))} />
          <ParamField label="Horizonte" suffix="anos" value={form.years}
            onChange={v => setForm(f => ({ ...f, years: +v }))} />
        </div>
        <button onClick={handleGenerate} disabled={loading} className="btn-primary w-full">
          {loading ? 'Gerando análise com Claude...' : 'Gerar Análise com IA'}
        </button>
      </div>

      {loading && <LoadingSpinner message="Claude está analisando sua carteira..." />}

      {error && (
        <div className="card border-red-900 bg-red-950/20">
          <p className="text-red-400 text-sm font-medium mb-1">Erro ao gerar análise</p>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      )}

      {insight && (
        <div className="card">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <h2 className="text-lg font-semibold text-white">Análise Personalizada</h2>
            <span className="ml-auto badge bg-blue-900 text-blue-300">Claude AI</span>
          </div>
          <div className="prose prose-invert prose-sm max-w-none">
            {insight.split('\n').map((line, i) => {
              if (!line.trim()) return <br key={i} />
              // Bold markdown
              const parts = line.split(/\*\*(.*?)\*\*/g)
              return (
                <p key={i} className="text-gray-300 leading-relaxed mb-3">
                  {parts.map((part, j) =>
                    j % 2 === 1
                      ? <strong key={j} className="text-white font-semibold">{part}</strong>
                      : part
                  )}
                </p>
              )
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-800 text-xs text-gray-600">
            Análise gerada por IA com base nos dados da carteira. Não constitui recomendação de investimento.
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 justify-end">
        <button onClick={() => navigate(`/simulation/${profile}`)} className="btn-secondary">
          Voltar Simulação
        </button>
        <button onClick={() => navigate('/')} className="btn-secondary">
          Novo Quiz
        </button>
      </div>
    </div>
  )
}

function ParamField({ label, prefix, suffix, value, onChange }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <div className="relative">
        {prefix && <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs">{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={e => onChange(e.target.value)}
          className={`w-full bg-gray-800 border border-gray-700 rounded-lg py-2 text-white text-sm focus:outline-none focus:border-blue-500 ${prefix ? 'pl-7 pr-2' : suffix ? 'pl-2 pr-7' : 'px-2'}`}
        />
        {suffix && <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs">{suffix}</span>}
      </div>
    </div>
  )
}
