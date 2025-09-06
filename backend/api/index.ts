import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { config, validateConfig } from '../src/config/app.config'
import { connectDatabase } from '../src/config/database.config'
import prisma from '../src/config/database.config'

// Charger les variables d'environnement
dotenv.config()

// Valider la configuration
validateConfig()

const app = express()

// Middlewares de sécurité
app.use(helmet())
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true
}))

// Middlewares de parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Route de santé
app.get('/health', async (req, res) => {
  try {
    // Test de connexion à la base de données
    await prisma.$queryRaw`SELECT 1`
    
    res.status(200).json({
      status: 'OK',
      message: 'Hedera Health API is running',
      timestamp: new Date().toISOString(),
      database: 'Connected',
      version: config.API_VERSION
    })
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Database connection failed',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Route de test des données
app.get('/api/v1/test', async (req, res) => {
  try {
    const stats = {
      hopitaux: await prisma.hopital.count(),
      medecins: await prisma.medecin.count(),
      patients: await prisma.patient.count(),
      consultations: await prisma.consultation.count(),
      permissions: await prisma.permissionMedecin.count()
    }

    res.json({
      message: 'API Test successful',
      database_stats: stats,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({
      error: 'Database query failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Route pour lister les hôpitaux
app.get('/api/v1/hopitaux', async (req, res) => {
  try {
    const hopitaux = await prisma.hopital.findMany({
      select: {
        id: true,
        code: true,
        nom: true,
        ville: true,
        telephone: true,
        email: true,
        isActive: true
      }
    })

    res.json({
      success: true,
      data: hopitaux,
      count: hopitaux.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch hospitals',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Route pour lister les patients
app.get('/api/v1/patients', async (req, res) => {
  try {
    const patients = await prisma.patient.findMany({
      select: {
        id: true,
        patientId: true,
        nom: true,
        prenom: true,
        telephone: true,
        ville: true,
        hopitalPrincipal: true,
        isActive: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.json({
      success: true,
      data: patients,
      count: patients.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch patients',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Middleware de gestion d'erreurs
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
    timestamp: new Date().toISOString()
  })
})

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  })
})

// Initialisation de la base de données pour Vercel
let isInitialized = false

async function initializeDatabase() {
  if (!isInitialized) {
    try {
      await connectDatabase()
      isInitialized = true
      console.log('✅ Base de données initialisée pour Vercel')
    } catch (error) {
      console.error('❌ Erreur initialisation base de données:', error)
    }
  }
}

// Export pour Vercel
export default async function handler(req: any, res: any) {
  await initializeDatabase()
  return app(req, res)
}
