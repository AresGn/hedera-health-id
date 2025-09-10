import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PatientLogin from './pages/PatientLogin'
import PatientDashboard from './pages/PatientDashboard'
import PatientRegistration from './pages/PatientRegistration'
import PatientIdGeneration from './pages/PatientIdGeneration'
import MedecinLogin from './pages/MedecinLogin'
import MedecinDashboard from './pages/MedecinDashboard'
import HospitalDashboard from './pages/HospitalDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/patient/login" element={<PatientLogin />} />
          <Route path="/patient/register" element={<PatientRegistration />} />
          <Route path="/patient/id-generated" element={<PatientIdGeneration />} />
          <Route path="/patient/dashboard" element={
            <ProtectedRoute requiredRole="patient">
              <PatientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/patient/*" element={
            <ProtectedRoute requiredRole="patient">
              <PatientDashboard />
            </ProtectedRoute>
          } />
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
