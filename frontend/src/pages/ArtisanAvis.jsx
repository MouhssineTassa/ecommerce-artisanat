import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

// Loader animé simple
function Loader() {
  return (
    <div className="flex justify-center items-center py-4">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
    </div>
  );
}

function ArtisanAvis() {
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const { produitId } = useParams();

  useEffect(() => {
    const fetchAvis = async () => {
      try {
        let url = "/api/avis/artisan";
        if (produitId) {
          url = `/api/avis/${produitId}`;
        }
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setAvis(res.data);
      } catch (err) {
        console.error("Erreur chargement avis:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAvis();
  }, [produitId]);

  return (
    <div className="max-w-3xl mx-auto p-2 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-green-800">Avis sur {produitId ? "ce produit" : "mes produits"}</h2>
      {loading ? (
        <Loader />
      ) : avis.length === 0 ? (
        <p className="text-gray-500">Aucun avis pour l'instant.</p>
      ) : (
        <div className="space-y-4">
          {avis.map((a) => (
            <div key={a._id} className="bg-white rounded shadow p-4 transition-transform duration-200 hover:scale-[1.02]">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                <span className="font-semibold text-green-700">{a.produit?.nom || "Produit inconnu"}</span>
                <span className="text-yellow-500 font-bold text-lg transition-all duration-200">
                  {"★".repeat(a.note)}{"☆".repeat(5 - a.note)}
                </span>
              </div>
              <p className="text-gray-700 mb-1">{a.commentaire}</p>
              <p className="text-sm text-gray-500">par {a.utilisateur?.nom || "Client inconnu"} le {new Date(a.date_creation).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ArtisanAvis; 