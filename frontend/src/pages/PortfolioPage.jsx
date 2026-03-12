import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { portfolioApi } from '../api'
import LoadingSpinner from '../components/LoadingSpinner'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { generateReport } from '../utils/generatePDF'

const TYPE_COLORS = {
  'RF':     '#4A90D9',
  'FII':    '#2DBA74',
  'Ações':  '#8B6FD4',
  'BDR':    '#E8C96A',
  'Fundo':  '#F59E0B',
  'Cripto': '#E05252',
}

export default function PortfolioPage() {
  const { profile }  = useParams()
  const location     = useLocation()
  const navigate     = useNavigate()
  const quizResult   = location.state?.result

  const [portfolio, setPortfolio] = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  useEffect(() => {
    portfolioApi.get(profile)
      .then(setPortfolio)
      .catch(() => setError('Não foi possível carregar o portfólio.'))
      .finally(() => setLoading(false))
  }, [profile])

  if (loading) return <LoadingSpinner message="Montando sua carteira..." />
  if (error)   return <div className="card border-red-800 text-red-400">{error}</div>

  const pieData = portfolio.assets.map(a => ({
    name:  a.type,
    value: a.allocation,
  }))

  // Aggregate by type for pie
  const aggregated = pieData.reduce((acc, cur) => {
    const found = acc.find(x => x.name === cur.name)
    if (found) found.value += cur.value
    else acc.push({ ...cur })
    return acc
  }, [])

  return (
    <div className="space-y-6">
      {/* Profile result banner */}
      {quizResult && (
        <div className="card border-l-4" style={{ borderLeftColor: portfolio.color }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Seu perfil de investidor</p>
              <h2 className="text-2xl font-bold text-white">{portfolio.name}</h2>
              <p className="text-gray-400 text-sm mt-1">{portfolio.subtitle}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Pontuação</p>
              <p className="text-3xl font-bold" style={{ color: portfolio.color }}>
                {quizResult.total_score}<span className="text-lg text-gray-400">/{quizResult.max_score}</span>
              </p>
              <p className="text-sm text-gray-400">Tolerância: {quizResult.risk_label}</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm mt-4">{portfolio.description}</p>
        </div>
      )}

      {/* Allocation chart + stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Alocação por Classe</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={aggregated} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                {aggregated.map((entry, i) => (
                  <Cell key={i} fill={TYPE_COLORS[entry.name] || '#6B7F9E'} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: '#111827', border: '1px solid #374151' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card space-y-4">
          <h3 className="text-lg font-semibold">Métricas da Carteira</h3>
          <MetricRow label="Retorno ponderado" value={`${portfolio.weighted_return}% a.a.`} highlight />
          <MetricRow label="Score de risco" value={`${portfolio.risk_score} / 10`} />
          <MetricRow label="Nº de ativos" value={portfolio.assets.length} />
          <div className="pt-2">
            <p className="text-xs text-gray-500 mb-2">Características</p>
            <div className="flex flex-wrap gap-2">
              {portfolio.characteristics.map((c, i) => (
                <span key={i} className="badge bg-gray-800 text-gray-300">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Assets table */}
      <div className="card overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4">Ativos Recomendados</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 border-b border-gray-800">
              <th className="text-left pb-3 font-medium">Ativo</th>
              <th className="text-left pb-3 font-medium">Tipo</th>
              <th className="text-right pb-3 font-medium">Alocação</th>
              <th className="text-right pb-3 font-medium">Retorno a.a.</th>
              <th className="text-left pb-3 font-medium">Risco</th>
              <th className="text-left pb-3 font-medium">Liquidez</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.assets.map((a, i) => (
              <tr key={i} className="border-b border-gray-800 last:border-0">
                <td className="py-3">
                  <p className="font-medium text-white">{a.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{a.description}</p>
                </td>
                <td className="py-3">
                  <span className="badge bg-gray-800 text-gray-300" style={{ color: TYPE_COLORS[a.type] }}>{a.type}</span>
                </td>
                <td className="py-3 text-right font-semibold text-white">{a.allocation}%</td>
                <td className="py-3 text-right text-green-400 font-medium">{a.annual_return}%</td>
                <td className="py-3">
                  <span className="text-xs font-medium" style={{ color: a.risk_color }}>{a.risk}</span>
                </td>
                <td className="py-3 text-gray-400 text-xs">{a.liquidity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <button onClick={() => navigate('/')} className="btn-secondary">
          Refazer Quiz
        </button>
        <button
          onClick={() => generateReport({ portfolio, quizResult })}
          className="btn-secondary"
        >
          Download PDF
        </button>
        <button onClick={() => navigate(`/simulation/${profile}`, { state: { portfolio } })} className="btn-primary">
          Simular Patrimônio
        </button>
      </div>
    </div>
  )
}

function MetricRow({ label, value, highlight }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className={`font-semibold ${highlight ? 'text-green-400' : 'text-white'}`}>{value}</span>
    </div>
  )
}
