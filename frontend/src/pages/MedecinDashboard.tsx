import { Link } from 'react-router-dom'
import { Stethoscope, ArrowLeft, Building2 } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function MedecinDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 to-hedera-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Link to="/" className="text-gray-600 hover:text-gray-800">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <Stethoscope className="h-8 w-8 text-medical-500" />
          <h1 className="text-3xl font-bold text-gray-800">Espace Médecin</h1>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Dashboard Médecin</h2>
          <p className="text-gray-600 mb-6">Interface médecin en cours de développement...</p>

          <div className="flex space-x-4">
            <Link to="/hospital/dashboard">
              <Button variant="outline" className="flex items-center space-x-2">
                <Building2 className="h-4 w-4" />
                <span>Dashboard Hôpital</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
