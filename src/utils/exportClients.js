export const exportClientsToCSV = (clients) => {
  const headers = [
    'Prénom',
    'Nom',
    'Société',
    'Email',
    'Téléphone',
    'Téléphone fixe',
    'Adresse',
    'Site web',
    'Date de création',
    'Commentaire interne',
    'Tags'
  ];

  const csvContent = [
    headers.join(','),
    ...clients.map(client => [
      client.informationsPersonnelles.prenom,
      client.informationsPersonnelles.nom,
      client.entreprise.nom,
      client.informationsPersonnelles.email,
      client.informationsPersonnelles.telephone,
      client.informationsPersonnelles.telFixe || '',
      client.entreprise.adresse,
      client.entreprise.siteWeb || '',
      client.relationClient.dateCreation,
      client.relationClient.commentaireInterne || '',
      client.relationClient.tags.join(';')
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'clients.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};