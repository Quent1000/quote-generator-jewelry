import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import { db, storage, auth } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { CameraIcon, CheckCircleIcon, XMarkIcon, UserCircleIcon, LockClosedIcon, PhoneIcon, BriefcaseIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import AnimatedBackground from '../components/ui/AnimatedBackground';

const PageProfil = () => {
  const { user, updateUser } = useAuth(); // Suppression de isAdmin ici
  const { darkMode } = useAppContext();
  const [userData, setUserData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    role: user.role || '',
    phoneNumber: '',
  });
  const [photoURL, setPhotoURL] = useState(user.photoURL || '');
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUserData(prevState => ({ ...prevState, ...userDoc.data() }));
      }
    };
    fetchUserData();
  }, [user.uid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevState => ({ ...prevState, [name]: value }));
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const storageRef = ref(storage, `profile_photos/${user.uid}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        setPhotoURL(downloadURL);
      } catch (error) {
        setMessage("Erreur lors du téléchargement de la photo.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const updatedUserData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        role: userData.role,
        photoURL: photoURL,
      };
      await updateDoc(doc(db, 'users', user.uid), updatedUserData);
      await updateUser(updatedUserData);
      setMessage("Profil mis à jour avec succès !");
    } catch (error) {
      setMessage("Erreur lors de la mise à jour du profil.");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      setMessage("Mot de passe mis à jour avec succès !");
      setIsChangingPassword(false);
    } catch (error) {
      setMessage("Erreur lors du changement de mot de passe.");
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!userData.firstName.trim()) errors.firstName = "Le prénom est requis";
    if (!userData.lastName.trim()) errors.lastName = "Le nom est requis";
    if (!userData.phoneNumber.trim()) errors.phoneNumber = "Le numéro de tléphone est requis";
    if (!/^(\+33|0)[1-9](\d{2}){4}$/.test(userData.phoneNumber)) errors.phoneNumber = "Format de téléphone invalide";
    return errors;
  };

  const inputClass = `w-full p-2 rounded-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} border ${darkMode ? 'border-gray-700' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-teal-500`;
  const buttonClass = `group relative overflow-hidden bg-gradient-to-r from-teal-500 to-teal-400 text-white font-semibold py-2 px-4 rounded-full shadow-lg transform transition duration-200 ease-in-out hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50`;
  const errorClass = 'text-red-500 text-xs italic';

  return (
    <AnimatedBackground darkMode={darkMode} intensity="low">
      <div className="relative min-h-screen flex flex-col">
        <div className="flex-grow p-8">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text">
            Profil Utilisateur
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-t-xl p-6 flex items-center space-x-4">
              <div className="relative">
                <img src={photoURL || "https://via.placeholder.com/150"} alt="Profil" className="w-24 h-24 rounded-full object-cover border-4 border-white" />
                <button onClick={() => fileInputRef.current.click()} className="absolute bottom-0 right-0 p-1 bg-white text-teal-500 rounded-full shadow-lg hover:bg-teal-100 transition-all duration-300">
                  <CameraIcon className="h-5 w-5" />
                </button>
                <input type="file" ref={fileInputRef} onChange={handlePhotoChange} className="hidden" accept="image/*" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{userData.firstName} {userData.lastName}</h2>
                <p className="text-teal-100">{userData.role || 'Rôle non défini'}</p>
              </div>
            </div>
            <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-b-xl shadow-lg p-6`}>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Prénom</label>
                    <div className="relative">
                      <UserCircleIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input type="text" name="firstName" value={userData.firstName} onChange={handleInputChange} className={`${inputClass} pl-10`} />
                    </div>
                    {errors.firstName && <p className={errorClass}>{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nom</label>
                    <div className="relative">
                      <UserCircleIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input type="text" name="lastName" value={userData.lastName} onChange={handleInputChange} className={`${inputClass} pl-10`} />
                    </div>
                    {errors.lastName && <p className={errorClass}>{errors.lastName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <div className="relative">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input type="email" name="email" value={userData.email} onChange={handleInputChange} className={`${inputClass} pl-10`} readOnly />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Téléphone</label>
                    <div className="relative">
                      <PhoneIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input type="tel" name="phoneNumber" value={userData.phoneNumber} onChange={handleInputChange} className={`${inputClass} pl-10`} />
                    </div>
                    {errors.phoneNumber && <p className={errorClass}>{errors.phoneNumber}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Rôle</label>
                    <div className="relative">
                      <BriefcaseIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="text"
                        value={userData.role}
                        className={`${inputClass} pl-10`}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="submit" className={buttonClass}>
                    <span className="absolute inset-0 bg-white opacity-20 transform skew-x-12 translate-x-full group-hover:translate-x-0 transition duration-300 ease-in-out"></span>
                    <span className="relative">Sauvegarder les modifications</span>
                  </button>
                </div>
              </form>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <LockClosedIcon className="h-5 w-5 mr-2 text-teal-500" />
                  Sécurité
                </h3>
                {isChangingPassword ? (
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="relative">
                      <LockClosedIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input type="password" placeholder="Mot de passe actuel" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={`${inputClass} pl-10`} />
                    </div>
                    <div className="relative">
                      <LockClosedIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input type="password" placeholder="Nouveau mot de passe" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={`${inputClass} pl-10`} />
                    </div>
                    <div className="relative">
                      <LockClosedIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input type="password" placeholder="Confirmer le mot de passe" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`${inputClass} pl-10`} />
                    </div>
                    <div className="flex justify-between items-center">
                      <button type="submit" className={buttonClass}>
                        <span className="absolute inset-0 bg-white opacity-20 transform skew-x-12 translate-x-full group-hover:translate-x-0 transition duration-300 ease-in-out"></span>
                        <span className="relative">Changer le mot de passe</span>
                      </button>
                      <button type="button" onClick={() => setIsChangingPassword(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        Annuler
                      </button>
                    </div>
                  </form>
                ) : (
                  <button onClick={() => setIsChangingPassword(true)} className={buttonClass}>
                    <span className="absolute inset-0 bg-white opacity-20 transform skew-x-12 translate-x-full group-hover:translate-x-0 transition duration-300 ease-in-out"></span>
                    <span className="relative">Changer le mot de passe</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        {message && (
          <div className="fixed bottom-4 right-4 bg-teal-500 text-white px-4 py-2 rounded-lg flex items-center shadow-lg animate-fade-in-up z-50">
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            {message}
            <button onClick={() => setMessage('')} className="ml-2 text-white hover:text-teal-200">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </AnimatedBackground>
  );
};

export default PageProfil;