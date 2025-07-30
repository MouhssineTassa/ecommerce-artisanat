const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const Utilisateur = require('../models/userModel'); // Assurez-vous que le chemin est correct

// Ajouter cette route avant les autres routes
router.post('/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    const utilisateur = await Utilisateur.findOne({ email });
    res.json({ exists: !!utilisateur });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la vérification de l'email" });
  }
});

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
