# 🔍 Guide de débogage - Connexion Neon Database sur Vercel

## ⚠️ Problème: Database "Disconnected" sur Vercel

Si votre backend affiche "Disconnected" pour la base de données malgré la configuration des variables Neon, suivez ces étapes :

## 📋 Étapes de diagnostic

### 1. Vérifier l'endpoint de debug

Visitez : `https://votre-backend.vercel.app/api/debug/database`

Cet endpoint vous donnera des informations détaillées sur :
- Si DATABASE_URL est configurée
- Les erreurs de connexion exactes
- Les tables disponibles dans la base

### 2. Vérifier les logs Vercel

```bash
vercel logs --follow
```

Recherchez les messages :
- `🚀 Backend starting with config:` - Vérification de la configuration
- `❌ Database connection error:` - Erreurs de connexion
- `✅ Database connected successfully` - Connexion réussie

### 3. Vérifier votre configuration Neon

#### Sur Neon (neon.tech) :

1. **Connection String** : 
   - Allez dans votre projet Neon
   - Cliquez sur "Connection Details"
   - **IMPORTANT** : Utilisez le "Pooled connection string" (pas le Direct)
   - Votre URL doit ressembler à :
   ```
   postgresql://username:password@ep-xxx-xxx-xxx.pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

2. **Connection Pooling** :
   - Assurez-vous que "Connection pooling" est activé
   - Utilisez le endpoint avec `-pooler` dans l'URL

#### Sur Vercel :

1. **Variables d'environnement** :
   - Allez dans Settings → Environment Variables
   - Vérifiez que `DATABASE_URL` est configurée
   - **IMPORTANT** : Pas d'espaces ou de quotes autour de l'URL
   - Assurez-vous que la variable est active pour tous les environnements

2. **Format correct** :
   ```
   DATABASE_URL=postgresql://username:password@ep-xxx-xxx-xxx.pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### 4. Erreurs courantes et solutions

#### Erreur : "Can't reach database server"
**Solution** : 
- Utilisez le pooled connection string (avec `-pooler` dans l'URL)
- Vérifiez que `sslmode=require` est dans l'URL

#### Erreur : "DATABASE_URL not configured"
**Solution** :
- Vérifiez dans Vercel Settings → Environment Variables
- Redéployez après avoir ajouté la variable

#### Erreur : "Invalid connection string"
**Solution** :
- Vérifiez qu'il n'y a pas d'espaces dans l'URL
- Assurez-vous que le mot de passe ne contient pas de caractères spéciaux non échappés

#### Erreur : "relation does not exist"
**Solution** :
- Les tables ne sont pas créées. Exécutez :
  ```bash
  cd backend
  npx prisma db push
  ```

### 5. Script de test local

Testez votre connexion Neon localement :

```bash
# Dans le dossier backend
echo "DATABASE_URL=votre-url-neon" > .env.test
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$connect()
  .then(() => console.log('✅ Connexion réussie'))
  .catch(err => console.error('❌ Erreur:', err))
  .finally(() => prisma.\$disconnect());
"
```

### 6. Commandes utiles

```bash
# Générer le client Prisma
cd backend
npx prisma generate

# Pousser le schéma vers Neon
npx prisma db push

# Vérifier le statut de la base
npx prisma db pull

# Ouvrir Prisma Studio pour visualiser les données
npx prisma studio
```

### 7. Configuration recommandée pour Neon

Dans votre `backend/prisma/schema.prisma` :

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") // Optionnel, pour les migrations
}
```

### 8. Variables d'environnement complètes pour Vercel

```bash
# Base de données (OBLIGATOIRE)
DATABASE_URL=postgresql://user:pass@ep-xxx.pooler.us-east-2.aws.neon.tech/neondb?sslmode=require

# Optionnel mais recommandé
DIRECT_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require

# Configuration Prisma
PRISMA_GENERATE_DATAPROXY=true

# Application
NODE_ENV=production
API_VERSION=1.0.0
CORS_ORIGIN=https://hedera-health-id.vercel.app
```

## 🚀 Redéploiement après corrections

1. Corrigez les variables d'environnement sur Vercel
2. Redéployez :
   ```bash
   cd backend
   vercel --prod
   ```
3. Vérifiez : `https://votre-backend.vercel.app/health`
4. Si toujours déconnecté, vérifiez : `https://votre-backend.vercel.app/api/debug/database`

## 💡 Tips

- Toujours utiliser le **pooled connection string** de Neon pour Vercel
- Les logs Vercel sont votre meilleur ami pour le débogage
- L'endpoint `/api/debug/database` donne des informations précieuses
- N'oubliez pas de redéployer après chaque changement de variable d'environnement

## 🔗 Ressources

- [Neon Documentation](https://neon.tech/docs/connect/connect-from-vercel)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Prisma with Neon](https://neon.tech/docs/guides/prisma)
