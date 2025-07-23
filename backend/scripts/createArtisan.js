// backend/scripts/createArtisan.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
require('dotenv').config();

async function createArtisan() {
  try {
    // 1. Connexion à la base de données
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connecté pour le script');

    // 2. Vérifier si l'artisan existe déjà
    const existingArtisan = await User.findOne({ email: 'admin@artisan.com' });
    if (existingArtisan) {
        console.log('L\'artisan existe déjà.');
        return; // Quitte la fonction si l'artisan existe
    }

    // 3. Créer le nouvel artisan
    const hashedPassword = await bcrypt.hash('motdepassefort', 10);
    const artisan = new User({
        nom: 'Admin',
        email: 'admin@artisan.com',
        mot_de_passe: hashedPassword,
        role: 'artisan'
    });

    await artisan.save();
    console.log('Artisan créé avec succès !');

  } catch(error) {
    console.error("❌ Erreur lors de la création de l'artisan:", error);
  } finally {
    // 4. Déconnexion propre
    await mongoose.disconnect();
    console.log('Déconnexion de MongoDB.');
  }
}

createArtisan(); 