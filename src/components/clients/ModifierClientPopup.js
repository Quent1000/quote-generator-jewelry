import React, { useState, useEffect, useCallback } from 'react';
import { XMarkIcon, UserCircleIcon, BuildingOfficeIcon, TagIcon, CloudArrowUpIcon, TrashIcon } from '@heroicons/react/24/outline';
import { doc, updateDoc, deleteDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import TagInput from '../common/TagInput';
import useFormValidation from '../../hooks/useFormValidation';
import { formatPhoneNumber } from '../../utils/formatPhoneNumber';
import FormInput from '../common/FormInput';

const ModifierClientPopup = ({ isOpen, onClose, client, darkMode, onClientUpdated }) => {
  const [clientData, setClientData] = useState({
    informationsPersonnelles: { prenom: '', nom: '', email: '', telephone: '', telFixe: '', linkedinUrl: '' },
    entrepriseId: '',
    relationClient: { dateCreation: '', commentaireInterne: '', tags: [], rating: 0 },
  });


  const [entreprise, setEntreprise] = useState({
    nom: '',
    raisonSociale: '', // Ajoutez cette ligne
    adresse: '',
    siteWeb: '',
    logo: '',
    siren: '',  // Ajout du champ SIREN
    siret: '',  // Ajout du champ SIRET
  });

  const [logoFile, setLogoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState([]);
  const tagSuggestions = ['VIP', 'Fidèle', 'Nouveau', 'Professionnel', 'Particulier'];
  const [rating, setRating] = useState(0);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [entreprises, setEntreprises] = useState([]);
  const [selectedEntrepriseId, setSelectedEntrepriseId] = useState('');

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const validationRules = {
    'informationsPersonnelles.prenom': (value) => {
      if (!value || !value.trim()) return "Le prénom est requis";
      return null;
    },
    'informationsPersonnelles.nom': (value) => {
      if (!value || !value.trim()) return "Le nom est requis";
      return null;
    },
    'informationsPersonnelles.email': (value) => {
      if (!value || !value.trim()) return "L'email est requis";
      if (!/^\S+@\S+\.\S+$/.test(value)) return "Format d'email invalide";
      return null;
    },
    'informationsPersonnelles.telephone': (value) => {
      if (!value || !value.trim()) return "Le téléphone est requis";
      const cleanedNumber = value.replace(/\s/g, '');
      if (!/^(\+33|0)[1-9]\d{8}$/.test(cleanedNumber)) {
        return "Format de téléphone invalide";
      }
      return null;
    },
    'entreprise.nom': (value) => {
      if (selectedEntrepriseId && (!value || !value.trim())) return "Le nom de l'entreprise est requis";
      return null;
    },
    'entreprise.siteWeb': (value) => {
      if (value && !isValidUrl(value)) {
        return "Format d'URL invalide";
      }
      return null;
    },
    'entreprise.siren': (value) => {
      if (value && !/^[0-9]{9}$/.test(value)) return "Le SIREN doit contenir 9 chiffres";
      return null;
    },
    'entreprise.siret': (value) => {
      if (value && !/^[0-9]{14}$/.test(value)) return "Le SIRET doit contenir 14 chiffres";
      return null;
    },
    // Ajoutez d'autres règles de validation si nécessaire
  };

  const { errors, validate } = useFormValidation({}, validationRules);

  useEffect(() => {
    const fetchEntreprises = async () => {
      const entreprisesSnapshot = await getDocs(collection(db, 'entreprises'));
      const entreprisesList = entreprisesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEntreprises(entreprisesList);
    };

    fetchEntreprises();
  }, []);

  useEffect(() => {
    if (client) {
      setClientData(client);
      setTags(client.relationClient.tags || []);
      setRating(client.relationClient.rating || 0);
      setSelectedEntrepriseId(client.entrepriseId || '');
      if (client.entrepriseId) {
        const fetchEntreprise = async () => {
          const entrepriseDoc = await getDoc(doc(db, 'entreprises', client.entrepriseId));
          if (entrepriseDoc.exists()) {
            const entrepriseData = entrepriseDoc.data();
            setEntreprise(entrepriseData);
            setPreviewUrl(entrepriseData.logo || '');
          }
        };
        fetchEntreprise();
      } else {
        // Réinitialiser le logo si le client n'a pas d'entreprise
        setPreviewUrl('');
        setEntreprise({ nom: '', adresse: '', siteWeb: '', logo: '', siren: '', siret: '' });
      }
    }
  }, [client]);

  const handleChange = (e, section) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'telephone') {
      formattedValue = formatPhoneNumber(value);
    }

    if (section === 'entreprise') {
      setEntreprise(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setClientData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: formattedValue
        }
      }));
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleLogoDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setLogoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleLogoDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleLogoDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleLogoDelete = () => {
    setLogoFile(null);
    setPreviewUrl('');
    setEntreprise(prev => ({ ...prev, logo: '' }));
  };

  const handleLogoPaste = useCallback((e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        setLogoFile(blob);
        setPreviewUrl(URL.createObjectURL(blob));
        break;
      }
    }
  }, []);

  const uploadLogo = async () => {
    if (logoFile) {
      const fileExtension = logoFile.name.split('.').pop();
      const fileName = `logos/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
      const logoRef = ref(storage, fileName);
      
      try {
        const snapshot = await uploadBytes(logoRef, logoFile);
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log('Logo uploaded successfully:', downloadURL);
        return downloadURL;
      } catch (error) {
        console.error('Error uploading logo:', error);
        throw error;
      }
    }
    return entreprise.logo;
  };

  const formatWebsite = (url) => {
    if (!url) return '';
    url = url.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }
    return url;
  };

  const handleEntrepriseChange = async (e) => {
    const newEntrepriseId = e.target.value;
    setSelectedEntrepriseId(newEntrepriseId);
    
    if (newEntrepriseId === '') {
      // Si aucune entreprise n'est sélectionnée, considérer comme particulier
      setClientData(prev => ({
        ...prev,
        entrepriseId: '',
        relationClient: {
          ...prev.relationClient,
          tags: prev.relationClient.tags.includes('Particulier') ? prev.relationClient.tags : [...prev.relationClient.tags, 'Particulier']
        }
      }));
      setEntreprise({ nom: '', adresse: '', siteWeb: '', logo: '', siren: '', siret: '' });
      setPreviewUrl('');
    } else {
      // Charger les données de la nouvelle entreprise sélectionnée
      const entrepriseDoc = await getDoc(doc(db, 'entreprises', newEntrepriseId));
      if (entrepriseDoc.exists()) {
        const entrepriseData = entrepriseDoc.data();
        setEntreprise(entrepriseData);
        setPreviewUrl(entrepriseData.logo || '');
        setClientData(prev => ({
          ...prev,
          entrepriseId: newEntrepriseId,
          relationClient: {
            ...prev.relationClient,
            tags: prev.relationClient.tags.filter(tag => tag !== 'Particulier')
          }
        }));
      }
    }
  };

  const handleEntrepriseFieldChange = (e) => {
    const { name, value } = e.target;
    setEntreprise(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate({ ...clientData, entreprise })) return;

    setIsSubmitting(true);

    try {
      let logoUrl = entreprise.logo;
      if (logoFile) {
        logoUrl = await uploadLogo();
      }

      const updatedClient = {
        ...clientData,
        entrepriseId: selectedEntrepriseId,
        relationClient: { ...clientData.relationClient, tags, rating },
        entreprise: {
          ...entreprise,
          raisonSociale: entreprise.raisonSociale || '', // Utiliser une chaîne vide si undefined
          // Gérer de la même manière les autres champs qui pourraient être undefined
        }
      };

      await updateDoc(doc(db, 'clients', clientData.id), updatedClient);

      if (selectedEntrepriseId) {
        const updatedEntreprise = {
          ...entreprise,
          logo: logoUrl,
          siteWeb: formatWebsite(entreprise.siteWeb)
        };
        await updateDoc(doc(db, 'entreprises', selectedEntrepriseId), updatedEntreprise);
      }

      onClientUpdated({ ...updatedClient, entreprise: { ...entreprise, id: selectedEntrepriseId } });
      onClose();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du client:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteDoc(doc(db, 'clients', clientData.id));
      onClose();
    } catch (error) {
      console.error("Erreur lors de la suppression du client :", error);
      alert("Une erreur s'est produite lors de la suppression du client.");
    } finally {
      setShowDeleteConfirmation(false);
    }
  };

  const bgClass = darkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = darkMode ? 'text-white' : 'text-gray-800';
  const inputClass = `w-full p-2 rounded-md ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`;
  const labelClass = `block text-sm font-medium ${textClass} mb-1`;
  const sectionClass = "mb-4";
  const buttonClass = `px-4 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors duration-300`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${bgClass} rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className={`text-xl font-bold ${textClass}`}>Modifier le client</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 grid grid-cols-3 gap-4">
          {/* Informations personnelles */}
          <div className={sectionClass}>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <UserCircleIcon className="h-5 w-5 mr-2 text-teal-500" />
              Informations personnelles
            </h3>
            <div className="space-y-2">
              <div>
                <label className={labelClass} htmlFor="prenom">Prénom</label>
                <input
                  type="text"
                  id="prenom"
                  name="prenom"
                  className={`${inputClass} ${errors.prenom ? 'border-red-500' : ''}`}
                  value={clientData.informationsPersonnelles.prenom}
                  onChange={(e) => handleChange(e, 'informationsPersonnelles')}
                />
                {errors.prenom && <p className="text-red-500 text-sm mt-1">{errors.prenom}</p>}
              </div>
              <div>
                <label className={labelClass} htmlFor="nom">Nom</label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  className={inputClass}
                  value={clientData.informationsPersonnelles.nom}
                  onChange={(e) => handleChange(e, 'informationsPersonnelles')}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={inputClass}
                  value={clientData.informationsPersonnelles.email}
                  onChange={(e) => handleChange(e, 'informationsPersonnelles')}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="telephone">Téléphone</label>
                <input
                  type="tel"
                  id="telephone"
                  name="telephone"
                  className={inputClass}
                  value={clientData.informationsPersonnelles.telephone}
                  onChange={(e) => handleChange(e, 'informationsPersonnelles')}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="telFixe">Téléphone fixe</label>
                <input
                  type="tel"
                  id="telFixe"
                  name="telFixe"
                  className={inputClass}
                  value={clientData.informationsPersonnelles.telFixe}
                  onChange={(e) => handleChange(e, 'informationsPersonnelles')}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="linkedinUrl">Profil LinkedIn</label>
                <input
                  type="url"
                  id="linkedinUrl"
                  name="linkedinUrl"
                  className={inputClass}
                  value={clientData.informationsPersonnelles.linkedinUrl}
                  onChange={(e) => handleChange(e, 'informationsPersonnelles')}
                />
              </div>
            </div>
          </div>

          {/* Entreprise */}
          <div className={sectionClass}>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <BuildingOfficeIcon className="h-5 w-5 mr-2 text-teal-500" />
              Entreprise
            </h3>
            <div className="space-y-2">
              <select
                value={selectedEntrepriseId}
                onChange={handleEntrepriseChange}
                className={`${inputClass} w-full`}
              >
                <option value="">Particulier</option>
                {entreprises.map(ent => (
                  <option key={ent.id} value={ent.id}>{ent.nom}</option>
                ))}
              </select>
              {selectedEntrepriseId && (
                <>
                  <FormInput
                    label="Nom de l'entreprise"
                    name="nom"
                    value={entreprise.nom}
                    onChange={handleEntrepriseFieldChange}
                    error={errors['entreprise.nom']}
                    darkMode={darkMode}
                  />
                  <FormInput
                    label="Raison sociale"
                    name="raisonSociale"
                    value={entreprise.raisonSociale}
                    onChange={handleEntrepriseFieldChange}
                    error={errors['entreprise.raisonSociale']}
                    darkMode={darkMode}
                  />
                  <input
                    type="text"
                    name="adresse"
                    value={entreprise.adresse}
                    onChange={handleEntrepriseFieldChange}
                    className={inputClass}
                    placeholder="Adresse de l'entreprise"
                  />
                  <input
                    type="text"
                    name="siteWeb"
                    value={entreprise.siteWeb}
                    onChange={handleEntrepriseFieldChange}
                    className={inputClass}
                    placeholder="Site web de l'entreprise"
                  />
                  <FormInput
                    label="SIREN"
                    name="siren"
                    value={entreprise.siren}
                    onChange={(e) => handleEntrepriseFieldChange(e)}
                    error={errors['entreprise.siren']}
                    darkMode={darkMode}
                  />
                  <FormInput
                    label="SIRET"
                    name="siret"
                    value={entreprise.siret}
                    onChange={(e) => handleEntrepriseFieldChange(e)}
                    error={errors['entreprise.siret']}
                    darkMode={darkMode}
                  />
                  <div>
                    <label className={`block mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                      Logo de l'entreprise
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-4 text-center ${
                        isDragging ? 'border-teal-500 bg-teal-50' : 'border-gray-300'
                      }`}
                      onDrop={handleLogoDrop}
                      onDragOver={handleLogoDragOver}
                      onDragLeave={handleLogoDragLeave}
                      onPaste={handleLogoPaste}
                    >
                      {previewUrl ? (
                        <div className="relative">
                          <img src={previewUrl} alt="Logo preview" className="max-w-full h-auto mx-auto" />
                          <button
                            type="button"
                            onClick={handleLogoDelete}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-1">Glissez et déposez un logo ici, ou cliquez pour sélectionner un fichier</p>
                        </>
                      )}
                      <input
                        type="file"
                        onChange={handleLogoChange}
                        accept="image/*"
                        className="hidden"
                        id="logo-upload"
                      />
                      <label htmlFor="logo-upload" className="mt-2 inline-block px-4 py-2 bg-teal-500 text-white rounded cursor-pointer">
                        Choisir un fichier
                      </label>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Relation client */}
          <div className={sectionClass}>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <TagIcon className="h-5 w-5 mr-2 text-teal-500" />
              Relation client
            </h3>
            <div className="space-y-2">
              <div>
                <label className={labelClass} htmlFor="dateCreation">Date de création</label>
                <input
                  type="date"
                  id="dateCreation"
                  name="dateCreation"
                  className={inputClass}
                  value={clientData.relationClient.dateCreation.split('T')[0]}
                  onChange={(e) => handleChange(e, 'relationClient')}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="commentaireInterne">Commentaire interne</label>
                <textarea
                  id="commentaireInterne"
                  name="commentaireInterne"
                  className={`${inputClass} h-20 resize-none`}
                  value={clientData.relationClient.commentaireInterne}
                  onChange={(e) => handleChange(e, 'relationClient')}
                ></textarea>
              </div>
              <div>
                <label className={labelClass}>Tags</label>
                <TagInput
                  tags={tags}
                  setTags={setTags}
                  suggestions={tagSuggestions}
                  darkMode={darkMode}
                />
              </div>
              <div>
                <label className={labelClass}>Note client</label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      onClick={() => setRating(star)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-3 flex justify-between items-center mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400 transition-colors duration-300">
              Annuler
            </button>
            <button
              type="submit"
              className={buttonClass}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Modification en cours...' : 'Modifier le client'}
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300"
              onClick={handleDelete}
            >
              <TrashIcon className="h-5 w-5 inline-block mr-2" />
              Supprimer
            </button>
          </div>
        </form>

        {showDeleteConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${bgClass} rounded-lg p-6 m-4 max-w-sm w-full shadow-xl`}>
              <h3 className={`text-lg font-bold ${textClass} mb-4`}>Confirmer la suppression</h3>
              <p className={`text-sm ${textClass} mb-4`}>
                Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible.
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowDeleteConfirmation(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-300"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModifierClientPopup;