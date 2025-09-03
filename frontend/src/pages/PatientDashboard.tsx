import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Building2, User, Calendar, Clock, Shield,
  Settings, Bell, FileText, Activity, Heart, AlertCircle,
  CheckCircle, Plus, Eye, Download, Share2
} from 'lucide-react'
import Button from '@/components/ui/Button'

interface PatientData {
  patientId: string
  nom: string
  prenom: string
  dateNaissance: string
  telephone: string
  email: string
  hopitalPrincipal: string
}

interface Consultation {
  id: string
  date: string
  medecin: string
  hopital: string
  type: string
  statut: 'terminee' | 'programmee' | 'annulee'
  resume?: string
}

interface MedecinAutorise {
  id: string
  nom: string
  prenom: string
  specialite: string
  hopital: string
  dateAutorisation: string
  statut: 'actif' | 'suspendu'
}

export default function PatientDashboard() {
  const location = useLocation()
  const navigate = useNavigate()
  const [patientData, setPatientData] = useState<PatientData | null>(null)
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [medecinsAutorises, setMedecinsAutorises] = useState<MedecinAutorise[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'consultations' | 'permissions' | 'settings'>('overview')

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

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'terminee': return 'text-green-600 bg-green-50'
      case 'programmee': return 'text-blue-600 bg-blue-50'
      case 'annulee': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case 'terminee': return <CheckCircle className="h-4 w-4" />
      case 'programmee': return <Clock className="h-4 w-4" />
      case 'annulee': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
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
                  onClick={() => setActiveTab(tab.id as any)}
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Carte d'identité patient */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                    <User className="h-5 w-5 text-hedera-500" />
                    <span>Mon Carnet de Santé</span>
                  </h2>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">ID Patient</label>
                    <p className="text-lg font-mono font-bold text-hedera-600">{patientData.patientId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nom complet</label>
                    <p className="text-lg font-semibold">{patientData.prenom} {patientData.nom}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date de naissance</label>
                    <p className="text-lg">{new Date(patientData.dateNaissance).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Hôpital principal</label>
                    <p className="text-lg">{patientData.hopitalPrincipal === 'chu-mel' ? 'CHU-MEL' : patientData.hopitalPrincipal}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Informations médicales</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-red-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium text-red-700">Groupe sanguin</span>
                      </div>
                      <p className="text-lg font-bold text-red-600">A+</p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium text-yellow-700">Allergies</span>
                      </div>
                      <p className="text-sm text-yellow-600">Pénicilline</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-green-700">Statut</span>
                      </div>
                      <p className="text-sm text-green-600">Actif</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistiques rapides */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-hedera-500" />
                    <span>Activité récente</span>
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Consultations</span>
                      <span className="font-bold text-2xl text-hedera-600">{consultations.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Médecins autorisés</span>
                      <span className="font-bold text-2xl text-medical-600">{medecinsAutorises.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Dernière visite</span>
                      <span className="text-sm font-medium">2 Jan 2025</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-hedera-500" />
                    <span>Prochains RDV</span>
                  </h3>
                  <div className="space-y-3">
                    {consultations
                      .filter(c => c.statut === 'programmee')
                      .slice(0, 2)
                      .map((consultation) => (
                        <div key={consultation.id} className="border-l-4 border-blue-500 pl-3">
                          <p className="font-medium text-sm">{consultation.medecin}</p>
                          <p className="text-xs text-gray-500">{consultation.type}</p>
                          <p className="text-xs text-blue-600">{new Date(consultation.date).toLocaleDateString('fr-FR')}</p>
                        </div>
                      ))}
                    {consultations.filter(c => c.statut === 'programmee').length === 0 && (
                      <p className="text-sm text-gray-500">Aucun RDV programmé</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'consultations' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
                <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-hedera-500" />
                  <span>Historique des consultations</span>
                </h2>
                <Button variant="primary" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle consultation
                </Button>
              </div>

              <div className="space-y-4">
                {consultations.map((consultation) => (
                  <div key={consultation.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-800">{consultation.medecin}</h3>
                          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatutColor(consultation.statut)}`}>
                            {getStatutIcon(consultation.statut)}
                            <span className="capitalize">{consultation.statut}</span>
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{consultation.type} - {consultation.hopital}</p>
                        <p className="text-sm text-gray-500">{new Date(consultation.date).toLocaleDateString('fr-FR')}</p>
                        {consultation.resume && (
                          <p className="text-sm text-gray-700 mt-2 bg-gray-50 p-2 rounded">{consultation.resume}</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'permissions' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
                <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-hedera-500" />
                  <span>Gestion des permissions</span>
                </h2>
                <Button variant="primary" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Autoriser un médecin
                </Button>
              </div>

              <div className="space-y-4">
                {medecinsAutorises.map((medecin) => (
                  <div key={medecin.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-800">{medecin.prenom} {medecin.nom}</h3>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            medecin.statut === 'actif' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                          }`}>
                            {medecin.statut === 'actif' ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
                            {medecin.statut}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{medecin.specialite} - {medecin.hopital}</p>
                        <p className="text-sm text-gray-500">Autorisé depuis le {new Date(medecin.dateAutorisation).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Modifier
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          Révoquer
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                <Settings className="h-5 w-5 text-hedera-500" />
                <span>Paramètres du compte</span>
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4">Informations personnelles</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                      <p className="text-gray-900">{patientData.telephone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-gray-900">{patientData.email || 'Non renseigné'}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="mt-4">
                    Modifier mes informations
                  </Button>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Rappels de RDV</span>
                      <input type="checkbox" defaultChecked className="h-4 w-4 text-hedera-500 focus:ring-hedera-500 border-gray-300 rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Nouvelles autorisations</span>
                      <input type="checkbox" defaultChecked className="h-4 w-4 text-hedera-500 focus:ring-hedera-500 border-gray-300 rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Résultats d'examens</span>
                      <input type="checkbox" defaultChecked className="h-4 w-4 text-hedera-500 focus:ring-hedera-500 border-gray-300 rounded" />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Sécurité</h3>
                  <div className="space-y-3">
                    <Button variant="outline">
                      Changer le mot de passe
                    </Button>
                    <Button variant="outline">
                      Télécharger mes données
                    </Button>
                    <Button variant="outline" className="text-red-600 hover:text-red-700">
                      Supprimer mon compte
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
