import React from 'react';
import { UserCircleIcon, BuildingOfficeIcon, TagIcon } from '@heroicons/react/24/outline';
import TagInput from '../common/TagInput';

const ClientForm = ({ client, entreprise, onChange, onEntrepriseChange, onTagsChange, errors, darkMode }) => {
  const inputClass = `w-full p-2 border-b ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'} focus:border-teal-500 focus:ring-0 transition-all duration-300`;
  const labelClass = 'block text-sm font-medium text-teal-600 dark:text-teal-400 mb-1';

  return (
    <form className="grid grid-cols-3 gap-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <UserCircleIcon className="h-5 w-5 mr-2 text-teal-500" />
          Informations personnelles
        </h3>
        <div>
          <label className={labelClass} htmlFor="prenom">Prénom</label>
          <input
            type="text"
            id="prenom"
            name="prenom"
            className={`${inputClass} ${errors.prenom ? 'border-red-500' : ''}`}
            value={client.informationsPersonnelles.prenom}
            onChange={(e) => onChange('informationsPersonnelles', { ...client.informationsPersonnelles, prenom: e.target.value })}
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
            onChange={(e) => onChange('informationsPersonnelles', { ...client.informationsPersonnelles, nom: e.target.value })}
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
            onChange={(e) => onChange('informationsPersonnelles', { ...client.informationsPersonnelles, email: e.target.value })}
          />
          {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="telephone">Téléphone portable</label>
          <input
            type="tel"
            id="telephone"
            name="telephone"
            className={`${inputClass} ${errors.telephone ? 'border-red-500' : ''}`}
            value={client.informationsPersonnelles.telephone}
            onChange={(e) => onChange('informationsPersonnelles', { ...client.informationsPersonnelles, telephone: e.target.value })}
          />
          {errors.telephone && <p className="text-red-500 text-xs italic">{errors.telephone}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="telFixe">Téléphone fixe</label>
          <input
            type="tel"
            id="telFixe"
            name="telFixe"
            className={inputClass}
            value={client.informationsPersonnelles.telFixe}
            onChange={(e) => onChange('informationsPersonnelles', { ...client.informationsPersonnelles, telFixe: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <BuildingOfficeIcon className="h-5 w-5 mr-2 text-teal-500" />
          Entreprise
        </h3>
        <div>
          <label className={labelClass} htmlFor="entrepriseNom">Nom de l'entreprise</label>
          <input
            type="text"
            id="entrepriseNom"
            name="nom"
            className={inputClass}
            value={entreprise.nom}
            onChange={(e) => onEntrepriseChange('nom', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="entrepriseAdresse">Adresse</label>
          <input
            type="text"
            id="entrepriseAdresse"
            name="adresse"
            className={inputClass}
            value={entreprise.adresse}
            onChange={(e) => onEntrepriseChange('adresse', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="entrepriseSiteWeb">Site web</label>
          <input
            type="url"
            id="entrepriseSiteWeb"
            name="siteWeb"
            className={`${inputClass} ${errors.siteWeb ? 'border-red-500' : ''}`}
            value={entreprise.siteWeb}
            onChange={(e) => onEntrepriseChange('siteWeb', e.target.value)}
          />
          {errors.siteWeb && <p className="text-red-500 text-xs italic">{errors.siteWeb}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <TagIcon className="h-5 w-5 mr-2 text-teal-500" />
          Relation client
        </h3>
        <div>
          <label className={labelClass} htmlFor="dateCreation">Date de création</label>
          <input
            type="date"
            id="dateCreation"
            name="dateCreation"
            className={inputClass}
            value={client.relationClient.dateCreation}
            onChange={(e) => onChange('relationClient', { ...client.relationClient, dateCreation: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="commentaireInterne">Commentaire interne</label>
          <textarea
            id="commentaireInterne"
            name="commentaireInterne"
            className={`${inputClass} h-24 resize-none`}
            value={client.relationClient.commentaireInterne}
            onChange={(e) => onChange('relationClient', { ...client.relationClient, commentaireInterne: e.target.value })}
          ></textarea>
        </div>
        <div>
          <label className={labelClass}>Tags</label>
          <TagInput
            tags={client.relationClient.tags}
            setTags={(newTags) => onTagsChange(newTags)}
            suggestions={['VIP', 'Fidèle', 'Nouveau', 'Professionnel', 'Particulier']}
            darkMode={darkMode}
            inputClass={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Note client</label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`text-2xl ${star <= client.relationClient.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                onClick={() => onChange('relationClient', { ...client.relationClient, rating: star })}
              >
                ★
              </button>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
};

export default ClientForm;