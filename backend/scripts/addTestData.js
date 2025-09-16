const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3001/api/v1';

async function addTestData() {
  console.log('🔄 Ajout de données de test...');

  try {
    // Ajouter des patients via l'API
    const patients = [
      {
        patientId: 'PAT-CHU-004',
        nom: 'KOUASSI',
        prenom: 'Marie',
        dateNaissance: '1978-05-15',
        telephone: '+229 97 44 44 44',
        email: 'm.kouassi@gmail.com',
        ville: 'Cotonou',
        groupeSanguin: 'A+',
        allergies: ['Pénicilline', 'Arachides'],
        maladiesChroniques: ['Hypertension'],
        contactUrgence: '+229 97 55 55 55',
        password: 'password123'
      },
      {
        patientId: 'PAT-CHU-005',
        nom: 'DOSSOU',
        prenom: 'Jean',
        dateNaissance: '1991-08-22',
        telephone: '+229 97 66 66 66',
        email: 'j.dossou@gmail.com',
        ville: 'Porto-Novo',
        groupeSanguin: 'O-',
        allergies: [],
        maladiesChroniques: [],
        contactUrgence: '+229 97 77 77 77',
        password: 'password123'
      },
      {
        patientId: 'PAT-CHU-006',
        nom: 'AGBODJAN',
        prenom: 'Fatou',
        dateNaissance: '1995-12-03',
        telephone: '+229 97 88 88 88',
        email: 'f.agbodjan@gmail.com',
        ville: 'Cotonou',
        groupeSanguin: 'B+',
        allergies: ['Latex'],
        maladiesChroniques: ['Asthme'],
        contactUrgence: '+229 97 99 99 99',
        password: 'password123'
      },
      {
        patientId: 'PAT-CHU-007',
        nom: 'TOSSOU',
        prenom: 'Paul',
        dateNaissance: '1956-03-18',
        telephone: '+229 97 10 10 10',
        email: 'p.tossou@gmail.com',
        ville: 'Abomey-Calavi',
        groupeSanguin: 'AB+',
        allergies: ['Iode'],
        maladiesChroniques: ['Diabète Type 2', 'Hypertension'],
        contactUrgence: '+229 97 20 20 20',
        password: 'password123'
      },
      {
        patientId: 'PAT-CNHU-003',
        nom: 'GBAGUIDI',
        prenom: 'Sylvie',
        dateNaissance: '1985-07-11',
        telephone: '+229 97 30 30 30',
        email: 's.gbaguidi@gmail.com',
        ville: 'Cotonou',
        groupeSanguin: 'A-',
        allergies: ['Aspirine'],
        maladiesChroniques: [],
        contactUrgence: '+229 97 40 40 40',
        password: 'password123'
      }
    ];

    for (const patient of patients) {
      try {
        const response = await fetch(`${API_BASE}/patients`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(patient)
        });

        if (response.ok) {
          const result = await response.json();
          console.log(`✅ Patient créé: ${patient.prenom} ${patient.nom}`);
        } else {
          const error = await response.text();
          console.log(`⚠️ Patient ${patient.prenom} ${patient.nom} existe peut-être déjà`);
        }
      } catch (error) {
        console.log(`⚠️ Erreur pour ${patient.prenom} ${patient.nom}:`, error.message);
      }
    }

    console.log('🎉 Ajout de données de test terminé!');
    console.log('📊 Vérification des données...');

    // Vérifier les données ajoutées
    const patientsResponse = await fetch(`${API_BASE}/patients`);
    if (patientsResponse.ok) {
      const patientsData = await patientsResponse.json();
      console.log(`📈 Total patients: ${patientsData.count}`);
    }

    const medecinsResponse = await fetch(`${API_BASE}/medecins`);
    if (medecinsResponse.ok) {
      const medecinsData = await medecinsResponse.json();
      console.log(`👨‍⚕️ Total médecins: ${medecinsData.count}`);
    }

  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des données:', error);
  }
}

addTestData();
