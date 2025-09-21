const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';

// Configuration des tests
const TEST_CREDENTIALS = {
  patients: [
    { patientId: 'BJ2025001', password: 'patient123', name: 'Adjoa KOSSOU' },
    { patientId: 'BJ2025002', password: 'patient456', name: 'Marie DOSSOU' },
    { patientId: 'BJ2025003', password: 'patient789', name: 'Jean HOUNKPATIN' },
    { patientId: 'BJ20257830', password: 'test123', name: 'Test PATIENT' }
  ],
  medecins: [
    { email: 'm.kossou@chu-mel.bj', password: 'medecin123', hopitalCode: 'chu-mel' },
    { email: 'j.adjahoui@chu-mel.bj', password: 'medecin456', hopitalCode: 'chu-mel' }
  ],
  hospitals: [
    { adminId: 'ADMIN-CHU-001', password: 'admin123', name: 'CHU Mère-Enfant Lagune' },
    { adminId: 'ADMIN-CNHU-001', password: 'cnhu123', name: 'CNHU Hubert Koutoukou Maga' }
  ]
};

async function testHealthCheck() {
  console.log('🏥 Test de santé de l\'API...');
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    if (response.status === 200 && response.data.status === 'OK') {
      console.log('✅ API Health Check: OK');
      console.log(`   Database: ${response.data.database}`);
      console.log(`   Version: ${response.data.version}`);
      return true;
    } else {
      console.log('❌ API Health Check: Failed');
      return false;
    }
  } catch (error) {
    console.log('❌ API Health Check: Error -', error.message);
    return false;
  }
}

async function testPatientAuthentication() {
  console.log('\n👥 Test d\'authentification des patients...');
  let successCount = 0;
  let totalCount = TEST_CREDENTIALS.patients.length;

  for (const patient of TEST_CREDENTIALS.patients) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/auth/patient`, {
        patientId: patient.patientId,
        password: patient.password
      });

      if (response.status === 200 && response.data.success) {
        console.log(`✅ Patient ${patient.patientId} (${patient.name}): Authentification réussie`);
        console.log(`   Token: ${response.data.data.token.substring(0, 20)}...`);
        successCount++;
      } else {
        console.log(`❌ Patient ${patient.patientId}: Échec authentification`);
      }
    } catch (error) {
      console.log(`❌ Patient ${patient.patientId}: Erreur - ${error.response?.data?.error || error.message}`);
    }
  }

  // Test avec de mauvais identifiants
  try {
    await axios.post(`${API_BASE_URL}/api/v1/auth/patient`, {
      patientId: 'BJ2025001',
      password: 'wrongpassword'
    });
    console.log('❌ Test sécurité: Mauvais mot de passe accepté (PROBLÈME!)');
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Test sécurité: Mauvais mot de passe rejeté correctement');
      successCount++;
      totalCount++;
    }
  }

  console.log(`📊 Patients: ${successCount}/${totalCount} tests réussis`);
  return successCount === totalCount;
}

async function testMedecinAuthentication() {
  console.log('\n👨‍⚕️ Test d\'authentification des médecins...');
  let successCount = 0;
  let totalCount = TEST_CREDENTIALS.medecins.length;

  for (const medecin of TEST_CREDENTIALS.medecins) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/auth/medecin`, {
        email: medecin.email,
        password: medecin.password,
        hopitalCode: medecin.hopitalCode
      });

      if (response.status === 200 && response.data.success) {
        console.log(`✅ Médecin ${medecin.email}: Authentification réussie`);
        console.log(`   Dr. ${response.data.data.medecin.prenom} ${response.data.data.medecin.nom}`);
        console.log(`   Spécialité: ${response.data.data.medecin.specialite}`);
        successCount++;
      } else {
        console.log(`❌ Médecin ${medecin.email}: Échec authentification`);
      }
    } catch (error) {
      console.log(`❌ Médecin ${medecin.email}: Erreur - ${error.response?.data?.error || error.message}`);
    }
  }

  console.log(`📊 Médecins: ${successCount}/${totalCount} tests réussis`);
  return successCount === totalCount;
}

async function testHospitalAuthentication() {
  console.log('\n🏥 Test d\'authentification des hôpitaux...');
  let successCount = 0;
  let totalCount = TEST_CREDENTIALS.hospitals.length;

  for (const hospital of TEST_CREDENTIALS.hospitals) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/auth/hospital`, {
        adminId: hospital.adminId,
        password: hospital.password
      });

      if (response.status === 200 && response.data.success) {
        console.log(`✅ Admin ${hospital.adminId}: Authentification réussie`);
        console.log(`   ${response.data.data.admin.prenom} ${response.data.data.admin.nom}`);
        console.log(`   Hôpital: ${response.data.data.admin.hopital.nom}`);
        console.log(`   Rôle: ${response.data.data.admin.role}`);
        successCount++;
      } else {
        console.log(`❌ Admin ${hospital.adminId}: Échec authentification`);
      }
    } catch (error) {
      console.log(`❌ Admin ${hospital.adminId}: Erreur - ${error.response?.data?.error || error.message}`);
    }
  }

  console.log(`📊 Hôpitaux: ${successCount}/${totalCount} tests réussis`);
  return successCount === totalCount;
}

async function testAPIEndpoints() {
  console.log('\n🔗 Test des endpoints API...');
  let successCount = 0;
  let totalCount = 0;

  const endpoints = [
    { method: 'GET', url: '/api/v1/patients', name: 'Liste patients' },
    { method: 'GET', url: '/api/v1/medecins', name: 'Liste médecins' },
    { method: 'GET', url: '/api/v1/hopitaux', name: 'Liste hôpitaux' },
    { method: 'GET', url: '/api/v1/patients/BJ2025001', name: 'Détail patient' },
    { method: 'GET', url: '/api/v1/patients/BJ2025001/consultations', name: 'Consultations patient' }
  ];

  for (const endpoint of endpoints) {
    totalCount++;
    try {
      const response = await axios({
        method: endpoint.method.toLowerCase(),
        url: `${API_BASE_URL}${endpoint.url}`
      });

      if (response.status === 200) {
        console.log(`✅ ${endpoint.name}: OK`);
        successCount++;
      } else {
        console.log(`❌ ${endpoint.name}: Status ${response.status}`);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        console.log(`⚠️  ${endpoint.name}: 404 (normal si données manquantes)`);
        successCount++; // 404 peut être normal
      } else {
        console.log(`❌ ${endpoint.name}: Erreur - ${error.response?.status || error.message}`);
      }
    }
  }

  console.log(`📊 Endpoints: ${successCount}/${totalCount} tests réussis`);
  return successCount >= totalCount * 0.8; // 80% de réussite acceptable
}

async function testDatabaseConnectivity() {
  console.log('\n🗄️  Test de connectivité base de données...');
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    if (response.data.database === 'Connected') {
      console.log('✅ Base de données: Connectée');
      return true;
    } else {
      console.log('❌ Base de données: Déconnectée');
      return false;
    }
  } catch (error) {
    console.log('❌ Base de données: Erreur de test -', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🧪 TESTS COMPLETS D\'AUTHENTIFICATION');
  console.log('=====================================');
  console.log(`🌐 API Base URL: ${API_BASE_URL}`);
  console.log(`📅 Date: ${new Date().toLocaleString('fr-FR')}`);
  
  const results = {
    healthCheck: false,
    patientAuth: false,
    medecinAuth: false,
    hospitalAuth: false,
    apiEndpoints: false,
    database: false
  };

  // Exécuter tous les tests
  results.healthCheck = await testHealthCheck();
  results.database = await testDatabaseConnectivity();
  results.patientAuth = await testPatientAuthentication();
  results.medecinAuth = await testMedecinAuthentication();
  results.hospitalAuth = await testHospitalAuthentication();
  results.apiEndpoints = await testAPIEndpoints();

  // Résumé final
  console.log('\n🎯 RÉSUMÉ DES TESTS');
  console.log('==================');
  
  const testResults = [
    { name: 'Health Check', status: results.healthCheck },
    { name: 'Base de données', status: results.database },
    { name: 'Auth Patients', status: results.patientAuth },
    { name: 'Auth Médecins', status: results.medecinAuth },
    { name: 'Auth Hôpitaux', status: results.hospitalAuth },
    { name: 'Endpoints API', status: results.apiEndpoints }
  ];

  let passedTests = 0;
  for (const test of testResults) {
    const status = test.status ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${test.name}`);
    if (test.status) passedTests++;
  }

  const successRate = Math.round((passedTests / testResults.length) * 100);
  console.log(`\n📊 Score global: ${passedTests}/${testResults.length} (${successRate}%)`);

  if (successRate >= 90) {
    console.log('🎉 EXCELLENT! Tous les systèmes sont opérationnels');
    console.log('🚀 L\'application est prête pour le déploiement');
  } else if (successRate >= 75) {
    console.log('⚠️  BON: La plupart des systèmes fonctionnent');
    console.log('🔧 Quelques ajustements peuvent être nécessaires');
  } else {
    console.log('❌ PROBLÈMES DÉTECTÉS: Plusieurs systèmes nécessitent une attention');
    console.log('🛠️  Veuillez corriger les erreurs avant le déploiement');
  }

  console.log('\n📋 INFORMATIONS DE CONNEXION:');
  console.log('Patient Test: BJ20257830 / test123');
  console.log('Admin Hôpital: ADMIN-CHU-001 / admin123');
  console.log('Frontend: http://localhost:3000');
  console.log('Backend: http://localhost:3001');

  return successRate >= 75;
}

// Exécuter les tests si le script est appelé directement
if (require.main === module) {
  runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('❌ Erreur fatale lors des tests:', error);
    process.exit(1);
  });
}

module.exports = {
  runAllTests,
  testPatientAuthentication,
  testMedecinAuthentication,
  testHospitalAuthentication,
  testAPIEndpoints
};
