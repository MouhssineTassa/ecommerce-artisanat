import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleLangChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50">
      {/* Logo / Titre */}
      <Link to="/" className="text-2xl font-bold text-green-800">
        MenuisierArt
      </Link>
      {/* Liens de navigation */}
      <div className="space-x-4 flex items-center">
        <Link to="/" className="text-gray-700 hover:text-green-700 font-medium">
          Accueil
        </Link>
        <Link to="/panier" className="text-gray-700 hover:text-green-700 font-medium">
          Panier 🛒
        </Link>

        {user?.role === 'artisan' && (
          <>
            <Link to="/artisan/dashboard" className="text-gray-700 hover:text-green-700 font-medium">{t('dashboard')}</Link>
            <Link to="/dashboard-artisan" className="text-gray-700 hover:text-green-700 font-medium">Espace Artisan</Link>
            <Link to="/artisan/commandes" className="text-gray-700 hover:text-green-700 font-medium">{t('orders')}</Link>
            <Link to="/artisan/categories" className="text-gray-700 hover:text-green-700 font-medium">{t('categories')}</Link>
            <Link to="/artisan/utilisateurs" className="text-gray-700 hover:text-green-700 font-medium">{t('users')}</Link>
          </>
        )}

        {user ? (
          <>
            <Link to="/profil" className="text-gray-700 hover:text-green-700 font-medium flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-8 h-8 bg-green-200 text-green-800 rounded-full font-bold">
                {user.nom ? user.nom.charAt(0).toUpperCase() : <span>👤</span>}
              </span>
              Profil
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-red-600 font-medium ml-2"
            >
              {t('logout')}
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-green-700 font-medium">
              Connexion
            </Link>
            <Link to="/signup" className="text-gray-700 hover:text-green-700 font-medium">
              S'inscrire
            </Link>
          </>
        )}
        {/* Sélecteur de langue */}
        <select
          value={i18n.language}
          onChange={handleLangChange}
          className="ml-4 border rounded px-2 py-1 text-sm bg-white"
        >
          <option value="fr">FR</option>
          <option value="en">EN</option>
          <option value="ar">AR</option>
        </select>
      </div>
    </nav>
  );
}

export default Navbar; 