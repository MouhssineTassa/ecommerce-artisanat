const mongoose = require('mongoose');

const avisSchema = new mongoose.Schema({
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  produit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produit',
    required: true
  },
  note: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  commentaire: {
    type: String,
    trim: true
  },
  date_creation: {
    type: Date,
    default: Date.now
  }
});

// Un utilisateur peut laisser un seul avis par produit
avisSchema.index({ utilisateur: 1, produit: 1 }, { unique: true });

module.exports = mongoose.model('Avis', avisSchema);
