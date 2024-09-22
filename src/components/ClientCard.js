import React from 'react';

const ClientCard = ({ client, darkMode }) => (
  <div className={`border p-4 rounded-lg shadow-sm cursor-pointer ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'}`}>
    <h3 className="font-semibold">{client.prenom} {client.nom}</h3>
    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{client.societe}</p>
    <p className="text-sm">📧 {client.email}</p>
    <p className="text-sm">📞 {client.telephone}</p>
  </div>
);

export default ClientCard;