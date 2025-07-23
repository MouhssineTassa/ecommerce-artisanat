const User = require('../models/userModel');

// ➕ Ajouter un produit aux favoris
exports.ajouterFavori = async (req, res) => {
  try {
    const { produitId } = req.body;
    const user = await User.findById(req.user.id);

    if (user.favoris.includes(produitId)) {
      return res.status(400).json({ message: 'Produit déjà dans les favoris' });
    }

    user.favoris.push(produitId);
    await user.save();

    res.json({ message: 'Produit ajouté aux favoris' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ Supprimer un produit des favoris
exports.supprimerFavori = async (req, res) => {
  try {
    const { produitId } = req.params;
    const user = await User.findById(req.user.id);

    user.favoris = user.favoris.filter(id => id.toString() !== produitId);
    await user.save();

    res.json({ message: 'Produit retiré des favoris' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📄 Voir les favoris de l'utilisateur
exports.getFavoris = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favoris');
    res.json(user.favoris);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
