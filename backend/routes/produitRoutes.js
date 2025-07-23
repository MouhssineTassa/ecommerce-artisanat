const express = require('express');
const router = express.Router();
const produitController = require('../controllers/produitController');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Routes publiques
router.get('/', produitController.getProduits);
router.get('/:id', produitController.getProduitById);

// Routes protégées (admin seulement)
router.post('/', verifyToken, authorizeRoles('admin'), produitController.creerProduit);
router.put('/:id', verifyToken, authorizeRoles('admin'), produitController.modifierProduit);
router.delete('/:id', verifyToken, authorizeRoles('admin'), produitController.supprimerProduit);

// ✅ Upload image produit
router.post(
  '/upload-image',
  verifyToken,
  authorizeRoles('admin'),
  upload.single('image'),
  async (req, res) => {
    try {
      const imageUrl = req.file.path;
      res.status(200).json({ imageUrl });
    } catch (err) {
      res.status(500).json({ message: 'Erreur upload image', error: err.message });
    }
  }
);

module.exports = router;
