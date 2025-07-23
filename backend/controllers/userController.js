const User = require('../models/userModel');
const bcrypt = require('bcrypt');

// Liste tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-mot_de_passe'); // Ne pas envoyer le mot de passe
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Crée un nouvel utilisateur (avec hash du mot de passe)
exports.createUser = async (req, res) => {
  try {
    const { nom, email, mot_de_passe, role, adresse } = req.body;

    // Vérifie que l'email n'existe pas déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email déjà utilisé' });

    // Hash mot de passe
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    const user = new User({
      nom,
      email,
      mot_de_passe: hashedPassword,
      role,
      adresse,
    });

    const newUser = await user.save();
    res.status(201).json({ 
      id: newUser._id,
      nom: newUser.nom,
      email: newUser.email,
      role: newUser.role,
      adresse: newUser.adresse,
      date_creation: newUser.date_creation,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Récupère un utilisateur par ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-mot_de_passe');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getProfile = async (req, res) => {
  try {
    res.status(200).json({
      message: 'Profil utilisateur',
      user: req.user // injecté depuis le token JWT
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération du profil' });
  }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur suppression utilisateur' });
  }
};

// Historique d'achat d'un utilisateur
const Commande = require('../models/commandeModel');
exports.getUserOrders = async (req, res) => {
  try {
    const commandes = await Commande.find({ utilisateur: req.params.id })
      .populate('produits.produit', 'nom prix')
      .sort({ date_creation: -1 });
    res.json(commandes);
  } catch (err) {
    res.status(500).json({ message: 'Erreur récupération historique commandes' });
  }
};

// Avis et notes d'un utilisateur
const Avis = require('../models/avisModel');
exports.getUserAvis = async (req, res) => {
  try {
    const avis = await Avis.find({ utilisateur: req.params.id })
      .populate('produit', 'nom')
      .sort({ date_creation: -1 });
    res.json(avis);
  } catch (err) {
    res.status(500).json({ message: 'Erreur récupération avis utilisateur' });
  }
};
