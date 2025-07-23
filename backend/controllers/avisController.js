const Avis = require('../models/avisModel');
const Produit = require('../models/produitModel');

// Obtenir tous les avis pour un produit
exports.getAvisByProduit = async (req, res) => {
  try {
    const avis = await Avis.find({ produit: req.params.produitId }).populate('utilisateur', 'nom');
    res.json(avis);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Créer un nouvel avis
exports.creerAvis = async (req, res) => {
  const { produitId, note, commentaire } = req.body;
  const utilisateurId = req.user.id;

  try {
    // Vérifier si l'utilisateur a déjà laissé un avis pour ce produit
    const avisExistant = await Avis.findOne({ produit: produitId, utilisateur: utilisateurId });
    if (avisExistant) {
      return res.status(400).json({ message: 'Vous avez déjà laissé un avis pour ce produit.' });
    }

    const nouvelAvis = new Avis({
      utilisateur: utilisateurId,
      produit: produitId,
      note,
      commentaire
    });

    const avisEnregistre = await nouvelAvis.save();

    // Mettre à jour la note moyenne du produit
    await updateNoteProduit(produitId);

    res.status(201).json(avisEnregistre);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Obtenir tous les avis pour les produits d'un artisan
exports.getAvisByArtisan = async (req, res) => {
  try {
    const artisanId = req.user.id;
    // Récupérer tous les produits de l'artisan
    const produits = await Produit.find({ artisan: artisanId }).select('_id nom');
    const produitIds = produits.map(p => p._id);
    // Récupérer tous les avis pour ces produits
    const avis = await Avis.find({ produit: { $in: produitIds } })
      .populate('utilisateur', 'nom')
      .populate('produit', 'nom');
    res.json(avis);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Fonction pour mettre à jour la note moyenne d'un produit
async function updateNoteProduit(produitId) {
  const avis = await Avis.find({ produit: produitId });
  if (avis.length > 0) {
    const totalNotes = avis.reduce((acc, item) => item.note + acc, 0);
    const noteMoyenne = totalNotes / avis.length;
    await Produit.findByIdAndUpdate(produitId, { note: noteMoyenne });
  } else {
    // S'il n'y a plus d'avis, on peut remettre la note à 0
    await Produit.findByIdAndUpdate(produitId, { note: 0 });
  }
}
