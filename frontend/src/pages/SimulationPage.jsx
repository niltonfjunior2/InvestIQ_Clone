import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { simulationApi, portfolioApi } from '../api'
import LoadingSpinner from '../components/LoadingSpinner'
import { generateReport } from '../utils/generatePDF'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts'

const BRL = (v) => v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

const CHART_LINES = [
  { key: 'carteira',  name: 'Sua Carteira', color: '#4A90D9', strokeWidth: 3 },
  { key: 'cdi',       name: 'CDI',          color: '#2DBA74', strokeWidth: 1.5, strokeDasharray: '4 4' },
  { key: 'ibovespa',  name: 'Ibovespa',     color: '#8B6FD4', strokeWidth: 1.5, strokeDasharray: '4 4' },
  { key: 'poupanca',  name: 'Poupança',     color: '#6B7F9E', strokeWidth: 1,   strokeDasharray: '2 4' },
]

export default function SimulationPage() {
  const { profile } = useParams()
  const navigate    = useNavigate()

  const [form, setForm] = useState({
    initial_amount:  100000,
    monthly_contrib: 1000,
    years:           10,
  })
  const [result, setResult]       = useState(null)
  const [portfolio, setPortfolio] = useState(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const [data, port] = await Promise.all([
        simulationApi.run({ profile, ...form }),
        portfolioApi.get(profile),
      ])
      setResult(data)
      setPortfolio(port)
    } catch {
      setError('Erro ao executar simulação.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Simulação Patrimonial</h1>
        <p className="text-gray-400 text-sm mt-1">
          Perfil: <span className="text-blue-400 capitalize">{profile}</span>
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="card">
        <h2 className="text-lg font-semibold mb-5">Parâmetros da Simulação</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <FormField
            label="Investimento inicial"
            prefix="R$"
            type="number"
            value={form.initial_amount}
            onChange={v => setForm(f => ({ ...f, initial_amount: +v }))}
            min={1000}
          />
          <FormField
            label="Aporte mensal"
            prefix="R$"
            type="number"
            value={form.monthly_contrib}
            onChange={v => setForm(f => ({ ...f, monthly_contrib: +v }))}
            min={0}
          />
          <FormField
            label="Horizonte"
            suffix="anos"
            type="number"
            value={form.years}
            onChange={v => setForm(f => ({ ...f, years: +v }))}
            min={1}
            max={50}
          />
        </div>
        <div className="mt-5 flex justify-end">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Calculando...' : 'Simular'}
          </button>
        </div>
      </form>

      {loading && <LoadingSpinner message="Calculando projeção..." />}
      {error   && <div className="card border-red-800 text-red-400 text-sm">{error}</div>}

      {result && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard label="Patrimônio final"     value={BRL(result.final_carteira)}    highlight />
            <KpiCard label="Total aportado"       value={BRL(result.total_contributed)} />
            <KpiCard label="Retorno da carteira"  value={`${result.weighted_return}% a.a.`} />
            <KpiCard label="Ganho vs CDI"         value={BRL(result.gain_vs_cdi)}       positive={result.gain_vs_cdi > 0} />
          </div>

          {/* Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-5">Evolução Patrimonial</h3>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={result.data} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="year" stroke="#6b7280" tick={{ fontSize: 12 }} />
                <YAxis
                  stroke="#6b7280"
                  tick={{ fontSize: 11 }}
                  tickFormatter={v => v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : `${(v / 1e3).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8 }}
                  formatter={(v, name) => [BRL(v), name]}
                />
                <Legend />
                {CHART_LINES.map(l => (
                  <Line
                    key={l.key}
                    type="monotone"
                    dataKey={l.key}
                    name={l.name}
                    stroke={l.color}
                    strokeWidth={l.strokeWidth}
                    strokeDasharray={l.strokeDasharray}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button onClick={() => navigate(`/portfolio/${profile}`)} className="btn-secondary">
              Ver Carteira
            </button>
            <button
              onClick={() => generateReport({ portfolio, simulation: result, params: form })}
              className="btn-secondary"
            >
              Download PDF
            </button>
            <button onClick={() => navigate(`/report/${profile}`, { state: { form } })} className="btn-primary">
              Análise com IA
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function FormField({ label, prefix, suffix, ...props }) {
  const { onChange, ...inputProps } = props
  return (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-1.5">{label}</label>
      <div className="relative">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{prefix}</span>}
        <input
          {...inputProps}
          onChange={e => onChange(e.target.value)}
          className={`w-full bg-gray-800 border border-gray-700 rounded-lg py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm ${prefix ? 'pl-8 pr-3' : suffix ? 'pl-3 pr-10' : 'px-3'}`}
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{suffix}</span>}
      </div>
    </div>
  )
}

function KpiCard({ label, value, highlight, positive }) {
  let valueClass = 'text-white'
  if (highlight) valueClass = 'text-blue-400'
  if (positive !== undefined) valueClass = positive ? 'text-green-400' : 'text-red-400'

  return (
    <div className="card py-4">
      <p className="text-gray-500 text-xs mb-1">{label}</p>
      <p className={`text-lg font-bold ${valueClass}`}>{value}</p>
    </div>
  )
}
