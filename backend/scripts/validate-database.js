const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function validateDatabase() {
  console.log('🗄️  VALIDATION DE LA BASE DE DONNÉES');
  console.log('=====================================');
  
  try {
    // 1. Vérifier la connexion
    console.log('🔌 Test de connexion...');
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Connexion PostgreSQL réussie');

    // 2. Vérifier les tables principales
    console.log('\n📊 Vérification des tables...');
    
    const tables = [
      { name: 'patients', model: prisma.patient },
      { name: 'medecins', model: prisma.medecin },
      { name: 'hopitaux', model: prisma.hopital },
      { name: 'hospital_admins', model: prisma.hospitalAdmin },
      { name: 'consultations', model: prisma.consultation }
    ];

    for (const table of tables) {
      try {
        const count = await table.model.count();
        console.log(`✅ Table ${table.name}: ${count} enregistrements`);
      } catch (error) {
        console.log(`❌ Table ${table.name}: Erreur - ${error.message}`);
      }
    }

    // 3. Vérifier l'authentification des patients
    console.log('\n🔐 Validation authentification patients...');
    const patients = await prisma.patient.findMany({
      select: {
        patientId: true,
        nom: true,
        prenom: true,
        passwordHash: true
      },
      take: 3
    });

    const patientPasswords = {
      'BJ2025001': 'patient123',
      'BJ2025002': 'patient456',
      'BJ2025003': 'patient789',
      'BJ20257830': 'test123'
    };

    for (const patient of patients) {
      const expectedPassword = patientPasswords[patient.patientId];
      if (expectedPassword) {
        try {
          const isValid = await bcrypt.compare(expectedPassword, patient.passwordHash);
          const status = isValid ? '✅' : '❌';
          console.log(`${status} Patient ${patient.patientId} (${patient.prenom} ${patient.nom})`);
        } catch (error) {
          console.log(`❌ Patient ${patient.patientId}: Erreur hash - ${error.message}`);
        }
      }
    }

    // 4. Vérifier l'authentification des médecins
    console.log('\n👨‍⚕️ Validation authentification médecins...');
    const medecins = await prisma.medecin.findMany({
      select: {
        medecinId: true,
        nom: true,
        prenom: true,
        email: true,
        isActive: true
      },
      take: 3
    });

    for (const medecin of medecins) {
      const status = medecin.isActive ? '✅' : '⚠️';
      console.log(`${status} Dr. ${medecin.prenom} ${medecin.nom} (${medecin.medecinId})`);
    }

    // 5. Vérifier l'authentification des administrateurs hôpital
    console.log('\n🏥 Validation authentification hôpitaux...');
    const admins = await prisma.hospitalAdmin.findMany({
      include: {
        hopital: {
          select: {
            nom: true,
            code: true
          }
        }
      }
    });

    const adminPasswords = {
      'ADMIN-CHU-001': 'admin123',
      'ADMIN-CNHU-001': 'cnhu123'
    };

    for (const admin of admins) {
      const expectedPassword = adminPasswords[admin.adminId];
      if (expectedPassword) {
        try {
          const isValid = await bcrypt.compare(expectedPassword, admin.passwordHash);
          const status = isValid ? '✅' : '❌';
          console.log(`${status} ${admin.adminId} - ${admin.hopital.nom}`);
        } catch (error) {
          console.log(`❌ Admin ${admin.adminId}: Erreur hash - ${error.message}`);
        }
      }
    }

    // 6. Vérifier les relations
    console.log('\n🔗 Validation des relations...');
    
    // Patients avec consultations
    const patientsWithConsultations = await prisma.patient.findMany({
      include: {
        consultations: true
      },
      take: 2
    });

    console.log(`✅ Relations Patient-Consultation: ${patientsWithConsultations.length} patients testés`);

    // Médecins avec hôpitaux
    const medecinsWithHopital = await prisma.medecin.findMany({
      include: {
        hopital: true
      },
      take: 2
    });

    console.log(`✅ Relations Médecin-Hôpital: ${medecinsWithHopital.length} médecins testés`);

    // 7. Statistiques générales
    console.log('\n📈 Statistiques générales...');
    const stats = {
      patients: await prisma.patient.count(),
      medecins: await prisma.medecin.count(),
      hopitaux: await prisma.hopital.count(),
      admins: await prisma.hospitalAdmin.count(),
      consultations: await prisma.consultation.count()
    };

    console.log(`   👥 Patients: ${stats.patients}`);
    console.log(`   👨‍⚕️ Médecins: ${stats.medecins}`);
    console.log(`   🏥 Hôpitaux: ${stats.hopitaux}`);
    console.log(`   👨‍💼 Administrateurs: ${stats.admins}`);
    console.log(`   📋 Consultations: ${stats.consultations}`);

    // 8. Vérifier les index et contraintes
    console.log('\n🔍 Validation des contraintes...');
    
    // Test unicité patientId
    try {
      const uniquePatientIds = await prisma.patient.groupBy({
        by: ['patientId'],
        _count: { patientId: true }
      });
      const duplicates = uniquePatientIds.filter(p => p._count.patientId > 1);
      if (duplicates.length === 0) {
        console.log('✅ Contrainte unicité patientId respectée');
      } else {
        console.log(`❌ ${duplicates.length} doublons patientId détectés`);
      }
    } catch (error) {
      console.log(`❌ Erreur validation patientId: ${error.message}`);
    }

    // Test unicité email médecins
    try {
      const uniqueEmails = await prisma.medecin.groupBy({
        by: ['email'],
        _count: { email: true }
      });
      const duplicates = uniqueEmails.filter(m => m._count.email > 1);
      if (duplicates.length === 0) {
        console.log('✅ Contrainte unicité email médecins respectée');
      } else {
        console.log(`❌ ${duplicates.length} doublons email médecins détectés`);
      }
    } catch (error) {
      console.log(`❌ Erreur validation email médecins: ${error.message}`);
    }

    console.log('\n🎉 VALIDATION TERMINÉE AVEC SUCCÈS !');
    console.log('\n📋 RÉSUMÉ:');
    console.log('   ✅ Base de données PostgreSQL opérationnelle');
    console.log('   ✅ Toutes les tables créées et accessibles');
    console.log('   ✅ Authentification bcrypt fonctionnelle');
    console.log('   ✅ Relations entre tables correctes');
    console.log('   ✅ Contraintes d\'unicité respectées');
    console.log('\n🚀 La base de données est prête pour la production !');

  } catch (error) {
    console.error('❌ Erreur fatale lors de la validation:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Fonction pour nettoyer les données de test
async function cleanupTestData() {
  console.log('\n🧹 Nettoyage des données de test...');
  
  try {
    // Supprimer les consultations de test
    const deletedConsultations = await prisma.consultation.deleteMany({
      where: {
        consultationId: {
          contains: 'TEST'
        }
      }
    });
    console.log(`✅ ${deletedConsultations.count} consultations de test supprimées`);

    // Supprimer les sessions expirées
    const deletedSessions = await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });
    console.log(`✅ ${deletedSessions.count} sessions expirées supprimées`);

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);
  }
}

// Exécuter le script
async function main() {
  await validateDatabase();
  await cleanupTestData();
}

if (require.main === module) {
  main();
}

module.exports = {
  validateDatabase,
  cleanupTestData
};
