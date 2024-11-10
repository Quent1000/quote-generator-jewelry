import React from 'react';

const ModelSelector = ({ onSelect }) => {
    const availableModels = [
        {
            id: 'votre_id_modele_1',
            name: 'Devis Standard',
            description: 'Pour les projets classiques'
        },
        // Ajoutez d'autres modèles ici
    ];

    return (
        <div className="model-selector">
            <h3>Modèles disponibles</h3>
            <div className="models-grid">
                {availableModels.map(model => (
                    <div 
                        key={model.id} 
                        className="model-card"
                        onClick={() => onSelect(model.id)}
                    >
                        <h4>{model.name}</h4>
                        <p>{model.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ModelSelector; 