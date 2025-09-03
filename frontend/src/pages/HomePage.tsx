import { Link } from 'react-router-dom'
import { Heart, Smartphone, Globe, Languages, Building2, User, Stethoscope, Hash } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-hedera-50 to-medical-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header avec sélecteur de langue */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <Building2 className="h-8 w-8 text-hedera-500" />
            <h1 className="text-2xl font-bold text-gray-800">
              HEDERA HEALTH ID
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <Languages className="h-5 w-5 text-gray-600" />
            <select className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-hedera-500">
              <option value="fr">🌍 FR</option>
              <option value="en">🌍 EN</option>
            </select>
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <Heart className="mx-auto h-16 w-16 text-hedera-500 mb-4" />
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              VOTRE SANTÉ
            </h2>
            <h3 className="text-3xl font-bold text-gray-800 mb-6">
              TOUJOURS AVEC VOUS
            </h3>
          </div>
        </div>

        {/* Cartes principales Patient/Médecin */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid md:grid-cols-2 gap-8">
            <Link to="/patient/register" className="block">
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-hedera-500">
                <h2 className="text-2xl font-semibold mb-4 flex items-center space-x-3">
                  <User className="h-8 w-8 text-hedera-500" />
                  <span>PATIENT</span>
                </h2>
                <ul className="text-gray-600 space-y-2">
                  <li>• Mon carnet</li>
                  <li>• Mes données</li>
                  <li>• USSD *789#</li>
                </ul>
              </div>
            </Link>

            <Link to="/medecin/login" className="block">
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-medical-500">
                <h2 className="text-2xl font-semibold mb-4 flex items-center space-x-3">
                  <Stethoscope className="h-8 w-8 text-medical-500" />
                  <span>MÉDECIN</span>
                </h2>
                <ul className="text-gray-600 space-y-2">
                  <li>• Scanner QR</li>
                  <li>• Consultations</li>
                  <li>• Dashboard</li>
                </ul>
              </div>
            </Link>
          </div>
        </div>

        {/* Section Accessibilité */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <h3 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center justify-center space-x-2">
              <Smartphone className="h-6 w-6 text-hedera-500" />
              <span>Accessible partout:</span>
            </h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="flex flex-col items-center">
                <Smartphone className="h-12 w-12 text-hedera-500 mb-2" />
                <span className="text-sm font-medium">• Smartphone</span>
              </div>
              <div className="flex flex-col items-center">
                <Globe className="h-12 w-12 text-medical-500 mb-2" />
                <span className="text-sm font-medium">• Web</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                  <Hash className="h-6 w-6 text-gray-600" />
                </div>
                <span className="text-sm font-medium">• USSD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="text-center">
          <div className="space-x-4">
            <Button variant="primary" size="lg">
              EN SAVOIR PLUS
            </Button>
            <Button variant="secondary" size="lg">
              DÉMO
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
