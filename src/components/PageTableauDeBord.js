import React from 'react';

const PageTableauDeBord = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="border p-4 rounded">
        <h2 className="font-bold">Devis en cours</h2>
        <p className="text-2xl font-bold">5</p>
      </div>
      <div className="border p-4 rounded">
        <h2 className="font-bold">Chiffre d'affaires du mois</h2>
        <p className="text-2xl font-bold">15 000 €</p>
      </div>
      <div className="border p-4 rounded">
        <h2 className="font-bold">Taux de conversion</h2>
        <p className="text-2xl font-bold">75%</p>
      </div>
    </div>
  );
};

export default PageTableauDeBord;