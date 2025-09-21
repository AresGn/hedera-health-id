# 💡 Exemples Pratiques d'Intégration - Hedera Health ID

## Scénarios Concrets d'Utilisation

Cette documentation présente des **exemples pratiques complets** montrant comment chaque fonctionnalité des contrats intelligents est utilisée concrètement par les tableaux de bord.

---

## 🏥 Scénario 1 : Nouvelle Patiente - Adjoa KOSSOU

### **Contexte**
Adjoa KOSSOU, 34 ans, habitante de Cotonou, souhaite créer son identité médicale numérique pour la première fois.

### **Étape 1 : Inscription Patient**

#### **Frontend : PatientRegistration.tsx**
```typescript
// Composant d'inscription patient
const PatientRegistration = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phoneNumber: '',
    email: '',
    address: {
      street: '',
      city: 'Cotonou',
      country: 'Bénin'
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Génération d'une adresse Ethereum pour le patient
    const patientWallet = generateWallet();

    // 2. Appel API pour créer le patient sur blockchain
    const response = await fetch('/api/hedera/create-patient', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personalData: formData,
        patientAddress: patientWallet.address,
        metadataHash: await uploadToIPFS(formData) // Optionnel
      })
    });

    const result = await response.json();

    if (result.success) {
      // 3. Stockage local des informations
      localStorage.setItem('patientData', JSON.stringify({
        patientId: result.data.patientId,
        walletAddress: patientWallet.address,
        privateKey: patientWallet.privateKey, // Chiffré
        qrCode: result.data.qrCode
      }));

      // 4. Redirection vers génération QR Code
      navigate('/patient/qr-generation');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Prénom"
          value={formData.firstName}
          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
          required
        />
        <Input
          label="Nom"
          value={formData.lastName}
          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
          required
        />
      </div>

      <Button type="submit" className="w-full">
        Créer mon identité médicale
      </Button>
    </form>
  );
};
```

#### **Backend : API Route**
```typescript
// backend/src/routes/blockchain/patients.ts
router.post('/create-patient', async (req: Request, res: Response) => {
  try {
    // 1. Validation des données avec Zod
    const validatedData = CreatePatientSchema.parse(req.body);

    // 2. Appel au service Hedera
    const result = await patientIdentityService.registerPatient({
      personalData: validatedData.personalData,
      patientAddress: validatedData.patientAddress,
      metadataHash: validatedData.metadataHash
    });

    if (result.success) {
      // 3. Génération du QR Code
      const qrCodeData = {
        patientId: result.patientId,
        patientAddress: validatedData.patientAddress,
        timestamp: Date.now(),
        version: '1.0'
      };

      const qrCode = await generateQRCode(qrCodeData);

      // 4. Réponse avec toutes les données nécessaires
      res.status(201).json({
        success: true,
        message: 'Patient créé avec succès sur la blockchain',
        data: {
          patientId: result.patientId,
          transactionId: result.transactionId,
          qrCode: qrCode,
          encryptedData: result.encryptedData
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la création du patient',
      error: error.message
    });
  }
});
```

#### **Service Hedera : PatientIdentityService**
```typescript
// backend/src/services/hedera/patient-identity.service.ts
async registerPatient(patientData: {
  personalData: any;
  patientAddress: string;
  metadataHash?: string;
}): Promise<any> {
  try {
    // 1. Chiffrement des données personnelles
    const encryptedData = this.encryptPatientData(patientData.personalData);

    // 2. Préparation des paramètres pour le contrat
    const functionParameters = new ContractFunctionParameters()
      .addString(encryptedData)
      .addString(patientData.metadataHash || '');

    // 3. Exécution de la transaction sur Hedera
    const result = await hederaService.executeContractFunction(
      this.contractId,
      'registerPatient',
      functionParameters,
      150000 // Gas limit
    );

    if (result.success) {
      // 4. Extraction de l'ID patient depuis les logs
      const patientId = this.extractPatientIdFromReceipt(result.receipt);

      return {
        success: true,
        patientId: patientId,
        transactionId: result.transactionId,
        encryptedData: encryptedData
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

private encryptPatientData(personalData: any): string {
  const key = process.env.ENCRYPTION_KEY;
  const cipher = crypto.createCipher('aes-256-cbc', key);
  let encrypted = cipher.update(JSON.stringify(personalData), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}
```

#### **Contrat Intelligent : PatientIdentityContract.sol**
```solidity
function registerPatient(
    string memory _encryptedData,
    string memory _metadataHash
) public returns (uint256) {
    require(
        addressToPatientId[msg.sender] == 0,
        "Patient deja enregistre avec cette adresse"
    );
    require(
        bytes(_encryptedData).length > 0,
        "Donnees chiffrees requises"
    );

    uint256 patientId = nextPatientId;

    // Création du patient
    patients[patientId] = Patient({
        patientId: patientId,
        encryptedPersonalData: _encryptedData,
        patientAddress: msg.sender,
        isActive: true,
        creationDate: block.timestamp,
        metadataHash: _metadataHash
    });

    addressToPatientId[msg.sender] = patientId;
    nextPatientId++;

    // Émission de l'événement
    emit PatientRegistered(patientId, msg.sender, block.timestamp);
    return patientId;
}
```

### **Résultat pour Adjoa**
- ✅ **ID Patient :** BJ2025001 (généré automatiquement)
- ✅ **QR Code :** Contient ses données chiffrées
- ✅ **Transaction Hedera :** 0.0.123456@1695123456.789
- ✅ **Données sécurisées :** Chiffrées AES-256 sur blockchain

---

## 👨‍⚕️ Scénario 2 : Dr. ADJAHOUI consulte Adjoa

### **Contexte**
Dr. ADJAHOUI (CHU-MEL) reçoit Adjoa en consultation. Il doit scanner son QR Code pour accéder à son dossier médical.

### **Étape 1 : Scanner QR Code**

#### **Frontend : QRScanner.tsx (dans MedecinDashboard)**
```typescript
const QRScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleScan = async (qrData: string) => {
    try {
      // 1. Parsing des données QR Code
      const patientData = JSON.parse(qrData);

      // 2. Vérification des permissions d'accès
      const doctorAddress = localStorage.getItem('doctorWalletAddress');

      const permissionCheck = await fetch('/api/hedera/access-control/check-permission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: doctorAddress,
          patientId: patientData.patientId,
          action: "READ_MEDICAL_RECORDS"
        })
      });

      const hasPermission = await permissionCheck.json();

      if (hasPermission.allowed) {
        // 3. Accès autorisé - Redirection vers dossier
        navigate(`/medecin/patient/${patientData.patientId}`);
      } else {
        // 4. Pas d'autorisation - Demande d'accès
        setShowPermissionRequest(true);
        setPendingPatientData(patientData);
      }

    } catch (error) {
      setError('QR Code invalide ou corrompu');
    }
  };

  const requestAccess = async () => {
    // Demande d'autorisation au patient (via notification)
    const response = await fetch('/api/hedera/request-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId: pendingPatientData.patientId,
        doctorAddress: localStorage.getItem('doctorWalletAddress'),
        doctorName: localStorage.getItem('doctorName'),
        hospital: localStorage.getItem('doctorHospital'),
        requestReason: 'Consultation médicale'
      })
    });

    if (response.ok) {
      setNotification('Demande d\'accès envoyée au patient');
    }
  };

  return (
    <div className="qr-scanner">
      <video ref={videoRef} className="w-full h-64 bg-black rounded-lg" />

      {showPermissionRequest && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold text-yellow-800">
            Autorisation requise
          </h3>
          <p className="text-yellow-700 mt-2">
            Vous n'avez pas l'autorisation d'accéder au dossier de ce patient.
          </p>
          <Button onClick={requestAccess} className="mt-3">
            Demander l'autorisation
          </Button>
        </div>
      )}
    </div>
  );
};
```

### **Étape 2 : Adjoa autorise Dr. ADJAHOUI**

#### **Frontend : PatientPermissions.tsx**
```typescript
const PatientPermissions = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [authorizedDoctors, setAuthorizedDoctors] = useState([]);

  useEffect(() => {
    loadPendingRequests();
    loadAuthorizedDoctors();
  }, []);

  const authorizeDoctor = async (requestId: string, permissions: string[]) => {
    const response = await fetch('/api/hedera/authorize-doctor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId: currentPatient.id,
        doctorAddress: request.doctorAddress,
        expirationDate: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 jours
        allowedActions: permissions
      })
    });

    const result = await response.json();

    if (result.success) {
      // Mise à jour de la liste
      setAuthorizedDoctors(prev => [...prev, {
        doctorAddress: request.doctorAddress,
        doctorName: request.doctorName,
        hospital: request.hospital,
        permissions: permissions,
        grantedAt: new Date(),
        expiresAt: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)),
        permissionId: result.data.permissionId
      }]);

      // Suppression de la demande en attente
      setPendingRequests(prev => prev.filter(r => r.id !== requestId));

      // Notification de succès
      setNotification({
        type: 'success',
        message: `Dr. ${request.doctorName} a été autorisé à accéder à votre dossier`
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Demandes en attente */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-3">
          Demandes d'autorisation en attente
        </h3>

        {pendingRequests.map(request => (
          <div key={request.id} className="bg-white p-4 rounded border mb-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{request.doctorName}</h4>
                <p className="text-gray-600">{request.hospital}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Demandé le {new Date(request.requestedAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => authorizeDoctor(request.id, [
                    'READ_MEDICAL_RECORDS',
                    'ADD_CONSULTATION',
                    'VIEW_HISTORY'
                  ])}
                >
                  Autoriser
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => rejectRequest(request.id)}
                >
                  Refuser
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Médecins autorisés */}
      <div>
        <h3 className="font-semibold mb-3">Médecins autorisés</h3>

        {authorizedDoctors.map(doctor => (
          <div key={doctor.permissionId} className="bg-white border rounded-lg p-4 mb-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{doctor.doctorName}</h4>
                <p className="text-gray-600">{doctor.hospital}</p>
                <p className="text-sm text-gray-500">
                  Autorisé le {doctor.grantedAt.toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  Expire le {doctor.expiresAt.toLocaleDateString()}
                </p>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => revokeAccess(doctor.permissionId)}
              >
                Révoquer
              </Button>
            </div>

            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700">Permissions accordées :</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {doctor.permissions.map(permission => (
                  <span key={permission} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    {permission}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### **Étape 3 : Dr. ADJAHOUI accède au dossier d'Adjoa**

#### **Frontend : PatientRecord.tsx (Vue Médecin)**
```typescript
const PatientRecord = () => {
  const { patientId } = useParams();
  const [patientInfo, setPatientInfo] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatientRecord(patientId);
  }, [patientId]);

  const loadPatientRecord = async (patientId: string) => {
    try {
      // 1. Vérification des permissions (double vérification)
      const doctorAddress = localStorage.getItem('doctorWalletAddress');

      const permissionResponse = await fetch('/api/hedera/access-control/check-permission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: doctorAddress,
          patientId: patientId,
          action: "READ_MEDICAL_RECORDS"
        })
      });

      const hasPermission = await permissionResponse.json();

      if (!hasPermission.allowed) {
        setError('Accès non autorisé à ce dossier patient');
        return;
      }

      // 2. Chargement des informations patient
      const patientResponse = await fetch(`/api/hedera/patient/${patientId}`);
      const patientData = await patientResponse.json();

      if (patientData.success) {
        setPatientInfo({
          id: patientData.data.patientId,
          name: `${patientData.data.decryptedData.firstName} ${patientData.data.decryptedData.lastName}`,
          dateOfBirth: patientData.data.decryptedData.dateOfBirth,
          gender: patientData.data.decryptedData.gender,
          phone: patientData.data.decryptedData.phoneNumber,
          email: patientData.data.decryptedData.email,
          address: patientData.data.decryptedData.address,
          registeredAt: new Date(patientData.data.creationDate * 1000)
        });
      }

      // 3. Chargement de l'historique médical
      const historyResponse = await fetch(`/api/hedera/medical-history/${patientId}`);
      const historyData = await historyResponse.json();

      if (historyData.success) {
        // Récupération des détails de chaque enregistrement
        const detailedRecords = await Promise.all(
          historyData.data.records.map(async (recordId) => {
            const recordResponse = await fetch(`/api/hedera/medical-record/${recordId}`);
            const recordData = await recordResponse.json();

            return {
              id: recordId,
              date: new Date(recordData.data.timestamp * 1000),
              type: recordData.data.recordType,
              doctorAddress: recordData.data.doctorAddress,
              diagnosis: recordData.data.decryptedData?.diagnosis,
              treatment: recordData.data.decryptedData?.treatment,
              prescription: recordData.data.decryptedData?.prescription,
              notes: recordData.data.decryptedData?.notes,
              isEmergency: recordData.data.isEmergency,
              status: recordData.data.status,
              attachments: recordData.data.attachmentHashes
            };
          })
        );

        setMedicalHistory(detailedRecords.sort((a, b) => b.date - a.date));
      }

      // 4. Log de l'accès pour audit
      await fetch('/api/hedera/access-control/log-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessor: doctorAddress,
          patientId: patientId,
          action: "READ_PATIENT_RECORD",
          success: true,
          details: `Consultation du dossier patient ${patientId} par Dr. ${localStorage.getItem('doctorName')}`
        })
      });

    } catch (error) {
      setError('Erreur lors du chargement du dossier patient');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Chargement du dossier patient...</div>;
  if (!patientInfo) return <div>Dossier patient non trouvé</div>;

  return (
    <div className="space-y-6">
      {/* Informations patient */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Informations Patient</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom complet</label>
            <p className="mt-1 text-sm text-gray-900">{patientInfo.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
            <p className="mt-1 text-sm text-gray-900">{patientInfo.dateOfBirth}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Téléphone</label>
            <p className="mt-1 text-sm text-gray-900">{patientInfo.phone}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-sm text-gray-900">{patientInfo.email}</p>
          </div>
        </div>
      </div>

      {/* Historique médical */}
      <div className="bg-white border rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Historique Médical</h2>
          <Button onClick={() => navigate(`/medecin/consultation/new/${patientId}`)}>
            Nouvelle Consultation
          </Button>
        </div>

        <div className="space-y-4">
          {medicalHistory.map(record => (
            <div key={record.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">
                    {getRecordTypeLabel(record.type)}
                    {record.isEmergency && (
                      <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                        URGENCE
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {record.date.toLocaleDateString()} à {record.date.toLocaleTimeString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded ${getStatusColor(record.status)}`}>
                  {record.status}
                </span>
              </div>

              {record.diagnosis && (
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">Diagnostic</label>
                  <p className="text-sm text-gray-900">{record.diagnosis}</p>
                </div>
              )}

              {record.treatment && (
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">Traitement</label>
                  <p className="text-sm text-gray-900">{record.treatment}</p>
                </div>
              )}

              {record.prescription && (
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">Prescription</label>
                  <p className="text-sm text-gray-900">{record.prescription}</p>
                </div>
              )}

              {record.notes && (
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <p className="text-sm text-gray-900">{record.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```

### **Étape 4 : Dr. ADJAHOUI crée une nouvelle consultation**

#### **Frontend : NewConsultation.tsx**
```typescript
const NewConsultation = () => {
  const { patientId } = useParams();
  const [consultationData, setConsultationData] = useState({
    diagnosis: '',
    treatment: '',
    prescription: '',
    vitalSigns: {
      temperature: '',
      bloodPressure: '',
      heartRate: '',
      weight: '',
      height: ''
    },
    notes: '',
    isEmergency: false,
    attachments: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1. Upload des pièces jointes vers IPFS (si présentes)
      const attachmentHashes = await Promise.all(
        consultationData.attachments.map(file => uploadToIPFS(file))
      );

      // 2. Sauvegarde de la consultation sur blockchain
      const response = await fetch('/api/hedera/add-consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: patientId,
          doctorAddress: localStorage.getItem('doctorWalletAddress'),
          recordType: 0, // CONSULTATION
          medicalData: {
            diagnosis: consultationData.diagnosis,
            treatment: consultationData.treatment,
            prescription: consultationData.prescription,
            vitalSigns: consultationData.vitalSigns,
            notes: consultationData.notes
          },
          attachments: attachmentHashes,
          isEmergency: consultationData.isEmergency
        })
      });

      const result = await response.json();

      if (result.success) {
        // 3. Notification de succès
        setNotification({
          type: 'success',
          message: `Consultation enregistrée avec succès sur la blockchain (TX: ${result.data.transactionId})`
        });

        // 4. Redirection vers le dossier patient
        navigate(`/medecin/patient/${patientId}`);
      }

    } catch (error) {
      setError('Erreur lors de la sauvegarde de la consultation');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Nouvelle Consultation</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Diagnostic
            </label>
            <textarea
              value={consultationData.diagnosis}
              onChange={(e) => setConsultationData({
                ...consultationData,
                diagnosis: e.target.value
              })}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Diagnostic principal..."
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Traitement
            </label>
            <textarea
              value={consultationData.treatment}
              onChange={(e) => setConsultationData({
                ...consultationData,
                treatment: e.target.value
              })}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Plan de traitement..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prescription
            </label>
            <textarea
              value={consultationData.prescription}
              onChange={(e) => setConsultationData({
                ...consultationData,
                prescription: e.target.value
              })}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Médicaments prescrits..."
            />
          </div>
        </div>

        {/* Constantes vitales */}
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">Constantes Vitales</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Température (°C)
              </label>
              <input
                type="number"
                step="0.1"
                value={consultationData.vitalSigns.temperature}
                onChange={(e) => setConsultationData({
                  ...consultationData,
                  vitalSigns: {
                    ...consultationData.vitalSigns,
                    temperature: e.target.value
                  }
                })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tension (mmHg)
              </label>
              <input
                type="text"
                value={consultationData.vitalSigns.bloodPressure}
                onChange={(e) => setConsultationData({
                  ...consultationData,
                  vitalSigns: {
                    ...consultationData.vitalSigns,
                    bloodPressure: e.target.value
                  }
                })}
                placeholder="120/80"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pouls (bpm)
              </label>
              <input
                type="number"
                value={consultationData.vitalSigns.heartRate}
                onChange={(e) => setConsultationData({
                  ...consultationData,
                  vitalSigns: {
                    ...consultationData.vitalSigns,
                    heartRate: e.target.value
                  }
                })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Poids (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={consultationData.vitalSigns.weight}
                onChange={(e) => setConsultationData({
                  ...consultationData,
                  vitalSigns: {
                    ...consultationData.vitalSigns,
                    weight: e.target.value
                  }
                })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Taille (cm)
              </label>
              <input
                type="number"
                value={consultationData.vitalSigns.height}
                onChange={(e) => setConsultationData({
                  ...consultationData,
                  vitalSigns: {
                    ...consultationData.vitalSigns,
                    height: e.target.value
                  }
                })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center">
          <input
            type="checkbox"
            id="emergency"
            checked={consultationData.isEmergency}
            onChange={(e) => setConsultationData({
              ...consultationData,
              isEmergency: e.target.checked
            })}
            className="mr-2"
          />
          <label htmlFor="emergency" className="text-sm font-medium text-gray-700">
            Marquer comme consultation d'urgence
          </label>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/medecin/patient/${patientId}`)}
          >
            Annuler
          </Button>
          <Button type="submit">
            Enregistrer la consultation
          </Button>
        </div>
      </div>
    </form>
  );
};
```

### **Résultat de la Consultation**
- ✅ **Consultation enregistrée** sur blockchain (immuable)
- ✅ **Transaction Hedera :** 0.0.789012@1695234567.890
- ✅ **Diagnostic :** Hypertension légère
- ✅ **Traitement :** Repos et surveillance
- ✅ **Prescription :** Amlodipine 5mg, 1 cp/jour
- ✅ **Accès loggé** pour audit et traçabilité
```