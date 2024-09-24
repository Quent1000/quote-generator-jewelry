import React from 'react';
import ClientCard from './ClientCard';

const ClientList = ({ clients, darkMode, onClientClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {clients.map((client) => (
        <ClientCard
          key={client.id}
          client={client}
          darkMode={darkMode}
          onClick={() => onClientClick(client)}
        />
      ))}
    </div>
  );
};

export default ClientList;