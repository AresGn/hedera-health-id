# 🏥 Hedera Health ID - API Documentation

## Endpoints

### Patients
- `GET /api/patients` - Liste des patients
- `POST /api/patients` - Créer un patient
- `GET /api/patients/:id` - Détails patient
- `PUT /api/patients/:id` - Modifier patient

### Médecins  
- `GET /api/medecins` - Liste des médecins
- `POST /api/medecins/login` - Connexion médecin

### Consultations
- `GET /api/consultations` - Liste consultations
- `POST /api/consultations` - Nouvelle consultation

### Hedera
- `GET /api/hedera/status` - Status blockchain
- `POST /api/hedera/create-patient` - Patient sur blockchain
