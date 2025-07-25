import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { MagnifyingGlassIcon, StarIcon, FireIcon, CurrencyEuroIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import Badge from "../components/Badge";

function Home() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // États pour les filtres
  const [filtres, setFiltres] = useState({
    search: '',
    categorie: '',
    prixMin: '',
    prixMax: '',
    noteMin: '',
    populaire: false
  });
  const [categories, setCategories] = useState([]);
  const { user } = React.useContext(AuthContext);

  useEffect(() => {
    // Charger les catégories pour le filtre
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Erreur de chargement des catégories", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProduits = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filtres.search) params.append('search', filtres.search);
        if (filtres.categorie) params.append('categorie', filtres.categorie);
        if (filtres.prixMin) params.append('prixMin', filtres.prixMin);
        if (filtres.prixMax) params.append('prixMax', filtres.prixMax);
        if (filtres.noteMin) params.append('noteMin', filtres.noteMin);
        if (filtres.populaire) params.append('populaire', filtres.populaire);

        const res = await axios.get(`http://localhost:5000/api/produits?${params.toString()}`);
        setProduits(Array.isArray(res.data.produits) ? res.data.produits : []);
        setLoading(false);
      } catch (err) {
        setError("Erreur de chargement des produits");
        setLoading(false);
        console.error("Erreur de chargement des produits", err);
      }
    };

    fetchProduits();
  }, [filtres]);

  const handleFiltreChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFiltres(prevFiltres => ({
      ...prevFiltres,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-emerald-50 to-amber-100 px-4 py-8">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-emerald-900 tracking-tight drop-shadow-lg">Produits artisanaux de menuiserie</h1>
      {user?.role === 'artisan' && (
        <div className="mb-8 text-center">
          <Link to="/artisan/produits" className="inline-block bg-emerald-700 text-white px-8 py-3 rounded-xl shadow-lg hover:bg-emerald-800 transition-all duration-200 font-semibold text-lg">
            Gérer mes produits
          </Link>
        </div>
      )}

      {/* Section des filtres */}
      <div className="mb-10 p-6 bg-white/80 rounded-2xl shadow flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="search"
              placeholder="Rechercher par nom..."
              value={filtres.search}
              onChange={handleFiltreChange}
              className="pl-10 p-2 border border-emerald-200 rounded-lg w-full focus:ring-2 focus:ring-emerald-300"
            />
          </div>
          <div className="relative">
            <select
              name="categorie"
              value={filtres.categorie}
              onChange={handleFiltreChange}
              className="p-2 border border-emerald-200 rounded-lg w-full focus:ring-2 focus:ring-emerald-300"
            >
              <option value="">Toutes les catégories</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.nom}</option>
              ))}
            </select>
          </div>
          <div className="relative">
            <CurrencyEuroIcon className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="number"
              name="prixMin"
              placeholder="Prix min"
              value={filtres.prixMin}
              onChange={handleFiltreChange}
              className="pl-9 p-2 border border-emerald-200 rounded-lg w-full focus:ring-2 focus:ring-emerald-300"
            />
          </div>
          <div className="relative">
            <CurrencyEuroIcon className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="number"
              name="prixMax"
              placeholder="Prix max"
              value={filtres.prixMax}
              onChange={handleFiltreChange}
              className="pl-9 p-2 border border-emerald-200 rounded-lg w-full focus:ring-2 focus:ring-emerald-300"
            />
          </div>
          <div className="relative">
            <StarIcon className="w-4 h-4 text-yellow-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="number"
              name="noteMin"
              placeholder="Note min (1-5)"
              min="1"
              max="5"
              value={filtres.noteMin}
              onChange={handleFiltreChange}
              className="pl-9 p-2 border border-emerald-200 rounded-lg w-full focus:ring-2 focus:ring-emerald-300"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="populaire"
              id="populaire"
              checked={filtres.populaire}
              onChange={handleFiltreChange}
              className="accent-emerald-600 w-5 h-5"
            />
            <label htmlFor="populaire" className="flex items-center gap-1 text-emerald-800 font-medium">
              <FireIcon className="w-5 h-5 text-orange-500" /> Les plus populaires
            </label>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-emerald-700 animate-pulse">Chargement des produits...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {produits.length > 0 ? (
            produits.map((produit, idx) => (
              <motion.div
                key={produit._id || produit.id}
                className="bg-white rounded-3xl shadow-lg p-5 hover:shadow-2xl transition-all duration-300 relative group border border-amber-100"
                whileHover={{ scale: 1.03, y: -4, boxShadow: "0 8px 32px 0 rgba(34,197,94,0.15)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <div className="relative">
                  <img
                    src={produit.images && produit.images[0] ? produit.images[0] : "https://via.placeholder.com/300x200"}
                    alt={produit.nom || "Produit"}
                    className="w-full h-48 object-cover rounded-2xl border border-amber-100 shadow-sm group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-2">
                    {produit.populaire && (
                      <Badge color="bg-orange-100" textColor="text-orange-700" icon={FireIcon}>Populaire</Badge>
                    )}
                    {produit.note >= 4.5 && (
                      <Badge color="bg-yellow-100" textColor="text-yellow-800" icon={StarIcon}>Top Note</Badge>
                    )}
                  </div>
                </div>
                <h2 className="text-xl font-bold mt-4 text-emerald-900 flex items-center gap-2">
                  {produit.nom || "Sans nom"}
                </h2>
                <p className="text-gray-600 mt-1 min-h-[2.5em]">{produit.description ? produit.description.substring(0, 60) + "..." : "Pas de description"}</p>
                <p className="text-emerald-700 font-bold mt-2 text-lg flex items-center gap-1">
                  <CurrencyEuroIcon className="w-5 h-5 text-amber-500" />
                  {produit.prix !== undefined ? produit.prix + " €" : ""}
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-yellow-500 flex items-center">
                    {Array.from({ length: 5 }, (_, i) =>
                      i < Math.round(produit.note) ? <StarIcon key={i} className="w-4 h-4 inline" /> : <StarIcon key={i} className="w-4 h-4 inline text-gray-300" />
                    )}
                  </span>
                  <span className="text-gray-600 ml-2">({produit.note?.toFixed(1)})</span>
                </div>
                <Link
                  to={`/produit/${produit._id || produit.id}`}
                  className="inline-block mt-4 bg-emerald-600 text-white px-5 py-2 rounded-lg shadow hover:bg-emerald-700 transition-all duration-200 font-semibold"
                >
                  Voir détail
                </Link>
              </motion.div>
            ))
          ) : (
            <p className="text-center col-span-full">Aucun produit ne correspond à votre recherche.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Home; 