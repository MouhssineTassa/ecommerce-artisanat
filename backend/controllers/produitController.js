const Produit = require('../models/produitModel');


exports.getProduits = async (req, res) => {
  try {
    const { search, categorie, prixMin, prixMax, noteMin, populaire, sortBy, order, page, limit } = req.query;

    let filtre = {};

    // 🔍 Recherche
    if (search) {
      filtre.nom = { $regex: search, $options: 'i' };
    }

    // 🎯 Filtre catégorie
    if (categorie) {
      filtre.categorie = categorie;
    }

    // 💰 Filtre prix
    if (prixMin || prixMax) {
      filtre.prix = {};
      if (prixMin) filtre.prix.$gte = Number(prixMin);
      if (prixMax) filtre.prix.$lte = Number(prixMax);
    }

    // ⭐ Filtre note
    if (noteMin) {
      filtre.note = { $gte: Number(noteMin) };
    }

    // 🔢 Tri
    let tri = {};
    if (populaire === 'true') {
      tri.nombreCommandes = -1; // Tri par popularité
    } else if (sortBy) {
      tri[sortBy] = order === 'desc' ? -1 : 1;
    } else {
      tri.date_creation = -1;
    }

    // 📄 Pagination
    const currentPage = parseInt(page) || 1;
    const perPage = parseInt(limit) || 10;
    const skip = (currentPage - 1) * perPage;

    // 📦 Récupération des produits
    const produits = await Produit.find(filtre)
      .sort(tri)
      .skip(skip)
      .limit(perPage)
      .populate('categorie', 'nom');

    // 🧮 Compter le total
    const total = await Produit.countDocuments(filtre);

    res.json({
      produits,
      total,
      page: currentPage,
      pages: Math.ceil(total / perPage)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getProduitById = async (req, res) => {
  try {
    const produit = await Produit.findById(req.params.id);
    if (!produit) return res.status(404).json({ message: 'Produit non trouvé' });
    res.json(produit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.creerProduit = async (req, res) => {
  try {
    const {
      nom,
      description,
      prix,
      categorie,
      stock
    } = req.body;

    const imageUrl = req.body.imageUrl || '';

    const nouveauProduit = new Produit({
      nom,
      description,
      prix,
      categorie,
      images: [imageUrl],
      stock
    });

    await nouveauProduit.save();
    res.status(201).json(nouveauProduit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.modifierProduit = async (req, res) => {
  try {
    const produit = await Produit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!produit) return res.status(404).json({ message: 'Produit non trouvé' });
    res.json(produit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.supprimerProduit = async (req, res) => {
  try {
    const produit = await Produit.findByIdAndDelete(req.params.id);
    if (!produit) return res.status(404).json({ message: 'Produit non trouvé' });
    res.json({ message: 'Produit supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
