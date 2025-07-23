const mongoose = require('mongoose');

const panierSchema = new mongoose.Schema({
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  produits: [
    {
      produit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Produit'
      },
      quantite: {
        type: Number,
        default: 1
      }
    }
  ],
  date_mise_a_jour: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Panier', panierSchema);
