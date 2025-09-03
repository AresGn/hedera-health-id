import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Building2, User, Bell, FileText, Activity, Shield, Settings } from 'lucide-react'
import Button from '@/components/ui/Button'
import PatientOverview from '@/components/patient/PatientOverview'
import PatientConsultations from '@/components/patient/PatientConsultations'
import PatientPermissions from '@/components/patient/PatientPermissions'
import PatientSettings from '@/components/patient/PatientSettings'
import { PatientData, Consultation, MedecinAutorise, DashboardTab } from '@/types/patient'

export default function PatientDashboard() {
  const location = useLocation()
  const navigate = useNavigate()
  const [patientData, setPatientData] = useState<PatientData | null>(null)
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [medecinsAutorises, setMedecinsAutorises] = useState<MedecinAutorise[]>([])
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview')

  useEffect(() => {
    // Récupérer les données du patient depuis l'état de navigation ou localStorage
    const data = location.state?.patientData || JSON.parse(localStorage.getItem('patientData') || '{}')
    
    if (!data.patientId) {
      // Rediriger vers l'inscription si pas de données
      navigate('/patient/register')
      return
    }

    setPatientData(data)
    
    // Charger les données fictives pour la démo
    loadDemoData(data.patientId)
  }, [location.state, navigate])

  const loadDemoData = (_patientId: string) => {
    // Consultations fictives
    const demoConsultations: Consultation[] = [
      {
        id: '1',
        date: '2025-01-02',
        medecin: 'Dr. ADJAHOUI',
        hopital: 'CHU-MEL',
        type: 'Consultation générale',
        statut: 'terminee',
        resume: 'Contrôle de routine. État général satisfaisant.'
      },
      {
        id: '2',
        date: '2025-01-15',
        medecin: 'Dr. KOSSOU',
        hopital: 'CHU-MEL',
        type: 'Suivi cardiologique',
        statut: 'programmee'
      },
      {
        id: '3',
        date: '2024-12-20',
        medecin: 'Dr. SOGLO',
        hopital: 'CNHU',
        type: 'Urgences',
        statut: 'terminee',
        resume: 'Traitement pour infection respiratoire. Guérison complète.'
      }
    ]

    // Médecins autorisés fictifs
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
      },
      {
        id: '3',
        nom: 'SOGLO',
        prenom: 'Dr. Paul',
        specialite: 'Urgences',
        hopital: 'CNHU',
        dateAutorisation: '2024-12-20',
        statut: 'actif'
      }
    ]

    setConsultations(demoConsultations)
    setMedecinsAutorises(demoMedecins)
  }

  if (!patientData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-hedera-50 to-medical-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hedera-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
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
            </div>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4" />
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
