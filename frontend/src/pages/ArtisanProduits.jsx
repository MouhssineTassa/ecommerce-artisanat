import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

// Loader animé simple
function Loader() {
  return (
    <div className="flex justify-center items-center py-4">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
    </div>
  );
}

function ArtisanProduits() {
  const { user } = useContext(AuthContext);
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProduits();
    // eslint-disable-next-line
  }, []);

  const fetchProduits = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/artisan/mes-produits", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProduits(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Erreur de chargement", err);
      setProduits([]);
    }
    setLoading(false);
  };

  const supprimerProduit = async (id) => {
    if (window.confirm("Supprimer ce produit ?")) {
      try {
        await axios.delete(`/api/artisan/produits/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProduits(produits.filter((p) => p._id !== id));
      } catch (err) {
        console.error("Erreur suppression", err);
      }
    }
  };

  // Recherche et tri côté client
  const produitsArray = Array.isArray(produits) ? produits : [];
  const produitsFiltres = produitsArray
    .filter((p) =>
      p.nom && p.nom.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sort === "prix-asc") return a.prix - b.prix;
      if (sort === "prix-desc") return b.prix - a.prix;
      if (sort === "stock") return a.stock - b.stock;
      return new Date(b.date_creation) - new Date(a.date_creation);
    });

  if (!user || (user.role !== "artisan" && user.role !== "admin")) {
    return <div className="p-6 text-red-600">Accès réservé à l'artisan.</div>;
  }

  return (
    <div className="p-2 sm:p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-green-800">Mes Produits</h2>
      <Link to="/artisan/produits/ajouter" className="bg-green-600 text-white px-4 py-2 rounded mb-4 inline-block transition-all duration-200 hover:bg-green-700">
        ➕ Ajouter un produit
      </Link>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        />
        <select value={sort} onChange={e => setSort(e.target.value)} className="border p-2 rounded w-full md:w-1/4">
          <option value="recent">Plus récents</option>
          <option value="prix-asc">Prix croissant</option>
          <option value="prix-desc">Prix décroissant</option>
          <option value="stock">Stock faible</option>
        </select>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {produitsFiltres.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">Aucun produit trouvé.</p>
          ) : produitsFiltres.map((produit) => (
            <div key={produit._id} className="border p-4 rounded shadow bg-white transition-transform duration-200 hover:scale-105">
              <img
                src={produit.images && produit.images[0] ? produit.images[0] : "https://via.placeholder.com/300x200"}
                alt={produit.nom}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h4 className="text-lg font-semibold text-green-800 mb-1">{produit.nom}</h4>
              <p className="mb-1">{produit.description}</p>
              <p className="font-bold mb-1">{produit.prix} DH</p>
              <p className="text-sm text-gray-500 mb-2">Stock : {produit.stock}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <Link
                  to={`/artisan/produits/modifier/${produit._id}`}
                  className="text-blue-600 hover:underline transition-colors duration-200"
                >
                  ✏️ Modifier
                </Link>
                <button
                  onClick={() => supprimerProduit(produit._id)}
                  className="text-red-600 hover:underline transition-colors duration-200"
                >
                  🗑️ Supprimer
                </button>
                <Link
                  to={`/artisan/produits/${produit._id}/avis`}
                  className="text-green-700 hover:underline transition-colors duration-200"
                >
                  Voir avis
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ArtisanProduits; 