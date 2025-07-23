import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

function CheckoutPage() {
  const [panier, setPanier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adresse, setAdresse] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPanier = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/panier', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPanier(res.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors de la récupération du panier.');
        setLoading(false);
      }
    };

    if (user) {
      fetchPanier();
    }
  }, [user]);

  const handleValiderCommande = async () => {
    if (!adresse.trim()) {
      setError('Veuillez saisir une adresse de livraison.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/commandes/valider',
        { adresse_livraison: adresse },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert('Commande validée avec succès !');
      navigate('/profil'); // Rediriger vers la page de profil pour voir les commandes
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la validation.');
    }
  };

  if (loading) return <p className="text-center mt-10">Chargement du panier...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!panier || panier.produits.length === 0) {
    return <p className="text-center mt-10">Votre panier est vide.</p>;
  }

  const prixTotal = panier.produits.reduce((total, item) => {
    if (!item.produit) return total;
    return total + item.produit.prix * item.quantite;
  }, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Valider ma commande</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Résumé du panier</h2>
        
        {panier.produits.map(item => (
          item.produit ? (
            <div key={item.produit._id} className="flex justify-between items-center border-b py-2">
              <div>
                <p className="font-semibold">{item.produit.nom}</p>
                <p className="text-sm text-gray-600">Quantité : {item.quantite}</p>
              </div>
              <p className="font-semibold">{(item.produit.prix * item.quantite).toFixed(2)} €</p>
            </div>
          ) : null
        ))}

        <div className="flex justify-between items-center mt-4 font-bold text-xl">
          <p>Total</p>
          <p>{prixTotal.toFixed(2)} €</p>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mt-8">
        <h2 className="text-2xl font-semibold mb-4">Adresse de livraison</h2>
        <textarea
          className="w-full p-2 border rounded"
          rows="3"
          value={adresse}
          onChange={(e) => setAdresse(e.target.value)}
          placeholder="Entrez votre adresse complète"
        ></textarea>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={handleValiderCommande}
          className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-bold text-lg"
        >
          Passer la commande
        </button>
      </div>
    </div>
  );
}

export default CheckoutPage; 