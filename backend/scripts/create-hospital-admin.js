const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createHospitalAdmin() {
  console.log('🏥 Création de l\'administrateur hôpital...');
  console.log('===========================================');
  
  try {
    // Vérifier si l'hôpital CHU-MEL existe
    let hopital = await prisma.hopital.findUnique({
      where: { code: 'CHU-MEL' }
    });

    if (!hopital) {
      console.log('🏗️  Création de l\'hôpital CHU-MEL...');
      hopital = await prisma.hopital.create({
        data: {
          code: 'CHU-MEL',
          nom: 'CHU Mère-Enfant Lagune',
          ville: 'Cotonou',
          adresse: 'Lagune, Cotonou, Bénin',
          telephone: '+229 21 30 30 30',
          email: 'contact@chu-mel.bj',
          directeur: 'Prof. AGBODJAN Koffi',
          isActive: true
        }
      });
      console.log('✅ Hôpital CHU-MEL créé avec succès');
    } else {
      console.log('✅ Hôpital CHU-MEL trouvé');
    }

    // Vérifier si l'admin existe déjà
    const existingAdmin = await prisma.hospitalAdmin.findUnique({
      where: { adminId: 'ADMIN-CHU-001' }
    });

    if (existingAdmin) {
      console.log('⚠️  L\'administrateur ADMIN-CHU-001 existe déjà');
      
      // Mettre à jour le mot de passe
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash('admin123', saltRounds);
      
      await prisma.hospitalAdmin.update({
        where: { id: existingAdmin.id },
        data: { passwordHash }
      });
      
      console.log('🔄 Mot de passe mis à jour pour ADMIN-CHU-001');
    } else {
      // Créer l'administrateur
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash('admin123', saltRounds);

      const admin = await prisma.hospitalAdmin.create({
        data: {
          adminId: 'ADMIN-CHU-001',
          nom: 'ADMINISTRATEUR',
          prenom: 'Système',
          email: 'admin@chu-mel.bj',
          telephone: '+229 97 00 00 01',
          passwordHash,
          hopitalId: hopital.id,
          role: 'super_admin',
          isActive: true
        }
      });

      console.log('✅ Administrateur créé avec succès:');
      console.log(`   ID: ${admin.adminId}`);
      console.log(`   Nom: ${admin.prenom} ${admin.nom}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Rôle: ${admin.role}`);
    }

    // Test d'authentification
    console.log('\n🧪 Test d\'authentification...');
    const admin = await prisma.hospitalAdmin.findUnique({
      where: { adminId: 'ADMIN-CHU-001' },
      include: {
        hopital: {
          select: {
            nom: true,
            code: true,
            ville: true
          }
        }
      }
    });

    if (admin) {
      const isValid = await bcrypt.compare('admin123', admin.passwordHash);
      const status = isValid ? '✅' : '❌';
      console.log(`${status} Test authentification: ${admin.adminId}`);
      console.log(`   Hôpital: ${admin.hopital.nom}`);
      console.log(`   Mot de passe: admin123`);
    }

    console.log('\n🎉 Configuration terminée avec succès !');
    console.log('\n📋 INFORMATIONS DE CONNEXION:');
    console.log('   ID Admin: ADMIN-CHU-001');
    console.log('   Mot de passe: admin123');
    console.log('   URL: http://localhost:3000/hospital/login');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Créer d'autres administrateurs pour différents hôpitaux
async function createAdditionalAdmins() {
  console.log('\n🏥 Création d\'administrateurs supplémentaires...');
  
  try {
    // CNHU-HKM
    let cnhu = await prisma.hopital.findUnique({
      where: { code: 'CNHU-HKM' }
    });

    if (!cnhu) {
      cnhu = await prisma.hopital.create({
        data: {
          code: 'CNHU-HKM',
          nom: 'CNHU Hubert Koutoukou Maga',
          ville: 'Cotonou',
          adresse: 'Avenue Clozel, Cotonou, Bénin',
          telephone: '+229 21 30 05 00',
          email: 'contact@cnhu-hkm.bj',
          directeur: 'Prof. HOUNKPATIN Benjamin',
          isActive: true
        }
      });
    }

    // Admin CNHU
    const existingCnhuAdmin = await prisma.hospitalAdmin.findUnique({
      where: { adminId: 'ADMIN-CNHU-001' }
    });

    if (!existingCnhuAdmin) {
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash('cnhu123', saltRounds);

      await prisma.hospitalAdmin.create({
        data: {
          adminId: 'ADMIN-CNHU-001',
          nom: 'ADMIN',
          prenom: 'CNHU',
          email: 'admin@cnhu-hkm.bj',
          telephone: '+229 97 00 00 02',
          passwordHash,
          hopitalId: cnhu.id,
          role: 'admin',
          isActive: true
        }
      });

      console.log('✅ Administrateur CNHU créé: ADMIN-CNHU-001 / cnhu123');
    }

  } catch (error) {
    console.error('❌ Erreur création admins supplémentaires:', error);
  }
}

// Exécuter le script
async function main() {
  await createHospitalAdmin();
  await createAdditionalAdmins();
}

if (require.main === module) {
  main();
}

module.exports = {
  createHospitalAdmin,
  createAdditionalAdmins
};
