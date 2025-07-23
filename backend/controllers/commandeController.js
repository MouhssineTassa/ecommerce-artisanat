const Commande = require('../models/commandeModel');
const Panier = require('../models/panierModel');
const Produit = require('../models/produitModel');

// Liste toutes les commandes
exports.getAllCommandes = async (req, res) => {
  try {
    const commandes = await Commande.find()
      .populate('utilisateur', 'nom email')
      .populate('produits.produit', 'nom prix');
    res.json(commandes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Crée une nouvelle commande
exports.createCommande = async (req, res) => {
  try {
    const { utilisateur, produits, adresse_livraison } = req.body;

    // Calcul prix total simple (somme prix * quantité)
    let prix_total = 0;
    for (const item of produits) {
      prix_total += item.produit.prix * item.quantite;
    }

    const commande = new Commande({
      utilisateur,
      produits,
      adresse_livraison,
      prix_total,
    });

    const newCommande = await commande.save();
    res.status(201).json(newCommande);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Récupère une commande par ID
exports.getCommandeById = async (req, res) => {
  try {
    const commande = await Commande.findById(req.params.id)
      .populate('utilisateur', 'nom email')
      .populate('produits.produit', 'nom prix');
    if (!commande) return res.status(404).json({ message: 'Commande non trouvée' });
    res.json(commande);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.validerCommande = async (req, res) => {
  try {
    const utilisateurId = req.user.id;
    const panier = await Panier.findOne({ utilisateur: utilisateurId }).populate('produits.produit');

    if (!panier || panier.produits.length === 0) {
      return res.status(400).json({ message: 'Panier vide' });
    }

    // Calcul du prix total
    let prix_total = 0;
    const produitsCommande = [];

    for (let item of panier.produits) {
      if (!item.produit) continue; // sécurité
      const produit = await Produit.findById(item.produit._id);
      if (produit.stock < item.quantite) {
        return res.status(400).json({ message: `Stock insuffisant pour le produit : ${produit.nom}` });
      }

      produit.stock -= item.quantite;
      await produit.save();

      prix_total += produit.prix * item.quantite;
      produitsCommande.push({
        produit: produit._id,
        quantite: item.quantite
      });
    }

    // Créer la commande
    const commande = new Commande({
      utilisateur: utilisateurId,
      produits: produitsCommande,
      prix_total,
      adresse_livraison: req.body.adresse_livraison
    });

    await commande.save();

    // Vider le panier
    panier.produits = [];
    await panier.save();

    res.status(201).json({ message: 'Commande créée avec succès', commande });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getCommandesUtilisateur = async (req, res) => {
  try {
    const commandes = await Commande.find({ utilisateur: req.user.id })
      .populate('produits.produit', 'nom prix')
      .sort({ date_creation: -1 });

    res.json(commandes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.mettreAJourStatut = async (req, res) => {
  const { id } = req.params;
  const { statut } = req.body;

  const etatsValides = ['en_attente', 'en_livraison', 'livree', 'annulee'];
  if (!etatsValides.includes(statut)) {
    return res.status(400).json({ message: 'Statut invalide' });
  }

  try {
    const commande = await Commande.findByIdAndUpdate(
      id,
      { statut },
      { new: true }
    ).populate('utilisateur', 'nom email');

    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    res.json({ message: 'Statut mis à jour', commande });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

