import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PatientDashboard from './pages/PatientDashboard'
import MedecinDashboard from './pages/MedecinDashboard'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/patient/*" element={<PatientDashboard />} />
          <Route path="/medecin/*" element={<MedecinDashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
