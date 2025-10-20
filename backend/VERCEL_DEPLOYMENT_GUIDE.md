# Guide de déploiement Vercel - Backend Hedera Health ID

## 🚀 Configuration du déploiement

### 1. Variables d'environnement REQUISES sur Vercel

Vous devez configurer ces variables dans votre dashboard Vercel (Settings → Environment Variables) :

```bash
# Base de données PostgreSQL
DATABASE_URL="postgresql://username:password@host:port/database?schema=public"

# Configuration de l'application
NODE_ENV="production"
API_VERSION="1.0.0"
CORS_ORIGIN="https://hedera-health-id.vercel.app"

# Configuration Prisma (important pour Vercel)
PRISMA_GENERATE_DATAPROXY=true
```

### 2. Comment ajouter les variables sur Vercel

1. Allez sur [vercel.com](https://vercel.com) et connectez-vous
2. Sélectionnez votre projet backend
3. Allez dans **Settings** → **Environment Variables**
4. Ajoutez chaque variable avec sa valeur
5. Assurez-vous de sélectionner les environnements : **Production**, **Preview**, **Development**

### 3. Base de données

#### Option A : Utiliser une base de données hébergée (Recommandé)
- **Supabase** : [supabase.com](https://supabase.com) - Gratuit avec 500MB
- **Neon** : [neon.tech](https://neon.tech) - Gratuit avec 3GB
- **PlanetScale** : [planetscale.com](https://planetscale.com) - MySQL compatible
- **Railway** : [railway.app](https://railway.app) - PostgreSQL gratuit

#### Option B : Utiliser Vercel Postgres
```bash
# Dans votre terminal
vercel env pull
vercel postgres create
```

### 4. Commandes de déploiement

```bash
# Déploiement initial
cd backend
vercel

# Mise à jour
vercel --prod

# Vérifier les logs
vercel logs
```

### 5. Structure du projet

```
backend/
├── api/
│   └── index.js        # Point d'entrée serverless
├── prisma/
│   └── schema.prisma   # Schéma de base de données
├── vercel.json         # Configuration Vercel
└── package.json        # Dépendances
```

### 6. Résolution des problèmes courants

#### Erreur "Function has crashed"
- Vérifiez que DATABASE_URL est configurée
- Vérifiez les logs : `vercel logs --follow`

#### Erreur de connexion à la base de données
- Assurez-vous que l'IP de Vercel est autorisée dans votre base de données
- Pour Supabase : Settings → Database → Connection pooling

#### Erreur CORS
- Vérifiez que CORS_ORIGIN correspond à votre frontend

### 7. Test de l'API déployée

Une fois déployé, visitez :
- `https://votre-backend.vercel.app/` - Page d'accueil avec statut
- `https://votre-backend.vercel.app/health` - Check de santé JSON
- `https://votre-backend.vercel.app/api/v1/test` - Test de la base de données

### 8. Monitoring

Surveillez votre application :
1. **Vercel Dashboard** : Voir les métriques et logs
2. **Endpoint /health** : Vérifier l'état de l'API
3. **Page d'accueil** : Vue d'ensemble visuelle

## 📝 Notes importantes

- Le fichier `api/index.js` est le point d'entrée serverless
- Les fonctions Vercel ont un timeout de 30 secondes (configuré dans vercel.json)
- La base de données doit accepter les connexions depuis les IPs de Vercel
- Utilisez `prisma generate` dans le build pour générer le client Prisma

## 🔧 Support

En cas de problème :
1. Vérifiez les logs Vercel : `vercel logs`
2. Testez localement : `vercel dev`
3. Consultez la documentation Vercel : [vercel.com/docs](https://vercel.com/docs)
