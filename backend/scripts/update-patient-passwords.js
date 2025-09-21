const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

// Mots de passe par défaut pour les patients existants
const DEFAULT_PASSWORDS = {
  'BJ2025001': 'patient123', // Adjoa KOSSOU
  'BJ2025002': 'patient456', // Marie DOSSOU  
  'BJ2025003': 'patient789', // Jean HOUNKPATIN
  'BJ20257830': 'test123'    // Patient Test
};

async function updatePatientPasswords() {
  console.log('🔐 Mise à jour des mots de passe des patients...');
  console.log('================================================');
  
  try {
    // Récupérer tous les patients
    const patients = await prisma.patient.findMany({
      select: {
        id: true,
        patientId: true,
        nom: true,
        prenom: true,
        passwordHash: true
      }
    });

    console.log(`📊 ${patients.length} patients trouvés`);

    let updatedCount = 0;
    let errorCount = 0;

    for (const patient of patients) {
      try {
        // Forcer la mise à jour de tous les patients pour assurer la cohérence
        console.log(`🔄 Mise à jour forcée pour ${patient.patientId} (${patient.prenom} ${patient.nom})`);

        // Vérifier si le patient a déjà un hash valide (pas un hash temporaire)
        // const hasValidHash = patient.passwordHash &&
        //                     !patient.passwordHash.startsWith('temp_hash_') &&
        //                     patient.passwordHash.length > 20;

        // if (hasValidHash) {
        //   console.log(`⏭️  ${patient.patientId} (${patient.prenom} ${patient.nom}) - Hash déjà valide`);
        //   continue;
        // }

        // Obtenir le mot de passe par défaut
        const defaultPassword = DEFAULT_PASSWORDS[patient.patientId] || 'patient123';
        
        // Hacher le mot de passe
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(defaultPassword, saltRounds);

        // Mettre à jour le patient
        await prisma.patient.update({
          where: { id: patient.id },
          data: { passwordHash }
        });

        console.log(`✅ ${patient.patientId} (${patient.prenom} ${patient.nom}) - Mot de passe: "${defaultPassword}"`);
        updatedCount++;

      } catch (error) {
        console.error(`❌ Erreur pour ${patient.patientId}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n================================================');
    console.log('📊 RÉSUMÉ DE LA MISE À JOUR:');
    console.log(`   ✅ Patients mis à jour: ${updatedCount}`);
    console.log(`   ❌ Erreurs: ${errorCount}`);
    console.log(`   📝 Total traité: ${patients.length}`);

    if (updatedCount > 0) {
      console.log('\n🔑 MOTS DE PASSE PAR DÉFAUT:');
      Object.entries(DEFAULT_PASSWORDS).forEach(([patientId, password]) => {
        console.log(`   ${patientId}: "${password}"`);
      });
    }

    console.log('\n🎉 Mise à jour terminée avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur fatale:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Fonction pour tester l'authentification
async function testAuthentication() {
  console.log('\n🧪 Test d\'authentification...');
  console.log('================================');

  try {
    for (const [patientId, password] of Object.entries(DEFAULT_PASSWORDS)) {
      const patient = await prisma.patient.findUnique({
        where: { patientId },
        select: { passwordHash: true, nom: true, prenom: true }
      });

      if (patient) {
        const isValid = await bcrypt.compare(password, patient.passwordHash);
        const status = isValid ? '✅' : '❌';
        console.log(`${status} ${patientId} (${patient.prenom} ${patient.nom}) - "${password}"`);
      }
    }
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Exécuter le script
async function main() {
  await updatePatientPasswords();
  await testAuthentication();
}

if (require.main === module) {
  main();
}

module.exports = {
  updatePatientPasswords,
  testAuthentication,
  DEFAULT_PASSWORDS
};
