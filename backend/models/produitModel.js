// backend/models/produitModel.js
const mongoose = require('mongoose');

const produitSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: String,
  prix: { type: Number, required: true },
  categorie: { type: String, required: true },
  sousCategorie: { type: String },
  images: [String],
  stock: { type: Number, default: 0 },
  note: { type: Number, default: 0 }, // Ajout de la note
  nombreCommandes: { type: Number, default: 0 }, // Ajout pour la popularité
  date_creation: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Produit', produitSchema);
