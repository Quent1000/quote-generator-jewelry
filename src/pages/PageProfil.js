import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, storage, auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { useAppContext } from '../context/AppContext';
import { CameraIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const PageProfil = () => {
  const { user, updateUser } = useAuth();
  const { darkMode } = useAppContext();
  const [userData, setUserData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    role: '',
    phoneNumber: '',
  });
  const [photoURL, setPhotoURL] = useState(user.photoURL || '');
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
    try {
      const updatedUserData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role,
        phoneNumber: userData.phoneNumber,
        photoURL: photoURL
      };
      await updateUser(updatedUserData);
      setMessage('Profil mis à jour avec succès');
      // setIsEditing(false); // Removed as per instructions
    } catch (error) {
      setMessage(`Erreur lors de la mise à jour du profil: ${error.message}`);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      setMessage('Mot de passe mis à jour avec succès');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsChangingPassword(false);
    } catch (error) {
      setMessage(`Erreur lors du changement de mot de passe: ${error.message}`);
    }
  };

  const bgClass = darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900';
  const inputClass = `w-full p-2 border rounded transition-all duration-300 ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
  } focus:border-teal-500 focus:ring focus:ring-teal-200`;
  const buttonClass = `px-4 py-2 rounded font-medium transition-all duration-300 ${
    darkMode ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-teal-500 text-white hover:bg-teal-600'
  }`;

  return (
    <div className={`p-4 min-h-screen ${bgClass}`}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-t-lg p-6 flex items-center space-x-4">
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
        
        <div className={`rounded-b-lg shadow-lg p-6 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Prénom</label>
                <input type="text" name="firstName" value={userData.firstName} onChange={handleInputChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nom</label>
                <input type="text" name="lastName" value={userData.lastName} onChange={handleInputChange} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" name="email" value={userData.email} onChange={handleInputChange} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Téléphone</label>
                <input type="tel" name="phoneNumber" value={userData.phoneNumber} onChange={handleInputChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rôle</label>
                <select name="role" value={userData.role} onChange={handleInputChange} className={inputClass}>
                  <option value="">Sélectionner un rôle</option>
                  <option value="user">Utilisateur</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <button type="submit" className={buttonClass}>Sauvegarder les modifications</button>
            </div>
          </form>
          
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              Sécurité
            </h3>
            {isChangingPassword ? (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <input type="password" placeholder="Mot de passe actuel" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={inputClass} />
                <input type="password" placeholder="Nouveau mot de passe" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} />
                <input type="password" placeholder="Confirmer le mot de passe" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} />
                <div className="flex justify-between items-center">
                  <button type="submit" className={buttonClass}>Changer le mot de passe</button>
                  <button type="button" onClick={() => setIsChangingPassword(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    Annuler
                  </button>
                </div>
              </form>
            ) : (
              <button onClick={() => setIsChangingPassword(true)} className={`${buttonClass} mt-2`}>
                Changer le mot de passe
              </button>
            )}
          </div>
        </div>
      </div>
      {message && (
        <div className="fixed bottom-4 right-4 bg-teal-500 text-white px-4 py-2 rounded-lg flex items-center shadow-lg animate-fade-in-up">
          <CheckCircleIcon className="h-5 w-5 mr-2" />
          {message}
          <button onClick={() => setMessage('')} className="ml-2 text-white hover:text-teal-200">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PageProfil;