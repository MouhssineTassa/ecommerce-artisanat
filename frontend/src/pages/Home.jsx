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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-500">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 animate-fade-in-up">
            Artisanat de Menuiserie
          </h1>
          <p className="text-xl text-white/90 mb-8 animate-fade-in-up animation-delay-200">
            Découvrez des créations uniques faites à la main par nos artisans passionnés
          </p>
          <div className="flex justify-center space-x-4 animate-fade-in-up animation-delay-400">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 text-white">
              <span className="text-2xl font-bold">{produits.length}</span>
              <p className="text-sm">Produits disponibles</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 text-white">
              <span className="text-2xl font-bold">{categories.length}</span>
              <p className="text-sm">Catégories</p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {user?.role === 'artisan' && (
          <div className="mb-8 text-center animate-slide-in-from-top">
            <Link 
              to="/artisan/produits" 
              className="group inline-flex items-center bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold"
            >
              <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Gérer mes produits
            </Link>
          </div>
        )}

        {/* Section des filtres améliorée */}
        <div className="mb-12 animate-slide-in-from-bottom">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
              <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filtrer les produits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <div className="relative group">
                <input
                  type="text"
                  name="search"
                  placeholder="Rechercher par nom..."
                  value={filtres.search}
                  onChange={handleFiltreChange}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-300 bg-white/70 backdrop-blur-sm group-hover:shadow-md"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <select
                name="categorie"
                value={filtres.categorie}
                onChange={handleFiltreChange}
                className="p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-300 bg-white/70 backdrop-blur-sm hover:shadow-md"
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
                className="p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-300 bg-white/70 backdrop-blur-sm hover:shadow-md"
              />
              
              <input
                type="number"
                name="prixMax"
                placeholder="Prix max (€)"
                value={filtres.prixMax}
                onChange={handleFiltreChange}
                className="p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-300 bg-white/70 backdrop-blur-sm hover:shadow-md"
              />
              
              <input
                type="number"
                name="noteMin"
                placeholder="Note min (1-5)"
                min="1"
                max="5"
                value={filtres.noteMin}
                onChange={handleFiltreChange}
                className="p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-300 bg-white/70 backdrop-blur-sm hover:shadow-md"
              />
              
              <div className="flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-xl border-2 border-gray-200 p-4 hover:shadow-md transition-all duration-300">
                <input
                  type="checkbox"
                  name="populaire"
                  id="populaire"
                  checked={filtres.populaire}
                  onChange={handleFiltreChange}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mr-3"
                />
                <label htmlFor="populaire" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Les plus populaires
                </label>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin"></div>
              <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="ml-4 text-xl text-gray-600 animate-pulse">Chargement des produits...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
              <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-600 text-lg font-semibold">{error}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {produits.length > 0 ? (
              produits.map((produit, index) => (
                <div 
                  key={produit._id || produit.id} 
                  className={`group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2 animate-fade-in-up`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={produit.images && produit.images[0] ? produit.images[0] : "https://via.placeholder.com/400x300?text=Produit+Artisanal"}
                      alt={produit.nom || "Produit"}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {produit.nom || "Sans nom"}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {produit.description ? produit.description.substring(0, 80) + "..." : "Pas de description"}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i}
                            className={`w-5 h-5 ${i < Math.round(produit.note || 0) ? 'text-yellow-400' : 'text-gray-300'} transition-colors duration-300`}
                            fill="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        ))}
                        <span className="text-sm text-gray-600 ml-2">({produit.note?.toFixed(1) || '0.0'})</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {produit.prix !== undefined ? produit.prix + " €" : "Prix sur demande"}
                      </span>
                      <Link
                        to={`/produit/${produit._id || produit.id}`}
                        className="group/btn bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                      >
                        <span className="font-semibold">Voir détail</span>
                        <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <div className="bg-gray-50 rounded-3xl p-12 max-w-md mx-auto">
                  <svg className="w-20 h-20 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun produit trouvé</h3>
                  <p className="text-gray-500">Essayez de modifier vos filtres de recherche</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in-from-top {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in-from-bottom {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .animate-slide-in-from-top {
          animation: slide-in-from-top 0.6s ease-out forwards;
        }
        
        .animate-slide-in-from-bottom {
          animation: slide-in-from-bottom 0.6s ease-out forwards;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default Home; 