import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Stethoscope, Users, Calendar, Clock,
  Plus, LogOut, Menu, X,
  AlertTriangle, BarChart3, User, Heart, FileText,
  QrCode, ChevronRight, TrendingUp
} from 'lucide-react'
import Button from '@/components/ui/Button'
import QRScanner from '@/components/QRScanner'
import { PatientQRData } from '@/services/qrCodeService'
import { getMedecinData, clearMedecinData } from '@/utils/storage'

interface MedecinData {
  id: string
  medecinId: string
  nom: string
  prenom: string
  email: string
  specialite: string
  service: string
  hopital: {
    nom: string
    code: string
  }
}

interface DashboardStats {
  patientsToday: number
  consultationsWeek: number
  emergencyCases: number
  avgConsultationTime: number
  patientsSatisfaction: number
  pendingReports: number
}

interface RecentPatient {
  id: string
  patientId: string
  nom: string
  prenom: string
  lastConsultation: string
  status: 'stable' | 'attention' | 'critique'
  nextAppointment?: string
}

interface UpcomingAppointment {
  id: string
  patientName: string
  time: string
  type: string
  duration: number
  isUrgent: boolean
}

const MedecinDashboardModern = () => {
  const navigate = useNavigate()
  
  // États
  const [medecin, setMedecin] = useState<MedecinData | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  
  // Données du dashboard
  const [stats, setStats] = useState<DashboardStats>({
    patientsToday: 0,
    consultationsWeek: 0,
    emergencyCases: 0,
    avgConsultationTime: 0,
    patientsSatisfaction: 0,
    pendingReports: 0
  })
  
  const [recentPatients, setRecentPatients] = useState<RecentPatient[]>([])
  const [upcomingAppointments, setUpcomingAppointments] = useState<UpcomingAppointment[]>([])

  // Chargement des données
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const medecinData = getMedecinData()
        if (!medecinData) {
          navigate('/medecin/login')
          return
        }
        
        setMedecin(medecinData)
        
        // Charger les statistiques du médecin
        await loadMedecinStats(medecinData.id)
        await loadRecentPatients(medecinData.id)
        await loadUpcomingAppointments(medecinData.id)
        
      } catch (error) {
        console.error('Erreur lors du chargement:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [navigate])

  const loadMedecinStats = async (_medecinId: string) => {
    try {
      // Simuler des statistiques réalistes
      setStats({
        patientsToday: Math.floor(Math.random() * 15) + 5,
        consultationsWeek: Math.floor(Math.random() * 50) + 20,
        emergencyCases: Math.floor(Math.random() * 3) + 1,
        avgConsultationTime: Math.floor(Math.random() * 10) + 25,
        patientsSatisfaction: Math.floor(Math.random() * 10) + 85,
        pendingReports: Math.floor(Math.random() * 5) + 2
      })
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error)
    }
  }

  const loadRecentPatients = async (_medecinId: string) => {
    try {
      // Simuler des patients récents
      const mockPatients: RecentPatient[] = [
        {
          id: '1',
          patientId: 'BJ2025001',
          nom: 'KOSSOU',
          prenom: 'Adjoa',
          lastConsultation: '2025-09-21T10:30:00Z',
          status: 'stable'
        },
        {
          id: '2',
          patientId: 'BJ2025002',
          nom: 'DOSSOU',
          prenom: 'Marie',
          lastConsultation: '2025-09-21T09:15:00Z',
          status: 'attention',
          nextAppointment: '2025-09-25T14:00:00Z'
        },
        {
          id: '3',
          patientId: 'BJ2025003',
          nom: 'HOUNKPATIN',
          prenom: 'Jean',
          lastConsultation: '2025-09-20T16:45:00Z',
          status: 'stable'
        }
      ]
      setRecentPatients(mockPatients)
    } catch (error) {
      console.error('Erreur lors du chargement des patients récents:', error)
    }
  }

  const loadUpcomingAppointments = async (_medecinId: string) => {
    try {
      // Simuler des rendez-vous à venir
      const mockAppointments: UpcomingAppointment[] = [
        {
          id: '1',
          patientName: 'KOSSOU Adjoa',
          time: '14:30',
          type: 'Consultation de suivi',
          duration: 30,
          isUrgent: false
        },
        {
          id: '2',
          patientName: 'DOSSOU Marie',
          time: '15:00',
          type: 'Consultation d\'urgence',
          duration: 45,
          isUrgent: true
        },
        {
          id: '3',
          patientName: 'HOUNKPATIN Jean',
          time: '15:45',
          type: 'Contrôle post-opératoire',
          duration: 30,
          isUrgent: false
        }
      ]
      setUpcomingAppointments(mockAppointments)
    } catch (error) {
      console.error('Erreur lors du chargement des rendez-vous:', error)
    }
  }

  const handleQRScan = (data: PatientQRData) => {
    setShowQRScanner(false)
    navigate(`/medecin/patient/${data.patientId}`)
  }

  const handleLogout = () => {
    clearMedecinData()
    navigate('/medecin/login')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stable': return 'text-green-600 bg-green-50'
      case 'attention': return 'text-yellow-600 bg-yellow-50'
      case 'critique': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  // const formatTime = (dateString: string) => {
  //   return new Date(dateString).toLocaleTimeString('fr-FR', {
  //     hour: '2-digit',
  //     minute: '2-digit'
  //   })
  // }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!medecin) {
  return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Mobile */}
      <div className="lg:hidden bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
        >
          <Menu className="h-6 w-6" />
        </button>
  <h1 className="text-lg font-semibold text-gray-900">Doctor Dashboard</h1>
        <button
          onClick={() => setShowQRScanner(true)}
          className="p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
        >
          <QrCode className="h-5 w-5" />
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">Hedera Health</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md text-gray-400 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Profil Médecin */}
          <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Dr. {medecin.prenom} {medecin.nom}
                </h3>
                <p className="text-xs text-gray-600">{medecin.specialite}</p>
                <p className="text-xs text-gray-500">{medecin.hopital.nom}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === 'overview' 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              <span className="font-medium">Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('patients')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === 'patients' 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Users className="h-5 w-5" />
              <span className="font-medium">My Patients</span>
            </button>

            <button
              onClick={() => setActiveTab('consultations')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === 'consultations' 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Stethoscope className="h-5 w-5" />
              <span className="font-medium">Consultations</span>
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === 'calendar' 
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Calendar className="h-5 w-5" />
              <span className="font-medium">Schedule</span>
            </button>

            <div className="border-t pt-4 mt-4">
              <button
                onClick={() => setShowQRScanner(true)}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <QrCode className="h-5 w-5" />
                <span className="font-medium">Scan QR Code</span>
              </button>

              <Link
                to="/medecin/consultation/new"
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span className="font-medium">New Consultation</span>
              </Link>
            </div>

            <div className="border-t pt-4 mt-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Overlay pour mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Contenu Principal */}
        <div className="flex-1 lg:ml-64">
          <div className="p-6">
            {/* En-tête */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Hello, Dr. {medecin.prenom} {medecin.nom}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="hidden lg:flex items-center space-x-4">
                  <Button
                    onClick={() => setShowQRScanner(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    Scan QR Code
                  </Button>
                  <Link to="/medecin/consultation/new">
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      New Consultation
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Contenu basé sur l'onglet actif */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Patients today</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.patientsToday}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">+12% vs yesterday</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Consultations/week</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.consultationsWeek}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                        <Stethoscope className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">+8% vs last week</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Emergency cases</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.emergencyCases}</p>
                      </div>
                      <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center">
                      <span className="text-sm text-gray-600">Today</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Average time</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.avgConsultationTime}min</p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                        <Clock className="h-6 w-6 text-yellow-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center">
                      <span className="text-sm text-gray-600">Per consultation</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Satisfaction</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.patientsSatisfaction}%</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                        <Heart className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">+3% this month</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Pending reports</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.pendingReports}</p>
                      </div>
                      <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-orange-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center">
                      <span className="text-sm text-gray-600">To finalize</span>
                    </div>
                  </div>
                </div>

                {/* Patients Récents et Rendez-vous */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Patients Récents */}
                  <div className="bg-white rounded-xl shadow-sm border">
                    <div className="p-6 border-b">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Patients</h3>
                        <Link
                          to="/medecin/patients"
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View all
                        </Link>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {recentPatients.map((patient) => (
                          <div key={patient.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {patient.prenom} {patient.nom}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  ID: {patient.patientId}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Last visit: {formatDate(patient.lastConsultation)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                                {patient.status === 'stable' ? 'Stable' :
                                 patient.status === 'attention' ? 'Attention' : 'Critical'}
                              </span>
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Rendez-vous à venir */}
                  <div className="bg-white rounded-xl shadow-sm border">
                    <div className="p-6 border-b">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Today's Appointments</h3>
                        <Link
                          to="/medecin/planning"
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Full schedule
                        </Link>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {upcomingAppointments.map((appointment) => (
                          <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                appointment.isUrgent ? 'bg-red-100' : 'bg-green-100'
                              }`}>
                                <Clock className={`h-5 w-5 ${
                                  appointment.isUrgent ? 'text-red-600' : 'text-green-600'
                                }`} />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {appointment.patientName}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {appointment.type}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {appointment.duration} minutes
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">{appointment.time}</p>
                              {appointment.isUrgent && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Urgent
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Rapides */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button
                      onClick={() => setShowQRScanner(true)}
                      className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <QrCode className="h-6 w-6 text-blue-600" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Scan QR Code</p>
                        <p className="text-sm text-gray-600">Access patient record</p>
                      </div>
                    </button>

                    <Link
                      to="/medecin/consultation/new"
                      className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <Plus className="h-6 w-6 text-green-600" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">New Consultation</p>
                        <p className="text-sm text-gray-600">Create new record</p>
                      </div>
                    </Link>

                    <Link
                      to="/medecin/patients"
                      className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                      <Users className="h-6 w-6 text-purple-600" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">My Patients</p>
                        <p className="text-sm text-gray-600">Manage records</p>
                      </div>
                    </Link>

                    <Link
                      to="/medecin/planning"
                      className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                    >
                      <Calendar className="h-6 w-6 text-orange-600" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Schedule</p>
                        <p className="text-sm text-gray-600">Manage appointments</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Autres onglets - Placeholder pour l'instant */}
            {activeTab === 'patients' && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Management</h3>
                <p className="text-gray-600">Patient management interface under development...</p>
                <div className="mt-4">
                  <Link to="/medecin/patients">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      Access full list
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'consultations' && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">My Consultations</h3>
                <p className="text-gray-600">Consultation management interface under development...</p>
                <div className="mt-4">
                  <Link to="/medecin/consultation/new">
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      New Consultation
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'calendar' && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule</h3>
                <p className="text-gray-600">Schedule interface under development...</p>
                <div className="mt-4">
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                    View full schedule
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scanner QR Code Modal */}
      {showQRScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Scan Patient QR Code</h3>
                <button
                  onClick={() => setShowQRScanner(false)}
                  className="p-2 rounded-md text-gray-400 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <QRScanner
                onScanSuccess={handleQRScan}
                onClose={() => setShowQRScanner(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MedecinDashboardModern
