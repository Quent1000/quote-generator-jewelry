import React, { useState, useCallback, useEffect } from 'react';
import { XMarkIcon, UserCircleIcon, BuildingOfficeIcon, TagIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import TagInput from '../common/TagInput';
import useFormValidation from '../../hooks/useFormValidation';
import FormInput from '../common/FormInput';
import { formatPhoneNumber } from '../../utils/formatPhoneNumber'; // Ajoutez cette ligne

const NouveauClientPopup = ({ isOpen, onClose, darkMode, onClientAdded }) => {
  const [formData, setFormData] = useState({
    client: {
      informationsPersonnelles: { prenom: '', nom: '', email: '', telephone: '', telFixe: '', linkedinUrl: '' },
      entrepriseId: '',
      relationClient: { dateCreation: new Date().toISOString().split('T')[0], commentaireInterne: '', tags: ['Particulier'], rating: 0 },
    },
    entreprise: {
      nom: '',
      raisonSociale: '',
      adresse: '',
      siteWeb: '',
      siren: '',  // Ajout du champ SIREN
      siret: '',  // Ajout du champ SIRET
    },
    nouvelleEntreprise: false,
    logoFile: null,
    previewUrl: '',
  });

  const [entreprises, setEntreprises] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const tagSuggestions = ['VIP', 'Fidèle', 'Nouveau', 'Professionnel', 'Particulier'];

  const [isDragging, setIsDragging] = useState(false);

  const validationRules = {
    'client.informationsPersonnelles.prenom': (value) => {
      if (!value || !value.trim()) return "Le prénom est requis";
      return null;
    },
    'client.informationsPersonnelles.nom': (value) => {
      if (!value || !value.trim()) return "Le nom est requis";
      return null;
    },
    'client.informationsPersonnelles.email': (value) => {
      if (!value || !value.trim()) return "L'email est requis";
      if (!/^\S+@\S+\.\S+$/.test(value)) return "Format d'email invalide";
      return null;
    },
    'client.informationsPersonnelles.telephone': (value) => {
      if (!value || !value.trim()) return "Le téléphone est requis";
      // Accepte les formats: 0612345678, +33612345678, (+33)612345678, 06 12 34 56 78
      if (!/^(\+33|0)[1-9](\d{2}){4}$/.test(value.replace(/\s/g, ''))) {
        return "Format de téléphone invalide";
      }
      return null;
    },
    'entreprise.nom': (value, data) => {
      if (data.nouvelleEntreprise && (!value || !value.trim())) return "Le nom de l'entreprise est requis";
      return null;
    },
    'entreprise.siteWeb': (value) => {
      if (value && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value)) {
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
  };

  const { errors, validate } = useFormValidation({}, validationRules);

  useEffect(() => {
    const fetchEntreprises = async () => {
      const entreprisesSnapshot = await getDocs(collection(db, 'entreprises'));
      const entreprisesList = entreprisesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEntreprises(entreprisesList);
    };

    if (isOpen) {
      fetchEntreprises();
    }
  }, [isOpen]);

  const updateFormData = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleChange = (e, section, subSection = null) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Formatage spécial pour le numéro de téléphone
    if (name === 'telephone') {
      formattedValue = formatPhoneNumber(value);
    }

    setFormData(prev => ({
      ...prev,
      [section]: subSection
        ? {
            ...prev[section],
            [subSection]: {
              ...prev[section][subSection],
              [name]: formattedValue
            }
          }
        : {
            ...prev[section],
            [name]: formattedValue
          }
    }));
  };

  const handleEntrepriseChange = (e) => {
    const { value } = e.target;
    if (value === '') {
      // Si aucune entreprise n'est sélectionnée, considérer comme particulier
      setFormData(prev => ({
        ...prev,
        nouvelleEntreprise: false,
        client: {
          ...prev.client,
          entrepriseId: '',
          relationClient: {
            ...prev.client.relationClient,
            tags: prev.client.relationClient.tags.includes('Particulier') ? prev.client.relationClient.tags : [...prev.client.relationClient.tags, 'Particulier']
          }
        }
      }));
    } else if (value === 'nouvelle') {
      setFormData(prev => ({
        ...prev,
        nouvelleEntreprise: true,
        client: {
          ...prev.client,
          entrepriseId: ''
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        nouvelleEntreprise: false,
        client: {
          ...prev.client,
          entrepriseId: value,
          relationClient: {
            ...prev.client.relationClient,
            tags: prev.client.relationClient.tags.filter(tag => tag !== 'Particulier')
          }
        }
      }));
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        logoFile: file,
        previewUrl: URL.createObjectURL(file)
      }));
    }
  };

  const handleLogoDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        logoFile: file,
        previewUrl: URL.createObjectURL(file)
      }));
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
    setFormData(prev => ({
      ...prev,
      logoFile: null,
      previewUrl: ''
    }));
  };

  const handleLogoPaste = useCallback((e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        setFormData(prev => ({
          ...prev,
          logoFile: blob,
          previewUrl: URL.createObjectURL(blob)
        }));
        break;
      }
    }
  }, []);

  const uploadLogo = async () => {
    if (formData.logoFile) {
      const fileExtension = formData.logoFile.name.split('.').pop();
      const fileName = `logos/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExtension}`;
      const logoRef = ref(storage, fileName);
      
      try {
        const snapshot = await uploadBytes(logoRef, formData.logoFile);
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log('Logo uploaded successfully:', downloadURL);
        return downloadURL;
      } catch (error) {
        console.error('Error uploading logo:', error);
        throw error;
      }
    }
    return null;
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
    const isValid = validate(formData);
    if (!isValid) {
      console.log("Erreurs de validation:", errors);
      return;
    }
    setIsSubmitting(true);
    setUploadProgress(0);
    try {
      let entrepriseId = formData.client.entrepriseId;

      if (formData.nouvelleEntreprise) {
        const logoUrl = await uploadLogo();
        const nouvelleEntrepriseDoc = await addDoc(collection(db, 'entreprises'), {
          ...formData.entreprise,
          logo: logoUrl,
          siteWeb: formatWebsite(formData.entreprise.siteWeb)
        });
        entrepriseId = nouvelleEntrepriseDoc.id;
      }

      const clientToAdd = {
        informationsPersonnelles: formData.client.informationsPersonnelles,
        entrepriseId: entrepriseId,
        relationClient: { 
          ...formData.client.relationClient, 
          dateCreation: new Date(formData.client.relationClient.dateCreation).toISOString(),
          tags: formData.client.relationClient.tags,
          rating: formData.client.relationClient.rating
        }
      };

      const docRef = await addDoc(collection(db, 'clients'), clientToAdd);
      console.log('Document written with ID:', docRef.id);

      const newClient = { id: docRef.id, ...clientToAdd };
      onClientAdded(newClient);
      onClose();
      
      // Réinitialiser le formulaire
      setFormData({
        client: {
          informationsPersonnelles: { prenom: '', nom: '', email: '', telephone: '', telFixe: '', linkedinUrl: '' },
          entrepriseId: '',
          relationClient: { dateCreation: new Date().toISOString().split('T')[0], commentaireInterne: '', tags: [], rating: 0 },
        },
        entreprise: { nom: '', adresse: '', siteWeb: '' },
        nouvelleEntreprise: false,
        logoFile: null,
        previewUrl: '',
      });
    } catch (error) {
      console.error('Erreur lors de la création du client:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const sectionClass = `p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transition-all duration-300`;
  const inputClass = `w-full p-2 border-b ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} focus:border-teal-500 focus:ring-0 transition-all duration-300`;
  const labelClass = 'block text-sm font-medium text-teal-600 dark:text-teal-400 mb-1';
  const buttonClass = 'px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-400 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
      <div className={`relative w-full max-w-4xl p-6 rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors duration-300">
          <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text">Ajouter un nouveau client</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4" autoComplete="off">
          <div className={sectionClass}>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <UserCircleIcon className="h-5 w-5 mr-2 text-teal-500" />
              Informations personnelles
            </h3>
            <div className="space-y-2">
              <FormInput
                label="Prénom"
                name="prenom"
                value={formData.client.informationsPersonnelles.prenom}
                onChange={(e) => handleChange(e, 'client', 'informationsPersonnelles')}
                error={errors['client.informationsPersonnelles.prenom']}
                darkMode={darkMode}
                required
              />
              <FormInput
                label="Nom"
                name="nom"
                value={formData.client.informationsPersonnelles.nom}
                onChange={(e) => handleChange(e, 'client', 'informationsPersonnelles')}
                error={errors['client.informationsPersonnelles.nom']}
                darkMode={darkMode}
                required
              />
              <FormInput
                label="Email"
                name="email"
                type="email"
                value={formData.client.informationsPersonnelles.email}
                onChange={(e) => handleChange(e, 'client', 'informationsPersonnelles')}
                error={errors['client.informationsPersonnelles.email']}
                darkMode={darkMode}
                required
              />
              <FormInput
                label="Téléphone"
                name="telephone"
                type="tel"
                value={formData.client.informationsPersonnelles.telephone}
                onChange={(e) => handleChange(e, 'client', 'informationsPersonnelles')}
                error={errors['client.informationsPersonnelles.telephone']}
                darkMode={darkMode}
                required
              />
              <FormInput
                label="Téléphone fixe"
                name="telFixe"
                type="tel"
                value={formData.client.informationsPersonnelles.telFixe}
                onChange={(e) => handleChange(e, 'client', 'informationsPersonnelles')}
                error={errors['client.informationsPersonnelles.telFixe']}
                darkMode={darkMode}
              />
              <FormInput
                label="LinkedIn URL"
                name="linkedinUrl"
                type="url"
                value={formData.client.informationsPersonnelles.linkedinUrl}
                onChange={(e) => handleChange(e, 'client', 'informationsPersonnelles')}
                error={errors['client.informationsPersonnelles.linkedinUrl']}
                darkMode={darkMode}
              />
            </div>
          </div>

          <div className={sectionClass}>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <BuildingOfficeIcon className="h-5 w-5 mr-2 text-teal-500" />
              Entreprise
            </h3>
            <div className="space-y-2">
              <div>
                <label className={labelClass} htmlFor="entreprise">Entreprise</label>
                <select
                  id="entreprise"
                  name="entreprise"
                  className={inputClass}
                  value={formData.nouvelleEntreprise ? 'nouvelle' : formData.client.entrepriseId}
                  onChange={handleEntrepriseChange}
                >
                  <option value="">Particulier</option>
                  {entreprises.map((ent) => (
                    <option key={ent.id} value={ent.id}>{ent.nom}</option>
                  ))}
                  <option value="nouvelle">Ajouter une nouvelle entreprise</option>
                </select>
                {errors['client.entrepriseId'] && <p className="text-red-500 text-xs italic">{errors['client.entrepriseId']}</p>}
              </div>
              {formData.nouvelleEntreprise && (
                <>
                  <FormInput
                    label="Nom de l'entreprise"
                    name="nom"
                    value={formData.entreprise.nom}
                    onChange={(e) => handleChange(e, 'entreprise')}
                    error={errors['entreprise.nom']}
                    darkMode={darkMode}
                    required
                  />
                  <FormInput
                    label="Raison sociale"
                    name="raisonSociale"
                    value={formData.entreprise.raisonSociale}
                    onChange={(e) => handleChange(e, 'entreprise')}
                    error={errors['entreprise.raisonSociale']}
                    darkMode={darkMode}
                  />
                  <FormInput
                    label="Adresse"
                    name="adresse"
                    value={formData.entreprise.adresse}
                    onChange={(e) => handleChange(e, 'entreprise')}
                    error={errors['entreprise.adresse']}
                    darkMode={darkMode}
                  />
                  <FormInput
                    label="Site web"
                    name="siteWeb"
                    type="url"
                    value={formData.entreprise.siteWeb}
                    onChange={(e) => handleChange(e, 'entreprise')}
                    error={errors['entreprise.siteWeb']}
                    darkMode={darkMode}
                  />
                  <FormInput
                    label="SIREN"
                    name="siren"
                    value={formData.entreprise.siren}
                    onChange={(e) => handleChange(e, 'entreprise')}
                    error={errors['entreprise.siren']}
                    darkMode={darkMode}
                  />
                  <FormInput
                    label="SIRET"
                    name="siret"
                    value={formData.entreprise.siret}
                    onChange={(e) => handleChange(e, 'entreprise')}
                    error={errors['entreprise.siret']}
                    darkMode={darkMode}
                  />
                  <div>
                    <label className={labelClass} htmlFor="logo">Logo de l'entreprise</label>
                    <div 
                      className={`flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer ${
                        isDragging ? 'border-teal-500 bg-teal-50' : 'border-gray-300'
                      }`}
                      onDrop={handleLogoDrop}
                      onDragOver={handleLogoDragOver}
                      onDragLeave={handleLogoDragLeave}
                      onPaste={handleLogoPaste}
                      tabIndex="0"
                    >
                      {formData.previewUrl ? (
                        <div className="relative w-full h-full">
                          <img src={formData.previewUrl} alt="Logo preview" className="w-full h-full object-contain" />
                          <button
                            type="button"
                            onClick={handleLogoDelete}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 m-1 hover:bg-red-600 transition-colors duration-300"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-1 text-sm text-gray-500">Cliquez, glissez-déposez ou collez pour ajouter un logo</p>
                        </div>
                      )}
                      <input 
                        id="logo" 
                        type="file" 
                        className="hidden" 
                        onChange={handleLogoChange} 
                        accept="image/*" 
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className={sectionClass}>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <TagIcon className="h-5 w-5 mr-2 text-teal-500" />
              Relation client
            </h3>
            <div className="space-y-2">
              <FormInput
                label="Date de création"
                name="dateCreation"
                type="date"
                value={formData.client.relationClient.dateCreation}
                onChange={(e) => handleChange(e, 'client', 'relationClient')}
                error={errors['client.relationClient.dateCreation']}
                darkMode={darkMode}
              />
              <div>
                <label className={labelClass} htmlFor="commentaireInterne">Commentaire interne</label>
                <textarea
                  id="commentaireInterne"
                  name="commentaireInterne"
                  value={formData.client.relationClient.commentaireInterne}
                  onChange={(e) => handleChange(e, 'client', 'relationClient')}
                  className={`${inputClass} h-24`}
                ></textarea>
              </div>
              <TagInput
                tags={formData.client.relationClient.tags}
                setTags={(newTags) => setFormData(prev => ({
                  ...prev,
                  client: {
                    ...prev.client,
                    relationClient: {
                      ...prev.client.relationClient,
                      tags: newTags
                    }
                  }
                }))}
                suggestions={tagSuggestions}
                darkMode={darkMode}
              />
              <div>
                <label className={labelClass}>Note client</label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`text-2xl ${star <= formData.client.relationClient.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      onClick={() => updateFormData('client.relationClient', 'rating', star)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-3">
            <button
              type="submit"
              className={`w-full ${buttonClass}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span>Ajout en cours... {uploadProgress > 0 && `${uploadProgress}%`}</span>
                  <div className="w-full bg-teal-200 mt-2 rounded-full h-2">
                    <div 
                      className="bg-teal-500 h-2 rounded-full" 
                      style={{width: `${uploadProgress}%`}}
                    ></div>
                  </div>
                </>
              ) : 'Ajouter le client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NouveauClientPopup;