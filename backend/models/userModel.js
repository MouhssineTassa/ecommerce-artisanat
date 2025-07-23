// backend/models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mot_de_passe: { type: String, required: true }, // stocker hashé
  role: {
    type: String,
    enum: ['client', 'artisan'],
    default: 'client'
  },
  adresse: String,
  date_creation: { type: Date, default: Date.now },
  favoris: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Produit'
}]

});

module.exports = mongoose.model('User', userSchema);
