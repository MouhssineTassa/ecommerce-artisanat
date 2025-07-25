import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { HomeIcon, ShoppingCartIcon, UserCircleIcon, ArrowRightOnRectangleIcon, ArrowLeftOnRectangleIcon, UserPlusIcon, WrenchScrewdriverIcon, ClipboardDocumentListIcon, UsersIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

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
    <motion.nav
      className="bg-gradient-to-r from-emerald-50 via-amber-50 to-emerald-100 shadow-md py-3 px-4 md:px-10 flex justify-between items-center sticky top-0 z-50 border-b border-emerald-100"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo / Titre */}
      <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-emerald-800 tracking-tight hover:scale-105 transition-transform">
        <WrenchScrewdriverIcon className="w-8 h-8 text-amber-500" />
        Menuisier<span className="text-amber-600">Art</span>
      </Link>
      {/* Liens de navigation */}
      <div className="hidden md:flex items-center gap-2 lg:gap-4 xl:gap-6">
        <NavLinkItem to="/" icon={HomeIcon} label="Accueil" />
        <NavLinkItem to="/panier" icon={ShoppingCartIcon} label="Panier" />
        {user?.role === 'artisan' && <div className="h-6 w-px bg-emerald-200 mx-2" />}
        {user?.role === 'artisan' && (
          <>
            <NavLinkItem to="/artisan/dashboard" icon={Squares2X2Icon} label={t('dashboard')} />
            <NavLinkItem to="/dashboard-artisan" icon={WrenchScrewdriverIcon} label="Espace Artisan" />
            <NavLinkItem to="/artisan/commandes" icon={ClipboardDocumentListIcon} label={t('orders')} />
            <NavLinkItem to="/artisan/categories" icon={WrenchScrewdriverIcon} label={t('categories')} />
            <NavLinkItem to="/artisan/utilisateurs" icon={UsersIcon} label={t('users')} />
          </>
        )}
        <div className="h-6 w-px bg-emerald-200 mx-2" />
        {user ? (
          <>
            <NavLinkItem to="/profil" icon={UserCircleIcon} label="Profil" avatar={user.nom} />
            <motion.button
              onClick={handleLogout}
              className="flex items-center gap-1 px-3 py-1 rounded-lg text-emerald-800 hover:bg-red-50 hover:text-red-600 font-medium transition-colors"
              whileHover={{ scale: 1.08 }}
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span className="hidden sm:inline">{t('logout')}</span>
            </motion.button>
          </>
        ) : (
          <>
            <NavLinkItem to="/login" icon={ArrowLeftOnRectangleIcon} label="Connexion" />
            <NavLinkItem to="/signup" icon={UserPlusIcon} label="S'inscrire" />
          </>
        )}
        <select
          value={i18n.language}
          onChange={handleLangChange}
          className="ml-4 border border-emerald-200 rounded px-2 py-1 text-sm bg-white hover:border-emerald-400 focus:ring-2 focus:ring-emerald-200 transition"
        >
          <option value="fr">FR</option>
          <option value="en">EN</option>
          <option value="ar">AR</option>
        </select>
      </div>
      {/* Menu burger mobile (structure, sans JS) */}
      <div className="md:hidden flex items-center">
        <button className="p-2 rounded-lg hover:bg-emerald-100 transition">
          <svg className="w-7 h-7 text-emerald-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>
    </motion.nav>
  );
}

function NavLinkItem({ to, icon: Icon, label, avatar }) {
  return (
    <motion.div whileHover={{ y: -2, scale: 1.08 }} className="inline-block">
      <Link
        to={to}
        className="flex items-center gap-1 px-3 py-1 rounded-lg text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900 font-medium transition-colors"
      >
        {avatar ? (
          <span className="inline-flex items-center justify-center w-8 h-8 bg-emerald-200 text-emerald-800 rounded-full font-bold text-lg shadow">
            {avatar.charAt(0).toUpperCase()}
          </span>
        ) : (
          <Icon className="w-5 h-5" />
        )}
        <span className="hidden sm:inline">{label}</span>
      </Link>
    </motion.div>
  );
}

export default Navbar; 