import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { config, validateConfig } from './config/app.config'
import { connectDatabase, disconnectDatabase } from './config/database.config'
import prisma from './config/database.config'
import statistiquesRouter from './routes/statistiques'

// Charger les variables d'environnement
dotenv.config()

// Valider la configuration
validateConfig()

const app = express()

// Middlewares de sécurité
app.use(helmet())

// Configuration CORS pour accepter plusieurs origines
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3002',
  'http://localhost:5173',
  'https://hedera-health-id.vercel.app',
  'https://hedera-health-id-frontend.vercel.app',
  config.CORS_ORIGIN
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    // Autoriser les requêtes sans origine (ex: applications mobiles, Postman)
    if (!origin) return callback(null, true)

    // En développement, autoriser localhost sur tous les ports
    if (config.NODE_ENV === 'development' && origin?.includes('localhost')) {
      return callback(null, true)
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    console.log(`CORS: Origin ${origin} not allowed. Allowed origins:`, allowedOrigins)
    return callback(new Error('Non autorisé par CORS'), false)
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'],
  preflightContinue: false,
  optionsSuccessStatus: 204
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

// Routes API
app.use('/api/v1/statistiques', statistiquesRouter)

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

// Démarrage du serveur
async function startServer() {
  try {
    // Connexion à la base de données
    await connectDatabase()
    
    // Démarrage du serveur
    const server = app.listen(config.PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${config.PORT}`)
      console.log(`🌐 API disponible sur: http://localhost:${config.PORT}`)
      console.log(`🏥 Health check: http://localhost:${config.PORT}/health`)
      console.log(`📊 Test API: http://localhost:${config.PORT}/api/v1/test`)
      console.log(`🏢 Hôpitaux: http://localhost:${config.PORT}/api/v1/hopitaux`)
      console.log(`👤 Patients: http://localhost:${config.PORT}/api/v1/patients`)
    })

    // Gestion graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('🛑 Arrêt du serveur...')
      server.close(async () => {
        await disconnectDatabase()
        process.exit(0)
      })
    })

    process.on('SIGINT', async () => {
      console.log('🛑 Arrêt du serveur...')
      server.close(async () => {
        await disconnectDatabase()
        process.exit(0)
      })
    })

  } catch (error) {
    console.error('❌ Erreur lors du démarrage:', error)
    process.exit(1)
  }
}

// Démarrage
startServer()
