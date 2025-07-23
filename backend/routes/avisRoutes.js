const express = require('express');
const router = express.Router();
const avisController = require('../controllers/avisController');
const { verifyToken } = require('../middleware/authMiddleware');

// GET /api/avis/:produitId — récupérer les avis pour un produit
router.get('/:produitId', avisController.getAvisByProduit);

// POST /api/avis — ajouter un avis (protégé)
router.post('/', verifyToken, avisController.creerAvis);

// GET /api/avis/artisan — récupérer tous les avis pour les produits de l'artisan
router.get('/artisan', verifyToken, avisController.getAvisByArtisan);

module.exports = router;
