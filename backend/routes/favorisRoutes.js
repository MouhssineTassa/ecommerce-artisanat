const express = require('express');
const router = express.Router();
const favorisController = require('../controllers/favorisController');
const { verifyToken } = require('../middleware/authMiddleware');

// favoris Routes
router.post('/', verifyToken, favorisController.ajouterFavori);
router.delete('/:produitId', verifyToken, favorisController.supprimerFavori);
router.get('/', verifyToken, favorisController.getFavoris);

module.exports = router;
