import linkedinIcon from '../assets/icone-linkedin.png'; // Importez l'icône LinkedIn personnalisée

function PageDevis() {
  // ... code existant ...

  return (
    <div className="page-devis">
      {/* ... code existant ... */}
      <div className="client-info">
        <h2>{client.nom}</h2>
        <p>{client.email}</p>
        <p>{client.telephone}</p>
        {client.linkedinUrl && (
          <a 
            href={client.linkedinUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="linkedin-link"
          >
            <img 
              src={linkedinIcon} 
              alt="LinkedIn" 
              className="linkedin-icon" 
              width="24" 
              height="24" 
            />
            Profil LinkedIn
          </a>
        )}
      </div>
      {/* ... reste du code ... */}
    </div>
  );
}

// ... code existant ...