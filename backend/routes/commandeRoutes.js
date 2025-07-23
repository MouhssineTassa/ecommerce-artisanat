const express = require('express');
const router = express.Router();
const commandeController = require('../controllers/commandeController');
const { verifyToken,authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', verifyToken, authorizeRoles('admin'), commandeController.getAllCommandes);
router.put('/:id/statut', verifyToken, authorizeRoles('admin'), commandeController.mettreAJourStatut);

router.post('/', verifyToken,commandeController.createCommande);
router.get('/utilisateur', verifyToken, commandeController.getCommandesUtilisateur);
router.get('/:id', verifyToken,commandeController.getCommandeById);
router.post('/valider', verifyToken, commandeController.validerCommande);


module.exports = router;
