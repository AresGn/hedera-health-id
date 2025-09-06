import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Phone, Mail, Building2, FileText, User } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import FileUpload from '@/components/ui/FileUpload'
import ProgressBar from '@/components/ui/ProgressBar'

interface PatientFormData {
  nom: string
  prenom: string
  dateNaissance: string
  telephone: string
  email: string
  hopitalPrincipal: string
  accepteConditions: boolean
  consentementDonnees: boolean
}

interface PatientFormErrors {
  nom?: string
  prenom?: string
  dateNaissance?: string
  telephone?: string
  email?: string
  hopitalPrincipal?: string
  accepteConditions?: string
  consentementDonnees?: string
}

const hopitauxOptions = [
  { value: 'chu-mel', label: 'CHU-MEL - Cotonou' },
  { value: 'cnhu', label: 'CNHU - Cotonou' },
  { value: 'pasteur', label: 'Clinique Louis Pasteur' },
  { value: 'akpakpa', label: 'Centre de Santé Akpakpa' },
]

export default function PatientRegistration() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<PatientFormData>({
    nom: '',
    prenom: '',
    dateNaissance: '',
    telephone: '',
    email: '',
    hopitalPrincipal: '',
    accepteConditions: false,
    consentementDonnees: false,
  })
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [errors, setErrors] = useState<PatientFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [completionPercentage, setCompletionPercentage] = useState(0)

  const steps = ['Informations', 'Hôpital', 'Documents', 'Validation']

  // Calculer le pourcentage de completion automatiquement
  useEffect(() => {
    const requiredFields = ['nom', 'prenom', 'dateNaissance', 'telephone', 'hopitalPrincipal']
    const filledFields = requiredFields.filter(field => {
      const value = formData[field as keyof PatientFormData]
      return typeof value === 'string' ? value.trim() !== '' : Boolean(value)
    })

    const percentage = (filledFields.length / requiredFields.length) * 100
    setCompletionPercentage(percentage)

    // Mise à jour automatique de l'étape
    if (percentage >= 80 && formData.accepteConditions && formData.consentementDonnees) {
      setCurrentStep(4) // Validation
    } else if (percentage >= 60 && formData.hopitalPrincipal) {
      setCurrentStep(3) // Documents
    } else if (percentage >= 40 && (formData.nom || formData.prenom)) {
      setCurrentStep(2) // Hôpital
    } else {
      setCurrentStep(1) // Informations
    }
  }, [formData])

  const handleInputChange = (field: keyof PatientFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      setSelectedFiles(Array.from(files))
    }
  }

  const handleFileRemove = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const validateForm = (): boolean => {
    const newErrors: PatientFormErrors = {}

    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis'
    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis'
    if (!formData.dateNaissance) newErrors.dateNaissance = 'La date de naissance est requise'
    if (!formData.telephone.trim()) newErrors.telephone = 'Le téléphone est requis'
    if (!formData.hopitalPrincipal) newErrors.hopitalPrincipal = 'Veuillez sélectionner un hôpital'
    if (!formData.accepteConditions) newErrors.accepteConditions = 'Vous devez accepter les conditions'
    if (!formData.consentementDonnees) newErrors.consentementDonnees = 'Le consentement est requis'

    // Validation email si fourni
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email invalide'
    }

    // Validation téléphone
    if (formData.telephone && !/^\+229\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/.test(formData.telephone)) {
      newErrors.telephone = 'Format: +229 XX XX XX XX'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    
    try {
      // Simulation de l'appel API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Redirection vers la page de génération d'ID
      navigate('/patient/id-generated', { 
        state: { 
          patientData: formData,
          files: selectedFiles 
        } 
      })
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error)
    } finally {
      setIsSubmitting(false)
    }
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
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-hedera-500 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
          </div>
        </header>

        {/* Formulaire d'inscription */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <FileText className="h-8 w-8 text-hedera-500" />
                <h2 className="text-3xl font-bold text-gray-800">
                  CRÉER MON CARNET
                </h2>
              </div>

              {/* Barre de progression */}
              <ProgressBar
                currentStep={currentStep}
                totalSteps={4}
                steps={steps}
                className="mb-6"
              />

              <div className="text-sm text-gray-600 mb-4">
                Progression: {Math.round(completionPercentage)}% complété
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations personnelles */}
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Nom"
                  value={formData.nom}
                  onChange={(e) => handleInputChange('nom', e.target.value)}
                  placeholder="Adjoa KOSSOU"
                  error={errors.nom}
                  required
                />
                <Input
                  label="Prénom"
                  value={formData.prenom}
                  onChange={(e) => handleInputChange('prenom', e.target.value)}
                  placeholder=""
                  error={errors.prenom}
                  required
                />
              </div>

              <Input
                label="Date de naissance"
                type="date"
                value={formData.dateNaissance}
                onChange={(e) => handleInputChange('dateNaissance', e.target.value)}
                icon={<Calendar className="h-4 w-4" />}
                error={errors.dateNaissance}
                required
              />

              <Input
                label="Téléphone"
                value={formData.telephone}
                onChange={(e) => handleInputChange('telephone', e.target.value)}
                placeholder="+229 97 XX XX XX"
                icon={<Phone className="h-4 w-4" />}
                error={errors.telephone}
                required
              />

              <Input
                label="Email (optionnel)"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder=""
                icon={<Mail className="h-4 w-4" />}
                error={errors.email}
              />

              <Select
                label="Hôpital principal"
                value={formData.hopitalPrincipal}
                onChange={(e) => handleInputChange('hopitalPrincipal', e.target.value)}
                options={hopitauxOptions}
                placeholder="CHU-MEL - Cotonou"
                error={errors.hopitalPrincipal}
                required
              />

              {/* Upload de fichier */}
              <FileUpload
                label="Importer ancien dossier (optionnel)"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple={true}
                onFileSelect={handleFileSelect}
                selectedFiles={selectedFiles}
                onFileRemove={handleFileRemove}
              />

              {/* Cases à cocher */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="conditions"
                    checked={formData.accepteConditions}
                    onChange={(e) => handleInputChange('accepteConditions', e.target.checked)}
                    className="mt-1 h-4 w-4 text-hedera-500 focus:ring-hedera-500 border-gray-300 rounded"
                  />
                  <label htmlFor="conditions" className="text-sm text-gray-700">
                    J'accepte les conditions d'utilisation
                  </label>
                </div>
                {errors.accepteConditions && (
                  <p className="text-sm text-red-600 ml-7">{errors.accepteConditions}</p>
                )}

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="consentement"
                    checked={formData.consentementDonnees}
                    onChange={(e) => handleInputChange('consentementDonnees', e.target.checked)}
                    className="mt-1 h-4 w-4 text-hedera-500 focus:ring-hedera-500 border-gray-300 rounded"
                  />
                  <label htmlFor="consentement" className="text-sm text-gray-700">
                    Je consens au traitement de mes données médicales
                  </label>
                </div>
                {errors.consentementDonnees && (
                  <p className="text-sm text-red-600 ml-7">{errors.consentementDonnees}</p>
                )}
              </div>

              {/* Bouton de soumission */}
              <div className="pt-6">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'CRÉATION EN COURS...' : 'CRÉER MON CARNET'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
