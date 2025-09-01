import { Link } from 'react-router-dom'
import { Heart, Smartphone, Globe } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-hedera-50 to-medical-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🏥 HEDERA HEALTH ID
          </h1>
          <p className="text-xl text-gray-600">
            Votre santé, toujours avec vous
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Link to="/patient" className="block">
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-hedera-500">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  👤 PATIENT
                </h2>
                <ul className="text-gray-600 space-y-2">
                  <li>• Mon carnet de santé</li>
                  <li>• Mes données médicales</li>
                  <li>• Accès USSD *789#</li>
                </ul>
              </div>
            </Link>

            <Link to="/medecin" className="block">
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-medical-500">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  👨‍⚕️ MÉDECIN
                </h2>
                <ul className="text-gray-600 space-y-2">
                  <li>• Scanner QR patients</li>
                  <li>• Consultations</li>
                  <li>• Dashboard médical</li>
                </ul>
              </div>
            </Link>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-medium mb-4">📱 Accessible partout:</h3>
            <div className="flex justify-center space-x-8 text-gray-600">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5" />
                <span>Smartphone</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>Web</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>USSD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
