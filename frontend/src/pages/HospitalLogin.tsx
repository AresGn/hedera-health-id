import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Building2, User, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useApi } from '@/services/api'

interface LoginFormData {
  adminId: string
  password: string
}

export default function HospitalLogin() {
  const navigate = useNavigate()
  const api = useApi()
  const [formData, setFormData] = useState<LoginFormData>({
    adminId: '',
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
      if (!formData.adminId.trim()) {
        throw new Error('Veuillez saisir votre ID administrateur')
      }
      if (!formData.password.trim()) {
        throw new Error('Veuillez saisir votre mot de passe')
      }

      // Appel API d'authentification
      console.log('🔄 Tentative d\'authentification hôpital pour:', formData.adminId)
      
      const response = await api.authenticateHospital({
        adminId: formData.adminId,
        password: formData.password
      })

      if (!response.success) {
        throw new Error(response.error || 'Erreur d\'authentification')
      }

      console.log('✅ Authentification hôpital réussie:', response.data)

      // Vérifier que les données sont présentes
      if (!response.data?.admin?.adminId) {
        throw new Error('Données administrateur manquantes dans la réponse')
      }

      // Stocker les informations de session
      localStorage.setItem('hospital_session', JSON.stringify({
        adminId: response.data.admin.adminId,
        token: response.data.token,
        admin: response.data.admin,
        isAuthenticated: true,
        loginTime: new Date().toISOString()
      }))
      
      // Rediriger vers le tableau de bord
      navigate('/hospital/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Bouton retour */}
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Link>
          </div>

          {/* Logo et titre */}
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Connexion Hôpital
            </h2>
            <p className="text-gray-600">
              Accédez au tableau de bord administrateur
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
            {/* Message d'erreur */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="adminId" className="block text-sm font-medium text-gray-800 mb-2">
                  ID Administrateur
                </label>
                <Input
                  id="adminId"
                  name="adminId"
                  type="text"
                  required
                  value={formData.adminId}
                  onChange={handleInputChange}
                  placeholder="Saisissez votre ID administrateur"
                  className="w-full"
                  icon={<User className="h-5 w-5 text-gray-400" />}
                />
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
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Saisissez votre mot de passe"
                    className="w-full pr-12"
                    icon={<Lock className="h-5 w-5 text-gray-400" />}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Connexion...
                    </div>
                  ) : (
                    'Se connecter'
                  )}
                </Button>
              </div>
            </form>

            {/* Informations de test */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                Identifiants de test :
              </h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>ID Admin:</strong> ADMIN-CHU-001</p>
                <p><strong>Mot de passe:</strong> admin123</p>
              </div>
            </div>

            {/* Liens utiles */}
            <div className="mt-6 text-center">
              <div className="text-sm text-gray-600">
                Besoin d'aide ? {' '}
                <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                  Contactez le support technique
                </a>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              © 2024 Hedera Health ID. Système sécurisé de gestion hospitalière.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
