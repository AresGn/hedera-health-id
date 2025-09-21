import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Lock, Eye, EyeOff, Building2, AlertCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useApi } from '@/services/api'

interface LoginFormData {
  patientId: string
  password: string
}

export default function PatientLogin() {
  const navigate = useNavigate()
  const api = useApi()
  const [formData, setFormData] = useState<LoginFormData>({
    patientId: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Effacer l'erreur quand l'utilisateur tape
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Validation basique
      if (!formData.patientId.trim()) {
        throw new Error('Veuillez saisir votre ID patient')
      }
      if (!formData.password.trim()) {
        throw new Error('Veuillez saisir votre mot de passe')
      }

      // Appel API d'authentification
      console.log('🔄 Tentative d\'authentification pour:', formData.patientId)

      const response = await api.authenticatePatient({
        patientId: formData.patientId,
        password: formData.password
      })

      if (!response.success) {
        throw new Error(response.error || 'Erreur d\'authentification')
      }

      console.log('✅ Authentification réussie:', response.data)
      console.log('🔍 response.data:', response.data)
      console.log('🔍 response.data.patient:', response.data?.patient)

      // Vérifier que les données sont présentes
      if (!response.data?.patient?.patientId) {
        throw new Error('Données patient manquantes dans la réponse')
      }

      // Stocker les informations de session
      localStorage.setItem('patient_session', JSON.stringify({
        patientId: response.data.patient.patientId,
        token: response.data.token,
        patient: response.data.patient,
        isAuthenticated: true,
        loginTime: new Date().toISOString()
      }))

      // Rediriger vers le tableau de bord
      navigate('/patient/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-hedera-50 to-medical-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link to="/" className="text-gray-600 hover:text-gray-800">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <Building2 className="h-6 w-6 text-hedera-500" />
          <h1 className="text-2xl font-bold text-gray-800">HEDERA HEALTH ID</h1>
        </div>

        {/* Formulaire de connexion */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-hedera-100 rounded-full mb-4">
                <User className="h-8 w-8 text-hedera-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Connexion Patient</h2>
              <p className="text-gray-600">Accédez à votre carnet de santé</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="patientId" className="block text-sm font-medium text-gray-800 mb-2">
                  ID Patient
                </label>
                <Input
                  id="patientId"
                  name="patientId"
                  type="text"
                  placeholder="BJ2025001"
                  value={formData.patientId}
                  onChange={handleInputChange}
                  className="w-full"
                  icon={<User className="h-4 w-4" />}
                />
                <p className="text-xs text-gray-600 mt-1">
                  Votre identifiant unique (ex: BJ2025001)
                </p>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pr-10"
                    icon={<Lock className="h-4 w-4" />}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-hedera-500 focus:ring-hedera-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Se souvenir de moi</span>
                </label>
                <Link to="/patient/forgot-password" className="text-sm text-hedera-600 hover:text-hedera-700">
                  Mot de passe oublié ?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-700 mb-4">
                  Vous n'avez pas encore de carnet ?
                </p>
                <Link to="/patient/register">
                  <Button variant="outline" className="w-full">
                    Créer mon carnet de santé
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-600">
                Accès USSD disponible : <span className="font-mono">*789*[ID]#</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
