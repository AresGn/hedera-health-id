#!/usr/bin/env node

/**
 * Script de test de connexion à la base de données Neon
 * Vérifie que la connexion fonctionne et affiche les statistiques
 */

const { PrismaClient } = require('@prisma/client');
const path = require('path');

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testConnection() {
  log('🔍 Test de connexion à la base de données Neon', 'cyan');
  log('==============================================', 'cyan');

  // Charger les variables d'environnement
  require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

  if (!process.env.DATABASE_URL) {
    log('❌ Variable DATABASE_URL non définie', 'red');
    process.exit(1);
  }

  const prisma = new PrismaClient({
    log: ['error'],
  });

  try {
    // Test de connexion basique
    log('🔄 Test de connexion...', 'blue');
    await prisma.$connect();
    log('✅ Connexion à la base de données réussie', 'green');

    // Test de requête simple
    log('🔄 Test de requête...', 'blue');
    const result = await prisma.$queryRaw`SELECT NOW() as current_time, version() as db_version`;
    log('✅ Requête de test réussie', 'green');
    
    if (result && result[0]) {
      log(`📅 Heure serveur: ${result[0].current_time}`, 'yellow');
      log(`🗄️  Version PostgreSQL: ${result[0].db_version.split(' ')[0]} ${result[0].db_version.split(' ')[1]}`, 'yellow');
    }

    // Statistiques des tables
    log('\n📊 Statistiques des tables:', 'cyan');
    
    try {
      const hopitauxCount = await prisma.hopital.count();
      const medecinsCount = await prisma.medecin.count();
      const patientsCount = await prisma.patient.count();
      const consultationsCount = await prisma.consultation.count();
      const permissionsCount = await prisma.permissionMedecin.count();

      log(`🏥 Hôpitaux: ${hopitauxCount}`, 'yellow');
      log(`👨‍⚕️ Médecins: ${medecinsCount}`, 'yellow');
      log(`👤 Patients: ${patientsCount}`, 'yellow');
      log(`📋 Consultations: ${consultationsCount}`, 'yellow');
      log(`🔐 Permissions: ${permissionsCount}`, 'yellow');

      if (hopitauxCount === 0 && medecinsCount === 0 && patientsCount === 0) {
        log('\n⚠️  Aucune donnée trouvée. Exécutez le seeding:', 'yellow');
        log('   npm run db:seed', 'cyan');
      } else {
        log('\n✅ Base de données configurée et peuplée', 'green');
      }

    } catch (tableError) {
      log('⚠️  Tables non créées. Exécutez les migrations:', 'yellow');
      log('   npm run db:push', 'cyan');
    }

    // Test de performance
    log('\n🚀 Test de performance...', 'blue');
    const startTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const endTime = Date.now();
    const latency = endTime - startTime;
    
    if (latency < 100) {
      log(`⚡ Latence: ${latency}ms (Excellente)`, 'green');
    } else if (latency < 300) {
      log(`🟡 Latence: ${latency}ms (Bonne)`, 'yellow');
    } else {
      log(`🔴 Latence: ${latency}ms (Lente)`, 'red');
    }

    log('\n🎉 Test de connexion terminé avec succès !', 'green');

  } catch (error) {
    log('❌ Erreur de connexion:', 'red');
    log(error.message, 'red');
    
    if (error.message.includes('ENOTFOUND')) {
      log('\n💡 Suggestions:', 'yellow');
      log('   - Vérifiez votre connexion internet', 'cyan');
      log('   - Vérifiez l\'URL de la base de données dans .env', 'cyan');
    } else if (error.message.includes('authentication')) {
      log('\n💡 Suggestions:', 'yellow');
      log('   - Vérifiez les identifiants dans DATABASE_URL', 'cyan');
      log('   - Vérifiez que la base de données Neon est active', 'cyan');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Gestion des signaux
process.on('SIGINT', async () => {
  log('\n⚠️  Test interrompu par l\'utilisateur', 'yellow');
  process.exit(0);
});

// Exécution du script
if (require.main === module) {
  testConnection().catch((error) => {
    log(`❌ Erreur fatale: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { testConnection };
