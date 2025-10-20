const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const dotenv = require('dotenv')
const { PrismaClient } = require('@prisma/client')

// Charger les variables d'environnement
dotenv.config()

// Initialiser Prisma avec logs détaillés
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'production' ? ['error', 'warn'] : ['error', 'warn', 'info'],
  errorFormat: 'pretty',
})

// Configuration simplifiée
const config = {
  NODE_ENV: process.env.NODE_ENV || 'production',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'https://hedera-health-id.vercel.app',
  API_VERSION: process.env.API_VERSION || '1.0.0',
  DATABASE_URL: process.env.DATABASE_URL ? '***CONFIGURED***' : 'NOT_CONFIGURED'
}

// Log de démarrage
console.log('🚀 Backend starting with config:', {
  NODE_ENV: config.NODE_ENV,
  HAS_DATABASE_URL: !!process.env.DATABASE_URL,
  CORS_ORIGIN: config.CORS_ORIGIN
})

const app = express()

// Middlewares de sécurité - désactivé pour Vercel
// app.use(helmet())

// Configuration CORS pour accepter plusieurs origines
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3002',
  'http://localhost:5173',
  'https://hedera-health-id.vercel.app',
  'https://hedera-health-id-backend.vercel.app',
  config.CORS_ORIGIN
].filter(Boolean)

console.log('🔒 CORS Allowed Origins:', allowedOrigins)

app.use(cors({
  origin: (origin, callback) => {
    console.log(`🔍 CORS Check - Origin: ${origin}`)

    // Autoriser les requêtes sans origine (ex: applications mobiles, Postman)
    if (!origin) {
      console.log('✅ CORS: No origin - allowing')
      return callback(null, true)
    }

    // En développement, autoriser localhost sur tous les ports
    if (config.NODE_ENV === 'development' && origin?.includes('localhost')) {
      console.log('✅ CORS: Development localhost - allowing')
      return callback(null, true)
    }

    if (allowedOrigins.includes(origin)) {
      console.log('✅ CORS: Origin allowed')
      return callback(null, true)
    }

    console.log(`❌ CORS: Origin ${origin} not allowed. Allowed origins:`, allowedOrigins)
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

// Page d'accueil HTML
app.get('/', async (req, res) => {
  let dbStatus = 'Unknown'
  let dbColor = 'gray'
  let dbError = ''
  
  try {
    // Tentative de connexion à la base de données
    await prisma.$connect()
    await prisma.$queryRaw`SELECT 1`
    dbStatus = 'Connected'
    dbColor = 'green'
  } catch (error) {
    console.error('Database connection error:', error)
    dbStatus = 'Disconnected'
    dbColor = 'red'
    dbError = error.message || 'Unknown error'
    
    // Si c'est une erreur de variable d'environnement
    if (!process.env.DATABASE_URL) {
      dbError = 'DATABASE_URL not configured'
    }
  }
  
  const html = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Hedera Health ID - Backend API</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .container {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          padding: 40px;
          max-width: 800px;
          width: 100%;
        }
        h1 {
          color: #333;
          margin-bottom: 10px;
          font-size: 2.5em;
        }
        .subtitle {
          color: #666;
          margin-bottom: 30px;
          font-size: 1.1em;
        }
        .status-card {
          background: #f7f9fc;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 30px;
        }
        .status-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          align-items: center;
        }
        .status-label {
          font-weight: 600;
          color: #555;
        }
        .status-value {
          font-weight: 500;
        }
        .status-badge {
          padding: 5px 12px;
          border-radius: 20px;
          color: white;
          font-size: 0.9em;
        }
        .status-green { background: #10b981; }
        .status-red { background: #ef4444; }
        .status-gray { background: #6b7280; }
        .endpoints-section {
          margin-top: 30px;
        }
        h2 {
          color: #333;
          margin-bottom: 20px;
          font-size: 1.8em;
        }
        .endpoint-group {
          margin-bottom: 25px;
        }
        h3 {
          color: #667eea;
          margin-bottom: 10px;
          font-size: 1.3em;
        }
        .endpoint-list {
          background: #f7f9fc;
          border-radius: 10px;
          padding: 15px;
        }
        .endpoint {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          padding: 8px;
          background: white;
          border-radius: 5px;
        }
        .method {
          padding: 4px 8px;
          border-radius: 4px;
          color: white;
          font-size: 0.85em;
          font-weight: 600;
          margin-right: 12px;
          min-width: 60px;
          text-align: center;
        }
        .method-get { background: #10b981; }
        .method-post { background: #3b82f6; }
        .method-put { background: #f59e0b; }
        .method-delete { background: #ef4444; }
        .path {
          color: #333;
          font-family: 'Courier New', monospace;
          font-size: 0.95em;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #999;
          font-size: 0.9em;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🏥 Hedera Health ID</h1>
        <p class="subtitle">Backend API Server</p>
        
        <div class="status-card">
          <div class="status-row">
            <span class="status-label">Status:</span>
            <span class="status-badge status-green">Online</span>
          </div>
          <div class="status-row">
            <span class="status-label">Database:</span>
            <span class="status-badge status-${dbColor}">${dbStatus}</span>
          </div>
          ${dbError ? `<div class="status-row">
            <span class="status-label">DB Error:</span>
            <span class="status-value" style="color: red; font-size: 0.9em;">${dbError}</span>
          </div>` : ''}
          <div class="status-row">
            <span class="status-label">Version:</span>
            <span class="status-value">${config.API_VERSION}</span>
          </div>
          <div class="status-row">
            <span class="status-label">Environment:</span>
            <span class="status-value">${config.NODE_ENV}</span>
          </div>
          <div class="status-row">
            <span class="status-label">Timestamp:</span>
            <span class="status-value">${new Date().toISOString()}</span>
          </div>
        </div>
        
        <div class="endpoints-section">
          <h2>📡 Available Endpoints</h2>
          
          <div class="endpoint-group">
            <h3>Health Check</h3>
            <div class="endpoint-list">
              <div class="endpoint">
                <span class="method method-get">GET</span>
                <span class="path">/</span>
              </div>
              <div class="endpoint">
                <span class="method method-get">GET</span>
                <span class="path">/health</span>
              </div>
              <div class="endpoint">
                <span class="method method-get">GET</span>
                <span class="path">/api/v1/test</span>
              </div>
            </div>
          </div>
          
          <div class="endpoint-group">
            <h3>Authentication</h3>
            <div class="endpoint-list">
              <div class="endpoint">
                <span class="method method-post">POST</span>
                <span class="path">/api/v1/auth/register</span>
              </div>
              <div class="endpoint">
                <span class="method method-post">POST</span>
                <span class="path">/api/v1/auth/login</span>
              </div>
            </div>
          </div>
          
          <div class="endpoint-group">
            <h3>Patient Management</h3>
            <div class="endpoint-list">
              <div class="endpoint">
                <span class="method method-get">GET</span>
                <span class="path">/api/v1/patients</span>
              </div>
              <div class="endpoint">
                <span class="method method-post">POST</span>
                <span class="path">/api/v1/patients</span>
              </div>
              <div class="endpoint">
                <span class="method method-get">GET</span>
                <span class="path">/api/v1/patients/:id</span>
              </div>
              <div class="endpoint">
                <span class="method method-put">PUT</span>
                <span class="path">/api/v1/patients/:id</span>
              </div>
              <div class="endpoint">
                <span class="method method-delete">DELETE</span>
                <span class="path">/api/v1/patients/:id</span>
              </div>
            </div>
          </div>
          
          <div class="endpoint-group">
            <h3>Medical Records</h3>
            <div class="endpoint-list">
              <div class="endpoint">
                <span class="method method-get">GET</span>
                <span class="path">/api/v1/consultations</span>
              </div>
              <div class="endpoint">
                <span class="method method-post">POST</span>
                <span class="path">/api/v1/consultations</span>
              </div>
              <div class="endpoint">
                <span class="method method-get">GET</span>
                <span class="path">/api/v1/patients/:id/consultations</span>
              </div>
            </div>
          </div>
          
          <div class="endpoint-group">
            <h3>Statistics</h3>
            <div class="endpoint-list">
              <div class="endpoint">
                <span class="method method-get">GET</span>
                <span class="path">/api/v1/statistiques/dashboard</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="footer">
          <p>© 2024 Hedera Health ID - MVP Version</p>
          <p>Built with Express.js, Prisma & Hedera Hashgraph</p>
        </div>
      </div>
    </body>
    </html>
  `
  
  res.setHeader('Content-Type', 'text/html')
  res.send(html)
})

// Route de santé
app.get('/health', async (req, res) => {
  const healthCheck = {
    timestamp: new Date().toISOString(),
    version: config.API_VERSION,
    environment: config.NODE_ENV,
    database: {
      configured: !!process.env.DATABASE_URL,
      status: 'checking'
    }
  }
  
  try {
    // Test de connexion à la base de données
    await prisma.$connect()
    const result = await prisma.$queryRaw`SELECT 1 as test`
    
    healthCheck.status = 'OK'
    healthCheck.message = 'Hedera Health API is running'
    healthCheck.database.status = 'Connected'
    healthCheck.database.test = result
    
    return res.status(200).json(healthCheck)
  } catch (error) {
    console.error('Health check failed:', error)
    
    healthCheck.status = 'ERROR'
    healthCheck.message = 'Database connection failed'
    healthCheck.database.status = 'Disconnected'
    healthCheck.database.error = error.message || 'Unknown error'
    
    // Ajouter plus de détails en mode développement
    if (config.NODE_ENV !== 'production') {
      healthCheck.database.errorStack = error.stack
    }
    
    return res.status(500).json(healthCheck)
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

    return res.json({
      message: 'API Test successful',
      database_stats: stats,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return res.status(500).json({
      error: 'Database query failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Route de debug de la base de données (à supprimer en production)
app.get('/api/debug/database', async (req, res) => {
  const debug = {
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      hasDBUrl: !!process.env.DATABASE_URL,
      dbUrlPrefix: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 20) + '...' : 'NOT SET',
      platform: process.platform,
      nodeVersion: process.version
    },
    prisma: {
      clientVersion: '@prisma/client version unknown'
    },
    tests: {}
  }
  
  // Test 1: Connexion basique
  try {
    await prisma.$connect()
    debug.tests.connect = { success: true, message: 'Connection established' }
  } catch (error) {
    debug.tests.connect = { 
      success: false, 
      message: error.message,
      code: error.code,
      meta: error.meta 
    }
  }
  
  // Test 2: Query simple
  try {
    const result = await prisma.$queryRaw`SELECT current_database(), current_schema(), version()`
    debug.tests.query = { success: true, result }
  } catch (error) {
    debug.tests.query = { 
      success: false, 
      message: error.message,
      code: error.code 
    }
  }
  
  // Test 3: Vérifier les tables
  try {
    const tables = await prisma.$queryRaw`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename
    `
    debug.tests.tables = { success: true, count: tables.length, tables }
  } catch (error) {
    debug.tests.tables = { 
      success: false, 
      message: error.message 
    }
  }
  
  return res.json(debug)
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

    return res.json({
      success: true,
      data: hopitaux,
      count: hopitaux.length
    })
  } catch (error) {
    return res.status(500).json({
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

    return res.json({
      success: true,
      data: patients,
      count: patients.length
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch patients',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Route pour récupérer un patient spécifique par patientId
app.get('/api/v1/patients/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params

    const patient = await prisma.patient.findUnique({
      where: {
        patientId: patientId
      },
      select: {
        id: true,
        patientId: true,
        nom: true,
        prenom: true,
        dateNaissance: true,
        telephone: true,
        email: true,
        ville: true,
        hopitalPrincipal: true,
        groupeSanguin: true,
        allergies: true,
        maladiesChroniques: true,
        contactUrgence: true,
        isActive: true,
        createdAt: true,
        lastLogin: true
      }
    })

    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found',
        message: `Patient avec l'ID ${patientId} non trouvé`
      })
    }

    return res.json({
      success: true,
      data: patient
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch patient',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Route pour récupérer les consultations d'un patient
app.get('/api/v1/patients/:patientId/consultations', async (req, res) => {
  try {
    const { patientId } = req.params

    // Vérifier que le patient existe
    const patient = await prisma.patient.findUnique({
      where: { patientId: patientId }
    })

    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found',
        message: `Patient avec l'ID ${patientId} non trouvé`
      })
    }

    const consultations = await prisma.consultation.findMany({
      where: {
        patientId: patient.id
      },
      select: {
        id: true,
        consultationId: true,
        dateConsultation: true,
        type: true,
        motif: true,
        diagnostic: true,
        statut: true,
        notes: true,
        createdAt: true,
        medecin: {
          select: {
            nom: true,
            prenom: true,
            specialite: true
          }
        },
        hopital: {
          select: {
            nom: true,
            code: true
          }
        }
      },
      orderBy: {
        dateConsultation: 'desc'
      }
    })

    return res.json({
      success: true,
      data: consultations,
      count: consultations.length
    })
  } catch (error) {
    console.warn('Erreur lors de la récupération des consultations:', error)
    return res.json({
      success: true,
      data: [],
      count: 0
    })
  }
})

// Route pour lister les médecins
app.get('/api/v1/medecins', async (req, res) => {
  try {
    const medecins = await prisma.medecin.findMany({
      select: {
        id: true,
        medecinId: true,
        nom: true,
        prenom: true,
        email: true,
        telephone: true,
        specialite: true,
        service: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        hopital: {
          select: {
            nom: true,
            code: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return res.json({
      success: true,
      data: medecins,
      count: medecins.length
    })
  } catch (error) {
    console.warn('Table medecin non trouvée, utilisation de valeur par défaut')
    return res.json({
      success: true,
      data: [],
      count: 0
    })
  }
})

// Route pour lister les consultations
app.get('/api/v1/consultations', async (req, res) => {
  try {
    const consultations = await prisma.consultation.findMany({
      select: {
        id: true,
        consultationId: true,
        dateConsultation: true,
        type: true,
        motif: true,
        diagnostic: true,
        statut: true,
        createdAt: true,
        patient: {
          select: {
            patientId: true,
            nom: true,
            prenom: true
          }
        },
        medecin: {
          select: {
            nom: true,
            prenom: true,
            specialite: true
          }
        },
        hopital: {
          select: {
            nom: true,
            code: true
          }
        }
      },
      orderBy: {
        dateConsultation: 'desc'
      }
    })

    return res.json({
      success: true,
      data: consultations,
      count: consultations.length
    })
  } catch (error) {
    console.warn('Table consultation non trouvée, utilisation de valeur par défaut')
    return res.json({
      success: true,
      data: [],
      count: 0
    })
  }
})

// Route pour créer une nouvelle consultation
app.post('/api/v1/consultations', async (req, res) => {
  try {
    const {
      patientId,
      medecinId,
      hopitalId,
      type,
      motif,
      diagnostic,
      prescription,
      examensPrescrits,
      poids,
      taille,
      tensionArterielle,
      temperature,
      pouls,
      notes,
      statut = 'PROGRAMMEE'
    } = req.body

    // Générer un ID unique pour la consultation
    const consultationId = `CONS-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`

    const consultation = await prisma.consultation.create({
      data: {
        consultationId,
        patientId,
        medecinId,
        hopitalId,
        dateConsultation: new Date(),
        type,
        motif,
        diagnostic,
        prescription,
        examensPrescrits: examensPrescrits || [],
        poids: poids ? parseFloat(poids) : null,
        taille: taille ? parseFloat(taille) : null,
        tensionArterielle,
        temperature: temperature ? parseFloat(temperature) : null,
        pouls: pouls ? parseInt(pouls) : null,
        statut,
        notes
      },
      include: {
        patient: {
          select: {
            patientId: true,
            nom: true,
            prenom: true
          }
        },
        medecin: {
          select: {
            nom: true,
            prenom: true,
            specialite: true
          }
        },
        hopital: {
          select: {
            nom: true,
            code: true
          }
        }
      }
    })

    return res.status(201).json({
      success: true,
      data: consultation,
      message: 'Consultation créée avec succès'
    })
  } catch (error) {
    console.error('Erreur création consultation:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to create consultation',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Route pour créer un nouveau patient
app.post('/api/v1/patients', async (req, res) => {
  try {
    const {
      patientId,
      nom,
      prenom,
      dateNaissance,
      telephone,
      email,
      ville,
      hopitalPrincipal,
      groupeSanguin,
      allergies,
      maladiesChroniques,
      contactUrgence,
      password
    } = req.body

    // Validation des champs requis
    if (!patientId || !nom || !prenom || !dateNaissance || !telephone || !password) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'PatientId, nom, prenom, dateNaissance, telephone et password sont requis'
      })
    }

    // Validation du mot de passe
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password too short',
        message: 'Le mot de passe doit contenir au moins 6 caractères'
      })
    }

    // Vérifier si le patient existe déjà
    const existingPatient = await prisma.patient.findUnique({
      where: { patientId }
    })

    if (existingPatient) {
      return res.status(409).json({
        success: false,
        error: 'Patient already exists',
        message: `Patient avec l'ID ${patientId} existe déjà`
      })
    }

    // Pour la démo, on stocke le mot de passe en clair (en production, utiliser bcrypt)
    const patient = await prisma.patient.create({
      data: {
        patientId,
        nom,
        prenom,
        dateNaissance: new Date(dateNaissance),
        telephone,
        email,
        ville,
        hopitalPrincipal,
        groupeSanguin,
        allergies: allergies || [],
        maladiesChroniques: maladiesChroniques || [],
        contactUrgence,
        passwordHash: password, // En production: await bcrypt.hash(password, 12)
        isActive: true
      }
    })

    return res.status(201).json({
      success: true,
      data: patient,
      message: 'Patient créé avec succès'
    })
  } catch (error) {
    console.error('Erreur création patient:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to create patient',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Route d'authentification patient
app.post('/api/v1/auth/patient', async (req, res) => {
  try {
    const { patientId, password } = req.body

    // Validation des données
    if (!patientId || !password) {
      return res.status(400).json({
        success: false,
        error: 'ID patient et mot de passe requis'
      })
    }

    // Recherche du patient
    const patient = await prisma.patient.findUnique({
      where: {
        patientId: patientId,
        isActive: true
      }
    })

    if (!patient) {
      return res.status(401).json({
        success: false,
        error: 'Identifiants invalides'
      })
    }

    // Vérification simple du mot de passe (en production, utiliser bcrypt.compare)
    const isPasswordValid = password === patient.passwordHash

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Identifiants invalides'
      })
    }

    // Mise à jour de la dernière connexion
    await prisma.patient.update({
      where: { id: patient.id },
      data: { lastLogin: new Date() }
    })

    // Génération du token JWT (simulation)
    const token = `jwt_patient_${patient.id}_${Date.now()}`

    return res.json({
      success: true,
      data: {
        token,
        patient: {
          id: patient.id,
          patientId: patient.patientId,
          nom: patient.nom,
          prenom: patient.prenom,
          email: patient.email,
          telephone: patient.telephone,
          ville: patient.ville,
          hopitalPrincipal: patient.hopitalPrincipal,
          lastLogin: new Date()
        }
      }
    })
  } catch (error) {
    console.error('Erreur authentification patient:', error)
    return res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de l\'authentification'
    })
  }
})

// Route d'authentification hôpital/admin
app.post('/api/v1/auth/hospital', async (req, res) => {
  try {
    const { adminId, password } = req.body

    // Validation des données
    if (!adminId || !password) {
      return res.status(400).json({
        success: false,
        error: 'ID admin et mot de passe requis'
      })
    }

    // Recherche de l'admin hôpital
    const admin = await prisma.hospitalAdmin.findUnique({
      where: {
        adminId: adminId,
        isActive: true
      },
      include: {
        hopital: {
          select: {
            id: true,
            nom: true,
            code: true,
            ville: true
          }
        }
      }
    })

    if (!admin) {
      return res.status(401).json({
        success: false,
        error: 'Identifiants invalides'
      })
    }

    // En production, vérifier le hash du mot de passe avec bcrypt
    // Pour la démo, on accepte tous les mots de passe
    const isPasswordValid = true // await bcrypt.compare(password, admin.passwordHash)

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Identifiants invalides'
      })
    }

    // Mise à jour de la dernière connexion
    await prisma.hospitalAdmin.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() }
    })

    // Génération du token JWT (simulation)
    const token = `jwt_admin_${admin.id}_${Date.now()}`

    return res.json({
      success: true,
      data: {
        token,
        admin: {
          id: admin.id,
          adminId: admin.adminId,
          nom: admin.nom,
          prenom: admin.prenom,
          email: admin.email,
          role: admin.role,
          hopital: admin.hopital,
          lastLogin: new Date()
        }
      }
    })
  } catch (error) {
    console.error('Erreur authentification admin hôpital:', error)
    return res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de l\'authentification'
    })
  }
})

// Route d'authentification médecin
app.post('/api/v1/auth/medecin', async (req, res) => {
  try {
    const { email, password, hopitalCode } = req.body

    // Validation des données
    if (!email || !password || !hopitalCode) {
      return res.status(400).json({
        success: false,
        error: 'Email, mot de passe et code hôpital requis'
      })
    }

    // Recherche du médecin
    const medecin = await prisma.medecin.findFirst({
      where: {
        email: email.toLowerCase(),
        hopital: {
          code: hopitalCode
        },
        isActive: true
      },
      include: {
        hopital: {
          select: {
            nom: true,
            code: true
          }
        }
      }
    })

    if (!medecin) {
      return res.status(401).json({
        success: false,
        error: 'Identifiants invalides'
      })
    }

    // En production, vérifier le hash du mot de passe avec bcrypt
    // Pour la démo, on accepte tous les mots de passe
    const isPasswordValid = true // await bcrypt.compare(password, medecin.passwordHash)

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Identifiants invalides'
      })
    }

    // Mise à jour de la dernière connexion
    await prisma.medecin.update({
      where: { id: medecin.id },
      data: { lastLogin: new Date() }
    })

    // Génération du token JWT (simulation)
    const token = `jwt_token_${medecin.id}_${Date.now()}`

    return res.json({
      success: true,
      data: {
        token,
        medecin: {
          id: medecin.id,
          medecinId: medecin.medecinId,
          nom: medecin.nom,
          prenom: medecin.prenom,
          email: medecin.email,
          specialite: medecin.specialite,
          service: medecin.service,
          hopital: medecin.hopital,
          lastLogin: medecin.lastLogin
        }
      }
    })
  } catch (error) {
    console.error('Erreur authentification médecin:', error)
    return res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de l\'authentification'
    })
  }
})

// Routes API
// Route de statistiques
app.get('/api/v1/statistiques/dashboard', async (req, res) => {
  try {
    const stats = await prisma.$transaction([
      prisma.hopital.count(),
      prisma.medecin.count(),
      prisma.patient.count(),
      prisma.consultation.count(),
    ])
    
    return res.json({
      success: true,
      data: {
        totalHopitaux: stats[0],
        totalMedecins: stats[1],
        totalPatients: stats[2],
        totalConsultations: stats[3],
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Erreur récupération stats:', error)
    return res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des statistiques'
    })
  }
})

// Routes Hedera simplifiées pour les tests - v2
app.get('/api/hedera/health', (req, res) => {
  return res.json({
    success: true,
    message: 'Service Hedera opérationnel - v2',
    timestamp: new Date().toISOString(),
    version: '2.0'
  });
});

app.get('/api/hedera/contracts', (req, res) => {
  return res.json({
    success: true,
    contracts: {
      patientIdentity: process.env.PATIENT_IDENTITY_CONTRACT_ID || '0.0.6853950',
      accessControl: process.env.ACCESS_CONTROL_CONTRACT_ID || '0.0.6853951',
      medicalRecords: process.env.MEDICAL_RECORDS_CONTRACT_ID || '0.0.6853952'
    },
    network: process.env.HEDERA_NETWORK || 'testnet',
    operator: process.env.OPERATOR_ID || '0.0.6853949'
  });
});

app.post('/api/hedera/create-patient', (req, res) => {
  const { personalData, patientAddress } = req.body;

  // Simulation de création de patient
  return res.json({
    success: true,
    patientId: Math.floor(Math.random() * 10000),
    transactionId: `0.0.${Date.now()}`,
    message: 'Patient créé avec succès (simulation)',
    data: {
      personalData,
      patientAddress,
      timestamp: Math.floor(Date.now() / 1000)
    }
  });
});

app.get('/api/hedera/patient/:id', (req, res) => {
  const patientId = req.params.id;

  // Simulation de récupération de patient
  return res.json({
    success: true,
    patient: {
      patientId: parseInt(patientId),
      encryptedPersonalData: 'encrypted_data_simulation',
      patientAddress: '0x1234567890123456789012345678901234567890',
      isActive: true,
      creationDate: Math.floor(Date.now() / 1000),
      metadataHash: 'metadata_hash_simulation'
    }
  });
});

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
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

// Export pour Vercel
module.exports = async function handler(req, res) {
  // Log des variables d'environnement (sans les valeurs sensibles)
  console.log('🔍 Vercel handler called:', {
    method: req.method,
    url: req.url,
    hasDBUrl: !!process.env.DATABASE_URL,
    nodeEnv: process.env.NODE_ENV
  })
  
  // Initialisation de Prisma si nécessaire
  try {
    await prisma.$connect()
    console.log('✅ Database connected successfully')
  } catch (error) {
    console.error('❌ Database connection error:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    })
  }
  
  return app(req, res)
}
