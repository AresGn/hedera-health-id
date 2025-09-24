import { FileText, Plus, Eye, Download, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import { Consultation } from '@/types/patient'

interface PatientConsultationsProps {
  consultations: Consultation[]
}

export default function PatientConsultations({ consultations }: PatientConsultationsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'terminee': return 'text-green-600 bg-green-50'
      case 'programmee': return 'text-blue-600 bg-blue-50'
      case 'annulee': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'terminee': return <CheckCircle className="h-4 w-4" />
      case 'programmee': return <Clock className="h-4 w-4" />
      case 'annulee': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const statusLabels: Record<string, string> = {
    terminee: 'Completed',
    programmee: 'Scheduled',
    annulee: 'Cancelled'
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
          <FileText className="h-5 w-5 text-hedera-500" />
          <span>Consultation History</span>
        </h2>
        <Button variant="primary" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Consultation
        </Button>
      </div>

      <div className="space-y-4">
        {consultations.map((consultation) => (
          <div key={consultation.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-gray-800">{consultation.medecin}</h3>
                  <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(consultation.statut)}`}>
                    {getStatusIcon(consultation.statut)}
                    <span className="capitalize">{statusLabels[consultation.statut] || consultation.statut}</span>
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{consultation.type} - {consultation.hopital}</p>
                <p className="text-sm text-gray-500">{new Date(consultation.date).toLocaleDateString('en-US')}</p>
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
  )
}
