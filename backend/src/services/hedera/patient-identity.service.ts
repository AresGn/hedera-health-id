import { ContractFunctionParameters } from '@hashgraph/sdk';
import { hederaService } from './hedera.service';
import crypto from 'crypto';

/**
 * Service pour la gestion des identités patients sur Hedera
 */
export class PatientIdentityService {
    private contractId: string;

    constructor() {
        this.contractId = process.env.PATIENT_IDENTITY_CONTRACT_ID || '';
        if (!this.contractId) {
            console.warn('PATIENT_IDENTITY_CONTRACT_ID non défini dans .env');
        }
    }

    /**
     * Enregistre un nouveau patient sur la blockchain
     */
    async registerPatient(patientData: {
        personalData: any;
        patientAddress: string;
        metadataHash?: string;
    }): Promise<any> {
        try {
            // Chiffrer les données personnelles
            const encryptedData = this.encryptPatientData(patientData.personalData);
            
            const functionParameters = new ContractFunctionParameters()
                .addString(encryptedData)
                .addAddress(patientData.patientAddress)
                .addString(patientData.metadataHash || '');

            if (!hederaService) {
                throw new Error('Hedera service not available');
            }

            const result = await hederaService.executeContractFunction(
                this.contractId,
                'registerPatient',
                functionParameters,
                150000
            );

            if (result.success) {
                console.log(`Patient enregistré avec succès: ${result.transactionId}`);
                return {
                    success: true,
                    transactionId: result.transactionId,
                    encryptedData
                };
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement du patient:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Erreur inconnue'
            };
        }
    }

    /**
     * Récupère les informations d'un patient
     */
    async getPatient(patientId: number): Promise<any> {
        try {
            const functionParameters = new ContractFunctionParameters()
                .addUint256(patientId);

            if (!hederaService) {
                throw new Error('Hedera service not available');
            }

            const result = await hederaService.callContractFunction(
                this.contractId,
                'getPatient',
                functionParameters
            );

            if (result.success) {
                return {
                    success: true,
                    patient: this.parsePatientData(result.result)
                };
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération du patient:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Erreur inconnue'
            };
        }
    }

    /**
     * Met à jour les données d'un patient
     */
    async updatePatientData(
        patientId: number,
        newData: any,
        newMetadataHash?: string
    ): Promise<any> {
        try {
            const encryptedData = this.encryptPatientData(newData);
            
            const functionParameters = new ContractFunctionParameters()
                .addUint256(patientId)
                .addString(encryptedData)
                .addString(newMetadataHash || '');

            if (!hederaService) {
                throw new Error('Hedera service not available');
            }

            const result = await hederaService.executeContractFunction(
                this.contractId,
                'updatePatientData',
                functionParameters,
                120000
            );

            if (result.success) {
                console.log(`Données patient mises à jour: ${result.transactionId}`);
                return {
                    success: true,
                    transactionId: result.transactionId
                };
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Erreur inconnue'
            };
        }
    }

    /**
     * Accorde l'accès à un médecin
     */
    async grantAccess(patientId: number, doctorAddress: string): Promise<any> {
        try {
            const functionParameters = new ContractFunctionParameters()
                .addUint256(patientId)
                .addAddress(doctorAddress);

            if (!hederaService) {
                throw new Error('Hedera service not available');
            }

            const result = await hederaService.executeContractFunction(
                this.contractId,
                'grantAccess',
                functionParameters,
                100000
            );

            if (result.success) {
                console.log(`Accès accordé au médecin: ${result.transactionId}`);
                return {
                    success: true,
                    transactionId: result.transactionId
                };
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Erreur lors de l\'octroi d\'accès:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Erreur inconnue'
            };
        }
    }

    /**
     * Révoque l'accès d'un médecin
     */
    async revokeAccess(patientId: number, doctorAddress: string): Promise<any> {
        try {
            const functionParameters = new ContractFunctionParameters()
                .addUint256(patientId)
                .addAddress(doctorAddress);

            if (!hederaService) {
                throw new Error('Hedera service not available');
            }

            const result = await hederaService.executeContractFunction(
                this.contractId,
                'revokeAccess',
                functionParameters,
                100000
            );

            if (result.success) {
                console.log(`Accès révoqué pour le médecin: ${result.transactionId}`);
                return {
                    success: true,
                    transactionId: result.transactionId
                };
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Erreur lors de la révocation d\'accès:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Erreur inconnue'
            };
        }
    }

    /**
     * Chiffre les données du patient
     */
    private encryptPatientData(data: any): string {
        const key = process.env.ENCRYPTION_KEY || 'default-key-32-chars-long-here';
        const cipher = crypto.createCipher('aes-256-cbc', key);
        let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    /**
     * Parse les données du patient depuis la blockchain
     */
    private parsePatientData(result: any): any {
        // Cette fonction devra être adaptée selon le format de retour exact
        // du smart contract
        return {
            patientId: result.getUint256(0),
            encryptedPersonalData: result.getString(1),
            patientAddress: result.getAddress(2),
            isActive: result.getBool(3),
            creationDate: result.getUint256(4),
            metadataHash: result.getString(5)
        };
    }
}

export const patientIdentityService = new PatientIdentityService();
