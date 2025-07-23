// backend/app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // charge .env

const app = express();
app.use(cors());
app.use(express.json());

// Connexion MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connecté'))
.catch((err) => console.error('❌ Erreur de connexion MongoDB :', err));

app.get("/", (req, res) => {
  res.send("API Artisanat en ligne opérationnelle ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend sur http://localhost:${PORT}`));

const produitRoutes = require('./routes/produitRoutes');
app.use('/api/produits', produitRoutes);

const userRoutes = require('./routes/userRoutes');
const commandeRoutes = require('./routes/commandeRoutes');
const authRoutes = require('./routes/authRoutes');
const panierRoutes = require('./routes/panierRoutes');
const categorieRoutes = require('./routes/categorieRoutes');
const avisRoutes = require('./routes/avisRoutes');
const favorisRoutes = require('./routes/favorisRoutes');
const artisanRoutes = require('./routes/artisanRoutes');

app.use('/api/users', userRoutes);
app.use('/api/commandes', commandeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/panier', panierRoutes);
app.use('/api/categories', categorieRoutes);
app.use('/api/avis', avisRoutes);
app.use('/api/favoris', favorisRoutes);
app.use('/api/artisan', artisanRoutes);
