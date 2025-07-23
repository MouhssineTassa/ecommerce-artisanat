import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Importer Link

function Cart() {
  const [panier, setPanier] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchPanier = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/panier", headers);
        const produitsPanier = res.data.produits || [];

        const itemsFormates = produitsPanier.map((item) => {
          if (!item.produit) return null;
          return {
            _id: item.produit._id,
            nom: item.produit.nom,
            prix: item.produit.prix,
            imageUrl: item.produit.imageUrl,
            quantite: item.quantite,
          };
        }).filter(Boolean);

        setPanier(itemsFormates);
        setLoading(false);
      } catch (err) {
        console.error("Erreur chargement panier :", err);
        setLoading(false);
      }
    };

    fetchPanier();
  }, []);

  const retirerProduit = async (idProduit) => {
    try {
      await axios.post(
        "http://localhost:5000/api/panier/retirer",
        { produitId: idProduit },
        headers
      );
      setPanier(panier.filter((item) => item._id !== idProduit));
    } catch (err) {
      console.error("Erreur retrait produit :", err);
    }
  };

  const totalGeneral = panier.reduce((acc, item) => acc + item.prix * item.quantite, 0);

  if (loading) return <p className="text-center mt-10">Chargement du panier...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">🛒 Mon panier</h1>

      {panier.length === 0 ? (
        <p>Votre panier est vide.</p>
      ) : (
        <div className="space-y-6">
          {panier.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between bg-white p-4 rounded-xl shadow"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.imageUrl || "https://via.placeholder.com/100x100"}
                  alt={item.nom}
                  className="w-24 h-24 rounded-xl object-cover"
                />
                <div>
                  <h2 className="text-lg font-semibold">{item.nom}</h2>
                  <p className="text-sm text-gray-600">Quantité : {item.quantite}</p>
                  <p className="font-bold text-green-700">
                    Total : {(item.prix * item.quantite).toFixed(2)} €
                  </p>
                  <p className="text-green-700 font-bold">{item.prix} €</p>
                </div>
              </div>

              <button
                onClick={() => retirerProduit(item._id)}
                className="text-red-600 hover:underline"
              >
                Retirer
              </button>
            </div>
          ))}

          <div className="text-right mt-8">
            <p className="text-xl font-bold">
              Total général : <span className="text-green-700">{totalGeneral.toFixed(2)} €</span>
            </p>
            <Link
              to="/checkout"
              className="mt-4 inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Valider la commande
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart; 