# 🚀 Guide de Déploiement

## Prérequis
- Node.js 18+
- PostgreSQL
- Compte Hedera Testnet

## Installation
```bash
# Cloner le repo
git clone https://github.com/AresGn/hedera-health-id.git
cd hedera-health-id

# Installer les dépendances
npm run install:all

# Configuration
cp backend/.env.example backend/.env
# Éditer les variables d'environnement

# Démarrer en développement
npm run dev
```

## Production
- Frontend: Vercel/Netlify
- Backend: Railway/Render
- Database: PostgreSQL (Supabase)
