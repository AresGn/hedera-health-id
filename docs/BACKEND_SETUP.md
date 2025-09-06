# CONFIGURATION BACKEND HEDERA HEALTH ID

## Vue d'ensemble

Ce document décrit la configuration complète du backend pour le projet Hedera Health ID MVP, incluant la base de données Neon PostgreSQL, l'architecture TypeScript, et les scripts d'automatisation.

## Architecture Technique

### Stack Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js avec TypeScript
- **Base de données**: PostgreSQL (Neon Cloud)
- **ORM**: Prisma 5.7.1
- **Authentification**: JWT + bcrypt
- **Validation**: Zod
- **Blockchain**: Hedera SDK

### Structure du Projet
```
backend/
├── src/
│   ├── config/           # Configuration app et DB
│   ├── controllers/      # Logique métier API
│   ├── services/         # Services métier
│   ├── middleware/       # Middlewares Express
│   ├── routes/           # Routes API
│   ├── utils/            # Utilitaires
│   └── types/            # Types TypeScript
├── prisma/
│   ├── schema.prisma     # Schéma de base de données
│   └── seed.ts           # Données de test
├── scripts/
│   ├── setup-database.js # Configuration automatique
│   └── test-connection.js # Test de connexion
└── dist/                 # Code compilé
```

## Base de Données

### Configuration Neon PostgreSQL



### Schéma de Base de Données

#### Tables Principales

1. **patients** - Données patients avec blockchain
   - `patientId` : Identifiant unique (BJ20250001)
   - `hederaAccountId` : Compte Hedera
   - `qrCodeHash` : Hash du QR Code
   - Données médicales chiffrées

2. **medecins** - Médecins avec authentification
   - `medecinId` : Identifiant médecin (MED-CHU-001)
   - `passwordHash` : Mot de passe chiffré
   - `hederaAccountId` : Compte Hedera

3. **hopitaux** - Établissements de santé
   - `code` : Code hôpital (chu-mel, cnhu-hkm)
   - Informations administratives

4. **consultations** - Dossiers médicaux + HCS
   - `consultationId` : Identifiant consultation
   - `hederaTxId` : Transaction Hedera
   - `hcsMessageId` : Message HCS

5. **permissions_medecins** - Contrôle d'accès + HTS
   - Gestion permissions patient-médecin
   - `hederaTokenId` : Token HTS

6. **notifications** - Système de notifications
7. **audit_logs** - Traçabilité complète
8. **sessions** - Gestion sessions JWT

### Données de Test

**3 Hôpitaux** :
- CHU-MEL (Cotonou)
- CNHU-HKM (Cotonou)
- CHU-BORGOU (Parakou)

**3 Médecins** :
- Dr. ADJAHOUI (Médecine Générale)
- Dr. KOSSOU (Cardiologie)
- Dr. SOSSOU (Pédiatrie)

**3 Patients** :
- Adjoa KOSSOU (BJ20250001)
- Kossi ADJAHOUI (BJ20250002)
- Fatima SOSSOU (BJ20250003)

## Scripts d'Automatisation

### Configuration Automatique
```bash
npm run db:setup
```
- Installe les dépendances
- Génère le client Prisma
- Synchronise le schéma avec Neon
- Exécute le seeding

### Test de Connexion
```bash
npm run db:test
```
- Teste la connexion à Neon
- Affiche les statistiques des tables
- Mesure la latence

### Autres Scripts
```bash
npm run db:generate    # Génère le client Prisma
npm run db:push        # Synchronise le schéma
npm run db:seed        # Insère les données de test
npm run db:studio      # Ouvre Prisma Studio
npm run build          # Compile TypeScript
npm run dev            # Démarre en mode développement
```

## API Endpoints

### Health Check
```
GET /health
```
Vérifie l'état du serveur et de la base de données.

### Test API
```
GET /api/v1/test
```
Retourne les statistiques de la base de données.

### Hôpitaux
```
GET /api/v1/hopitaux
```
Liste tous les hôpitaux actifs.

### Patients
```
GET /api/v1/patients
```
Liste tous les patients avec informations de base.

## Configuration

### Variables d'Environnement

Fichier `.env` requis :
```env
NODE_ENV=development
PORT=3001
DATABASE_URL="postgresql://neondb_owner:..."
JWT_SECRET=

HEDERA_NETWORK=testnet
HEDERA_ACCOUNT_ID=0.0.123456
HEDERA_PRIVATE_KEY=your-hedera-private-key
CORS_ORIGIN=http://localhost:3000
```

### TypeScript Configuration

Configuration stricte avec :
- Target ES2020
- Module CommonJS
- Paths aliases (@/config/*, @/services/*, etc.)
- Source maps activées

## Sécurité

### Authentification
- JWT avec expiration 24h
- Refresh tokens 7 jours
- Mots de passe hachés avec bcrypt

### Validation
- Validation stricte avec Zod
- Sanitization des inputs
- Rate limiting configuré

### Blockchain
- Clés privées en variables d'environnement
- Transactions signées côté serveur
- Audit trail complet

## Performance

### Base de Données
- Connection pooling Prisma
- Index sur colonnes fréquentes
- Requêtes optimisées

### Monitoring
- Logs structurés avec Winston
- Métriques de performance
- Health checks automatiques

## Déploiement

### Prérequis
1. Node.js 18+
2. Base de données Neon configurée
3. Variables d'environnement définies

### Installation
```bash
cd backend
npm install
npm run db:setup
npm run build
npm start
```

### Vérification
```bash
curl http://localhost:3001/health
curl http://localhost:3001/api/v1/test
```

## Prochaines Étapes

1. **Authentification complète** - JWT middleware
2. **Routes CRUD** - Patients, médecins, consultations
3. **Intégration Hedera** - Smart contracts
4. **Tests automatisés** - Jest + Supertest
5. **Documentation API** - Swagger/OpenAPI

## Troubleshooting

### Erreurs Communes

**Connexion base de données** :
- Vérifier l'URL dans .env
- Tester avec `npm run db:test`

**Erreurs TypeScript** :
- Vérifier tsconfig.json
- Régénérer le client Prisma

**Port déjà utilisé** :
- Changer PORT dans .env
- Tuer les processus existants

### Support

Pour toute question technique, consulter :
- Documentation Prisma : https://prisma.io/docs
- Documentation Neon : https://neon.tech/docs
- Documentation Hedera : https://docs.hedera.com
