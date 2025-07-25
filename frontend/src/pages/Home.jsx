import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

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
    <div className="font-sans bg-gradient-to-br from-green-50 via-white to-blue-50 min-h-screen">
      {/* Hero visuel */}
      <div className="relative flex flex-col items-center justify-center h-72 md:h-96 mb-10 rounded-3xl overflow-hidden shadow-lg animate-fade-in">
        <img
          src={require('../../images/ravel_salle-a-manger.jpg') || 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=900&q=80'}
          alt="Salle à manger artisanale"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/60 to-blue-900/30" />
        <h1 className="relative z-10 text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg animate-bounce-slow text-center">
          Produits artisanaux de menuiserie
        </h1>
        <p className="relative z-10 mt-4 text-lg md:text-2xl text-white text-center max-w-2xl animate-fade-in">
          Découvrez l'excellence du bois fait main, sélectionnez des créations uniques pour votre intérieur.
        </p>
      </div>
      {/* CTA artisan */}
      {user?.role === 'artisan' && (
        <div className="mb-6 text-center animate-fade-in">
          <Link to="/artisan/produits" className="inline-block bg-green-700 text-white px-6 py-2 rounded shadow hover:bg-green-800 transition font-semibold">
            Gérer mes produits
          </Link>
        </div>
      )}
      {/* Section des filtres */}
      <div className="mb-8 p-4 bg-white/80 rounded-lg shadow animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <input
            type="text"
            name="search"
            placeholder="Rechercher par nom..."
            value={filtres.search}
            onChange={handleFiltreChange}
            className="p-2 border rounded focus:ring-2 focus:ring-green-400 transition"
          />
          <select
            name="categorie"
            value={filtres.categorie}
            onChange={handleFiltreChange}
            className="p-2 border rounded focus:ring-2 focus:ring-green-400 transition"
          >
            <option value="">Toutes les catégories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.nom}</option>
            ))}
          </select>
          <input
            type="number"
            name="prixMin"
            placeholder="Prix min"
            value={filtres.prixMin}
            onChange={handleFiltreChange}
            className="p-2 border rounded focus:ring-2 focus:ring-green-400 transition"
          />
          <input
            type="number"
            name="prixMax"
            placeholder="Prix max"
            value={filtres.prixMax}
            onChange={handleFiltreChange}
            className="p-2 border rounded focus:ring-2 focus:ring-green-400 transition"
          />
          <input
            type="number"
            name="noteMin"
            placeholder="Note min (1-5)"
            min="1"
            max="5"
            value={filtres.noteMin}
            onChange={handleFiltreChange}
            className="p-2 border rounded focus:ring-2 focus:ring-green-400 transition"
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              name="populaire"
              id="populaire"
              checked={filtres.populaire}
              onChange={handleFiltreChange}
              className="mr-2 accent-green-600"
            />
            <label htmlFor="populaire">Les plus populaires</label>
          </div>
        </div>
      </div>
      {/* Grille produits */}
      {loading ? (
        <p className="text-center animate-pulse">Chargement des produits...</p>
      ) : error ? (
        <p className="text-center text-red-600 animate-fade-in">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 animate-fade-in">
          {produits.length > 0 ? (
            produits.map((produit, idx) => (
              <div
                key={produit._id || produit.id}
                className="bg-white rounded-2xl shadow-lg p-4 hover:shadow-2xl hover:-translate-y-1 transition transform duration-300 flex flex-col items-center group relative overflow-hidden"
                style={{ animation: `fadeIn 0.7s ${idx * 0.1}s both` }}
              >
                <img
                  src={produit.images && produit.images[0] ? produit.images[0] : "https://via.placeholder.com/300x200"}
                  alt={produit.nom || "Produit"}
                  className="w-full h-48 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300 shadow"
                />
                <h2 className="text-xl font-semibold mt-4 text-green-900 group-hover:text-blue-700 transition">{produit.nom || "Sans nom"}</h2>
                <p className="text-gray-600 mt-1">{produit.description ? produit.description.substring(0, 60) + "..." : "Pas de description"}</p>
                <p className="text-green-600 font-bold mt-2">{produit.prix !== undefined ? produit.prix + " €" : ""}</p>
                <div className="flex items-center mt-2">
                  <span className="text-yellow-500 text-lg">{'★'.repeat(Math.round(produit.note))}{'☆'.repeat(5 - Math.round(produit.note))}</span>
                  <span className="text-gray-600 ml-2">({produit.note?.toFixed(1)})</span>
                </div>
                <Link
                  to={`/produit/${produit._id || produit.id}`}
                  className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow transition font-semibold"
                >
                  Voir détail
                </Link>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full animate-fade-in">Aucun produit ne correspond à votre recherche.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Home; 