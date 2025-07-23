const express = require('express');
const router = express.Router();
const panierController = require('../controllers/panierController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, panierController.getPanier);
router.post('/ajouter', verifyToken, panierController.ajouterAuPanier);
router.post('/retirer', verifyToken, panierController.retirerDuPanier);

module.exports = router;
