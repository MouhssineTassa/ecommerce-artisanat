const Panier = require('../models/panierModel');

exports.getPanier = async (req, res) => {
  try {
    const panier = await Panier.findOne({ utilisateur: req.user.id }).populate('produits.produit');
    res.json(panier || { produits: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.ajouterAuPanier = async (req, res) => {
  const { produitId, quantite } = req.body;
  try {
    let panier = await Panier.findOne({ utilisateur: req.user.id });

    if (!panier) {
      panier = new Panier({
        utilisateur: req.user.id,
        produits: [{ produit: produitId, quantite }]
      });
    } else {
      const index = panier.produits.findIndex(p => p.produit.toString() === produitId);
      if (index > -1) {
        panier.produits[index].quantite += quantite;
      } else {
        panier.produits.push({ produit: produitId, quantite });
      }
    }

    await panier.save();
    res.status(200).json(panier);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.retirerDuPanier = async (req, res) => {
  const { produitId } = req.body;
  try {
    const panier = await Panier.findOne({ utilisateur: req.user.id });
    if (!panier) return res.status(404).json({ message: 'Panier introuvable' });

    panier.produits = panier.produits.filter(p => p.produit.toString() !== produitId);
    await panier.save();

    res.status(200).json(panier);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
