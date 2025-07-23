import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AvisProduit from "../components/AvisProduit";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [produit, setProduit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantite, setQuantite] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProduit = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/produits/${id}`);
        setProduit(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Erreur chargement produit :", err);
        setLoading(false);
      }
    };

    fetchProduit();
  }, [id]);

  const ajouterAuPanier = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/panier/ajouter",
        {
          produitId: produit._id,
          quantite,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("✅ Produit ajouté au panier !");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Erreur ajout panier :", err);
      setMessage("❌ Une erreur est survenue.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (loading) return <p className="text-center mt-10">Chargement...</p>;
  if (!produit) return <p className="text-center mt-10 text-red-500">Produit introuvable</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Image */}
        <img
          src={produit.imageUrl || "https://via.placeholder.com/400x300"}
          alt={produit.nom}
          className="w-full md:w-1/2 h-auto rounded-xl shadow"
        />

        {/* Détails */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-green-800 mb-4">{produit.nom}</h1>
          <p className="text-gray-700 mb-4">{produit.description}</p>
          <p className="text-xl font-bold text-green-600 mb-6">{produit.prix} €</p>

          <div className="mb-4">
            <label className="block mb-1 text-gray-700">Quantité :</label>
            <input
              type="number"
              min="1"
              value={quantite}
              onChange={(e) => setQuantite(Number(e.target.value))}
              className="w-24 border rounded px-2 py-1"
            />
          </div>

          {/* Message de succès ou d'erreur */}
          {message && (
            <p className={message.startsWith("✅") ? "text-green-700 font-semibold mb-3" : "text-red-600 font-semibold mb-3"}>{message}</p>
          )}

          <button
            onClick={ajouterAuPanier}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Ajouter au panier
          </button>

          <button
            onClick={() => navigate("/")}
            className="ml-4 text-gray-600 hover:underline"
          >
            ⬅ Retour à l’accueil
          </button>
        </div>
      </div>
      
      {/* Section des avis */}
      {produit && (
        <div className="mt-10">
          <AvisProduit produitId={produit._id} />
        </div>
      )}
    </div>
  );
}

export default ProductDetail; 