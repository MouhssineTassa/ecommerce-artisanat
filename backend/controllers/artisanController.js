const Produit = require("../models/produitModel");
const Commande = require("../models/commandeModel");

const getDashboardData = async (req, res) => {
  try {
    const artisanId = req.user.id;

    const produits = await Produit.find({ artisan: artisanId });
    const nombreProduits = produits.length;

    const commandes = await Commande.find({ "produits.artisan": artisanId });
    const nombreCommandes = commandes.length;

    let revenusTotaux = 0;

    commandes.forEach((commande) => {
      commande.produits.forEach((p) => {
        if (p.artisan.toString() === artisanId) {
          revenusTotaux += p.prix * p.quantite;
        }
      });
    });

    res.status(200).json({
      nombreProduits,
      nombreCommandes,
      revenusTotaux,
    });
  } catch (err) {
    console.error("Erreur dashboard artisan :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const produits = await Produit.find({});
    const commandes = await Commande.find({});

    const nombreProduits = produits.length;
    const produitsRupture = produits.filter(p => p.stock <= 0).length;
    const nombreCommandes = commandes.length;
    const revenusTotaux = commandes.reduce((total, cmd) => total + (cmd.total || 0), 0);

    res.json({
      nombreProduits,
      produitsRupture,
      nombreCommandes,
      revenusTotaux,
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors du chargement des statistiques.' });
  }
};

const getArtisanStats = async (req, res) => {
  try {
    const artisanId = req.user.id;
    const produits = await Produit.find({ artisan: artisanId });
    const commandes = await Commande.find({ "produits.artisan": artisanId });

    // Revenus par mois et produits vendus
    const revenusParMois = {};
    const produitsVendus = {};
    commandes.forEach((cmd) => {
      const mois = new Date(cmd.date).toLocaleString("default", { month: "long", year: "numeric" });
      cmd.produits.forEach((p) => {
        if (String(p.artisan) === artisanId) {
          revenusParMois[mois] = (revenusParMois[mois] || 0) + p.quantite * p.prix;
          produitsVendus[p.nom] = (produitsVendus[p.nom] || 0) + p.quantite;
        }
      });
    });
    const topProduits = Object.entries(produitsVendus)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([nom, quantite]) => ({ nom, quantite }));
    res.json({
      revenusParMois,
      topProduits,
      totalCommandes: commandes.length,
      totalProduits: produits.length,
    });
  } catch (err) {
    console.error("Erreur statistiques artisan:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const getCommandesArtisan = async (req, res) => {
  try {
    // Récupérer tous les produits de l'artisan
    const produitsArtisan = await Produit.find({ artisan: req.user.id }).select('_id');
    const produitIds = produitsArtisan.map(p => p._id.toString());
    // Récupérer toutes les commandes contenant au moins un de ces produits
    const commandes = await Commande.find({ "produits.produit": { $in: produitIds } })
      .sort({ date_creation: -1 })
      .populate('utilisateur', 'nom email')
      .populate('produits.produit', 'nom');
    res.json(commandes);
  } catch (err) {
    res.status(500).json({ message: "Erreur récupération commandes" });
  }
};

const updateStatutCommande = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;
    const commande = await Commande.findById(id);
    if (!commande) return res.status(404).json({ message: "Commande introuvable" });
    // Mettre à jour le statut global de la commande
    commande.statut = statut;
    await commande.save();
    res.json({ message: "Statut mis à jour", commande });
  } catch (err) {
    res.status(500).json({ message: "Erreur mise à jour statut" });
  }
};

const getAllCommandes = async (req, res) => {
  try {
    const commandes = await Commande.find().sort({ date_creation: -1 }).populate('utilisateur', 'nom email').populate('produits.produit', 'nom');
    res.json(commandes);
  } catch (err) {
    res.status(500).json({ message: "Erreur récupération commandes" });
  }
};

module.exports = { getDashboardData, getDashboardStats, getArtisanStats, getCommandesArtisan, updateStatutCommande, getAllCommandes }; 