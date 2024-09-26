import React, { useState, useCallback, useEffect } from 'react';
import { XMarkIcon, UserCircleIcon, BuildingOfficeIcon, TagIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import TagInput from '../common/TagInput';

const NouveauClientPopup = ({ isOpen, onClose, darkMode, onClientAdded }) => {
  const [client, setClient] = useState({
    informationsPersonnelles: { prenom: '', nom: '', email: '', telephone: '', telFixe: '', linkedinUrl: '' },
    entrepriseId: '',
    relationClient: { dateCreation: new Date().toISOString().split('T')[0], commentaireInterne: '', tags: [], rating: 0 },
  });

  const [entreprise, setEntreprise] = useState({
    nom: '',
    adresse: '',
    siteWeb: '',
  });

  const [entreprises, setEntreprises] = useState([]);
  const [nouvelleEntreprise, setNouvelleEntreprise] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState({});
  const [tags, setTags] = useState([]);
  const tagSuggestions = ['VIP', 'Fidèle', 'Nouveau', 'Professionnel', 'Particulier'];
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchEntreprises = async () => {
      const entreprisesSnapshot = await getDocs(collection(db, 'entreprises'));
      const entreprisesList = entreprisesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEntreprises(entreprisesList);
    };
    fetchEntreprises();
  }, []);

  const handleChange = (e, section) => {
    const { name, value } = e.target;
    if (section === 'entreprise') {
      setEntreprise(prev => ({ ...prev, [name]: value }));
    } else {
      setClient(prev => ({ ...prev, [section]: { ...prev[section], [name]: value } }));
    }
  };

  const handleEntrepriseChange = (e) => {
    const { value } = e.target;
    if (value === 'nouvelle') {
      setNouvelleEntreprise(true);
      setClient(prev => ({ ...prev, entrepriseId: '' }));
    } else {
      setNouvelleEntreprise(false);
      setClient(prev => ({ ...prev, entrepriseId: value }));
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

  const isValidUrl = (url) => {
    if (!url) return true; // URL optionnelle
    const pattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return pattern.test(url);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!client.informationsPersonnelles.prenom.trim()) newErrors.prenom = "Le prénom est requis";
    if (!client.informationsPersonnelles.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!client.informationsPersonnelles.email.trim()) newErrors.email = "L'email est requis";
    if (!/^\S+@\S+\.\S+$/.test(client.informationsPersonnelles.email)) newErrors.email = "Format d'email invalide";
    if (!client.informationsPersonnelles.telephone.trim()) newErrors.telephone = "Le téléphone est requis";
    if (!/^(\+33|0)[1-9](\d{2}){4}$/.test(client.informationsPersonnelles.telephone)) newErrors.telephone = "Format de téléphone invalide";
    
    if (nouvelleEntreprise) {
      if (!entreprise.nom.trim()) newErrors.entrepriseNom = "Le nom de l'entreprise est requis";
      if (entreprise.siteWeb && !isValidUrl(entreprise.siteWeb)) newErrors.siteWeb = "Format d'URL invalide";
    } else if (!client.entrepriseId) {
      newErrors.entrepriseId = "Veuillez sélectionner une entreprise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setUploadProgress(0);
    try {
      let entrepriseId = client.entrepriseId;

      if (nouvelleEntreprise) {
        const logoUrl = await uploadLogo();
        const nouvelleEntrepriseDoc = await addDoc(collection(db, 'entreprises'), {
          ...entreprise,
          logo: logoUrl,
          siteWeb: formatWebsite(entreprise.siteWeb)
        });
        entrepriseId = nouvelleEntrepriseDoc.id;
      }

      const clientToAdd = {
        informationsPersonnelles: client.informationsPersonnelles,
        entrepriseId: entrepriseId,
        relationClient: { 
          ...client.relationClient, 
          dateCreation: new Date(client.relationClient.dateCreation).toISOString(),
          tags: tags,
          rating: rating
        }
      };

      const docRef = await addDoc(collection(db, 'clients'), clientToAdd);
      console.log('Document written with ID:', docRef.id);

      const newClient = { id: docRef.id, ...clientToAdd };
      onClientAdded(newClient);
      onClose();
      
      // Réinitialiser le formulaire
      setClient({
        informationsPersonnelles: { prenom: '', nom: '', email: '', telephone: '', telFixe: '', linkedinUrl: '' },
        entrepriseId: '',
        relationClient: { dateCreation: new Date().toISOString().split('T')[0], commentaireInterne: '', tags: [], rating: 0 },
      });
      setEntreprise({ nom: '', adresse: '', siteWeb: '' });
      setLogoFile(null);
      setPreviewUrl('');
      setNouvelleEntreprise(false);
      setTags([]);
      setRating(0);
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
              <div>
                <label className={labelClass} htmlFor="prenom">Prénom</label>
                <input
                  type="text"
                  id="prenom"
                  name="prenom"
                  className={`${inputClass} ${errors.prenom ? 'border-red-500' : ''}`}
                  value={client.informationsPersonnelles.prenom}
                  onChange={(e) => handleChange(e, 'informationsPersonnelles')}
                  required
                  autoComplete="off"
                />
                {errors.prenom && <p className="text-red-500 text-xs italic">{errors.prenom}</p>}
              </div>
              <div>
                <label className={labelClass} htmlFor="nom">Nom</label>
                <input 
                  type="text" 
                  id="nom" 
                  name="nom" 
                  className={`${inputClass} ${errors.nom ? 'border-red-500' : ''}`}
                  value={client.informationsPersonnelles.nom} 
                  onChange={(e) => handleChange(e, 'informationsPersonnelles')} 
                  required 
                  autoComplete="off"
                />
                {errors.nom && <p className="text-red-500 text-xs italic">{errors.nom}</p>}
              </div>
              <div>
                <label className={labelClass} htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  className={`${inputClass} ${errors.email ? 'border-red-500' : ''}`}
                  value={client.informationsPersonnelles.email} 
                  onChange={(e) => handleChange(e, 'informationsPersonnelles')} 
                  required 
                  autoComplete="off"
                />
                {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
              </div>
              <div>
                <label className={labelClass} htmlFor="telephone">Téléphone</label>
                <input 
                  type="text" 
                  id="telephone" 
                  name="telephone" 
                  className={`${inputClass} ${errors.telephone ? 'border-red-500' : ''}`}
                  value={client.informationsPersonnelles.telephone} 
                  onChange={(e) => handleChange(e, 'informationsPersonnelles')} 
                  required 
                  autoComplete="off"
                />
                {errors.telephone && <p className="text-red-500 text-xs italic">{errors.telephone}</p>}
              </div>
              <div>
                <label className={labelClass} htmlFor="telFixe">Téléphone fixe</label>
                <input 
                  type="text" 
                  id="telFixe" 
                  name="telFixe" 
                  className={inputClass}
                  value={client.informationsPersonnelles.telFixe} 
                  onChange={(e) => handleChange(e, 'informationsPersonnelles')} 
                  autoComplete="off"
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="linkedinUrl">Profil LinkedIn</label>
                <input 
                  type="url" 
                  id="linkedinUrl" 
                  name="linkedinUrl" 
                  className={inputClass}
                  value={client.informationsPersonnelles.linkedinUrl} 
                  onChange={(e) => handleChange(e, 'informationsPersonnelles')} 
                  placeholder="https://www.linkedin.com/in/username"
                />
              </div>
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
                  value={nouvelleEntreprise ? 'nouvelle' : client.entrepriseId}
                  onChange={handleEntrepriseChange}
                >
                  <option value="">Sélectionner une entreprise</option>
                  {entreprises.map((ent) => (
                    <option key={ent.id} value={ent.id}>{ent.nom}</option>
                  ))}
                  <option value="nouvelle">Ajouter une nouvelle entreprise</option>
                </select>
                {errors.entrepriseId && <p className="text-red-500 text-xs italic">{errors.entrepriseId}</p>}
              </div>
              {nouvelleEntreprise && (
                <>
                  <div>
                    <label className={labelClass} htmlFor="nomEntreprise">Nom de l'entreprise</label>
                    <input
                      type="text"
                      id="nomEntreprise"
                      name="nom"
                      className={inputClass}
                      value={entreprise.nom}
                      onChange={(e) => handleChange(e, 'entreprise')}
                      required
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
                      className="flex items-center justify-center w-full"
                      onPaste={handleLogoPaste}
                      tabIndex="0"
                    >
                      <label htmlFor="logo" className="flex flex-col items-center justify-center w-full h-32 border-2 border-teal-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {previewUrl ? (
                            <img src={previewUrl} alt="Logo preview" className="w-20 h-20 object-cover rounded-lg" />
                          ) : (
                            <>
                              <CloudArrowUpIcon className="w-10 h-10 mb-3 text-teal-500" />
                              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Cliquez pour uploader</span>, glissez et déposez ou collez une image</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG ou GIF (MAX. 800x400px)</p>
                            </>
                          )}
                        </div>
                        <input id="logo" type="file" className="hidden" onChange={handleLogoChange} accept="image/*" />
                      </label>
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
              <div>
                <label className={labelClass} htmlFor="dateCreation">Date de création</label>
                <input type="date" id="dateCreation" name="dateCreation" className={inputClass} value={client.relationClient.dateCreation} onChange={(e) => handleChange(e, 'relationClient')} />
              </div>
              <div>
                <label className={labelClass} htmlFor="commentaireInterne">Commentaire interne</label>
                <textarea id="commentaireInterne" name="commentaireInterne" className={`${inputClass} h-24 resize-none`} value={client.relationClient.commentaireInterne} onChange={(e) => handleChange(e, 'relationClient')}></textarea>
              </div>
              <div>
                <label className={labelClass} htmlFor="tags">Tags</label>
                <TagInput
                  tags={tags}
                  setTags={setTags}
                  suggestions={tagSuggestions}
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

          <div className="col-span-3 flex justify-end space-x-4 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400 transition-colors duration-300">Annuler</button>
            <button 
              type="submit" 
              className={`${buttonClass} ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
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