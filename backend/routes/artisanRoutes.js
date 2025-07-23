const express = require("express");
const router = express.Router();
const { getDashboardData, getDashboardStats, getArtisanStats, getCommandesArtisan, updateStatutCommande, getAllCommandes } = require("../controllers/artisanController");
const { verifyToken } = require("../middleware/authMiddleware");
const Produit = require("../models/produitModel");
const upload = require("../middleware/uploadMiddleware");
const userController = require('../controllers/userController');

router.get("/dashboard", verifyToken, getDashboardData);

// Obtenir les produits créés par l’artisan connecté
router.get("/mes-produits", verifyToken, async (req, res) => {
  try {
    let produits;
    // Si admin ou artisan unique, retourner tous les produits
    if (req.user.role === 'admin' || req.user.role === 'artisan') {
      produits = await Produit.find();
    } else {
      produits = await Produit.find({ artisan: req.user.id });
    }
    res.json(produits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ajouter un produit
router.post("/produits", verifyToken, upload.single("image"), async (req, res) => {
  try {
    console.log('BODY:', req.body);
    console.log('FILE:', req.file);
    if (req.user.role !== "artisan" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Accès refusé" });
    }
    const { nom, description, prix, categorie, stock } = req.body;
    let images = [];
    if (req.file && req.file.path) {
      images.push(req.file.path);
    }
    const produit = new Produit({
      nom,
      description,
      prix,
      categorie,
      stock,
      images,
      artisan: req.user.id
    });
    await produit.save();
    res.status(201).json(produit);
  } catch (err) {
    console.error("Erreur ajout produit:", err);
    res.status(500).json({ message: err.message });
  }
});

// Modifier un produit
router.put("/produits/:id", verifyToken, upload.single("image"), async (req, res) => {
  try {
    console.log('PUT BODY:', req.body);
    console.log('PUT FILE:', req.file);
    const produit = await Produit.findById(req.params.id);
    if (!produit) return res.status(404).json({ message: "Produit non trouvé" });
    if (produit.artisan && produit.artisan.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Accès interdit" });
    }
    const champsModifiables = ["nom", "description", "prix", "categorie", "sousCategorie", "stock"];
    champsModifiables.forEach((champ) => {
      if (req.body[champ] !== undefined) {
        produit[champ] = req.body[champ];
      }
    });
    if (req.file && req.file.path) {
      produit.images = [req.file.path];
    }
    await produit.save();
    res.json(produit);
  } catch (err) {
    console.error("Erreur modification produit:", err);
    res.status(500).json({ message: err.message });
  }
});

// Supprimer un produit
router.delete("/produits/:id", verifyToken, async (req, res) => {
  try {
    console.log('DELETE produit id:', req.params.id);
    const produit = await Produit.findById(req.params.id);
    if (!produit) return res.status(404).json({ message: "Produit non trouvé" });
    if (produit.artisan && produit.artisan.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Accès interdit" });
    }
    await produit.deleteOne();
    res.json({ message: "Produit supprimé avec succès" });
  } catch (err) {
    console.error("Erreur suppression produit:", err);
    res.status(500).json({ message: err.message });
  }
});

// Récupérer un produit par son id (pour modification)
router.get("/produits/:id", verifyToken, async (req, res) => {
  try {
    const produit = await Produit.findById(req.params.id);
    if (!produit) return res.status(404).json({ message: "Produit non trouvé" });
    res.json(produit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware pour vérifier le rôle artisan
function isArtisan(req, res, next) {
  if (req.user.role !== 'artisan' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès réservé à l\'artisan.' });
  }
  next();
}

router.get('/dashboard/stats', verifyToken, isArtisan, getDashboardStats);
router.get('/stats', verifyToken, isArtisan, getArtisanStats);
router.get('/commandes', verifyToken, isArtisan, getCommandesArtisan);
router.get('/commandes/all', verifyToken, isArtisan, getAllCommandes);
router.put('/commandes/:id/status', verifyToken, isArtisan, updateStatutCommande);

// Gestion des utilisateurs (admin/artisan)
router.get('/utilisateurs', verifyToken, isArtisan, userController.getAllUsers);
router.delete('/utilisateurs/:id', verifyToken, isArtisan, userController.deleteUser);
router.get('/utilisateurs/:id/commandes', verifyToken, isArtisan, userController.getUserOrders);
router.get('/utilisateurs/:id/avis', verifyToken, isArtisan, userController.getUserAvis);

module.exports = router; 