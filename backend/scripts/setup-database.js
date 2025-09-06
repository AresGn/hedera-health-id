#!/usr/bin/env node

/**
 * Script de configuration de la base de données Neon
 * Exécute les migrations Prisma et le seeding
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

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

function execCommand(command, description) {
  try {
    log(`\n🔄 ${description}...`, 'blue');
    const result = execSync(command, { 
      stdio: 'inherit', 
      cwd: path.join(__dirname, '..') 
    });
    log(`✅ ${description} terminé avec succès`, 'green');
    return result;
  } catch (error) {
    log(`❌ Erreur lors de ${description}:`, 'red');
    log(error.message, 'red');
    process.exit(1);
  }
}

async function main() {
  log('🚀 Configuration de la base de données Hedera Health ID', 'cyan');
  log('================================================', 'cyan');

  // Vérifier que le fichier .env existe
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    log('❌ Fichier .env non trouvé. Veuillez le créer d\'abord.', 'red');
    process.exit(1);
  }

  // Vérifier la variable DATABASE_URL
  require('dotenv').config({ path: envPath });
  if (!process.env.DATABASE_URL) {
    log('❌ Variable DATABASE_URL non définie dans .env', 'red');
    process.exit(1);
  }

  log(`📊 Base de données: ${process.env.DATABASE_URL.split('@')[1]?.split('/')[0] || 'Neon'}`, 'yellow');

  try {
    // 1. Installer les dépendances si nécessaire
    if (!fs.existsSync(path.join(__dirname, '..', 'node_modules'))) {
      execCommand('npm install', 'Installation des dépendances');
    }

    // 2. Générer le client Prisma
    execCommand('npx prisma generate', 'Génération du client Prisma');

    // 3. Pousser le schéma vers la base de données
    execCommand('npx prisma db push', 'Synchronisation du schéma avec Neon');

    // 4. Exécuter le seeding
    execCommand('npx prisma db seed', 'Insertion des données de test');

    // 5. Ouvrir Prisma Studio (optionnel)
    log('\n🎉 Configuration terminée avec succès !', 'green');
    log('================================================', 'green');
    log('📊 Pour explorer la base de données:', 'cyan');
    log('   npm run db:studio', 'yellow');
    log('\n🚀 Pour démarrer le serveur:', 'cyan');
    log('   npm run dev', 'yellow');

  } catch (error) {
    log(`❌ Erreur lors de la configuration: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Gestion des signaux pour un arrêt propre
process.on('SIGINT', () => {
  log('\n⚠️  Configuration interrompue par l\'utilisateur', 'yellow');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('\n⚠️  Configuration interrompue', 'yellow');
  process.exit(0);
});

// Exécution du script
if (require.main === module) {
  main().catch((error) => {
    log(`❌ Erreur fatale: ${error.message}`, 'red');
    process.exit(1);
  });
}

module.exports = { main };
