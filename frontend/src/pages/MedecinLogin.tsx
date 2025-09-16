import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Building2, Mail, Lock, Camera, Eye, EyeOff, Shield, AlertTriangle, CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import ProgressBar from '@/components/ui/ProgressBar'
import QRScanner from '@/components/QRScanner'
import { PatientQRData } from '@/services/qrCodeService'
import { useApi } from '@/services/api'

interface MedecinFormData {
  hopital: string
  email: string
  password: string
  rememberMe: boolean
}



const hopitauxOptions = [
  { value: 'chu-mel', label: 'CHU-MEL - Cotonou' },
  { value: 'cnhu', label: 'CNHU - Cotonou' },
  { value: 'pasteur', label: 'Clinique Louis Pasteur' },
  { value: 'akpakpa', label: 'Centre de Santé Akpakpa' },
]

// Validation des emails professionnels par hôpital
const emailDomains: Record<string, string[]> = {
  'chu-mel': ['chu-mel.bj', 'chumel.org'],
  'cnhu': ['cnhu.bj', 'cnhu-hkm.org'],
  'pasteur': ['pasteur.bj', 'clinique-pasteur.com'],
  'akpakpa': ['akpakpa.bj', 'cs-akpakpa.org']
}

export default function MedecinLogin() {
  const navigate = useNavigate()
  const api = useApi()
  const [formData, setFormData] = useState<MedecinFormData>({
    hopital: '',
    email: '',
    password: '',
    rememberMe: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [errors, setErrors] = useState<Partial<MedecinFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [completionPercentage, setCompletionPercentage] = useState(0)
  const [authAttempts, setAuthAttempts] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0)

  const steps = ['Hôpital', 'Identifiants', 'Validation']

  // Calculer le pourcentage de completion automatiquement
  useEffect(() => {
    const requiredFields = ['hopital', 'email', 'password']
    const filledFields = requiredFields.filter(field => {
      const value = formData[field as keyof MedecinFormData]
      return typeof value === 'string' ? value.trim() !== '' : Boolean(value)
    })

    const percentage = (filledFields.length / requiredFields.length) * 100
    setCompletionPercentage(percentage)

    // Mise à jour automatique de l'étape
    if (percentage >= 100) {
      setCurrentStep(3) // Validation
    } else if (percentage >= 66 && formData.email) {
      setCurrentStep(2) // Identifiants
    } else {
      setCurrentStep(1) // Hôpital
    }
  }, [formData])

  // Gestion du blocage temporaire après tentatives échouées
  useEffect(() => {
    if (isBlocked && blockTimeRemaining > 0) {
      const timer = setInterval(() => {
        setBlockTimeRemaining(prev => {
          if (prev <= 1) {
            setIsBlocked(false)
            setAuthAttempts(0)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isBlocked, blockTimeRemaining])

  const handleInputChange = (field: keyof MedecinFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateEmailDomain = (email: string, hopital: string): boolean => {
    if (!hopital || !email) return false
    const domains = emailDomains[hopital]
    if (!domains) return false

    const emailDomain = email.split('@')[1]?.toLowerCase()
    return domains.some(domain => emailDomain === domain.toLowerCase())
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<MedecinFormData> = {}

    if (!formData.hopital) {
      newErrors.hopital = 'Veuillez sélectionner votre hôpital'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email professionnel requis'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email invalide'
    } else if (!validateEmailDomain(formData.email, formData.hopital)) {
      const domains = emailDomains[formData.hopital]
      newErrors.email = `Email professionnel requis (${domains?.join(', ') || 'domaine officiel'})`
    }

    if (!formData.password) {
      newErrors.password = 'Mot de passe requis'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mot de passe trop court (min. 8 caractères)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Vérifier si l'utilisateur est bloqué
    if (isBlocked) {
      setErrors({ email: `Trop de tentatives. Réessayez dans ${blockTimeRemaining}s` })
      return
    }

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Appel API d'authentification
      const response = await api.loginMedecin({
        email: formData.email,
        password: formData.password,
        hopitalCode: formData.hopital
      })

      if (response.success && response.data) {
        // Réinitialiser les tentatives en cas de succès
        setAuthAttempts(0)

        // Stocker le token et les données médecin
        if (formData.rememberMe) {
          localStorage.setItem('medecin_token', response.data.token)
          localStorage.setItem('medecin_data', JSON.stringify(response.data.medecin))
        } else {
          sessionStorage.setItem('medecin_token', response.data.token)
          sessionStorage.setItem('medecin_data', JSON.stringify(response.data.medecin))
        }

        // Redirection vers le dashboard médecin
        navigate('/medecin/dashboard', {
          state: {
            medecinData: response.data.medecin,
            token: response.data.token
          }
        })
      } else {
        throw new Error(response.error || 'Authentification échouée')
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error)

      // Gestion des tentatives échouées
      const newAttempts = authAttempts + 1
      setAuthAttempts(newAttempts)

      if (newAttempts >= 3) {
        setIsBlocked(true)
        setBlockTimeRemaining(300) // 5 minutes
        setErrors({ email: 'Trop de tentatives. Compte bloqué 5 minutes.' })
      } else {
        setErrors({
          email: `Email ou mot de passe incorrect (${newAttempts}/3 tentatives)`
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleQRScanSuccess = (patientData: PatientQRData) => {
    // Redirection directe vers le dossier patient
    navigate('/medecin/patient', {
      state: {
        patientData,
        medecinData: {
          email: formData.email || 'dr.urgence@chu-mel.bj',
          hopital: formData.hopital || 'chu-mel',
          nom: 'Dr. URGENCE',
          specialite: 'Urgences'
        }
      }
    })
  }

  if (showScanner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-hedera-50 to-medical-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <QRScanner
              onScanSuccess={handleQRScanSuccess}
              onClose={() => setShowScanner(false)}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-hedera-50 to-medical-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-800">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div className="flex items-center space-x-3">
              <Building2 className="h-6 w-6 text-hedera-500" />
              <h1 className="text-2xl font-bold text-gray-800">
                HEDERA HEALTH ID
              </h1>
            </div>
          </div>
        </header>

        {/* Formulaire de connexion */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-medical-500 rounded-full flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">
                  ESPACE MÉDECIN
                </h2>
              </div>

              {/* Barre de progression */}
              <ProgressBar
                currentStep={currentStep}
                totalSteps={3}
                steps={steps}
                className="mb-6"
              />

              <div className="text-sm text-gray-600 mb-4">
                Progression: {Math.round(completionPercentage)}% complété
              </div>

              {/* Indicateurs de sécurité */}
              {isBlocked && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <div className="text-red-700">
                    <p className="font-medium">Compte temporairement bloqué</p>
                    <p className="text-sm">Réessayez dans {Math.floor(blockTimeRemaining / 60)}:{(blockTimeRemaining % 60).toString().padStart(2, '0')}</p>
                  </div>
                </div>
              )}

              {authAttempts > 0 && !isBlocked && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-yellow-500" />
                  <span className="text-yellow-700">
                    {authAttempts}/3 tentatives utilisées
                  </span>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Select
                label="Hôpital"
                value={formData.hopital}
                onChange={(e) => handleInputChange('hopital', e.target.value)}
                options={hopitauxOptions}
                placeholder="CHU-MEL - Cotonou"
                error={errors.hopital}
                required
              />

              <div className="relative">
                <Input
                  label="Email professionnel"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="dr.adjahoui@chu-mel.bj"
                  icon={<Mail className="h-4 w-4" />}
                  error={errors.email}
                  required
                />
                {formData.email && formData.hopital && validateEmailDomain(formData.email, formData.hopital) && (
                  <div className="absolute right-3 top-8 text-green-500">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                )}
                {formData.hopital && (
                  <div className="mt-1 text-xs text-gray-500">
                    Domaines acceptés: {emailDomains[formData.hopital]?.join(', ')}
                  </div>
                )}
              </div>

              <div className="relative">
                <Input
                  label="Mot de passe"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="••••••••••"
                  icon={<Lock className="h-4 w-4" />}
                  error={errors.password}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                  className="h-4 w-4 text-hedera-500 focus:ring-hedera-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                  Se souvenir de moi
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isSubmitting || isBlocked || !validateForm()}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>AUTHENTIFICATION...</span>
                  </div>
                ) : isBlocked ? (
                  `BLOQUÉ (${Math.floor(blockTimeRemaining / 60)}:${(blockTimeRemaining % 60).toString().padStart(2, '0')})`
                ) : (
                  'SE CONNECTER'
                )}
              </Button>

              {/* Indicateur de sécurité */}
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                <Shield className="h-3 w-3" />
                <span>Connexion sécurisée SSL</span>
              </div>
            </form>

            {/* Séparateur */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou</span>
              </div>
            </div>

            {/* Scanner QR direct */}
            <Button
              onClick={() => setShowScanner(true)}
              variant="secondary"
              size="lg"
              className="w-full flex items-center justify-center space-x-2"
            >
              <Camera className="h-5 w-5" />
              <span>SCANNER QR PATIENT</span>
            </Button>
            <p className="text-center text-sm text-gray-600 mt-2">
              (Accès direct consultation)
            </p>

            {/* Lien mot de passe oublié */}
            <div className="text-center mt-6">
              <Link 
                to="/medecin/forgot-password" 
                className="text-sm text-hedera-600 hover:text-hedera-700"
              >
                Mot de passe oublié?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
