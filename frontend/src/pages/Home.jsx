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
    <div className="container mx-auto px-4 py-8">
      {/* HERO SECTION */}
      <section className="relative rounded-xl overflow-hidden mb-10">
        {/* Image d’arrière-plan */}
        <img
          src="https://images.unsplash.com/photo-1517292987719-f899b2b66885?auto=format&fit=crop&w=1920&q=80"
          alt="Menuiserie artisanale"
          className="w-full h-64 md:h-96 object-cover transition-transform duration-500 scale-100 hover:scale-105"
        />
        {/* Voile sombre + contenu centré */}
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
            Découvrez l'art de la menuiserie
          </h1>
          <p className="max-w-2xl mb-6 text-lg md:text-xl">
            Des créations artisanales uniques réalisées avec passion par nos artisans.
          </p>
          <a
            href="#produits"
            className="inline-block bg-green-600 hover:bg-green-700 transition-colors duration-300 px-6 py-3 rounded-full font-semibold shadow-lg"
          >
            Explorer la collection
          </a>
        </div>
      </section>
      {user?.role === 'artisan' && (
        <div className="mb-6 text-center">
          <Link to="/artisan/produits" className="inline-block bg-green-700 text-white px-6 py-2 rounded shadow hover:bg-green-800 transition">
            Gérer mes produits
          </Link>
        </div>
      )}

      {/* Section des filtres */}
      <div className="mb-8 p-4 bg-gray-100 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <input
            type="text"
            name="search"
            placeholder="Rechercher par nom..."
            value={filtres.search}
            onChange={handleFiltreChange}
            className="p-2 border rounded"
          />
          <select
            name="categorie"
            value={filtres.categorie}
            onChange={handleFiltreChange}
            className="p-2 border rounded"
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
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="prixMax"
            placeholder="Prix max"
            value={filtres.prixMax}
            onChange={handleFiltreChange}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="noteMin"
            placeholder="Note min (1-5)"
            min="1"
            max="5"
            value={filtres.noteMin}
            onChange={handleFiltreChange}
            className="p-2 border rounded"
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              name="populaire"
              id="populaire"
              checked={filtres.populaire}
              onChange={handleFiltreChange}
              className="mr-2"
            />
            <label htmlFor="populaire">Les plus populaires</label>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-center">Chargement des produits...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : (
        <div id="produits" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {produits.length > 0 ? (
            produits.map((produit) => (
              <div
                key={produit._id || produit.id}
                className="bg-white rounded-2xl shadow-lg p-4 overflow-hidden group transform transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <img
                  src={
                    produit.images && produit.images[0]
                      ? produit.images[0]
                      : "https://via.placeholder.com/300x200"
                  }
                  alt={produit.nom || "Produit"}
                  className="w-full h-48 object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                />
                <h2 className="text-xl font-semibold mt-4">{produit.nom || "Sans nom"}</h2>
                <p className="text-gray-600 mt-1">{produit.description ? produit.description.substring(0, 60) + "..." : "Pas de description"}</p>
                <p className="text-green-600 font-bold mt-2">{produit.prix !== undefined ? produit.prix + " €" : ""}</p>
                <div className="flex items-center mt-2">
                  <span className="text-yellow-500">{'★'.repeat(Math.round(produit.note))}{'☆'.repeat(5 - Math.round(produit.note))}</span>
                  <span className="text-gray-600 ml-2">({produit.note?.toFixed(1)})</span>
                </div>
                <Link
                  to={`/produit/${produit._id || produit.id}`}
                  className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-full font-medium shadow hover:bg-blue-700 transition-colors duration-300"
                >
                  Voir détail
                </Link>
              </div>
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