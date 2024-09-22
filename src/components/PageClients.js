import React, { useState } from 'react';

const ClientCard = ({ client }) => (
  <div className="border p-4 rounded-lg shadow-sm">
    <h3 className="font-semibold">{client.prenom} {client.nom}</h3>
    <p className="text-sm text-gray-600">{client.societe}</p>
    <p className="text-sm">📧 {client.email}</p>
    <p className="text-sm">📞 {client.telephone}</p>
  </div>
);

const NouveauClientForm = ({ onAjouterClient }) => {
  const [nouveauClient, setNouveauClient] = useState({
    prenom: '',
    nom: '',
    societe: '',
    email: '',
    telephone: ''
  });



  const handleSubmit = (e) => {
    e.preventDefault();
    onAjouterClient(nouveauClient);
    setNouveauClient({ prenom: '', nom: '', societe: '', email: '', telephone: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {/* Contenu du formulaire */}
      {/* ... (le reste du formulaire reste inchangé) ... */}
    </form>
  );
};

// ... (autres imports et déclarations)

const PageClients = () => {
    const [clients, setClients] = useState([
      { prenom: 'David', nom: 'Gusky', societe: 'DAVIDOR', email: 'dgusky@davidor.com', telephone: '0783009816' },
      { prenom: 'Quentin', nom: 'Imhoff', societe: 'TGN409', email: 'imhoff.quentin@orange.fr', telephone: '0645376438' },
    ]);
  
    const [afficherFormulaire, setAfficherFormulaire] = useState(false);
  
    const ajouterClient = (nouveauClient) => {
      setClients(prevClients => [...prevClients, nouveauClient]);
      setAfficherFormulaire(false);
    };
  
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Clients ({clients.length})</h2>
          <button onClick={() => setAfficherFormulaire(!afficherFormulaire)} className="bg-blue-500 text-white p-2 rounded">
            {afficherFormulaire ? 'Annuler' : 'Ajouter un client'}
          </button>
        </div>
        {afficherFormulaire && <NouveauClientForm onAjouterClient={ajouterClient} />}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {clients.map((client, index) => (
            <ClientCard key={index} client={client} />
          ))}
        </div>
      </div>
    );
  };
  
  export default PageClients;