import 'dotenv/config';
import {
    Client,
    PrivateKey,
    AccountId,
    ContractCreateFlow,
    Hbar
} from "@hashgraph/sdk";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Déploiement simple pour tester
 */
async function deploySimple() {
    console.log("🚀 Test de déploiement simple");
    console.log("=" .repeat(40));
    
    try {
        const operatorId = process.env.OPERATOR_ID;
        const operatorKey = process.env.OPERATOR_KEY;

        console.log(`✅ Operator ID: ${operatorId}`);

        if (!operatorId || !operatorKey) {
            throw new Error("Variables d'environnement manquantes!");
        }

        // Parse de la clé privée
        let operatorPrivateKey;
        if (operatorKey.startsWith('0x')) {
            operatorPrivateKey = PrivateKey.fromStringECDSA(operatorKey.substring(2));
        } else if (operatorKey.length === 64) {
            operatorPrivateKey = PrivateKey.fromStringECDSA(operatorKey);
        } else {
            operatorPrivateKey = PrivateKey.fromString(operatorKey);
        }

        console.log("✅ Clé privée parsée");

        // Création du client avec configuration minimale
        const client = Client.forTestnet();
        client.setOperator(operatorId, operatorPrivateKey);
        
        // Configuration des frais avec valeur explicite
        const maxFee = new Hbar(5);
        console.log(`✅ Configuration des frais: ${maxFee.toString()}`);
        client.setDefaultMaxTransactionFee(maxFee);

        console.log("✅ Client configuré");

        // Test simple - vérifier le solde
        try {
            const accountId = AccountId.fromString(operatorId);
            const balance = await accountId.getBalance(client);
            console.log(`✅ Solde: ${balance.toString()}`);
        } catch (error) {
            console.warn("⚠️ Erreur solde:", error.message);
        }

        // Charger un contrat simple pour test
        const contractPath = path.join(__dirname, '../contracts/compiled/PatientIdentityContract_bytecode.bin');
        
        if (!fs.existsSync(contractPath)) {
            console.log("⚠️ Contrat non compilé, compilation en cours...");
            // Ici on pourrait appeler la compilation
            throw new Error("Contrat non trouvé. Exécutez d'abord: npm run contracts:compile");
        }

        const contractBytecode = fs.readFileSync(contractPath, 'utf8');
        console.log(`✅ Bytecode chargé: ${contractBytecode.length} caractères`);

        // Test de création de contrat
        console.log("\n🚀 Test de déploiement...");

        const contractCreateTx = new ContractCreateFlow()
            .setGas(300000)
            .setBytecode(contractBytecode)
            .setTransactionValidDuration(120); // 2 minutes

        console.log("✅ Transaction préparée");

        const contractCreateSubmit = await contractCreateTx.execute(client);
        console.log("✅ Transaction soumise");

        const contractCreateRx = await contractCreateSubmit.getReceipt(client);
        console.log("✅ Reçu obtenu");

        const contractId = contractCreateRx.contractId;
        console.log(`🎉 Contrat déployé: ${contractId}`);

        client.close();
        return contractId;

    } catch (error) {
        console.error("❌ ERREUR DÉTAILLÉE:");
        console.error("Message:", error.message);
        console.error("Stack:", error.stack);
        
        if (error.status) {
            console.error("Status Hedera:", error.status.toString());
        }
        
        throw error;
    }
}

deploySimple()
    .then(contractId => {
        console.log(`\n🎉 Déploiement réussi: ${contractId}`);
        process.exit(0);
    })
    .catch(error => {
        console.error("\n❌ Déploiement échoué");
        process.exit(1);
    });
