import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import '../styles/Home.css';

function Home() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center">
          Produits artisanaux de menuiserie
        </h1>
        
        {/* Affichage conditionnel des liens selon le rôle */}
        <div className="flex items-center gap-4">
          {user?.role === 'artisan' ? (
            <Link 
              to="/artisan/produits" 
              className="inline-block bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800 transition"
            >
              Gérer mes produits
            </Link>
          ) : (
            <Link 
              to="/panier" 
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              <span>🛒</span>
              <span>Mon Panier</span>
            </Link>
          )}
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row md:flex-wrap gap-4">
          <input
            type="text"
            name="search"
            placeholder="Rechercher par nom..."
            value={filtres.search}
            onChange={handleFiltreChange}
            className="flex-1 p-2 border rounded"
          />
          <select
            name="categorie"
            value={filtres.categorie}
            onChange={handleFiltreChange}
            className="flex-1 p-2 border rounded"
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
            className="flex-1 p-2 border rounded"
          />
          <input
            type="number"
            name="prixMax"
            placeholder="Prix max"
            value={filtres.prixMax}
            onChange={handleFiltreChange}
            className="flex-1 p-2 border rounded"
          />
          <input
            type="number"
            name="noteMin"
            placeholder="Note min (1-5)"
            min="1"
            max="5"
            value={filtres.noteMin}
            onChange={handleFiltreChange}
            className="flex-1 p-2 border rounded"
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="populaire"
              checked={filtres.populaire}
              onChange={handleFiltreChange}
            />
            <span>Les plus populaires</span>
          </label>
        </div>
      </div>

      {loading ? (
        <p className="text-center loading-spinner">Chargement des produits...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {produits.length > 0 ? (
            produits.map((produit) => (
              <div key={produit._id || produit.id} className="bg-white rounded-xl shadow-md p-4 flex flex-col product-card">
                <img
                  src={produit.images?.[0] || "https://via.placeholder.com/300x200"}
                  alt={produit.nom}
                  className="w-full h-48 object-cover rounded-lg product-image"
                />
                <h2 className="text-lg font-semibold mt-3">{produit.nom}</h2>
                <p className="text-gray-600 text-sm mt-1">{produit.description?.substring(0, 60)}...</p>
                <p className="text-green-700 font-bold mt-2 product-price">{produit.prix} €</p>
                <div className="flex items-center mt-2 text-sm">
                  <span className="text-yellow-500 product-rating">
                    {'★'.repeat(Math.round(produit.note))}{'☆'.repeat(5 - Math.round(produit.note))}
                  </span>
                  <span className="ml-2 text-gray-600">({produit.note?.toFixed(1)})</span>
                </div>
                <Link
                  to={`/produit/${produit._id}`}
                  className="mt-auto inline-block bg-blue-600 text-white text-center px-4 py-2 rounded hover:bg-blue-700 transition mt-4 product-button"
                >
                  Voir détail
                </Link>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center">Aucun produit trouvé.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;