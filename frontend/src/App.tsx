import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PatientDashboard from './pages/PatientDashboard'
import PatientRegistration from './pages/PatientRegistration'
import PatientIdGeneration from './pages/PatientIdGeneration'
import MedecinLogin from './pages/MedecinLogin'
import MedecinDashboard from './pages/MedecinDashboard'
import HospitalDashboard from './pages/HospitalDashboard'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/patient/register" element={<PatientRegistration />} />
          <Route path="/patient/id-generated" element={<PatientIdGeneration />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/*" element={<PatientDashboard />} />
          <Route path="/medecin/login" element={<MedecinLogin />} />
          <Route path="/medecin/dashboard" element={<MedecinDashboard />} />
          <Route path="/medecin/*" element={<MedecinDashboard />} />
          <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
