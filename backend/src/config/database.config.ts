import { PrismaClient } from '@prisma/client'
import { config } from './app.config'

// Configuration Prisma avec logging conditionnel et pool optimisé
const prisma = new PrismaClient({
  log: config.NODE_ENV === 'development' 
    ? ['warn', 'error'] // Réduit les logs en dev pour éviter le spam
    : ['error'],
  errorFormat: 'pretty',
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

// Gestion de la connexion avec retry
export const connectDatabase = async (): Promise<void> => {
  let retries = 3
  while (retries > 0) {
    try {
      await prisma.$connect()
      console.log('✅ Base de données connectée avec succès')
      
      // Test de connexion
      await prisma.$queryRaw`SELECT 1`
      console.log('✅ Test de connexion réussi')
      return
    } catch (error) {
      retries--
      console.error(`❌ Erreur de connexion à la base de données (tentatives restantes: ${retries}):`, error)
      
      if (retries === 0) {
        console.error('❌ Impossible de se connecter à la base de données après 3 tentatives')
        // Ne pas faire exit(1) en dev pour permettre de continuer
        if (config.NODE_ENV === 'production') {
          process.exit(1)
        }
      } else {
        // Attendre avant de réessayer
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }
  }
}

// Gestion de la déconnexion
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect()
    console.log('✅ Base de données déconnectée')
  } catch (error) {
    console.error('❌ Erreur lors de la déconnexion:', error)
  }
}

// Gestion graceful shutdown
process.on('SIGINT', async () => {
  await disconnectDatabase()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await disconnectDatabase()
  process.exit(0)
})

export { prisma }
export default prisma
