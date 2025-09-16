import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addTestData() {
  try {
    console.log('🔄 Ajout de données de test...')

    // Récupérer les médecins et hôpitaux existants
    const medecins = await prisma.medecin.findMany()
    const hopitaux = await prisma.hopital.findMany()
    const patients = await prisma.patient.findMany()

    console.log(`📊 Trouvé: ${medecins.length} médecins, ${hopitaux.length} hôpitaux, ${patients.length} patients`)

    if (medecins.length === 0 || hopitaux.length === 0) {
      console.log('❌ Pas assez de données de base. Veuillez d\'abord exécuter le seed.')
      return
    }

    // Créer quelques patients de test s'il n'y en a pas
    if (patients.length === 0) {
      console.log('👤 Création de patients de test...')
      
      const testPatients = [
        {
          patientId: 'BJ2025001',
          nom: 'KOSSOU',
          prenom: 'Adjoa',
          dateNaissance: new Date('1990-05-15'),
          telephone: '+229 97 11 11 11',
          email: 'adjoa.kossou@email.bj',
          ville: 'Cotonou',
          hopitalPrincipal: 'CHU-MEL',
          passwordHash: '$2b$10$example.hash.for.demo.purposes.only',
          isActive: true
        },
        {
          patientId: 'BJ2025002',
          nom: 'DOSSOU',
          prenom: 'Marie',
          dateNaissance: new Date('1985-08-22'),
          telephone: '+229 97 22 22 22',
          email: 'marie.dossou@email.bj',
          ville: 'Porto-Novo',
          hopitalPrincipal: 'CNHU-HKM',
          passwordHash: '$2b$10$example.hash.for.demo.purposes.only',
          isActive: true
        },
        {
          patientId: 'BJ2025003',
          nom: 'HOUNKPATIN',
          prenom: 'Jean',
          dateNaissance: new Date('1978-12-03'),
          telephone: '+229 97 33 33 33',
          email: 'jean.hounkpatin@email.bj',
          ville: 'Parakou',
          hopitalPrincipal: 'CHU-MEL',
          passwordHash: '$2b$10$example.hash.for.demo.purposes.only',
          isActive: true
        }
      ]

      for (const patientData of testPatients) {
        await prisma.patient.create({ data: patientData })
        console.log(`✅ Patient créé: ${patientData.prenom} ${patientData.nom}`)
      }
    }

    // Récupérer les patients (nouveaux ou existants)
    const allPatients = await prisma.patient.findMany()
    
    // Créer des consultations de test
    console.log('🏥 Création de consultations de test...')
    
    const testConsultations = [
      {
        consultationId: 'CONS-2025-001',
        patientId: allPatients[0].id,
        medecinId: medecins[0].id,
        hopitalId: hopitaux[0].id,
        dateConsultation: new Date('2025-01-10T14:30:00Z'),
        type: 'Consultation générale',
        motif: 'Contrôle de routine',
        diagnostic: 'État général satisfaisant',
        statut: 'TERMINEE'
      },
      {
        consultationId: 'CONS-2025-002',
        patientId: allPatients[1] ? allPatients[1].id : allPatients[0].id,
        medecinId: medecins[1] ? medecins[1].id : medecins[0].id,
        hopitalId: hopitaux[0].id,
        dateConsultation: new Date('2025-01-11T10:00:00Z'),
        type: 'Cardiologie',
        motif: 'Suivi cardiologique',
        statut: 'PROGRAMMEE'
      },
      {
        consultationId: 'CONS-2025-003',
        patientId: allPatients[2] ? allPatients[2].id : allPatients[0].id,
        medecinId: medecins[2] ? medecins[2].id : medecins[0].id,
        hopitalId: hopitaux[1] ? hopitaux[1].id : hopitaux[0].id,
        dateConsultation: new Date('2025-01-11T15:45:00Z'),
        type: 'Urgences',
        motif: 'Douleurs abdominales',
        statut: 'EN_COURS'
      },
      {
        consultationId: 'CONS-2025-004',
        patientId: allPatients[0].id,
        medecinId: medecins[0].id,
        hopitalId: hopitaux[0].id,
        dateConsultation: new Date('2025-01-12T09:15:00Z'),
        type: 'Pédiatrie',
        motif: 'Vaccination',
        statut: 'PROGRAMMEE'
      }
    ]

    for (const consultationData of testConsultations) {
      try {
        await prisma.consultation.create({ data: consultationData })
        console.log(`✅ Consultation créée: ${consultationData.consultationId}`)
      } catch (error) {
        console.log(`⚠️ Consultation ${consultationData.consultationId} existe déjà ou erreur:`, error)
      }
    }

    console.log('✅ Données de test ajoutées avec succès!')
    
    // Afficher un résumé
    const finalStats = {
      patients: await prisma.patient.count(),
      medecins: await prisma.medecin.count(),
      consultations: await prisma.consultation.count(),
      hopitaux: await prisma.hopital.count()
    }
    
    console.log('📊 Résumé final:', finalStats)

  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des données de test:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addTestData()
