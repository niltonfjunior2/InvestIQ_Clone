/**
 * InvestIQ — Gerador de Relatório PDF
 * Usa jsPDF + jspdf-autotable
 * Estrutura: Capa · Carteira · Simulação · Benchmarks
 */

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const BRL = (v) =>
  (v ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

const PCT = (v) => `${(v ?? 0).toFixed(1)}%`

// Paleta
const COLORS = {
  dark:    [15,  23,  42],   // slate-900
  accent:  [74, 144, 217],   // brand-blue
  green:   [45, 186, 116],   // brand-green
  yellow:  [232, 201, 106],  // brand-gold
  light:   [148, 163, 184],  // slate-400
  white:   [255, 255, 255],
  border:  [30,  41,  59],   // slate-800
}

function setFont(doc, size, style = 'normal', color = COLORS.white) {
  doc.setFontSize(size)
  doc.setFont('helvetica', style)
  doc.setTextColor(...color)
}

function drawRect(doc, x, y, w, h, color) {
  doc.setFillColor(...color)
  doc.rect(x, y, w, h, 'F')
}

// ── Página 1: Capa ────────────────────────────────────────────────────────────
function drawCover(doc, portfolio, quizResult) {
  const W = doc.internal.pageSize.getWidth()
  const H = doc.internal.pageSize.getHeight()

  // Fundo escuro
  drawRect(doc, 0, 0, W, H, COLORS.dark)

  // Barra lateral colorida
  const profileColor = hexToRgb(portfolio.color)
  drawRect(doc, 0, 0, 6, H, profileColor)

  // Badge "InvestIQ"
  drawRect(doc, 20, 20, 40, 10, COLORS.accent)
  setFont(doc, 8, 'bold', COLORS.white)
  doc.text('InvestIQ', 22, 27)

  // Título principal
  setFont(doc, 32, 'bold', COLORS.white)
  doc.text('Relatório de', 20, 65)
  doc.text('Investimentos', 20, 80)

  // Linha divisória colorida
  doc.setDrawColor(...profileColor)
  doc.setLineWidth(0.8)
  doc.line(20, 88, W - 20, 88)

  // Perfil
  setFont(doc, 14, 'normal', COLORS.light)
  doc.text('Perfil do Investidor', 20, 100)
  setFont(doc, 22, 'bold', profileColor)
  doc.text(portfolio.name, 20, 112)
  setFont(doc, 11, 'normal', COLORS.light)
  doc.text(portfolio.subtitle, 20, 121)

  // Caixas de métricas
  const metrics = [
    { label: 'Retorno Esperado', value: `${portfolio.weighted_return}% a.a.` },
    { label: 'Score de Risco',   value: `${portfolio.risk_score} / 10` },
    { label: 'Nº de Ativos',     value: String(portfolio.assets.length) },
  ]
  if (quizResult) {
    metrics.unshift({ label: 'Pontuação Quiz', value: `${quizResult.total_score}/${quizResult.max_score}` })
  }

  metrics.forEach((m, i) => {
    const bx = 20 + i * 46
    const by = 135
    drawRect(doc, bx, by, 42, 20, COLORS.border)
    setFont(doc, 7, 'normal', COLORS.light)
    doc.text(m.label, bx + 3, by + 7)
    setFont(doc, 11, 'bold', COLORS.white)
    doc.text(m.value, bx + 3, by + 16)
  })

  // Descrição
  setFont(doc, 9, 'normal', COLORS.light)
  const descLines = doc.splitTextToSize(portfolio.description, W - 40)
  doc.text(descLines.slice(0, 3), 20, 170)

  // Características
  setFont(doc, 8, 'bold', COLORS.accent)
  doc.text('CARACTERÍSTICAS DA CARTEIRA', 20, 192)
  portfolio.characteristics.forEach((c, i) => {
    const col = i % 2 === 0 ? 20 : W / 2
    const row = 200 + Math.floor(i / 2) * 8
    setFont(doc, 8, 'normal', COLORS.light)
    doc.text(`• ${c}`, col, row)
  })

  // Rodapé
  setFont(doc, 7, 'normal', COLORS.light)
  const date = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
  doc.text(`Gerado em ${date} · InvestIQ — Análise com IA`, 20, H - 10)
  doc.text('Este relatório não constitui recomendação de investimento.', W - 20, H - 10, { align: 'right' })
}

// ── Página 2: Carteira de Ativos ─────────────────────────────────────────────
function drawPortfolioPage(doc, portfolio) {
  doc.addPage()
  const W = doc.internal.pageSize.getWidth()

  drawRect(doc, 0, 0, W, 30, COLORS.border)
  setFont(doc, 16, 'bold', COLORS.white)
  doc.text('Carteira Recomendada', 20, 20)
  setFont(doc, 9, 'normal', COLORS.light)
  doc.text(`Perfil ${portfolio.name}`, W - 20, 20, { align: 'right' })

  // Alocação por classe (resumo)
  const summary = {}
  portfolio.assets.forEach(a => {
    summary[a.type] = (summary[a.type] || 0) + a.allocation
  })

  let sx = 20
  Object.entries(summary).forEach(([type, pct]) => {
    drawRect(doc, sx, 36, 36, 16, COLORS.border)
    setFont(doc, 7, 'normal', COLORS.light)
    doc.text(type, sx + 2, 43)
    setFont(doc, 10, 'bold', COLORS.white)
    doc.text(`${pct}%`, sx + 2, 50)
    sx += 40
  })

  // Tabela de ativos
  autoTable(doc, {
    startY: 58,
    head: [['Ativo', 'Tipo', 'Alocação', 'Retorno a.a.', 'Risco', 'Liquidez']],
    body: portfolio.assets.map(a => [
      a.name,
      a.type,
      `${a.allocation}%`,
      `${a.annual_return}%`,
      a.risk,
      a.liquidity,
    ]),
    styles: {
      fontSize: 8,
      cellPadding: 3,
      fillColor: COLORS.dark,
      textColor: COLORS.white,
      lineColor: COLORS.border,
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: COLORS.border,
      textColor: COLORS.light,
      fontStyle: 'bold',
      fontSize: 7,
    },
    alternateRowStyles: {
      fillColor: [20, 30, 50],
    },
    columnStyles: {
      0: { cellWidth: 55 },
      2: { halign: 'center' },
      3: { halign: 'center', textColor: COLORS.green },
    },
    margin: { left: 20, right: 20 },
  })

  // Nota
  const finalY = doc.lastAutoTable.finalY + 6
  setFont(doc, 7, 'italic', COLORS.light)
  doc.text('* Retornos históricos não garantem resultados futuros.', 20, finalY)
}

// ── Página 3: Simulação Patrimonial ──────────────────────────────────────────
function drawSimulationPage(doc, simulation, params) {
  doc.addPage()
  const W = doc.internal.pageSize.getWidth()

  drawRect(doc, 0, 0, W, 30, COLORS.border)
  setFont(doc, 16, 'bold', COLORS.white)
  doc.text('Simulação Patrimonial', 20, 20)
  setFont(doc, 9, 'normal', COLORS.light)
  doc.text(`Horizonte: ${params.years} anos`, W - 20, 20, { align: 'right' })

  // KPIs
  const kpis = [
    { label: 'Investimento Inicial', value: BRL(params.initial_amount) },
    { label: 'Aporte Mensal',        value: BRL(params.monthly_contrib) },
    { label: 'Patrimônio Final',     value: BRL(simulation.final_carteira), highlight: true },
    { label: 'Total Aportado',       value: BRL(simulation.total_contributed) },
    { label: 'Retorno da Carteira',  value: PCT(simulation.weighted_return) + ' a.a.' },
    { label: 'Ganho vs CDI',         value: BRL(simulation.gain_vs_cdi), positive: simulation.gain_vs_cdi > 0 },
    { label: 'ROI Total',            value: PCT(simulation.roi_percentage) },
    { label: 'Carteira vs Ibovespa', value: BRL(simulation.final_carteira - simulation.final_ibovespa) },
  ]

  kpis.forEach((k, i) => {
    const col = i % 4
    const row = Math.floor(i / 4)
    const bx = 20 + col * 47
    const by = 36 + row * 24
    drawRect(doc, bx, by, 43, 20, COLORS.border)
    setFont(doc, 6.5, 'normal', COLORS.light)
    doc.text(k.label, bx + 2, by + 7)
    const color = k.highlight ? COLORS.accent : k.positive === false ? [224, 82, 82] : k.positive ? COLORS.green : COLORS.white
    setFont(doc, 9, 'bold', color)
    doc.text(k.value, bx + 2, by + 16)
  })

  // Tabela de projeção
  autoTable(doc, {
    startY: 90,
    head: [['Ano', 'Sua Carteira', 'CDI', 'Ibovespa', 'Poupança', 'Ganho vs CDI']],
    body: simulation.data.map(d => [
      d.year,
      BRL(d.carteira),
      BRL(d.cdi),
      BRL(d.ibovespa),
      BRL(d.poupanca),
      BRL(d.diff_cdi),
    ]),
    styles: {
      fontSize: 7.5,
      cellPadding: 2.5,
      fillColor: COLORS.dark,
      textColor: COLORS.white,
      lineColor: COLORS.border,
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: COLORS.border,
      textColor: COLORS.light,
      fontStyle: 'bold',
      fontSize: 7,
    },
    alternateRowStyles: {
      fillColor: [20, 30, 50],
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 14 },
      1: { textColor: COLORS.accent, fontStyle: 'bold' },
      5: { textColor: COLORS.green },
    },
    margin: { left: 20, right: 20 },
  })
}

// ── Página 4: Benchmarks ─────────────────────────────────────────────────────
function drawBenchmarksPage(doc, simulation, portfolio) {
  doc.addPage()
  const W = doc.internal.pageSize.getWidth()
  const H = doc.internal.pageSize.getHeight()

  drawRect(doc, 0, 0, W, 30, COLORS.border)
  setFont(doc, 16, 'bold', COLORS.white)
  doc.text('Comparativo de Benchmarks', 20, 20)

  const benchmarks = [
    { name: 'Sua Carteira',  rate: portfolio.weighted_return,  color: COLORS.accent,  final: simulation.final_carteira },
    { name: 'CDI',           rate: 10.5,                       color: COLORS.green,   final: simulation.final_cdi },
    { name: 'Ibovespa',      rate: 12.3,                       color: [139, 111, 212],final: simulation.final_ibovespa },
    { name: 'S&P 500 (BRL)', rate: 15.8,                       color: COLORS.yellow,  final: null },
    { name: 'IFIX',          rate: 8.7,                        color: [107, 127, 158],final: null },
    { name: 'Poupança',      rate: 6.2,                        color: [100, 116, 139],final: null },
  ]

  // Barras de comparação
  const maxRate = Math.max(...benchmarks.map(b => b.rate))
  benchmarks.forEach((b, i) => {
    const y  = 40 + i * 22
    const bw = ((b.rate / maxRate) * (W - 100))

    setFont(doc, 8, i === 0 ? 'bold' : 'normal', i === 0 ? COLORS.white : COLORS.light)
    doc.text(b.name, 20, y + 7)
    drawRect(doc, 70, y, bw, 10, b.color)
    setFont(doc, 8, 'bold', COLORS.white)
    doc.text(`${b.rate}% a.a.`, 72 + bw, y + 7)
  })

  // Tabela de patrimônio final comparativo
  autoTable(doc, {
    startY: 185,
    head: [['Benchmark', 'Taxa a.a.', 'Patrimônio Final (proj.)', 'Diferença vs Carteira']],
    body: benchmarks.map(b => [
      b.name,
      `${b.rate}%`,
      b.final ? BRL(b.final) : '—',
      b.final && b.final !== simulation.final_carteira
        ? BRL(simulation.final_carteira - b.final)
        : b.name === 'Sua Carteira' ? '—' : '—',
    ]),
    styles: {
      fontSize: 8,
      cellPadding: 3,
      fillColor: COLORS.dark,
      textColor: COLORS.white,
      lineColor: COLORS.border,
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: COLORS.border,
      textColor: COLORS.light,
      fontStyle: 'bold',
      fontSize: 7,
    },
    alternateRowStyles: { fillColor: [20, 30, 50] },
    margin: { left: 20, right: 20 },
  })

  // Disclaimer final
  setFont(doc, 7, 'italic', COLORS.light)
  const disclaimer = [
    'Este relatório foi gerado automaticamente pelo InvestIQ com base no perfil de suitability do investidor.',
    'As projeções são baseadas em retornos históricos e não garantem resultados futuros.',
    'Não constitui oferta ou recomendação de compra ou venda de qualquer ativo financeiro.',
  ]
  disclaimer.forEach((line, i) => {
    doc.text(line, 20, H - 20 + i * 5)
  })
}

// ── Helper: hex → rgb ─────────────────────────────────────────────────────────
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return [r, g, b]
}

// ── Função principal ──────────────────────────────────────────────────────────
export function generateReport({ portfolio, simulation, params, quizResult }) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  drawCover(doc, portfolio, quizResult)
  drawPortfolioPage(doc, portfolio)

  if (simulation) {
    drawSimulationPage(doc, simulation, params)
    drawBenchmarksPage(doc, simulation, portfolio)
  }

  // Numeração de páginas
  const total = doc.internal.getNumberOfPages()
  for (let i = 1; i <= total; i++) {
    doc.setPage(i)
    doc.setFontSize(7)
    doc.setTextColor(...COLORS.light)
    doc.text(`${i} / ${total}`, doc.internal.pageSize.getWidth() - 20, doc.internal.pageSize.getHeight() - 5, { align: 'right' })
  }

  const filename = `InvestIQ_${portfolio.name}_${new Date().toISOString().slice(0, 10)}.pdf`
  doc.save(filename)
}
