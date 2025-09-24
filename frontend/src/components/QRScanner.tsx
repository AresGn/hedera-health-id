import { useState, useRef, useEffect } from 'react'
import { Camera, X, Search, AlertCircle, CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import qrCodeService, { PatientQRData } from '@/services/qrCodeService'

interface QRScannerProps {
  onScanSuccess: (patientData: PatientQRData) => void
  onClose: () => void
  className?: string
}

export default function QRScanner({ onScanSuccess, onClose, className }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [manualId, setManualId] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Start camera
  const startCamera = async () => {
    try {
      setError('')
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Prefer rear camera
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      })
      
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.play()
      }
      
      setIsScanning(true)
      startScanning()
    } catch (error) {
      console.error('Camera access error:', error)
      setError("Can't access camera. Check permissions.")
    }
  }

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
    }
    setIsScanning(false)
  }

  // Scan QR code from video
  const startScanning = () => {
    if (!videoRef.current || !canvasRef.current) return

    scanIntervalRef.current = setInterval(() => {
      scanFrame()
    }, 500) // Scan every 500ms
  }

  const scanFrame = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) return

    const context = canvas.getContext('2d')
    if (!context) return

    // Capturer l'image de la vidéo
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Obtenir les données de l'image
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    
    // Ici, en production, on utiliserait une bibliothèque comme jsQR
    // Pour la démo, on simule la détection
    simulateQRDetection(imageData)
  }

  // Simulate QR detection (in production, use jsQR or similar)
  const simulateQRDetection = (_imageData: ImageData) => {
    // Simulate: detect QR code after 3 seconds of scan
    if (isScanning) {
      setTimeout(() => {
        // Test data for demo
        const testQRData = {
          patientId: 'BJ2025001',
          nom: 'KOSSOU',
          prenom: 'Adjoa',
          hopital: 'chu-mel',
          dateNaissance: '1990-05-12',
          groupeSanguin: 'A+',
          allergies: ['Pénicilline'],
          timestamp: Date.now(),
          version: '1.0'
        }
        
        handleQRDetected(JSON.stringify(testQRData))
      }, 3000)
    }
  }

  // Traiter un QR Code détecté
  const handleQRDetected = (qrData: string) => {
    try {
      // Valider le QR Code
      const validation = qrCodeService.validateQRCode(qrData)
      
      if (validation.isValid && validation.data) {
        setSuccess('QR Code scanné avec succès!')
        stopCamera()
        onScanSuccess(validation.data)
      } else {
        setError(validation.error || 'QR Code invalide')
      }
    } catch (error) {
      setError('Erreur lors de la lecture du QR Code')
    }
  }

  // Recherche manuelle par ID
  const handleManualSearch = () => {
    if (!manualId.trim()) {
      setError('Veuillez saisir un ID patient')
      return
    }

    // Validation format ID (BJ + année + 4 chiffres)
    const idPattern = /^BJ\d{8}$/
    if (!idPattern.test(manualId)) {
      setError('Format ID invalide. Exemple: BJ20250001')
      return
    }

    // Simulation de recherche (en production, appel API)
    setTimeout(() => {
      const testPatientData: PatientQRData = {
        patientId: manualId,
        nom: 'PATIENT',
        prenom: 'Test',
        hopital: 'chu-mel',
        dateNaissance: '1985-01-01',
        groupeSanguin: 'O+',
        allergies: [],
        timestamp: Date.now(),
        version: '1.0'
      }
      
      setSuccess('Patient trouvé!')
      onScanSuccess(testPatientData)
    }, 1000)
  }

  // Nettoyage à la fermeture
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
          <Camera className="h-6 w-6 text-hedera-500" />
          <span>Scanner Patient</span>
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className="text-green-700">{success}</span>
        </div>
      )}

      {/* Zone de scan */}
      <div className="mb-6">
        <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
          {isScanning ? (
            <>
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Overlay de scan */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-hedera-500 border-dashed rounded-lg flex items-center justify-center">
                  <div className="text-center text-white bg-black bg-opacity-50 p-2 rounded">
                    <p className="text-sm">Centrez le QR Code</p>
                    <p className="text-sm">dans le cadre</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <Camera className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">Cliquez pour démarrer la caméra</p>
                <Button onClick={startCamera} variant="primary">
                  Démarrer le scan
                </Button>
              </div>
            </div>
          )}
        </div>

        {isScanning && (
          <div className="mt-4 text-center">
            <Button onClick={stopCamera} variant="outline">
              Arrêter le scan
            </Button>
          </div>
        )}
      </div>

      {/* Séparateur */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Alternative</span>
        </div>
      </div>

      {/* Saisie manuelle */}
      <div className="space-y-4">
        <Input
          label="Saisir ID manuellement"
          value={manualId}
          onChange={(e) => {
            setManualId(e.target.value.toUpperCase())
            setError('')
          }}
          placeholder="BJ20250001"
          icon={<Search className="h-4 w-4" />}
        />
        
        <Button
          onClick={handleManualSearch}
          variant="secondary"
          className="w-full"
          disabled={!manualId.trim()}
        >
          Rechercher
        </Button>
      </div>
    </div>
  )
}
