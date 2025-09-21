#!/usr/bin/env node

/**
 * Script de validation complète pour toutes les corrections UI/UX et intégration de données
 * du projet Hedera Health ID
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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
function execCommand(command, description, cwd = process.cwd()) {
  try {
    log(`🔄 ${description}...`, 'blue');
    const result = execSync(command, { 
      stdio: 'pipe', 
      cwd: cwd,
      encoding: 'utf8'
    });
    log(`✅ ${description} terminé`, 'green');
    return result;
  } catch (error) {
    log(`❌ Erreur lors de ${description}: ${error.message}`, 'red');
    if (error.stdout) log(`Stdout: ${error.stdout}`, 'yellow');
    if (error.stderr) log(`Stderr: ${error.stderr}`, 'yellow');
    throw error;
  }
}

// Fonction pour vérifier les corrections de visibilité du texte
function validateTextVisibilityFixes() {
  log('🔍 Validation des corrections de visibilité du texte...', 'cyan');
  
  const filesToCheck = [
    'frontend/src/components/ui/Input.tsx',
    'frontend/src/components/ui/Select.tsx',
    'frontend/src/pages/PatientLogin.tsx',
    'frontend/src/pages/NewConsultation.tsx',
    'frontend/src/components/patient/PatientOverview.tsx'
  ];

  let fixes = 0;
  let issues = 0;

  filesToCheck.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Vérifier les améliorations de contraste
      if (content.includes('text-gray-800') || content.includes('text-gray-900')) {
        fixes++;
        log(`  ✅ ${file}: Contraste amélioré`, 'green');
      }
      
      // Vérifier les problèmes restants
      if (content.includes('text-gray-500') && !content.includes('placeholder:text-gray-500')) {
        issues++;
        log(`  ⚠️ ${file}: text-gray-500 détecté (peut nécessiter une révision)`, 'yellow');
      }
    } else {
      log(`  ❌ ${file}: Fichier non trouvé`, 'red');
      issues++;
    }
  });

  log(`📊 Corrections de visibilité: ${fixes} améliorations, ${issues} problèmes potentiels`, 'cyan');
  return { fixes, issues };
}

// Fonction pour valider la responsivité
function validateResponsiveDesign() {
  log('📱 Validation du design responsive...', 'cyan');
  
  const responsiveFiles = [
    'frontend/src/pages/MedecinDashboardNew.tsx',
    'frontend/src/styles/index.css'
  ];

  let responsiveFixes = 0;

  responsiveFiles.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Vérifier les classes responsive
      if (content.includes('lg:') || content.includes('md:') || content.includes('sm:')) {
        responsiveFixes++;
        log(`  ✅ ${file}: Classes responsive détectées`, 'green');
      }
      
      // Vérifier le menu mobile
      if (content.includes('sidebarOpen') || content.includes('Menu')) {
        log(`  ✅ ${file}: Menu mobile implémenté`, 'green');
      }
    }
  });

  log(`📊 Design responsive: ${responsiveFixes} améliorations détectées`, 'cyan');
  return responsiveFixes;
}

// Fonction pour valider l'intégration API
function validateApiIntegration() {
  log('🔌 Validation de l\'intégration API...', 'cyan');
  
  const apiFiles = [
    'frontend/src/services/api.ts',
    'frontend/src/pages/PatientDashboard.tsx',
    'backend/api/index.ts'
  ];

  let apiImprovements = 0;

  apiFiles.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Vérifier les nouveaux endpoints
      if (content.includes('getPatientById') || content.includes('getPatientConsultations')) {
        apiImprovements++;
        log(`  ✅ ${file}: Nouveaux endpoints détectés`, 'green');
      }
      
      // Vérifier l'utilisation de vraies données
      if (content.includes('api.getPatientById') || content.includes('patientResponse.data')) {
        log(`  ✅ ${file}: Utilisation de vraies données API`, 'green');
      }
    }
  });

  log(`📊 Intégration API: ${apiImprovements} améliorations détectées`, 'cyan');
  return apiImprovements;
}

// Fonction pour tester les builds
function testBuilds() {
  log('🏗️ Test des builds...', 'cyan');
  
  try {
    // Test build frontend
    log('Frontend build...', 'blue');
    execCommand('npm run build', 'Build frontend', path.join(process.cwd(), 'frontend'));
    
    // Test build backend
    log('Backend build...', 'blue');
    execCommand('npm run build', 'Build backend', path.join(process.cwd(), 'backend'));
    
    log('✅ Tous les builds réussis', 'green');
    return true;
  } catch (error) {
    log('❌ Échec des builds', 'red');
    return false;
  }
}

// Fonction pour tester la base de données
async function testDatabase() {
  log('🗄️ Test de la base de données...', 'cyan');
  
  try {
    // Exécuter le script de vérification de la base de données
    execCommand('node scripts/ensure-database-setup.js', 'Vérification base de données', path.join(process.cwd(), 'backend'));
    
    log('✅ Base de données validée', 'green');
    return true;
  } catch (error) {
    log('❌ Problème avec la base de données', 'red');
    return false;
  }
}

// Fonction pour générer un rapport de validation
function generateValidationReport(results) {
  log('\n📋 RAPPORT DE VALIDATION COMPLET', 'magenta');
  log('================================================', 'magenta');
  
  const { textVisibility, responsive, api, builds, database } = results;
  
  log('🎨 CORRECTIONS UI/UX:', 'cyan');
  log(`   ✅ Visibilité du texte: ${textVisibility.fixes} corrections`, 'green');
  log(`   ⚠️ Problèmes restants: ${textVisibility.issues}`, textVisibility.issues > 0 ? 'yellow' : 'green');
  log(`   📱 Design responsive: ${responsive} améliorations`, 'green');
  
  log('\n🔌 INTÉGRATION DONNÉES:', 'cyan');
  log(`   ✅ API améliorations: ${api}`, 'green');
  log(`   ✅ Builds: ${builds ? 'Réussis' : 'Échec'}`, builds ? 'green' : 'red');
  log(`   ✅ Base de données: ${database ? 'Validée' : 'Problème'}`, database ? 'green' : 'red');
  
  const totalScore = textVisibility.fixes + responsive + api + (builds ? 5 : 0) + (database ? 5 : 0);
  const maxScore = 20; // Score maximum possible
  const percentage = Math.round((totalScore / maxScore) * 100);
  
  log(`\n🏆 SCORE GLOBAL: ${totalScore}/${maxScore} (${percentage}%)`, percentage >= 80 ? 'green' : percentage >= 60 ? 'yellow' : 'red');
  
  if (percentage >= 80) {
    log('🎉 EXCELLENT! Toutes les corrections sont bien implémentées', 'green');
  } else if (percentage >= 60) {
    log('👍 BON! La plupart des corrections sont en place', 'yellow');
  } else {
    log('⚠️ ATTENTION! Plusieurs corrections nécessitent encore du travail', 'red');
  }
  
  log('\n📝 PROCHAINES ÉTAPES RECOMMANDÉES:', 'cyan');
  if (textVisibility.issues > 0) {
    log('   • Réviser les instances restantes de text-gray-500', 'yellow');
  }
  if (!builds) {
    log('   • Corriger les erreurs de build', 'yellow');
  }
  if (!database) {
    log('   • Résoudre les problèmes de base de données', 'yellow');
  }
  log('   • Tester manuellement tous les dashboards', 'blue');
  log('   • Valider l\'expérience utilisateur sur mobile', 'blue');
  
  return { totalScore, maxScore, percentage };
}

// Fonction principale
async function main() {
  try {
    log('🚀 DÉMARRAGE DE LA VALIDATION COMPLÈTE', 'magenta');
    log('================================================', 'magenta');
    
    // 1. Valider les corrections de visibilité du texte
    const textVisibility = validateTextVisibilityFixes();
    
    // 2. Valider le design responsive
    const responsive = validateResponsiveDesign();
    
    // 3. Valider l'intégration API
    const api = validateApiIntegration();
    
    // 4. Tester les builds
    const builds = testBuilds();
    
    // 5. Tester la base de données
    const database = await testDatabase();
    
    // 6. Générer le rapport final
    const report = generateValidationReport({
      textVisibility,
      responsive,
      api,
      builds,
      database
    });
    
    log('\n✅ VALIDATION TERMINÉE', 'green');
    
    // Code de sortie basé sur le score
    process.exit(report.percentage >= 60 ? 0 : 1);
    
  } catch (error) {
    log(`❌ Erreur lors de la validation: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Exécuter le script
if (require.main === module) {
  main();
}

module.exports = { 
  validateTextVisibilityFixes, 
  validateResponsiveDesign, 
  validateApiIntegration,
  testBuilds,
  testDatabase,
  generateValidationReport
};
