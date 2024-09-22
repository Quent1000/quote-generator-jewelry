import React, { useState } from 'react';

const NouveauClientForm = ({ onAjouterClient, darkMode }) => {
  const [nouveauClient, setNouveauClient] = useState({
    prenom: '',
    nom: '',
    societe: '',
    email: '',
    telephone: '',
    adresse: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNouveauClient(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAjouterClient(nouveauClient);
    setNouveauClient({ prenom: '', nom: '', societe: '', email: '', telephone: '', adresse: '' });
  };

  const inputClass = `w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:border-teal-500 focus:ring focus:ring-teal-200`;
  const buttonClass = 'bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50';

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input type="text" name="prenom" value={nouveauClient.prenom} onChange={handleChange} placeholder="Prénom" className={inputClass} required />
      <input type="text" name="nom" value={nouveauClient.nom} onChange={handleChange} placeholder="Nom" className={inputClass} required />
      <input type="text" name="societe" value={nouveauClient.societe} onChange={handleChange} placeholder="Société" className={inputClass} />
      <input type="email" name="email" value={nouveauClient.email} onChange={handleChange} placeholder="Email" className={inputClass} required />
      <input type="tel" name="telephone" value={nouveauClient.telephone} onChange={handleChange} placeholder="Téléphone" className={inputClass} />
      <input type="text" name="adresse" value={nouveauClient.adresse} onChange={handleChange} placeholder="Adresse" className={inputClass} />
      <button type="submit" className={buttonClass}>Ajouter le client</button>
    </form>
  );
};

export default NouveauClientForm;