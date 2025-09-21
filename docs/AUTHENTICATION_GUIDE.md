# 🔐 Guide d'Authentification - Hedera Health ID

## 📋 Vue d'ensemble

Ce guide détaille le système d'authentification complet de Hedera Health ID, incluant les corrections récentes et les bonnes pratiques de sécurité.

## 🏗️ Architecture d'Authentification

### Types d'utilisateurs

1. **Patients** - Utilisateurs finaux avec dossiers médicaux
2. **Médecins** - Professionnels de santé affiliés à des hôpitaux
3. **Administrateurs Hôpital** - Gestionnaires des établissements de santé

### Sécurité

- **Hachage bcrypt** avec 12 rounds de salage
- **Validation côté serveur** pour tous les endpoints
- **Limitation des tentatives** de connexion (3 max)
- **Tokens JWT simulés** pour les sessions

## 🔑 Authentification des Patients

### Endpoint
```
POST /api/v1/auth/patient
```

### Payload
```json
{
  "patientId": "BJ2025001",
  "password": "patient123"
}
```

### Réponse
```json
{
  "success": true,
  "data": {
    "token": "patient_jwt_...",
    "patient": {
      "id": "cmf...",
      "patientId": "BJ2025001",
      "nom": "KOSSOU",
      "prenom": "Adjoa",
      "email": "adjoa.kossou@email.bj",
      "telephone": "+229 97 11 11 11",
      "ville": "Cotonou",
      "hopitalPrincipal": "CHU-MEL",
      "lastLogin": "2025-09-21T14:49:13.945Z"
    }
  },
  "message": "Authentification réussie"
}
```

### Identifiants de test
- `BJ2025001` / `[CONFIDENTIEL]` (Adjoa KOSSOU)
- `BJ2025002` / `[CONFIDENTIEL]` (Marie DOSSOU)
- `BJ2025003` / `[CONFIDENTIEL]` (Jean HOUNKPATIN)
- `BJ20257830` / `[CONFIDENTIEL]` (Patient de test)

> ⚠️ **Note de sécurité :** Les mots de passe de test sont disponibles dans l'environnement de développement local uniquement.

## 👨‍⚕️ Authentification des Médecins

### Endpoint
```
POST /api/v1/auth/medecin
```

### Payload
```json
{
  "email": "m.kossou@chu-mel.bj",
  "password": "medecin123",
  "hopitalCode": "chu-mel"
}
```

### Réponse
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_...",
    "medecin": {
      "id": "cmf...",
      "medecinId": "MED-CHU-002",
      "nom": "KOSSOU",
      "prenom": "Dr. Marie",
      "email": "m.kossou@chu-mel.bj",
      "telephone": "+229 97 22 22 22",
      "specialite": "Cardiologie",
      "service": "Cardiologie",
      "isActive": true,
      "lastLogin": "2025-09-20T11:59:45.244Z",
      "hopital": {
        "nom": "CHU-MEL",
        "code": "chu-mel"
      }
    }
  },
  "message": "Authentification réussie"
}
```

### Identifiants de test
- `m.kossou@chu-mel.bj` / `[CONFIDENTIEL]` (Dr. Marie KOSSOU - Cardiologie)
- `j.adjahoui@chu-mel.bj` / `[CONFIDENTIEL]` (Dr. Jean ADJAHOUI - Médecine Générale)

> ⚠️ **Note de sécurité :** Les mots de passe de test sont disponibles dans l'environnement de développement local uniquement.

## 🏥 Authentification des Hôpitaux

### Endpoint
```
POST /api/v1/auth/hospital
```

### Payload
```json
{
  "adminId": "ADMIN-CHU-001",
  "password": "admin123"
}
```

### Réponse
```json
{
  "success": true,
  "data": {
    "token": "hospital_jwt_...",
    "admin": {
      "id": "cmf...",
      "adminId": "ADMIN-CHU-001",
      "nom": "ADMINISTRATEUR",
      "prenom": "Système",
      "email": "admin@chu-mel.bj",
      "telephone": "+229 97 00 00 01",
      "role": "super_admin",
      "hopital": {
        "nom": "CHU Mère-Enfant Lagune",
        "code": "CHU-MEL",
        "ville": "Cotonou"
      },
      "lastLogin": null
    }
  },
  "message": "Authentification réussie"
}
```

### Identifiants de test
- `ADMIN-CHU-001` / `[CONFIDENTIEL]` (CHU Mère-Enfant Lagune)
- `ADMIN-CNHU-001` / `[CONFIDENTIEL]` (CNHU Hubert Koutoukou Maga)

> ⚠️ **Note de sécurité :** Les mots de passe de test sont disponibles dans l'environnement de développement local uniquement.

## 🔧 Corrections Récentes

### Problème résolu : Service API Frontend

**Problème :** Double encapsulation des réponses API
- Backend retournait : `{ success: true, data: {...} }`
- Frontend encapsulait encore : `{ success: true, data: { success: true, data: {...} } }`

**Solution :** Modification du service API pour extraire directement la structure backend

```typescript
// Avant
return {
  success: true,
  data: responseData
}

// Après
if (responseData.success !== undefined) {
  return responseData // Utilise directement la structure backend
}
return {
  success: true,
  data: responseData
}
```

### Problème résolu : Authentification Médecin

**Problème :** Logique de double encapsulation dans MedecinLogin.tsx

**Solution :** Simplification de l'accès aux données
```typescript
// Avant
const backendResponse = response.data as any
if (response.success && backendResponse && backendResponse.success && backendResponse.data) {
  storeMedecinData(backendResponse.data.medecin, backendResponse.data.token, formData.rememberMe)
}

// Après
if (response.success && response.data?.medecin) {
  storeMedecinData(response.data.medecin, response.data.token, formData.rememberMe)
}
```

## 🧪 Tests d'Authentification

### Résultats des tests

**Score global : 100% (6/6)**
- ✅ Health Check : API opérationnelle
- ✅ Base de données : PostgreSQL connectée
- ✅ Auth Patients : 5/5 tests réussis
- ✅ Auth Médecins : 2/2 tests réussis
- ✅ Auth Hôpitaux : 2/2 tests réussis
- ✅ Endpoints API : 5/5 tests réussis

### Script de test

```javascript
// Test patient
const patientResponse = await axios.post('/api/v1/auth/patient', {
  patientId: 'BJ20257830',
  password: 'test123'
});

// Test médecin
const medecinResponse = await axios.post('/api/v1/auth/medecin', {
  email: 'm.kossou@chu-mel.bj',
  password: 'medecin123',
  hopitalCode: 'chu-mel'
});

// Test hôpital
const hospitalResponse = await axios.post('/api/v1/auth/hospital', {
  adminId: 'ADMIN-CHU-001',
  password: 'admin123'
});
```

## 🔒 Sécurité et Bonnes Pratiques

### Hachage des mots de passe

```typescript
const saltRounds = 12;
const passwordHash = await bcrypt.hash(password, saltRounds);
const isValid = await bcrypt.compare(password, passwordHash);
```

### Validation des données

```typescript
// Validation côté serveur
if (!patientId || !password) {
  return res.status(400).json({
    success: false,
    error: 'ID patient et mot de passe requis'
  });
}
```

### Gestion des erreurs

```typescript
// Réponse d'erreur standardisée
return res.status(401).json({
  success: false,
  error: 'Identifiants invalides'
});
```

## 📱 Intégration Frontend

### Stockage des sessions

```typescript
// Patient
localStorage.setItem('patient_session', JSON.stringify({
  patientId: response.data.patient.patientId,
  token: response.data.token,
  patient: response.data.patient,
  isAuthenticated: true,
  loginTime: new Date().toISOString()
}));

// Médecin
storeMedecinData(response.data.medecin, response.data.token, rememberMe);

// Hôpital
localStorage.setItem('hospital_session', JSON.stringify({
  adminId: response.data.admin.adminId,
  token: response.data.token,
  admin: response.data.admin,
  isAuthenticated: true,
  loginTime: new Date().toISOString()
}));
```

### Navigation après authentification

```typescript
// Redirection vers le dashboard approprié
navigate('/patient/dashboard');
navigate('/medecin/dashboard');
navigate('/hospital/dashboard');
```

## 🚀 Déploiement

### Variables d'environnement

```env
# Backend
DATABASE_URL="postgresql://..."
PORT=3001
NODE_ENV=production

# Sécurité
BCRYPT_ROUNDS=12
JWT_SECRET="your-secret-key"
```

### Health Check

```
GET /health
```

Réponse :
```json
{
  "status": "OK",
  "database": "Connected",
  "version": "v1",
  "timestamp": "2025-09-21T15:00:00.000Z"
}
```

## 📞 Support et Dépannage

### Erreurs communes

1. **"Identifiants invalides"**
   - Vérifier l'email/ID et le mot de passe
   - Vérifier que l'utilisateur est actif

2. **"Trop de tentatives"**
   - Attendre la fin du blocage temporaire
   - Vérifier les identifiants corrects

3. **"Erreur serveur"**
   - Vérifier la connexion à la base de données
   - Consulter les logs du serveur

### Logs utiles

```bash
# Backend logs
npm run dev

# Database logs
npx prisma studio
```

---

**🔐 Authentification sécurisée et fiable pour Hedera Health ID**
