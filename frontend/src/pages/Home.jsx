import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  StarIcon,
  ShoppingBagIcon,
  SparklesIcon,
  TagIcon,
  TruckIcon,
  ShieldCheckIcon,
  HeartIcon
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

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
  const [showFilters, setShowFilters] = useState(false);
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

  const renderStars = (note) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= Math.round(note) ? (
              <StarIconSolid className="h-4 w-4 text-yellow-400" />
            ) : (
              <StarIcon className="h-4 w-4 text-gray-300" />
            )}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="hero-gradient relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16 text-center text-white">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <SparklesIcon className="h-16 w-16 mx-auto mb-6 animate-pulse-slow" />
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Artisanat d'Exception
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Découvrez des créations uniques en menuiserie, façonnées avec passion par nos artisans experts
            </p>
            
            {user?.role === 'artisan' && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Link 
                  to="/artisan/produits" 
                  className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-2xl"
                >
                  <ShoppingBagIcon className="h-6 w-6" />
                  Gérer mes produits
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse-slow"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </motion.div>

      {/* Features Section */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="container mx-auto px-4 py-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <TruckIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Livraison Gratuite</h3>
            <p className="text-gray-600">Livraison offerte dès 100€ d'achat</p>
          </div>
          <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <ShieldCheckIcon className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Qualité Garantie</h3>
            <p className="text-gray-600">Satisfaction garantie ou remboursé</p>
          </div>
          <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <HeartIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Fait avec Amour</h3>
            <p className="text-gray-600">Chaque pièce est unique et artisanale</p>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 pb-12">
        {/* Section des filtres */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <TagIcon className="h-8 w-8 text-purple-600" />
              Nos Créations
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
            >
              <FunnelIcon className="h-5 w-5" />
              {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
            </button>
          </div>

          <motion.div 
            initial={false}
            animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="filter-container p-6 rounded-2xl shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="search"
                    placeholder="Rechercher par nom..."
                    value={filtres.search}
                    onChange={handleFiltreChange}
                    className="w-full pl-10 pr-4 py-3 border border-white/20 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <select
                  name="categorie"
                  value={filtres.categorie}
                  onChange={handleFiltreChange}
                  className="px-4 py-3 border border-white/20 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.nom}</option>
                  ))}
                </select>
                <input
                  type="number"
                  name="prixMin"
                  placeholder="Prix min (€)"
                  value={filtres.prixMin}
                  onChange={handleFiltreChange}
                  className="px-4 py-3 border border-white/20 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                />
                <input
                  type="number"
                  name="prixMax"
                  placeholder="Prix max (€)"
                  value={filtres.prixMax}
                  onChange={handleFiltreChange}
                  className="px-4 py-3 border border-white/20 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                />
                <input
                  type="number"
                  name="noteMin"
                  placeholder="Note min (1-5)"
                  min="1"
                  max="5"
                  value={filtres.noteMin}
                  onChange={handleFiltreChange}
                  className="px-4 py-3 border border-white/20 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                />
                <div className="flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                  <input
                    type="checkbox"
                    name="populaire"
                    id="populaire"
                    checked={filtres.populaire}
                    onChange={handleFiltreChange}
                    className="mr-3 h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="populaire" className="text-sm font-medium text-gray-700">
                    Les plus populaires
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Section des produits */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-xl text-gray-600">Chargement des merveilles...</p>
          </div>
        ) : error ? (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-16"
          >
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
              <p className="text-red-600 text-lg font-semibold">{error}</p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {produits.length > 0 ? (
              produits.map((produit, index) => (
                <motion.div
                  key={produit._id || produit.id}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="product-card rounded-2xl shadow-lg overflow-hidden group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={produit.images && produit.images[0] ? produit.images[0] : "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"}
                      alt={produit.nom || "Produit artisanal"}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80";
                      }}
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <HeartIcon className="h-5 w-5 text-red-500 hover:fill-current cursor-pointer transition-colors duration-200" />
                    </div>
                    {produit.populaire && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        ⭐ Populaire
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                      {produit.nom || "Création Artisanale"}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                      {produit.description ? produit.description.substring(0, 100) + "..." : "Une création unique façonnée avec passion et savoir-faire artisanal."}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {renderStars(produit.note || 4.5)}
                        <span className="text-sm text-gray-500">
                          ({(produit.note || 4.5).toFixed(1)})
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-purple-600">
                        {produit.prix !== undefined ? `${produit.prix}€` : "Prix sur demande"}
                      </div>
                    </div>
                    
                    <Link
                      to={`/produit/${produit._id || produit.id}`}
                      className="w-full btn-primary text-white px-6 py-3 rounded-xl font-semibold text-center block hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <ShoppingBagIcon className="h-5 w-5" />
                      Voir les détails
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="col-span-full text-center py-16"
              >
                <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-12 max-w-md mx-auto">
                  <MagnifyingGlassIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun produit trouvé</h3>
                  <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Home; 