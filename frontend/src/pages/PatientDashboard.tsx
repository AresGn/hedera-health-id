import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Building2, User, Bell, FileText, Activity, Shield, Settings, LogOut } from 'lucide-react'
import Button from '@/components/ui/Button'
import PatientOverview from '@/components/patient/PatientOverview'
import PatientConsultations from '@/components/patient/PatientConsultations'
import PatientPermissions from '@/components/patient/PatientPermissions'
import PatientSettings from '@/components/patient/PatientSettings'
import PatientDocuments from '@/components/patient/PatientDocuments'
import { PatientData, Consultation, MedecinAutorise, DashboardTab } from '@/types/patient'
import { useSession } from '@/components/ProtectedRoute'
import { useApi } from '@/services/api'

export default function PatientDashboard() {
  // const location = useLocation()
  // const navigate = useNavigate()
  const { sessionData, logout } = useSession('patient')
  const api = useApi()

  const [patientData, setPatientData] = useState<PatientData | null>(null)
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [medecinsAutorises, setMedecinsAutorises] = useState<MedecinAutorise[]>([])
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (sessionData?.patientId) {
      loadPatientData(sessionData.patientId)
    }
  }, [sessionData])

  const loadPatientData = async (patientId: string) => {
    setIsLoading(true)
    setError('')

    try {
      // Récupérer les données du patient depuis l'API
      const patientResponse = await api.getPatientById(patientId)

      if (!patientResponse.success || !patientResponse.data) {
        throw new Error('Patient non trouvé')
      }

      const patient = patientResponse.data
      const patientData: PatientData = {
        patientId: patient.patientId,
        nom: patient.nom,
        prenom: patient.prenom,
        dateNaissance: new Date(patient.dateNaissance).toLocaleDateString('fr-FR'),
        telephone: patient.telephone,
        email: patient.email || 'Non renseigné',
        hopitalPrincipal: patient.hopitalPrincipal || 'Non renseigné'
      }

      // Récupérer les consultations du patient
      const consultationsResponse = await api.getPatientConsultations(patientId)

      let consultations: Consultation[] = []
      if (consultationsResponse.success && consultationsResponse.data) {
        // Vérifier si data est un tableau
        const consultationsArray = Array.isArray(consultationsResponse.data)
          ? consultationsResponse.data
          : []

        consultations = consultationsArray.map((consultation: any) => ({
          id: consultation.id,
          date: new Date(consultation.dateConsultation).toLocaleDateString('fr-FR'),
          medecin: `Dr. ${consultation.medecin.prenom} ${consultation.medecin.nom}`,
          hopital: consultation.hopital.nom,
          type: consultation.type,
          statut: consultation.statut.toLowerCase(),
          resume: consultation.notes || consultation.diagnostic || 'Consultation en cours'
        }))
      }

      // Médecins autorisés fictifs (en attendant l'API)
      const demoMedecins: MedecinAutorise[] = [
        {
          id: '1',
          nom: 'ADJAHOUI',
          prenom: 'Dr. Jean',
          specialite: 'Médecine Générale',
          hopital: 'CHU-MEL',
          dateAutorisation: '2024-01-15',
          statut: 'actif'
        },
        {
          id: '2',
          nom: 'KOSSOU',
          prenom: 'Dr. Marie',
          specialite: 'Cardiologie',
          hopital: 'CHU-MEL',
          dateAutorisation: '2024-06-10',
          statut: 'actif'
        }
      ]

      setPatientData(patientData)
      setConsultations(consultations)
      setMedecinsAutorises(demoMedecins)

    } catch (err) {
      console.error('Erreur chargement données patient:', err)
      setError('Impossible de charger les données du patient')

      // Fallback vers des données par défaut en cas d'erreur
      const fallbackPatientData: PatientData = {
        patientId: patientId,
        nom: 'PATIENT',
        prenom: 'Utilisateur',
        dateNaissance: '01/01/1990',
        telephone: '+229 XX XX XX XX',
        email: 'Non renseigné',
        hopitalPrincipal: 'Non renseigné'
      }
      setPatientData(fallbackPatientData)
      setConsultations([])
      setMedecinsAutorises([])
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || !patientData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-hedera-50 to-medical-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hedera-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données patient...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-hedera-50 to-medical-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <Button onClick={() => loadPatientData(sessionData?.patientId || '')}>
            Réessayer
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-hedera-50 to-medical-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-800">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div className="flex items-center space-x-3">
              <Building2 className="h-6 w-6 text-hedera-500" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                HEDERA HEALTH ID
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-sm">
              <User className="h-4 w-4 text-hedera-500" />
              <span className="text-sm font-medium text-gray-700">
                {patientData.prenom} {patientData.nom}
              </span>
              <span className="text-xs text-gray-500 ml-2">
                ({patientData.patientId})
              </span>
            </div>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="text-red-600 hover:text-red-700 hover:border-red-300"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {[
                { id: 'overview', label: 'Vue d\'ensemble', icon: Activity },
                { id: 'consultations', label: 'Consultations', icon: FileText },
                { id: 'documents', label: 'Documents', icon: FileText },
                { id: 'permissions', label: 'Permissions', icon: Shield },
                { id: 'settings', label: 'Paramètres', icon: Settings }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as DashboardTab)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-hedera-500 text-hedera-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Contenu des onglets */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <PatientOverview 
              patientData={patientData}
              consultations={consultations}
              medecinsAutorises={medecinsAutorises}
            />
          )}

          {activeTab === 'consultations' && (
            <PatientConsultations consultations={consultations} />
          )}

          {activeTab === 'documents' && (
            <PatientDocuments />
          )}

          {activeTab === 'permissions' && (
            <PatientPermissions medecinsAutorises={medecinsAutorises} />
          )}

          {activeTab === 'settings' && (
            <PatientSettings patientData={patientData} />
          )}
        </div>
      </div>
    </div>
  )
}
