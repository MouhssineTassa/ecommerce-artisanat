const express = require('express');
const router = express.Router();
const categorieController = require('../controllers/categorieController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', categorieController.getCategories);
router.post('/', verifyToken, authorizeRoles('admin', 'artisan'), categorieController.creerCategorie);
router.delete('/:id', verifyToken, authorizeRoles('admin', 'artisan'), categorieController.supprimerCategorie);
router.post('/:id/sous-categories', verifyToken, authorizeRoles('admin', 'artisan'), categorieController.ajouterSousCategorie);
router.delete('/:id/sous-categories/:sid', verifyToken, authorizeRoles('admin', 'artisan'), categorieController.supprimerSousCategorie);
router.put('/:id', verifyToken, authorizeRoles('admin', 'artisan'), categorieController.modifierCategorie);
router.put('/:id/sous-categories/:sid', verifyToken, authorizeRoles('admin', 'artisan'), categorieController.modifierSousCategorie);

module.exports = router;
