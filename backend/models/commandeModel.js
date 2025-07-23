const mongoose = require('mongoose');

const commandeSchema = new mongoose.Schema({
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  produits: [
    {
      produit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Produit'
      },
      quantite: {
        type: Number,
        required: true
      }
    }
  ],
  prix_total: {
    type: Number,
    required: true
  },
  adresse_livraison: {
    type: String,
    required: true
  },
  statut: {
    type: String,
    enum: ['en_attente', 'en_livraison', 'livree', 'annulee'],
    default: 'en_attente'
  },
  date_creation: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Commande', commandeSchema);
