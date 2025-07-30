import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import '../styles/Navbar.css';

function Navbar() {
  const [showSearch, setShowSearch] = useState(false);
  const { user, logout } = React.useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLangChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <>
      <nav className="navbar-fixed bg-white shadow-md py-4">
        <div className="navbar-container flex items-center justify-between">
          {/* Logo - Left */}
          <Link to="/" className="nav-logo flex-shrink-0">
            🌳 MenuisierArt
          </Link>

          {user ? (
            // Navigation complète pour utilisateur connecté
            <>
              <div className="nav-center flex items-center space-x-8">
                <Link to="/" className="nav-link">Accueil</Link>
                <Link to="/categories" className="nav-link">Catégories</Link>
                <Link to="/about" className="nav-link">À propos</Link>
                <Link to="/contact" className="nav-link">Contact</Link>
                <button 
                  onClick={() => setShowSearch(!showSearch)}
                  className="nav-search-button"
                >
                  🔍
                </button>
              </div>

              <div className="nav-right">
                {user.role === 'artisan' && (
                  <Link to="/artisan/dashboard" className="nav-link mr-4">
                    Espace Artisan
                  </Link>
                )}
                <Link to="/profil" className="nav-link flex items-center gap-2">
                  <span className="nav-avatar">
                    {user.nom ? user.nom.charAt(0).toUpperCase() : '👤'}
                  </span>
                  <span>Profil</span>
                </Link>
                <button onClick={handleLogout} className="nav-button ml-4">
                  Déconnexion
                </button>
              </div>
            </>
          ) : (
            // Navigation simplifiée pour visiteur
            <>
              <div className="nav-center flex items-center space-x-8">
                <Link to="/" className="nav-link">Accueil</Link>
                <Link to="/categories" className="nav-link">Catégories</Link>
                <Link to="/about" className="nav-link">À propos</Link>
                <Link to="/contact" className="nav-link">Contact</Link>
                <button 
                  onClick={() => setShowSearch(!showSearch)}
                  className="nav-search-button"
                >
                  🔍
                </button>
              </div>

              <div className="nav-right">
                <Link to="/login" className="nav-link-login">
                  Se connecter
                </Link>
                <Link to="/signup" className="nav-button-primary">
                  Créer un compte
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Search Panel */}
        {showSearch && (
          <div className="search-panel show">
            <div className="search-container">
              <input
                type="text"
                placeholder="Rechercher..."
                className="search-input"
              />
              <button 
                onClick={() => setShowSearch(false)}
                className="search-close"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </nav>
      <div className="h-16"></div>
    </>
  );
}

export default Navbar;