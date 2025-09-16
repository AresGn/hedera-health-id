# Configuration des Variables d'Environnement Vercel

## 🚨 URGENT - Configuration Requise

Pour résoudre les erreurs CORS et de connexion API, vous devez configurer les variables d'environnement suivantes sur Vercel :

## Frontend (hedera-health-id.vercel.app)

### Variables à ajouter dans Vercel Dashboard :

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet frontend `hedera-health-id`
3. Allez dans Settings > Environment Variables
4. Ajoutez les variables suivantes :

```
VITE_API_URL=https://hedera-health-id-backend.vercel.app
VITE_APP_NAME=Hedera Health ID
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=production
```

## Backend (hedera-health-id-backend.vercel.app)

### Variables déjà configurées à vérifier :

```
NODE_ENV=production
DATABASE_URL=your-neon-database-url
JWT_SECRET=your-jwt-secret
HEDERA_ACCOUNT_ID=your-hedera-account
HEDERA_PRIVATE_KEY=your-hedera-private-key
ENCRYPTION_KEY=your-encryption-key
CORS_ORIGIN=https://hedera-health-id.vercel.app
```

## 🔧 Étapes de Configuration

### 1. Frontend
```bash
# Dans le dashboard Vercel du frontend
VITE_API_URL → https://hedera-health-id-backend.vercel.app
```

### 2. Redéploiement
Après avoir ajouté les variables :
1. Allez dans l'onglet "Deployments"
2. Cliquez sur "Redeploy" pour le dernier déploiement
3. Ou poussez un nouveau commit pour déclencher un redéploiement automatique

## 🧪 Test après Configuration

Une fois configuré, testez :
1. https://hedera-health-id.vercel.app/hospital/dashboard
2. Vérifiez la console du navigateur pour les logs d'API
3. Les erreurs CORS devraient disparaître

## 📝 Notes Importantes

- Les variables `VITE_*` sont exposées côté client
- Elles doivent être configurées au moment du build
- Un redéploiement est nécessaire après modification
- Les logs dans la console vous aideront à déboguer

## 🔍 Debugging

Si les erreurs persistent :
1. Vérifiez les logs Vercel du backend
2. Vérifiez les logs de la console du navigateur
3. Testez l'endpoint directement : https://hedera-health-id-backend.vercel.app/health
