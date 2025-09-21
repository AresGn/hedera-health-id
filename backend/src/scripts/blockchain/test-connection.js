import 'dotenv/config';
import {
    Client,
    PrivateKey,
    AccountId,
    Hbar
} from "@hashgraph/sdk";

/**
 * Test simple de connexion Hedera
 */
async function testConnection() {
    console.log("🔍 Test de connexion Hedera");
    console.log("=" .repeat(40));
    
    try {
        const operatorId = process.env.OPERATOR_ID;
        const operatorKey = process.env.OPERATOR_KEY;

        console.log(`Operator ID: ${operatorId}`);
        console.log(`Operator Key: ${operatorKey ? operatorKey.substring(0, 10) + '...' : 'NON DÉFINIE'}`);

        if (!operatorId || !operatorKey) {
            throw new Error("Variables d'environnement manquantes!");
        }

        // Test de parsing de la clé privée
        let operatorPrivateKey;
        console.log("\n🔑 Test de parsing de la clé privée...");
        
        try {
            if (operatorKey.startsWith('0x')) {
                console.log("Format détecté: Hexadécimal avec préfixe 0x");
                operatorPrivateKey = PrivateKey.fromStringECDSA(operatorKey.substring(2));
            } else if (operatorKey.length === 64) {
                console.log("Format détecté: Hexadécimal sans préfixe");
                operatorPrivateKey = PrivateKey.fromStringECDSA(operatorKey);
            } else {
                console.log("Format détecté: DER standard");
                operatorPrivateKey = PrivateKey.fromString(operatorKey);
            }
            console.log("✅ Clé privée parsée avec succès");
        } catch (error) {
            console.error("❌ Erreur de parsing de clé:", error.message);
            return;
        }

        // Test de création du client
        console.log("\n🌐 Test de création du client...");
        const client = Client.forTestnet();
        console.log("✅ Client créé");

        // Test de configuration de l'opérateur
        console.log("\n👤 Test de configuration de l'opérateur...");
        client.setOperator(operatorId, operatorPrivateKey);
        console.log("✅ Opérateur configuré");

        // Test de configuration des frais
        console.log("\n💰 Test de configuration des frais...");
        client.setDefaultMaxTransactionFee(new Hbar(2));
        console.log("✅ Frais configurés");

        // Test de vérification du solde
        console.log("\n💳 Test de vérification du solde...");
        try {
            const accountBalance = await client.getAccountBalance(operatorId);
            console.log(`✅ Solde: ${accountBalance.hbars.toString()}`);
            
            if (accountBalance.hbars.toBigNumber().lt(1)) {
                console.warn("⚠️ Solde très faible!");
                console.warn("💡 Obtenez des HBAR testnet sur: https://portal.hedera.com/");
            }
        } catch (error) {
            console.error("❌ Erreur de vérification du solde:", error.message);
        }

        console.log("\n🎉 Test de connexion réussi!");
        client.close();

    } catch (error) {
        console.error("❌ ERREUR:", error.message);
        console.error("Stack:", error.stack);
    }
}

testConnection();
