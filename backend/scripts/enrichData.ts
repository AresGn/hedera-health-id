import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function enrichData() {
  console.log('🔄 Enrichissement des données...')

  try {
    // Ajouter plus de patients
    const newPatients = [
      {
        patientId: 'PAT-CHU-004',
        nom: 'KOUASSI',
        prenom: 'Marie',
        dateNaissance: new Date('1978-05-15'),
        telephone: '+229 97 44 44 44',
        ville: 'Cotonou',
        hopitalPrincipal: 'CHU-MEL',
        groupeSanguin: 'A+',
        allergies: ['Pénicilline', 'Arachides'],
        maladiesChroniques: ['Hypertension'],
        contactUrgence: '+229 97 55 55 55',
        isActive: true
      },
      {
        patientId: 'PAT-CHU-005',
        nom: 'DOSSOU',
        prenom: 'Jean',
        dateNaissance: new Date('1991-08-22'),
        telephone: '+229 97 66 66 66',
        ville: 'Porto-Novo',
        hopitalPrincipal: 'CHU-MEL',
        groupeSanguin: 'O-',
        allergies: [],
        maladiesChroniques: [],
        contactUrgence: '+229 97 77 77 77',
        isActive: true
      },
      {
        patientId: 'PAT-CHU-006',
        nom: 'AGBODJAN',
        prenom: 'Fatou',
        dateNaissance: new Date('1995-12-03'),
        telephone: '+229 97 88 88 88',
        ville: 'Cotonou',
        hopitalPrincipal: 'CHU-MEL',
        groupeSanguin: 'B+',
        allergies: ['Latex'],
        maladiesChroniques: ['Asthme'],
        contactUrgence: '+229 97 99 99 99',
        isActive: true
      },
      {
        patientId: 'PAT-CHU-007',
        nom: 'TOSSOU',
        prenom: 'Paul',
        dateNaissance: new Date('1956-03-18'),
        telephone: '+229 97 10 10 10',
        ville: 'Abomey-Calavi',
        hopitalPrincipal: 'CHU-MEL',
        groupeSanguin: 'AB+',
        allergies: ['Iode'],
        maladiesChroniques: ['Diabète Type 2', 'Hypertension'],
        contactUrgence: '+229 97 20 20 20',
        isActive: true
      },
      {
        patientId: 'PAT-CNHU-003',
        nom: 'GBAGUIDI',
        prenom: 'Sylvie',
        dateNaissance: new Date('1985-07-11'),
        telephone: '+229 97 30 30 30',
        ville: 'Cotonou',
        hopitalPrincipal: 'CNHU-HKM',
        groupeSanguin: 'A-',
        allergies: ['Aspirine'],
        maladiesChroniques: [],
        contactUrgence: '+229 97 40 40 40',
        isActive: true
      }
    ]

    for (const patient of newPatients) {
      await prisma.patient.create({
        data: patient
      })
      console.log(`✅ Patient créé: ${patient.prenom} ${patient.nom}`)
    }

    // Ajouter des consultations
    const patients = await prisma.patient.findMany()
    const medecins = await prisma.medecin.findMany()

    const consultations = [
      {
        consultationId: 'CONS-001',
        patientId: patients[0].id,
        medecinId: medecins[0].id,
        dateConsultation: new Date('2025-09-15T09:30:00'),
        motifConsultation: 'Contrôle de routine',
        symptomes: ['Fatigue légère'],
        diagnostic: 'Bilan de santé normal',
        traitement: 'Repos et hydratation',
        prescriptions: [
          {
            medicament: 'Paracétamol 500mg',
            posologie: '1 comprimé 3 fois par jour',
            duree: '3 jours'
          }
        ],
        examensComplementaires: ['Prise de sang'],
        donneesVitales: {
          tension: '120/80',
          pouls: '72',
          temperature: '36.8',
          poids: '65',
          taille: '165'
        },
        notes: 'Patient en bonne santé générale',
        statut: 'terminee'
      },
      {
        consultationId: 'CONS-002',
        patientId: patients[1].id,
        medecinId: medecins[1].id,
        dateConsultation: new Date('2025-09-16T10:00:00'),
        motifConsultation: 'Douleurs abdominales',
        symptomes: ['Douleur abdominale', 'Nausées'],
        diagnostic: 'Gastrite légère',
        traitement: 'Régime alimentaire adapté',
        prescriptions: [
          {
            medicament: 'Oméprazole 20mg',
            posologie: '1 comprimé le matin à jeun',
            duree: '7 jours'
          }
        ],
        examensComplementaires: ['Échographie abdominale'],
        donneesVitales: {
          tension: '110/70',
          pouls: '68',
          temperature: '37.1',
          poids: '70',
          taille: '175'
        },
        notes: 'Éviter les aliments épicés',
        statut: 'terminee'
      },
      {
        consultationId: 'CONS-003',
        patientId: patients[2].id,
        medecinId: medecins[2].id,
        dateConsultation: new Date('2025-09-16T14:30:00'),
        motifConsultation: 'Crise d\'asthme',
        symptomes: ['Difficultés respiratoires', 'Toux sèche'],
        diagnostic: 'Exacerbation asthmatique légère',
        traitement: 'Bronchodilatateurs et corticoïdes',
        prescriptions: [
          {
            medicament: 'Ventoline (Salbutamol)',
            posologie: '2 bouffées si besoin',
            duree: 'En cas de crise'
          },
          {
            medicament: 'Prednisolone 20mg',
            posologie: '1 comprimé par jour',
            duree: '5 jours'
          }
        ],
        examensComplementaires: ['Spirométrie'],
        donneesVitales: {
          tension: '115/75',
          pouls: '85',
          temperature: '36.9',
          poids: '58',
          taille: '160'
        },
        notes: 'Éviter les allergènes connus',
        statut: 'en_cours'
      }
    ]

    for (const consultation of consultations) {
      await prisma.consultation.create({
        data: consultation
      })
      console.log(`✅ Consultation créée: ${consultation.consultationId}`)
    }

    // Ajouter des rendez-vous
    const rendezVous = [
      {
        rdvId: 'RDV-001',
        patientId: patients[0].id,
        medecinId: medecins[0].id,
        dateRdv: new Date('2025-09-17T09:00:00'),
        motif: 'Suivi post-consultation',
        statut: 'confirme',
        notes: 'Contrôle des résultats d\'analyses'
      },
      {
        rdvId: 'RDV-002',
        patientId: patients[3].id,
        medecinId: medecins[0].id,
        dateRdv: new Date('2025-09-17T10:30:00'),
        motif: 'Consultation diabète',
        statut: 'en_attente',
        notes: 'Ajustement du traitement'
      },
      {
        rdvId: 'RDV-003',
        patientId: patients[4].id,
        medecinId: medecins[2].id,
        dateRdv: new Date('2025-09-17T14:00:00'),
        motif: 'Urgence',
        statut: 'urgent',
        notes: 'Douleurs thoraciques'
      }
    ]

    for (const rdv of rendezVous) {
      await prisma.rendezVous.create({
        data: rdv
      })
      console.log(`✅ Rendez-vous créé: ${rdv.rdvId}`)
    }

    console.log('🎉 Enrichissement des données terminé avec succès!')

  } catch (error) {
    console.error('❌ Erreur lors de l\'enrichissement:', error)
  } finally {
    await prisma.$disconnect()
  }
}

enrichData()
