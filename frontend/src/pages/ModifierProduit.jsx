import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

function ModifierProduit() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/artisan/produits/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => setForm(res.data));
  }, [id, token]);

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("nom", form.nom);
      data.append("description", form.description);
      data.append("prix", form.prix);
      data.append("categorie", form.categorie);
      data.append("sousCategorie", form.sousCategorie);
      data.append("stock", form.stock);
      if (imageFile) data.append("image", imageFile);
      await api.put(`/artisan/produits/${id}`, data, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      navigate("/artisan/produits");
    } catch (err) {
      console.error("Erreur modif", err);
    }
  };

  if (!form) return <p>Chargement...</p>;

  const sousCategories = categories.find(cat => cat._id === form.categorie)?.sousCategories || [];

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Modifier le produit</h2>
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <input name="nom" value={form.nom} onChange={handleChange} required className="input" />
        <textarea name="description" value={form.description} onChange={handleChange} required className="input" />
        <input name="prix" type="number" value={form.prix} onChange={handleChange} required className="input" />
        {/* Catégorie */}
        <select name="categorie" value={form.categorie} onChange={handleChange} required className="input">
          <option value="">-- Sélectionner une catégorie --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.nom}</option>
          ))}
        </select>
        {/* Sous-catégorie */}
        <select name="sousCategorie" value={form.sousCategorie || ""} onChange={handleChange} className="input">
          <option value="">-- Sélectionner une sous-catégorie --</option>
          {sousCategories.map((sc) => (
            <option key={sc._id} value={sc.nom}>{sc.nom}</option>
          ))}
        </select>
        <input name="stock" type="number" value={form.stock || 0} onChange={handleChange} required className="input" />
        <input type="file" accept="image/*" onChange={handleImageChange} className="input" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Enregistrer
        </button>
      </form>
    </div>
  );
}

export default ModifierProduit; 