import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowLeft, Building2, Users, FileText, DollarSign, Clock, 
  TrendingUp, Download, BarChart3, Calendar, Bell, Settings 
} from 'lucide-react'
import Button from '@/components/ui/Button'

interface HospitalStats {
  patients: {
    total: number
    actifs: number
    croissance: number
  }
  consultations: {
    total: number
    croissance: number
  }
  economies: {
    montant: number
    examensEvites: number
  }
  temps: {
    gainParConsultation: number
  }
  utilisation: number
}

export default function HospitalDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('mois')
  
  // Données fictives pour la démo
  const stats: HospitalStats = {
    patients: {
      total: 1247,
      actifs: 1247,
      croissance: 12
    },
    consultations: {
      total: 3456,
      croissance: 8
    },
    economies: {
      montant: 2300000, // 2.3M FCFA
      examensEvites: 156
    },
    temps: {
      gainParConsultation: 15 // minutes
    },
    utilisation: 82
  }

  // const formatCurrency = (amount: number) => {
  //   return new Intl.NumberFormat('fr-FR', {
  //     style: 'currency',
  //     currency: 'XOF',
  //     minimumFractionDigits: 0
  //   }).format(amount)
  // }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num)
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
                CHU-MEL | Admin Dashboard
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hedera-500"
            >
              <option value="semaine">Cette semaine</option>
              <option value="mois">Ce mois</option>
              <option value="trimestre">Ce trimestre</option>
              <option value="annee">Cette année</option>
            </select>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Titre de section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-hedera-500" />
            <span>STATISTIQUES DU {selectedPeriod.toUpperCase()}</span>
          </h2>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Patients */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-hedera-500" />
                <span className="font-medium text-gray-700">PATIENTS</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-gray-800">{formatNumber(stats.patients.actifs)} actifs</p>
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">+{stats.patients.croissance}% vs mois</span>
              </div>
            </div>
          </div>

          {/* Consultations */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-500" />
                <span className="font-medium text-gray-700">CONSULT.</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-gray-800">{formatNumber(stats.consultations.total)} total</p>
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">+{stats.consultations.croissance}%</span>
              </div>
            </div>
          </div>

          {/* Économies */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-yellow-500" />
                <span className="font-medium text-gray-700">ÉCONOMIES</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-gray-800">2.3M FCFA</p>
              <p className="text-sm text-gray-600">examens évités</p>
            </div>
          </div>

          {/* Temps */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-purple-500" />
                <span className="font-medium text-gray-700">TEMPS</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-gray-800">-{stats.temps.gainParConsultation} min</p>
              <p className="text-sm text-gray-600">par consultation</p>
            </div>
          </div>
        </div>

        {/* Graphique d'utilisation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-hedera-500" />
              <span>GRAPHIQUE UTILISATION</span>
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Adoption système</span>
                <span className="text-sm font-medium text-gray-800">{stats.utilisation}%</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-hedera-500 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${stats.utilisation}%` }}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600">85%</p>
                  <p className="text-xs text-gray-500">Médecins actifs</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-blue-600">78%</p>
                  <p className="text-xs text-gray-500">Patients inscrits</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-purple-600">92%</p>
                  <p className="text-xs text-gray-500">Satisfaction</p>
                </div>
              </div>
            </div>
          </div>

          {/* Activité récente */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-hedera-500" />
              <span>ACTIVITÉ RÉCENTE</span>
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">156 nouveaux patients</p>
                  <p className="text-xs text-gray-500">Aujourd'hui</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">23 médecins connectés</p>
                  <p className="text-xs text-gray-500">En ce moment</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">Maintenance programmée</p>
                  <p className="text-xs text-gray-500">Dimanche 3h-5h</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="primary" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>RAPPORT DÉTAILLÉ</span>
          </Button>
          
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>EXPORTER DONNÉES</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
