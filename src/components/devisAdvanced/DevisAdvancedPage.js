import React, { useState } from 'react';
import { GoogleSheetsService } from '../../services/googleSheets';
import ModelSelector from './ModelSelector';

const DevisAdvancedPage = () => {
    const [selectedModel, setSelectedModel] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleModelSelect = async (modelId) => {
        setIsLoading(true);
        try {
            const sheetsService = new GoogleSheetsService();
            await sheetsService.initialize(modelId);
            setSelectedModel(modelId);
        } catch (err) {
            setError("Erreur lors de l'initialisation du modèle");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="devis-advanced-container p-6">
            <h1 className="text-2xl font-bold mb-6">Création de Devis Avancé</h1>
            
            {/* Utilisation du composant ModelSelector */}
            <div className="model-selection">
                <h2 className="text-xl mb-4">Choisir un modèle</h2>
                <ModelSelector onSelect={handleModelSelect} />
            </div>

            {/* Affichage du statut */}
            {isLoading && <div className="mt-4">Chargement en cours...</div>}
            {error && <div className="error-message mt-4 text-red-500">{error}</div>}

            {/* Interface principale une fois le modèle sélectionné */}
            {selectedModel && (
                <div className="sheet-interface mt-6">
                    <div className="sheet-actions">
                        <button 
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            onClick={() => window.open(`https://docs.google.com/spreadsheets/d/${selectedModel}`)}
                        >
                            Ouvrir dans Google Sheets
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DevisAdvancedPage; 