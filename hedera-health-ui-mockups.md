# HEDERA HEALTH ID - MAQUETTES INTERFACE UX
## Description Complète des Écrans

---

## 🏠 **1. ÉCRAN D'ACCUEIL (Landing Page)**

```
┌─────────────────────────────────────┐
│ 🏥 HEDERA HEALTH ID         [🌍 FR] │
├─────────────────────────────────────┤
│                                     │
│         🫀 VOTRE SANTÉ              │
│         TOUJOURS AVEC VOUS          │
│                                     │
│  ┌─────────────┐  ┌─────────────┐   │
│  │👤 PATIENT   │  │👨‍⚕️ MÉDECIN  │   │
│  │             │  │             │   │
│  │• Mon carnet │  │• Scanner QR │   │
│  │• Mes données│  │• Consultations│   │
│  │• USSD *789# │  │• Dashboard  │   │
│  └─────────────┘  └─────────────┘   │
│                                     │
│  📱 Accessible partout:             │
│  • Smartphone • Web • USSD         │
│                                     │
│  [EN SAVOIR PLUS] [DÉMO]           │
└─────────────────────────────────────┘
```

**Éléments clés:**
- Header avec logo et sélecteur langue (FR/EN)
- Hero section avec proposition de valeur claire
- Deux CTA principaux: Patient vs Médecin
- Badges accessibilité (multi-canal)
- Boutons secondaires pour découverte

---

## 👤 **2. INSCRIPTION PATIENT**

```
┌─────────────────────────────────────┐
│ ← 🏥 HEDERA HEALTH ID       [👤]    │
├─────────────────────────────────────┤
│                                     │
│        📝 CRÉER MON CARNET          │
│                                     │
│  Nom: [Adjoa KOSSOU              ]  │
│  Prénom: [                       ]  │
│  Date naissance: [📅 12/05/1990  ]  │
│  Téléphone: [📱 +229 97 XX XX XX ]  │
│  Email: [📧                      ]  │
│                                     │
│  🏥 Hôpital principal:              │
│  [▼ CHU-MEL - Cotonou             ] │
│                                     │
│  📋 Importer ancien dossier:        │
│  [📁 CHOISIR FICHIER] (optionnel)   │
│                                     │
│  ☑️ J'accepte les conditions       │
│  ☑️ Je consens au traitement        │
│      de mes données médicales       │
│                                     │
│        [CRÉER MON CARNET]           │
└─────────────────────────────────────┘
```

**Fonctionnalités:**
- Formulaire simple et clair
- Sélection hôpital principal via dropdown
- Upload optionnel ancien dossier (PDF/image)
- Cases à cocher consentement RGPD
- Validation en temps réel des champs

---

## 🎯 **3. GÉNÉRATION ID PATIENT**

```
┌─────────────────────────────────────┐
│ ← 🏥 HEDERA HEALTH ID       [👤]    │
├─────────────────────────────────────┤
│                                     │
│        🎉 CARNET CRÉÉ!              │
│                                     │
│        Votre ID Unique:             │
│      ┌─────────────────────┐        │
│      │    📱 BJ2025001     │        │
│      │  ████ ████ ████    │        │
│      │  ████ ████ ████    │        │
│      │  ████ ████ ████    │        │
│      │                     │        │
│      │ Adjoa KOSSOU        │        │
│      │ CHU-MEL            │        │
│      └─────────────────────┘        │
│                                     │
│  📱 Actions rapides:                │
│  [📥 TÉLÉCHARGER]  [📤 PARTAGER]    │
│                                     │
│  📞 Accès USSD: *789*BJ2025001#     │
│                                     │
│        [ACCÉDER MON CARNET]         │
└─────────────────────────────────────┘
```

**Éléments clés:**
- QR Code généré automatiquement
- ID unique affiché clairement
- Options téléchargement/partage
- Code USSD explicite
- CTA vers dashboard principal

---

## 📊 **4. DASHBOARD PATIENT**

```
┌─────────────────────────────────────┐
│ 🏥 Health ID    [BJ2025001]    [⚙️] │
├─────────────────────────────────────┤
│                                     │
│    👋 Bonjour Adjoa                │
│                                     │
│  ┌─────────────┐  ┌─────────────┐   │
│  │📊 RÉSUMÉ    │  │🗓️ PROCHAINS│   │
│  │             │  │              │   │
│  │3 consultations│ │• RDV Dr.TOMEY│   │
│  │2 prescriptions│ │  Mardi 15h   │   │
│  │1 analyse    │  │• Prise sang  │   │
│  │             │  │  Jeudi matin │   │
│  └─────────────┘  └─────────────┘   │
│                                     │
│  📋 HISTORIQUE RÉCENT:              │
│  ┌─────────────────────────────────┐ │
│  │🩺 12/08 - Consultation générale│ │
│  │   Dr. ADJAHOUI | CHU-MEL       │ │
│  │   💊 Paracétamol prescrit       │ │
│  └─────────────────────────────────┘ │
│                                     │
│  [📱 MON QR] [📞 USSD] [📋 TOUT]   │
└─────────────────────────────────────┘
```

**Fonctionnalités:**
- Vue synthétique de l'état de santé
- Prochains RDV prominents
- Historique récent cliquable
- Accès rapide QR Code et USSD
- Settings dans le header

---

## 🏥 **5. CONNEXION MÉDECIN**

```
┌─────────────────────────────────────┐
│ ← 🏥 HEDERA HEALTH ID               │
├─────────────────────────────────────┤
│                                     │
│        👨‍⚕️ ESPACE MÉDECIN            │
│                                     │
│  🏥 Hôpital:                        │
│  [▼ CHU-MEL - Cotonou             ] │
│                                     │
│  👨‍⚕️ Email professionnel:           │
│  [dr.adjahoui@chu-mel.bj         ]  │
│                                     │
│  🔒 Mot de passe:                   │
│  [••••••••••                     ]  │
│                                     │
│  ☑️ Se souvenir de moi              │
│                                     │
│        [SE CONNECTER]               │
│                                     │
│  ────── ou ──────                   │
│                                     │
│  📱 [SCANNER QR PATIENT]            │
│      (Accès direct consultation)    │
│                                     │
│  [Mot de passe oublié?]             │
└─────────────────────────────────────┘
```

**Éléments clés:**
- Sélection hôpital obligatoire
- Authentification par email professionnel
- Option "Scanner QR direct" pour urgences
- Interface sécurisée et professionnelle

---

## 📱 **6. SCANNER QR MÉDECIN**

```
┌─────────────────────────────────────┐
│ ← Dr. ADJAHOUI | CHU-MEL      [📱] │
├─────────────────────────────────────┤
│                                     │
│       📷 SCANNER PATIENT            │
│                                     │
│  ┌─────────────────────────────────┐ │
│  │                                 │ │
│  │    ┌─────────────────┐          │ │
│  │    │ ████ ████ ████ │   📱    │ │
│  │    │ ████ ████ ████ │          │ │
│  │    │ ████ ████ ████ │          │ │
│  │    └─────────────────┘          │ │
│  │                                 │ │
│  │   Centrez le QR Code            │ │
│  │   dans le cadre                 │ │
│  └─────────────────────────────────┘ │
│                                     │
│  ─── Alternative ───                │
│                                     │
│  🔤 Saisir ID manuellement:         │
│  [BJ2025___                      ]  │
│                                     │
│         [RECHERCHER]                │
└─────────────────────────────────────┘
```

**Fonctionnalités:**
- Interface caméra native responsive
- Zone de scan clairement délimitée
- Fallback saisie manuelle ID
- Instructions visuelles claires

---

## 📋 **7. DOSSIER PATIENT (VUE MÉDECIN)**

```
┌─────────────────────────────────────┐
│ ← Scanner | Dr. ADJAHOUI      [📱] │
├─────────────────────────────────────┤
│                                     │
│    👤 Adjoa KOSSOU | BJ2025001     │
│    34 ans • ♀ • CHU-MEL            │
│                                     │
│  ┌─────────────┐  ┌─────────────┐   │
│  │⚠️ ALERTES   │  │📊 RÉSUMÉ    │   │
│  │             │  │             │   │
│  │• Allergie   │  │💉 Vaccins OK│   │
│  │  Pénicilline│  │🩸 Groupe A+ │   │
│  │• RAS        │  │⚖️ 65kg      │   │
│  └─────────────┘  └─────────────┘   │
│                                     │
│  📋 HISTORIQUE (5 consultations):   │
│  ┌─────────────────────────────────┐ │
│  │🩺 12/08/25 - Dr.ADJAHOUI        │ │
│  │   Grippe • Paracétamol prescrit │ │
│  │ ▼ [DÉTAILS]                     │ │
│  └─────────────────────────────────┘ │
│                                     │
│  [➕ NOUVELLE CONSULTATION]         │
└─────────────────────────────────────┘
```

**Informations affichées:**
- Identité claire avec photo optionnelle
- Alertes médicales critiques
- Résumé santé synthétique
- Historique chronologique dépliable
- CTA ajout consultation prominent

---

## ✏️ **8. NOUVELLE CONSULTATION**

```
┌─────────────────────────────────────┐
│ ← Adjoa KOSSOU | Dr. ADJAHOUI [📱] │
├─────────────────────────────────────┤
│                                     │
│    ➕ NOUVELLE CONSULTATION         │
│                                     │
│  Date: [📅 20/08/2025            ]  │
│  Heure: [🕐 14:30                ]  │
│                                     │
│  🩺 Type de consultation:           │
│  [▼ Consultation générale        ]  │
│                                     │
│  📝 Motif de consultation:          │
│  [Douleurs abdominales depuis   ]  │
│  [3 jours, nausées              ]  │
│                                     │
│  🔍 Diagnostic:                     │
│  [Gastro-entérite probable      ]  │
│                                     │
│  💊 Prescriptions:                  │
│  [+ Ajouter médicament]             │
│  ☑️ Smecta 3g x3/jour x 5 jours     │
│                                     │
│  📋 Prochaines étapes:              │
│  [☑️ Retour si pas d'amélioration ] │
│  [☑️ Régime hydrique renforcé    ]  │
│                                     │
│    [ENREGISTRER] [ANNULER]          │
└─────────────────────────────────────┘
```

**Fonctionnalités:**
- Formulaire structuré médical
- Dropdown types consultation
- Zone prescription avec autocomplete
- Recommandations par checkbox
- Sauvegarde automatique en blockchain

---

## 📊 **9. DASHBOARD MÉDECIN**

```
┌─────────────────────────────────────┐
│ 🏥 Dr. ADJAHOUI | CHU-MEL     [⚙️] │
├─────────────────────────────────────┤
│                                     │
│    📊 VUE D'ENSEMBLE                │
│                                     │
│  ┌─────────────┐  ┌─────────────┐   │
│  │👥 PATIENTS  │  │📅 PLANNING  │   │
│  │             │  │             │   │
│  │127 total    │  │• 14:00 A.K  │   │
│  │8 aujourd'hui│  │• 15:30 M.D  │   │
│  │3 en attente │  │• 16:00 Libre│   │
│  └─────────────┘  └─────────────┘   │
│                                     │
│  🔍 RECHERCHE RAPIDE:               │
│  [🔍 ID Patient ou nom...        ]  │
│                                     │
│  📱 ACTIONS RAPIDES:                │
│  [📷 SCANNER QR] [➕ NOUVELLE]       │
│                                     │
│  📋 PATIENTS RÉCENTS:               │
│  • BJ2025001 - Adjoa KOSSOU         │
│  • BJ2025034 - Marie DOSSOU         │
│  • BJ2024987 - Jean HOUNKPATIN      │
│                                     │
│  [📊 STATISTIQUES] [📋 RAPPORTS]    │
└─────────────────────────────────────┘
```

**Éléments clés:**
- KPIs journaliers en cards
- Planning intégré
- Recherche patients centralisée  
- Actions rapides prominentes
- Historique patients récents

---

## 📱 **10. SIMULATEUR USSD**

```
┌─────────────────────────────────────┐
│ 📱 MTN Bénin      🔋88%    📶 EDGE │
├─────────────────────────────────────┤
│                                     │
│  *789*BJ2025001#                   │
│                                     │
│  🏥 HEDERA HEALTH ID                │
│                                     │
│  Bonjour Adjoa KOSSOU               │
│                                     │
│  1. Mes consultations récentes      │
│  2. Mes prescriptions               │
│  3. Prochains RDV                   │
│  4. Mon ID et QR                    │
│  5. Urgence - Partager dossier      │
│  6. Paramètres                      │
│  0. Menu principal                  │
│                                     │
│  Tapez votre choix:                 │
│  [1]                                │
│                                     │
│  Session expire dans: 2:45          │
└─────────────────────────────────────┘
```

**Fonctionnalités USSD:**
- Interface feature phone authentique
- Menu numéroté simple
- Timer de session visible
- Accès aux données essentielles
- Option urgence prioritaire

---

## 🚨 **11. USSD URGENCE**

```
┌─────────────────────────────────────┐
│ 📱 MTN Bénin      🔋88%    📶 EDGE │
├─────────────────────────────────────┤
│                                     │
│  🚨 MODE URGENCE                    │
│                                     │
│  Adjoa KOSSOU - BJ2025001           │
│  Groupe sanguin: A+                 │
│  Allergies: Pénicilline             │
│                                     │
│  🏥 Hôpital principal:              │
│  CHU-MEL - Cotonou                  │
│  Dr. ADJAHOUI                       │
│  +229 21 XX XX XX                   │
│                                     │
│  📋 Dernière consultation:           │
│  20/08/25 - Gastro-entérite         │
│                                     │
│  ⚠️  PARTAGE ACTIVÉ                 │
│  Médecin peut accéder dossier       │
│  pendant 2 heures                   │
│                                     │
│  # Retour  0 Menu                   │
└─────────────────────────────────────┘
```

**Fonctionnalités urgence:**
- Informations critiques en premier
- Contact médecin référent
- Partage temporaire automatique
- Interface optimisée stress

---

## ⚙️ **12. PARAMÈTRES PATIENT**

```
┌─────────────────────────────────────┐
│ ← Dashboard | Adjoa KOSSOU   [👤] │
├─────────────────────────────────────┤
│                                     │
│        ⚙️ MES PARAMÈTRES            │
│                                     │
│  👤 PROFIL:                         │
│  [✏️ Modifier informations]          │
│  [🔒 Changer mot de passe]          │
│                                     │
│  🔐 CONFIDENTIALITÉ:                │
│  [🏥 Gérer accès médecins]          │
│  [📊 Partage données recherche]     │
│                                     │
│  🏥 Médecins autorisés:              │
│  ✅ Dr. ADJAHOUI (CHU-MEL)          │
│  ✅ Dr. TOMEY (Pasteur)             │
│  [+ Autoriser nouveau médecin]       │
│                                     │
│  📱 NOTIFICATIONS:                   │
│  ☑️ SMS pour nouveaux RDV            │
│  ☑️ Rappels prise médicaments        │
│  ☐ Alertes santé préventive         │
│                                     │
│  🗑️ DANGER:                         │
│  [🗑️ Supprimer mon compte]          │
└─────────────────────────────────────┘
```

**Options configurables:**
- Profil utilisateur éditable
- Gestion granulaire des permissions
- Notifications personnalisables
- Zone danger pour suppression

---

## 📊 **13. ANALYTICS HÔPITAL**

```
┌─────────────────────────────────────┐
│ 🏥 CHU-MEL | Admin Dashboard  [👨‍💼] │
├─────────────────────────────────────┤
│                                     │
│    📊 STATISTIQUES DU MOIS          │
│                                     │
│  ┌─────────────┐  ┌─────────────┐   │
│  │👥 PATIENTS  │  │📋 CONSULT.  │   │
│  │             │  │             │   │
│  │1,247 actifs │  │3,456 total  │   │
│  │+12% vs mois │  │↗️ +8%       │   │
│  └─────────────┘  └─────────────┘   │
│                                     │
│  ┌─────────────┐  ┌─────────────┐   │
│  │💰 ÉCONOMIES │  │⏱️ TEMPS     │   │
│  │             │  │             │   │
│  │2.3M FCFA    │  │-15 min/     │   │
│  │examens évités│  │consultation │   │
│  └─────────────┘  └─────────────┘   │
│                                     │
│  📈 GRAPHIQUE UTILISATION:          │
│  [████████████████████    ] 82%     │
│                                     │
│  [📊 RAPPORT DÉTAILLÉ]              │
│  [📤 EXPORTER DONNÉES]              │
└─────────────────────────────────────┘
```

**Métriques clés:**
- KPIs opérationnels temps réel  
- Comparaisons historiques
- Économies quantifiées
- ROI démontrable pour décideurs

---

## 🎯 **PRINCIPES DESIGN GÉNÉRAL**

### **Couleurs Hedera**
- **Primaire**: #00D4AA (Vert Hedera)
- **Secondaire**: #1E3A8A (Bleu médical)
- **Accent**: #F59E0B (Orange alertes)
- **Neutral**: #6B7280 (Gris texte)

### **Typographie**
- **Headings**: Inter Bold 24px/20px/16px
- **Body**: Inter Regular 14px/12px
- **Code**: JetBrains Mono 12px

### **Iconographie**
- **Médical**: 🏥 🩺 💊 🧬
- **Tech**: 📱 🔗 ⚡ 🔒
- **Users**: 👤 👨‍⚕️ 👥 🫂

### **Responsive Breakpoints**
- **Mobile**: < 768px (priorité feature phone)
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

### **Accessibilité**
- Contraste WCAG AA minimum
- Navigation clavier complète
- Textes alternatifs images
- Support lecteurs d'écran

---

> **Ces maquettes forment la base UX complète pour développer le MVP fonctionnel !**