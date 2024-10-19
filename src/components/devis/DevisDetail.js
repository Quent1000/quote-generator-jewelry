import React, { useState } from 'react';
import { XMarkIcon, ChevronDownIcon, ChevronUpIcon, StarIcon } from '@heroicons/react/24/outline';

const DevisDetail = ({ devis, onClose, darkMode, onUpdateMainImage }) => {
  const [expandedSections, setExpandedSections] = useState({
    informations: true,
    details: true,
    diamantsPierres: true,
    gravureFinition: true,
    tempsProduction: true,
    composants: true,
    tarifs: true,
    totaux: true,
    images: false,
  });
  const [selectedImage, setSelectedImage] = useState(null);

  const clientInfo = devis.clientInfo || {};

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const Section = ({ title, id, children }) => (
    <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <button
        onClick={() => toggleSection(id)}
        className="w-full px-4 py-2 flex justify-between items-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
      >
        <h3 className="text-lg font-semibold">{title}</h3>
        {expandedSections[id] ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
      </button>
      {expandedSections[id] && <div className="p-4">{children}</div>}
    </div>
  );

  const InfoItem = ({ label, value }) => (
    <div className="flex justify-between items-center py-1">
      <span className="font-medium">{label}:</span>
      <span>{value || 'Non défini'}</span>
    </div>
  );

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
  };

  const handleSetMainImage = (imageId) => {
    onUpdateMainImage(devis.id, imageId);
  };

  const renderImages = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {devis.images && devis.images.map((image, index) => (
        <div key={image.id} className="relative group">
          <img 
            src={image.url} 
            alt={`Devis ${index + 1}`} 
            className="w-full h-32 object-cover rounded cursor-pointer"
            onClick={() => handleImageClick(image)}
          />
          <button
            onClick={() => handleSetMainImage(image.id)}
            className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <StarIcon className={`h-5 w-5 ${image.isMain ? 'text-yellow-500' : 'text-gray-500'}`} />
          </button>
        </div>
      ))}
    </div>
  );

  const renderDiamantsPierres = () => (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h4 className="font-semibold mb-2">Diamants</h4>
        {devis.diamants.map((diamant, index) => (
          <div key={index} className="mb-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
            <InfoItem label="Taille" value={diamant.taille} />
            <InfoItem label="Quantité" value={diamant.qte} />
            <InfoItem label="Carat" value={diamant.carat} />
            <InfoItem label="Fourni par" value={diamant.fourniPar} />
            <InfoItem label="Sertissage" value={diamant.sertissage} />
            <InfoItem label="Prix unitaire" value={`${diamant.prixUnitaire}€`} />
            <InfoItem label="Prix total" value={`${diamant.prixTotal}€`} />
          </div>
        ))}
      </div>
      <div>
        <h4 className="font-semibold mb-2">Autres pierres</h4>
        {devis.autresPierres.map((pierre, index) => (
          <div key={index} className="mb-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
            <InfoItem label="Forme" value={pierre.forme} />
            <InfoItem label="Type" value={pierre.type} />
            <InfoItem label="Taille" value={pierre.taille} />
            <InfoItem label="Quantité" value={pierre.qte} />
            <InfoItem label="Fourni par" value={pierre.fourniPar} />
            <InfoItem label="Sertissage" value={pierre.sertissage} />
            <InfoItem label="Prix" value={`${pierre.prix}€`} />
            <InfoItem label="Prix total" value={`${pierre.prixTotal}€`} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto ${darkMode ? 'bg-gray-900 bg-opacity-75' : 'bg-gray-100 bg-opacity-75'}`}>
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className={`relative bg-white dark:bg-gray-800 w-full max-w-6xl p-6 rounded-lg shadow-xl ${darkMode ? 'text-white' : 'text-gray-900'} overflow-y-auto max-h-[90vh]`}>
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
            <XMarkIcon className="h-6 w-6" />
          </button>
          
          <h2 className="text-2xl font-bold mb-6">Détails du devis {devis.numeroDevis}</h2>
          
          {devis.images && devis.images.length > 0 && devis.images.find(img => img.isMain) && (
            <div className="mb-6 cursor-pointer" onClick={() => handleImageClick(devis.images.find(img => img.isMain))}>
              <img 
                src={devis.images.find(img => img.isMain).url} 
                alt={`Devis ${devis.numeroDevis}`}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Section title="Informations générales" id="informations">
                <InfoItem label="Client" value={clientInfo.nom ? `${clientInfo.nom}${clientInfo.entreprise ? ` - ${clientInfo.entreprise}` : ''}` : 'Non défini'} />
                <InfoItem label="Date de création" value={devis.createdAt ? new Date(devis.createdAt).toLocaleDateString() : 'Non définie'} />
                <InfoItem label="Statut" value={devis.status} />
                <InfoItem label="Titre du devis" value={devis.titreDevis} />
              </Section>
              
              <Section title="Détails du produit" id="details">
                <InfoItem label="Catégorie" value={devis.categorie} />
                <InfoItem label="Sous-catégorie" value={devis.sousCategorie} />
                <InfoItem label="Métal" value={devis.metal} />
                <InfoItem label="Taille" value={devis.taille} />
                <InfoItem label="Poids estimé" value={devis.poidsEstime ? `${devis.poidsEstime} g` : 'Non défini'} />
                <InfoItem label="Description" value={devis.description} />
              </Section>
              
              <Section title="Gravure et finition" id="gravureFinition">
                <InfoItem label="Gravure" value={devis.gravure} />
                <InfoItem label="Style de gravure" value={devis.styleGravure} />
                <InfoItem label="Poinçon de maître" value={devis.options.poinconMaitre} />
                <InfoItem label="Poinçon de titre" value={devis.options.poinconTitre} />
                <InfoItem label="Marque" value={devis.options.marque} />
                <InfoItem label="Gravure logo marque" value={devis.options.gravureLogoMarque ? 'Oui' : 'Non'} />
                <InfoItem label="Gravure numéro série" value={devis.options.gravureNumeroSerie ? 'Oui' : 'Non'} />
                <InfoItem label="Rhodiage" value={devis.options.rhodiage ? 'Oui' : 'Non'} />
              </Section>
            </div>
            
            <div>
              <Section title="Diamants et pierres" id="diamantsPierres">
                {renderDiamantsPierres()}
              </Section>
              
              <Section title="Temps de production" id="tempsProduction">
                {Object.entries(devis.tempsProduction).map(([key, value]) => (
                  <InfoItem key={key} label={key} value={`${value.heures}h ${value.minutes}min`} />
                ))}
              </Section>
              
              <Section title="Composants" id="composants">
                {devis.composantsFrequents && devis.composantsFrequents.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Composants fréquents:</h4>
                    {devis.composantsFrequents.map((composant, index) => (
                      <InfoItem key={index} label={composant.description || composant.nom} value={`${composant.quantite || 1} x ${composant.prix}€ = ${((composant.quantite || 1) * composant.prix).toFixed(2)}€`} />
                    ))}
                  </div>
                )}
                {devis.composantsLibres && devis.composantsLibres.length > 0 && (
                  <div className="mt-2">
                    <h4 className="font-semibold mb-2">Composants libres:</h4>
                    {devis.composantsLibres.map((composant, index) => (
                      <InfoItem key={index} label={composant.description || composant.nom} value={`${composant.quantite || 1} x ${composant.prix}€ = ${((composant.quantite || 1) * composant.prix).toFixed(2)}€`} />
                    ))}
                  </div>
                )}
              </Section>
            </div>
          </div>
          
          <Section title="Tarifs" id="tarifs">
            <InfoItem label="Tarif fonte" value={devis.tarifFonte} />
            <InfoItem label="Tarif impression cire" value={devis.tarifImpressionCire} />
            <InfoItem label="Tarif impression résine" value={devis.tarifImpressionResine} />
            <InfoItem label="Type de livraison" value={devis.typeLivraison} />
            <InfoItem label="Prix livraison" value={devis.prixLivraison ? `${devis.prixLivraison} €` : 'Non défini'} />
          </Section>
          
          <Section title="Totaux" id="totaux">
            <InfoItem label="Montant total" value={devis.totalGeneral ? `${devis.totalGeneral.toFixed(2)} €` : 'Non défini'} />
            <InfoItem label="Remise" value={devis.remise ? `${devis.remise.valeur} ${devis.remise.type === 'pourcentage' ? '%' : '€'}` : 'Aucune'} />
            <InfoItem label="Marge totale" value={devis.marge ? `${devis.marge.toFixed(2)} €` : 'Non définie'} />
          </Section>
          
          {devis.tags && devis.tags.length > 0 && (
            <Section title="Tags" id="tags">
              <div className="flex flex-wrap gap-2">
                {devis.tags.map((tag, index) => (
                  <span key={index} className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-sm">{tag}</span>
                ))}
              </div>
            </Section>
          )}
          
          <Section title="Images" id="images">
            {renderImages()}
          </Section>
          
          <div className="mt-6">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded ${
                darkMode ? 'bg-teal-600 hover:bg-teal-700' : 'bg-teal-500 hover:bg-teal-600'
              } text-white`}
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
      
      {selectedImage && (
        <div 
          className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-75"
          onClick={handleCloseImage}
        >
          <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <img 
              src={selectedImage.url} 
              alt="Devis en plein écran" 
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button 
              onClick={handleCloseImage}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <XMarkIcon className="h-8 w-8" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevisDetail;
