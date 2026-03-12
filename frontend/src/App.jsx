import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import QuizPage from './pages/QuizPage'
import PortfolioPage from './pages/PortfolioPage'
import SimulationPage from './pages/SimulationPage'
import ReportPage from './pages/ReportPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-gray-100 font-sans">
        <Navbar />
        <main className="container mx-auto px-4 py-8 max-w-5xl">
          <Routes>
            <Route path="/"                         element={<QuizPage />} />
            <Route path="/portfolio/:profile"       element={<PortfolioPage />} />
            <Route path="/simulation/:profile"      element={<SimulationPage />} />
            <Route path="/report/:profile"          element={<ReportPage />} />
            <Route path="*"                         element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
