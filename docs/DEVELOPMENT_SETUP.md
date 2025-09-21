# 🛠️ Configuration de Développement - Hedera Health ID

## 📋 Vue d'ensemble

Ce guide détaille la configuration complète de l'environnement de développement pour Hedera Health ID, incluant les outils, les dépendances et les bonnes pratiques de sécurité.

## 🔧 Prérequis Système

### Outils requis
- **Node.js** 18+ (LTS recommandé)
- **npm** 9+ ou **yarn** 1.22+
- **Git** 2.30+
- **PostgreSQL** 15+ (ou accès Neon)
- **VS Code** (recommandé) avec extensions

### Extensions VS Code recommandées
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-vscode.vscode-json",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint"
  ]
}
```

## 📦 Installation du Projet

### 1. Clonage et installation

```bash
# Cloner le repository
git clone https://github.com/AresGn/hedera-health-id.git
cd hedera-health-id

# Installation des dépendances racine
npm install

# Installation frontend
cd frontend
npm install

# Installation backend
cd ../backend
npm install

# Retour à la racine
cd ..
```

### 2. Configuration des variables d'environnement

**Backend (.env) :**
```env
# Base de données PostgreSQL
DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"

# Configuration serveur
PORT=3001
NODE_ENV=development

# Sécurité
BCRYPT_ROUNDS=12

# CORS (Frontend URL)
CORS_ORIGIN="http://localhost:3000"

# Hedera (Future)
HEDERA_NETWORK=testnet
HEDERA_ACCOUNT_ID=0.0.xxxxx
HEDERA_PRIVATE_KEY=302e020100300506032b657004220420...
```

**Frontend (.env) :**
```env
# API Backend
VITE_API_BASE_URL=http://localhost:3001

# Environnement
NODE_ENV=development

# PWA Configuration
VITE_APP_NAME="Hedera Health ID"
VITE_APP_SHORT_NAME="HederaHealth"
```

### 3. Configuration de la base de données

```bash
# Génération du client Prisma
cd backend
npx prisma generate

# Application des migrations
npx prisma db push

# Vérification avec Prisma Studio
npx prisma studio
```

## 🗄️ Structure du Projet

```
hedera-health-id/
├── frontend/                 # Application React
│   ├── src/
│   │   ├── components/       # Composants réutilisables
│   │   │   ├── ui/          # Composants UI de base
│   │   │   ├── patient/     # Composants patients
│   │   │   ├── medecin/     # Composants médecins
│   │   │   └── hospital/    # Composants hôpitaux
│   │   ├── pages/           # Pages principales
│   │   ├── services/        # Services API
│   │   ├── utils/           # Utilitaires
│   │   ├── hooks/           # Hooks personnalisés
│   │   └── types/           # Types TypeScript
│   ├── public/              # Assets statiques
│   └── dist/                # Build de production
├── backend/                  # API Node.js
│   ├── src/
│   │   ├── routes/          # Routes API
│   │   ├── services/        # Services métier
│   │   ├── utils/           # Utilitaires
│   │   └── types/           # Types TypeScript
│   ├── prisma/              # Schema et migrations
│   └── dist/                # Build de production
├── docs/                     # Documentation
├── scripts/                  # Scripts utilitaires (LOCAL ONLY)
└── tests/                    # Tests automatisés
```

## 🔐 Données de Test (Environnement Local)

> ⚠️ **IMPORTANT :** Ces informations sont strictement pour l'environnement de développement local et ne doivent JAMAIS être commitées ou partagées publiquement.

### Patients de test
```typescript
// Utilisez ces identifiants UNIQUEMENT en développement local
const TEST_PATIENTS = [
  { id: 'BJ2025001', password: 'patient123', name: 'Adjoa KOSSOU' },
  { id: 'BJ2025002', password: 'patient456', name: 'Marie DOSSOU' },
  { id: 'BJ2025003', password: 'patient789', name: 'Jean HOUNKPATIN' },
  { id: 'BJ20257830', password: 'test123', name: 'Patient Test' }
];
```

### Médecins de test
```typescript
const TEST_DOCTORS = [
  { 
    email: 'm.kossou@chu-mel.bj', 
    password: 'medecin123', 
    hospital: 'chu-mel',
    name: 'Dr. Marie KOSSOU',
    specialty: 'Cardiologie'
  },
  { 
    email: 'j.adjahoui@chu-mel.bj', 
    password: 'medecin456', 
    hospital: 'chu-mel',
    name: 'Dr. Jean ADJAHOUI',
    specialty: 'Médecine Générale'
  }
];
```

### Administrateurs hôpital de test
```typescript
const TEST_HOSPITAL_ADMINS = [
  { 
    adminId: 'ADMIN-CHU-001', 
    password: 'admin123', 
    hospital: 'CHU Mère-Enfant Lagune'
  },
  { 
    adminId: 'ADMIN-CNHU-001', 
    password: 'cnhu123', 
    hospital: 'CNHU Hubert Koutoukou Maga'
  }
];
```

## 🚀 Scripts de Développement

### Frontend
```bash
cd frontend

# Démarrage en mode développement
npm run dev

# Build de production
npm run build

# Preview du build
npm run preview

# Linting
npm run lint

# Tests
npm run test
```

### Backend
```bash
cd backend

# Démarrage en mode développement
npm run dev

# Build de production
npm run build

# Démarrage production
npm start

# Tests
npm run test

# Base de données
npx prisma studio
npx prisma db push
npx prisma generate
```

## 🧪 Tests et Validation

### 1. Tests d'authentification

```bash
# Script de test complet (depuis la racine)
node scripts/test-all-authentication.js

# Tests individuels
curl -X POST http://localhost:3001/api/v1/auth/patient \
  -H "Content-Type: application/json" \
  -d '{"patientId":"BJ20257830","password":"test123"}'
```

### 2. Health Check

```bash
# Vérification de l'état du système
curl http://localhost:3001/health

# Réponse attendue
{
  "status": "OK",
  "database": "Connected",
  "version": "v1",
  "timestamp": "2025-09-21T15:00:00.000Z"
}
```

### 3. Tests automatisés

```bash
# Tests unitaires
npm run test:unit

# Tests d'intégration
npm run test:integration

# Tests E2E
npm run test:e2e

# Coverage
npm run test:coverage
```

## 🔧 Outils de Développement

### 1. Debugging

**VS Code Launch Configuration (.vscode/launch.json) :**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Backend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/backend/src/index.ts",
      "outFiles": ["${workspaceFolder}/backend/dist/**/*.js"],
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal",
      "restart": true,
      "runtimeArgs": ["-r", "ts-node/register"]
    }
  ]
}
```

### 2. Linting et Formatting

**ESLint Configuration (.eslintrc.js) :**
```javascript
module.exports = {
  extends: [
    '@typescript-eslint/recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    'prefer-const': 'error'
  }
};
```

**Prettier Configuration (.prettierrc) :**
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### 3. Git Hooks

**Husky Configuration (package.json) :**
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run test"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "git add"
    ]
  }
}
```

## 📊 Monitoring en Développement

### 1. Logs structurés

```typescript
// Configuration Winston
import winston from 'winston';

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'dev.log' })
  ]
});
```

### 2. Performance Monitoring

```typescript
// Middleware de performance
const performanceMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};
```

## 🔒 Sécurité en Développement

### 1. Variables d'environnement

```bash
# Ne jamais committer les fichiers .env
echo ".env" >> .gitignore
echo ".env.*" >> .gitignore
echo "!.env.example" >> .gitignore

# Scripts avec credentials
echo "scripts/" >> .gitignore
echo "backend/scripts/" >> .gitignore
```

### 2. Validation des données

```typescript
// Middleware de validation
import Joi from 'joi';

const validatePatient = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    patientId: Joi.string().pattern(/^BJ\d{7}$/).required(),
    password: Joi.string().min(6).required()
  });
  
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }
  
  next();
};
```

## 🚀 Déploiement Local

### 1. Docker (Optionnel)

**docker-compose.yml :**
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_API_BASE_URL=http://backend:3001
    depends_on:
      - backend
      
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NODE_ENV=development
    depends_on:
      - database
      
  database:
    image: postgres:15
    environment:
      - POSTGRES_DB=hedera_health_dev
      - POSTGRES_USER=dev_user
      - POSTGRES_PASSWORD=dev_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 2. Scripts utilitaires

```bash
# Script de démarrage complet
#!/bin/bash
echo "🚀 Démarrage de Hedera Health ID..."

# Vérification des prérequis
node --version
npm --version

# Démarrage des services
echo "📊 Démarrage de la base de données..."
# docker-compose up -d database

echo "⚙️ Démarrage du backend..."
cd backend && npm run dev &

echo "🎨 Démarrage du frontend..."
cd frontend && npm run dev &

echo "✅ Tous les services sont démarrés!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:3001"
echo "Health: http://localhost:3001/health"
```

## 📞 Support et Dépannage

### Problèmes courants

1. **Port déjà utilisé**
   ```bash
   # Trouver le processus
   lsof -i :3000
   lsof -i :3001
   
   # Tuer le processus
   kill -9 <PID>
   ```

2. **Erreur de base de données**
   ```bash
   # Réinitialiser Prisma
   npx prisma db push --force-reset
   npx prisma generate
   ```

3. **Erreurs de build**
   ```bash
   # Nettoyer les caches
   rm -rf node_modules package-lock.json
   npm install
   
   # Frontend
   rm -rf frontend/dist frontend/node_modules
   cd frontend && npm install
   
   # Backend
   rm -rf backend/dist backend/node_modules
   cd backend && npm install
   ```

### Contacts

- **Repository :** https://github.com/AresGn/hedera-health-id
- **Issues :** https://github.com/AresGn/hedera-health-id/issues
- **Documentation :** `/docs/`

---

**🛠️ Environnement de développement optimisé pour Hedera Health ID**
