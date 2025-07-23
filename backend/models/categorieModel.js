const mongoose = require('mongoose');

const sousCategorieSchema = new mongoose.Schema({
  nom: { type: String, required: true }
});

const categorieSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  sousCategories: [sousCategorieSchema],
  date_creation: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Categorie', categorieSchema);
