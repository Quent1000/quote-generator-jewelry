import React, { useState, useCallback, useEffect } from 'react';
import { XMarkIcon, UserCircleIcon, BuildingOfficeIcon, TagIcon, CloudArrowUpIcon, TrashIcon } from '@heroicons/react/24/outline';
import { doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import TagInput from '../common/TagInput';
import useFormValidation from '../../hooks/useFormValidation';

const ModifierClientPopup = ({ isOpen, onClose, client, darkMode, onClientUpdated }) => {
  const [clientData, setClientData] = useState({
    informationsPersonnelles: { prenom: '', nom: '', email: '', telephone: '', telFixe: '', linkedinUrl: '' },
    entrepriseId: '',
    relationClient: { dateCreation: '', commentaireInterne: '', tags: [], rating: 0 },
  });

  const [entreprise, setEntreprise] = useState({
    nom: '',
    adresse: '',
    siteWeb: '',
    logo: '',
  });

  const [logoFile, setLogoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState([]);
  const tagSuggestions = ['VIP', 'Fidèle', 'Nouveau', 'Professionnel', 'Particulier'];
  const [rating, setRating] = useState(0);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

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
      if (!/^(\+33|0)[1-9](\d{2}){4}$/.test(value)) return "Format de téléphone invalide";
      return null;
    },
    'entreprise.siteWeb': (value) => {
      if (value && !isValidUrl(value)) {
        return "Format d'URL invalide";
      }
      return null;
    },
    // Ajoutez d'autres règles de validation si nécessaire
  };

  const { errors, validate } = useFormValidation({}, validationRules);

  useEffect(() => {
    if (client) {
      setClientData(client);
      setTags(client.relationClient.tags || []);
      setRating(client.relationClient.rating || 0);
      if (client.entrepriseId) {
        // Charger les données de l'entreprise
        const fetchEntreprise = async () => {
          const entrepriseDoc = await getDoc(doc(db, 'entreprises', client.entrepriseId));
          if (entrepriseDoc.exists()) {
            setEntreprise(entrepriseDoc.data());
            setPreviewUrl(entrepriseDoc.data().logo || '');
          }
        };
        fetchEntreprise();
      }
    }
  }, [client]);

  const handleChange = (e, section) => {
    const { name, value } = e.target;
    if (section === 'entreprise') {
      setEntreprise(prev => ({ ...prev, [name]: value }));
    } else {
      setClientData(prev => ({ ...prev, [section]: { ...prev[section], [name]: value } }));
    }
  };

  const handleLogoChange = (e) => {
    if (e.target.files[0]) {
      setLogoFile(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate({ ...clientData, entreprise })) {
      setIsSubmitting(true);

      try {
        const logoUrl = await uploadLogo();
        
        const updatedClient = {
          ...clientData,
          relationClient: { ...clientData.relationClient, tags, rating }
        };

        await updateDoc(doc(db, 'clients', clientData.id), updatedClient);

        if (entreprise && clientData.entrepriseId) {
          const updatedEntreprise = {
            ...entreprise,
            logo: logoUrl,
            siteWeb: formatWebsite(entreprise.siteWeb)
          };
          await updateDoc(doc(db, 'entreprises', clientData.entrepriseId), updatedEntreprise);
        }

        onClientUpdated(updatedClient);
        onClose();
      } catch (error) {
        console.error("Erreur lors de la mise à jour du client :", error);
        alert("Une erreur s'est produite lors de la mise à jour du client.");
      } finally {
        setIsSubmitting(false);
      }
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

  const isValidUrl = (url) => {
    if (!url) return true; // URL optionnelle
    const pattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return pattern.test(url);
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
              <div>
                <label className={labelClass} htmlFor="nomEntreprise">Nom de l'entreprise</label>
                <input
                  type="text"
                  id="nomEntreprise"
                  name="nom"
                  className={inputClass}
                  value={entreprise.nom}
                  onChange={(e) => handleChange(e, 'entreprise')}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="adresse">Adresse</label>
                <input
                  type="text"
                  id="adresse"
                  name="adresse"
                  className={inputClass}
                  value={entreprise.adresse}
                  onChange={(e) => handleChange(e, 'entreprise')}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="siteWeb">Site web</label>
                <input
                  type="url"
                  id="siteWeb"
                  name="siteWeb"
                  className={inputClass}
                  value={entreprise.siteWeb}
                  onChange={(e) => handleChange(e, 'entreprise')}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="logo">Logo de l'entreprise</label>
                <div 
                  className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer"
                  onPaste={handleLogoPaste}
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="Logo preview" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-center">
                      <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-1 text-sm text-gray-500">Cliquez ou collez pour ajouter un logo</p>
                    </div>
                  )}
                  <input id="logo" type="file" className="hidden" onChange={handleLogoChange} accept="image/*" />
                </div>
              </div>
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