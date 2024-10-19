import React, { useState } from 'react';
import { XMarkIcon, ChevronDownIcon, ChevronUpIcon, StarIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { PDFViewer, Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import logoTGN409 from '../../assets/logo-tgn409.png';

// Supprimez ces lignes
// import RobotoRegular from '../../assets/fonts/Roboto-Regular.ttf';
// import RobotoBold from '../../assets/fonts/Roboto-Bold.ttf';

// Remplacez par ceci
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf', fontWeight: 'normal' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' },
  ]
});

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
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);

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

  const handleGeneratePdf = () => {
    setShowPdfPreview(true);
  };

  const handleSavePdf = () => {
    // Logique pour sauvegarder le PDF
    setShowPdfPreview(false);
  };

  // Ajoutez cette fonction pour formater les montants
  const formatMontant = (montant) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(montant);
  };

  // Styles pour le PDF
  const styles = StyleSheet.create({
    page: { 
      padding: 30,
      fontFamily: 'Roboto',
      fontSize: 12,
    },
    header: { 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      marginBottom: 20,
      borderBottom: 1,
      paddingBottom: 10,
    },
    logo: { width: 100 },
    companyInfo: { textAlign: 'right' },
    title: { 
      fontSize: 18, 
      fontWeight: 'bold', 
      marginBottom: 20,
      textAlign: 'center',
    },
    section: { marginBottom: 10 },
    sectionTitle: { 
      fontSize: 14, 
      fontWeight: 'bold', 
      marginBottom: 5,
      backgroundColor: '#f0f0f0',
      padding: 5,
    },
    row: { 
      flexDirection: 'row', 
      justifyContent: 'space-between',
      marginBottom: 5,
    },
    footer: { 
      position: 'absolute', 
      bottom: 30, 
      left: 30, 
      right: 30, 
      fontSize: 8,
      textAlign: 'center',
    },
    legalText: {
      fontSize: 8,
      marginTop: 20,
      textAlign: 'justify',
    },
  });

  // Composant PDF
  const DevisPDF = ({ devis }) => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image style={styles.logo} src={logoTGN409} />
          <View style={styles.companyInfo}>
            <Text>TGN 409</Text>
            <Text>21 montée des soldats</Text>
            <Text>69300 Caluire et cuire</Text>
          </View>
        </View>
        
        <Text style={styles.title}>Devis n° {devis.numeroDevis}</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Client</Text>
          <Text>{devis.clientInfo.nom}</Text>
          <Text>{devis.clientInfo.entreprise}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Détails du produit</Text>
          <View style={styles.row}>
            <Text>Catégorie:</Text>
            <Text>{devis.categorie}</Text>
          </View>
          <View style={styles.row}>
            <Text>Métal:</Text>
            <Text>{devis.metal}</Text>
          </View>
          {/* Ajoutez d'autres détails du produit ici */}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Totaux</Text>
          <View style={styles.row}>
            <Text>Montant total:</Text>
            <Text>{formatMontant(devis.totalGeneral)}</Text>
          </View>
          {/* Ajoutez d'autres totaux ici */}
        </View>
        
        <Text style={styles.legalText}>
          La fabrication d'un bijou exige environ 50% de son poids métal en plus, dont l'excédent métal hors pertes reste la propriété du client.
          L'approvisionnement métal ne peut se faire qu'en métal fin, à partir d'un compte officiel qui sera alimenté par le client.
          Si le montant est trop important il sera demandé le règlement par avance. Le client en sera averti avant toute exécution.
          Acompte obligatoire réalisé par virement uniquement sur le compte de TGN 409 dont les informations bancaires sont signifiées en bas de page.
          Une facture avec règlement à réception sera émise lors de la livraison de la commande. Dans le cas d'une nouvelle relation commerciale, il sera demandé un règlement avant envoi.

          Pour une commande dont la prestation de fabrication est inférieure à 150,00 Euros HT, TGN 409 s'autorise le droit d'ajouter des frais de gestion de dossier de 70,00 Euros HT.

          TGN 409 ne peut être tenue pour responsable en cas de casse de pierres clients durant l'opération de dessertissage, ni même s'il est constaté après dessertissage que des problèmes sur les pierres étaient non apparents du fait d'être cachés sous le métal qui les maintenait.
        </Text>
        
        <Text style={styles.footer}>
          TGN 409 - SIRET: XXXXXXXXX - TVA: FRXXXXXXXXX
        </Text>
      </Page>
    </Document>
  );

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

  const TruncatedText = ({ text, maxLength = 150 }) => {
    if (text.length <= maxLength) return <p className="whitespace-pre-wrap">{text}</p>;
    
    return (
      <div>
        <p className="whitespace-pre-wrap">
          {showFullDescription ? text : `${text.substring(0, maxLength)}...`}
        </p>
        <button
          onClick={() => setShowFullDescription(!showFullDescription)}
          className="mt-2 text-teal-500 hover:text-teal-600 underline focus:outline-none"
        >
          {showFullDescription ? 'Voir moins' : 'Voir plus'}
        </button>
      </div>
    );
  };

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
                {/* Ajout de l'information sur le créateur du devis */}
                <InfoItem 
                  label="Créé par" 
                  value={devis.createdByUser ? `${devis.createdByUser.prenom} ${devis.createdByUser.nom}` : 'Non spécifié'} 
                />
              </Section>
              
              <Section title="Détails du produit" id="details">
                <InfoItem label="Catégorie" value={devis.categorie} />
                <InfoItem label="Sous-catégorie" value={devis.sousCategorie} />
                <InfoItem label="Métal" value={devis.metal} />
                <InfoItem label="Taille" value={devis.taille} />
                <InfoItem label="Poids estimé" value={devis.poidsEstime ? `${devis.poidsEstime} g` : 'Non défini'} />
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Description:</h4>
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                    <TruncatedText text={devis.description || 'Aucune description fournie'} />
                  </div>
                </div>
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
          
          <div className="mt-6 flex justify-between">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded ${
                darkMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-300 hover:bg-gray-400'
              } text-white`}
            >
              Fermer
            </button>
            <button
              onClick={handleGeneratePdf}
              className={`px-4 py-2 rounded flex items-center ${
                darkMode ? 'bg-teal-600 hover:bg-teal-700' : 'bg-teal-500 hover:bg-teal-600'
              } text-white`}
            >
              <DocumentIcon className="h-5 w-5 mr-2" />
              Aperçu PDF
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
      
      {showPdfPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg w-full h-full max-w-full max-h-full flex flex-col">
            <PDFViewer width="100%" height="100%" className="flex-grow">
              <DevisPDF devis={devis} />
            </PDFViewer>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setShowPdfPreview(false)} className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Fermer</button>
              <button onClick={handleSavePdf} className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600">Enregistrer PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevisDetail;
