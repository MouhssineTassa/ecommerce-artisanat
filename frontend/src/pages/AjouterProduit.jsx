import React, { useState, useEffect } from "react";
import api from "../services/api";

function AjouterProduit() {
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [prix, setPrix] = useState(0);
  const [stock, setStock] = useState(0);
  const [categories, setCategories] = useState([]);
  const [selectedCategorie, setSelectedCategorie] = useState("");
  const [selectedSousCategorie, setSelectedSousCategorie] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data);
      } catch (err) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("nom", nom);
      data.append("description", description);
      data.append("prix", prix);
      data.append("stock", stock);
      data.append("categorie", selectedCategorie);
      data.append("sousCategorie", selectedSousCategorie);
      if (imageFile) data.append("image", imageFile);

      await api.post("/artisan/produits", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });
      alert("Produit ajouté !");
      setNom(""); setDescription(""); setPrix(0); setStock(0);
      setSelectedCategorie(""); setSelectedSousCategorie(""); setImageFile(null);
    } catch (err) {
      console.error("Erreur ajout produit", err);
    }
  };

  const sousCategories = categories.find(cat => cat._id === selectedCategorie)?.sousCategories || [];

  return (
    <div className="max-w-xl mx-auto mt-6 p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Ajouter un produit</h2>
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <input type="text" placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} className="w-full border px-3 py-2 rounded" required />
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full border px-3 py-2 rounded" required />
        <input type="number" placeholder="Prix" value={prix} onChange={e => setPrix(e.target.value)} className="w-full border px-3 py-2 rounded" required />
        <input type="number" placeholder="Stock" value={stock} onChange={e => setStock(e.target.value)} className="w-full border px-3 py-2 rounded" required />

        <select
          value={selectedCategorie}
          onChange={e => { setSelectedCategorie(e.target.value); setSelectedSousCategorie(""); }}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="">-- Sélectionner une catégorie --</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.nom}</option>
          ))}
        </select>

        {selectedCategorie && (
          <select
            value={selectedSousCategorie}
            onChange={e => setSelectedSousCategorie(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">-- Sélectionner une sous-catégorie --</option>
            {sousCategories.map((sub) => (
              <option key={sub._id} value={sub.nom}>{sub.nom}</option>
            ))}
          </select>
        )}

        <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="w-full" required />

        <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800">Ajouter</button>
      </form>
    </div>
  );
}

export default AjouterProduit; 