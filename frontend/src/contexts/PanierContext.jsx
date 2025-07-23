import React, { createContext, useState, useContext } from 'react';

const PanierContext = createContext();

export const PanierProvider = ({ children }) => {
  const [panier, setPanier] = useState([]);
  return (
    <PanierContext.Provider value={{ panier, setPanier }}>
      {children}
    </PanierContext.Provider>
  );
};

export const usePanier = () => useContext(PanierContext); 