import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import ProfilUtilisateur from './pages/Profile';
import CheckoutPage from './pages/CheckoutPage'; // Importer la nouvelle page
import { AuthProvider } from './contexts/AuthContext';
import { PanierProvider } from './contexts/PanierContext';
import PrivateRoute from './components/PrivateRoute';
import DashboardArtisan from './components/DashboardArtisan';
import ArtisanProduitsPage from './pages/ArtisanProduitsPage';
import ArtisanDashboard from './pages/ArtisanDashboard';
import ArtisanProduits from './pages/ArtisanProduits';
import AjouterProduit from './pages/AjouterProduit';
import ModifierProduit from './pages/ModifierProduit';
import ArtisanAvis from './pages/ArtisanAvis';
import CommandesArtisan from './pages/CommandesArtisan';
import ArtisanCategories from './pages/ArtisanCategories';
import ArtisanUtilisateurs from './pages/ArtisanUtilisateurs';

function App() {
  return (
    <AuthProvider>
      <PanierProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/produit/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/panier" element={<Cart />} />
            <Route
              path="/checkout"
              element={
                <PrivateRoute>
                  <CheckoutPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/profil"
              element={
                <PrivateRoute>
                  <ProfilUtilisateur />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard-artisan"
              element={
                <PrivateRoute roles={['artisan','admin']}>
                  <DashboardArtisan />
                </PrivateRoute>
              }
            />
            <Route
              path="/artisan/dashboard"
              element={
                <PrivateRoute roles={['artisan','admin']}>
                  <ArtisanDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/artisan/produits"
              element={
                <PrivateRoute roles={['artisan','admin']}>
                  <ArtisanProduits />
                </PrivateRoute>
              }
            />
            <Route
              path="/artisan/produits/ajouter"
              element={
                <PrivateRoute roles={['artisan','admin']}>
                  <AjouterProduit />
                </PrivateRoute>
              }
            />
            <Route
              path="/artisan/produits/modifier/:id"
              element={
                <PrivateRoute roles={['artisan','admin']}>
                  <ModifierProduit />
                </PrivateRoute>
              }
            />
            <Route
              path="/artisan/avis"
              element={
                <PrivateRoute roles={['artisan','admin']}>
                  <ArtisanAvis />
                </PrivateRoute>
              }
            />
            <Route
              path="/artisan/commandes"
              element={
                <PrivateRoute roles={['artisan','admin']}>
                  <CommandesArtisan />
                </PrivateRoute>
              }
            />
            <Route
              path="/artisan/produits/:produitId/avis"
              element={
                <PrivateRoute roles={['artisan','admin']}>
                  <ArtisanAvis />
                </PrivateRoute>
              }
            />
            <Route
              path="/artisan/categories"
              element={
                <PrivateRoute roles={['artisan','admin']}>
                  <ArtisanCategories />
                </PrivateRoute>
              }
            />
            <Route
              path="/artisan/utilisateurs"
              element={
                <PrivateRoute roles={['artisan','admin']}>
                  <ArtisanUtilisateurs />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </PanierProvider>
    </AuthProvider>
  );
}

export default App; 