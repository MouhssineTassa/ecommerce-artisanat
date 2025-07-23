const Categorie = require('../models/categorieModel');

exports.creerCategorie = async (req, res) => {
  try {
    const { nom, description, sousCategories } = req.body;
    const exist = await Categorie.findOne({ nom });
    if (exist) return res.status(400).json({ message: 'Catégorie existe déjà' });

    const categorie = new Categorie({ nom, description, sousCategories });
    await categorie.save();
    res.status(201).json(categorie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Categorie.find().sort({ nom: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.supprimerCategorie = async (req, res) => {
  try {
    const { id } = req.params;
    await Categorie.findByIdAndDelete(id);
    res.json({ message: 'Catégorie supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.ajouterSousCategorie = async (req, res) => {
  const { nom } = req.body;
  try {
    const cat = await Categorie.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: 'Catégorie non trouvée' });
    cat.sousCategories.push({ nom });
    await cat.save();
    res.status(201).json(cat);
  } catch (err) {
    res.status(500).json({ message: "Erreur ajout sous-catégorie" });
  }
};

exports.supprimerSousCategorie = async (req, res) => {
  try {
    const cat = await Categorie.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: 'Catégorie non trouvée' });
    cat.sousCategories = cat.sousCategories.filter(s => s._id.toString() !== req.params.sid);
    await cat.save();
    res.json(cat);
  } catch (err) {
    res.status(500).json({ message: "Erreur suppression sous-catégorie" });
  }
};

exports.modifierCategorie = async (req, res) => {
  try {
    const { nom } = req.body;
    const cat = await Categorie.findByIdAndUpdate(req.params.id, { nom }, { new: true });
    if (!cat) return res.status(404).json({ message: 'Catégorie non trouvée' });
    res.json(cat);
  } catch (err) {
    res.status(500).json({ message: "Erreur modification catégorie" });
  }
};

exports.modifierSousCategorie = async (req, res) => {
  try {
    const { nom } = req.body;
    const cat = await Categorie.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: 'Catégorie non trouvée' });
    const sousCat = cat.sousCategories.id(req.params.sid);
    if (!sousCat) return res.status(404).json({ message: 'Sous-catégorie non trouvée' });
    sousCat.nom = nom;
    await cat.save();
    res.json(cat);
  } catch (err) {
    res.status(500).json({ message: "Erreur modification sous-catégorie" });
  }
};
