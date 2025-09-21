#!/usr/bin/env node

/**
 * Script pour s'assurer que la base de données est correctement configurée
 * avec toutes les tables et données nécessaires pour le projet Hedera Health ID
 */

const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Fonction pour afficher des logs colorés
function log(message, color = 'white') {
  const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    reset: '\x1b[0m'
  };
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Fonction pour exécuter des commandes
function execCommand(command, description) {
  try {
    log(`🔄 ${description}...`, 'blue');
    execSync(command, { stdio: 'inherit', cwd: process.cwd() });
    log(`✅ ${description} terminé`, 'green');
  } catch (error) {
    log(`❌ Erreur lors de ${description}: ${error.message}`, 'red');
    throw error;
  }
}

// Fonction pour vérifier l'état de la base de données
async function checkDatabaseState() {
  try {
    log('🔍 Vérification de l\'état de la base de données...', 'cyan');
    
    // Test de connexion
    await prisma.$connect();
    log('✅ Connexion à la base de données réussie', 'green');

    // Vérifier les tables principales
    const stats = {
      hopitaux: await prisma.hopital.count(),
      medecins: await prisma.medecin.count(),
      patients: await prisma.patient.count(),
      consultations: await prisma.consultation.count(),
      permissions: await prisma.permissionMedecin.count()
    };

    log('📊 État actuel de la base de données:', 'cyan');
    log(`   🏥 Hôpitaux: ${stats.hopitaux}`, 'yellow');
    log(`   👨‍⚕️ Médecins: ${stats.medecins}`, 'yellow');
    log(`   👤 Patients: ${stats.patients}`, 'yellow');
    log(`   📋 Consultations: ${stats.consultations}`, 'yellow');
    log(`   🔐 Permissions: ${stats.permissions}`, 'yellow');

    return stats;
  } catch (error) {
    log(`❌ Erreur lors de la vérification: ${error.message}`, 'red');
    return null;
  }
}

// Fonction pour créer des données de test supplémentaires si nécessaire
async function ensureTestData() {
  try {
    log('🌱 Vérification des données de test...', 'cyan');

    // Vérifier si nous avons assez de données de test
    const patientCount = await prisma.patient.count();
    const medecinCount = await prisma.medecin.count();
    const hopitalCount = await prisma.hopital.count();

    if (hopitalCount === 0 || medecinCount === 0 || patientCount === 0) {
      log('⚠️ Données de test insuffisantes, exécution du seeding...', 'yellow');
      execCommand('npm run db:seed', 'Insertion des données de test');
    } else {
      log('✅ Données de test suffisantes présentes', 'green');
    }

    // Créer des consultations de test si nécessaire
    const consultationCount = await prisma.consultation.count();
    if (consultationCount === 0) {
      log('📋 Création de consultations de test...', 'blue');
      await createTestConsultations();
    }

  } catch (error) {
    log(`❌ Erreur lors de la création des données de test: ${error.message}`, 'red');
    throw error;
  }
}

// Fonction pour créer des consultations de test
async function createTestConsultations() {
  try {
    const patients = await prisma.patient.findMany({ take: 3 });
    const medecins = await prisma.medecin.findMany({ take: 3 });
    const hopitaux = await prisma.hopital.findMany({ take: 3 });

    if (patients.length === 0 || medecins.length === 0 || hopitaux.length === 0) {
      log('⚠️ Pas assez de données pour créer des consultations', 'yellow');
      return;
    }

    const testConsultations = [
      {
        consultationId: 'CONS-2025-001',
        patientId: patients[0].id,
        medecinId: medecins[0].id,
        hopitalId: hopitaux[0].id,
        dateConsultation: new Date('2025-01-15'),
        type: 'Consultation générale',
        motif: 'Contrôle de routine',
        diagnostic: 'État général satisfaisant',
        statut: 'TERMINEE',
        notes: 'Patient en bonne santé générale'
      },
      {
        consultationId: 'CONS-2025-002',
        patientId: patients[1].id,
        medecinId: medecins[1].id,
        hopitalId: hopitaux[1].id,
        dateConsultation: new Date('2025-01-20'),
        type: 'Suivi cardiologique',
        motif: 'Suivi hypertension',
        diagnostic: 'Hypertension contrôlée',
        statut: 'TERMINEE',
        notes: 'Continuer le traitement actuel'
      },
      {
        consultationId: 'CONS-2025-003',
        patientId: patients[2].id,
        medecinId: medecins[2].id,
        hopitalId: hopitaux[2].id,
        dateConsultation: new Date('2025-01-25'),
        type: 'Consultation pédiatrique',
        motif: 'Vaccination',
        statut: 'PROGRAMMEE',
        notes: 'Vaccination de routine prévue'
      }
    ];

    for (const consultation of testConsultations) {
      try {
        await prisma.consultation.create({ data: consultation });
        log(`✅ Consultation créée: ${consultation.consultationId}`, 'green');
      } catch (error) {
        if (error.code === 'P2002') {
          log(`⚠️ Consultation ${consultation.consultationId} existe déjà`, 'yellow');
        } else {
          throw error;
        }
      }
    }
  } catch (error) {
    log(`❌ Erreur lors de la création des consultations: ${error.message}`, 'red');
    throw error;
  }
}

// Fonction principale
async function main() {
  try {
    log('🚀 Démarrage de la vérification de la base de données...', 'magenta');
    log('================================================', 'magenta');

    // 1. Générer le client Prisma
    execCommand('npx prisma generate', 'Génération du client Prisma');

    // 2. Pousser le schéma vers la base de données (sans migration)
    execCommand('npx prisma db push', 'Synchronisation du schéma avec la base de données');

    // 3. Vérifier l'état de la base de données
    const initialStats = await checkDatabaseState();
    
    if (!initialStats) {
      throw new Error('Impossible de se connecter à la base de données');
    }

    // 4. S'assurer que les données de test sont présentes
    await ensureTestData();

    // 5. Vérification finale
    log('\n🔍 Vérification finale...', 'cyan');
    const finalStats = await checkDatabaseState();

    log('\n🎉 Configuration de la base de données terminée avec succès !', 'green');
    log('================================================', 'green');
    log('📊 Pour explorer la base de données:', 'cyan');
    log('   npm run db:studio', 'yellow');
    log('\n🚀 Pour démarrer le serveur:', 'cyan');
    log('   npm run dev', 'yellow');
    log('\n🧪 Pour tester l\'API:', 'cyan');
    log('   npm run db:test', 'yellow');

  } catch (error) {
    log(`❌ Erreur lors de la configuration: ${error.message}`, 'red');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
if (require.main === module) {
  main();
}

module.exports = { main, checkDatabaseState, ensureTestData };
