import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

function ArtisanProduitsPage() {
  const { user } = useContext(AuthContext);
  const [produits, setProduits] = useState([]);
  const [form, setForm] = useState({
    nom: "",
    description: "",
    prix: "",
    categorie: "",
    stock: "",
    images: "",
  });
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProduits();
    // eslint-disable-next-line
  }, []);

  const fetchProduits = async () => {
    try {
      const res = await axios.get("/api/artisan/mes-produits", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProduits(res.data);
    } catch (err) {
      console.error("Erreur chargement produits", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Modifier produit
        await axios.put(`/api/artisan/produits/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // Ajouter produit
        await axios.post("/api/artisan/produits", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setForm({
        nom: "",
        description: "",
        prix: "",
        categorie: "",
        stock: "",
        images: "",
      });
      setEditingId(null);
      fetchProduits();
    } catch (err) {
      console.error("Erreur enregistrement produit", err);
    }
  };

  const handleEdit = (produit) => {
    setForm({
      nom: produit.nom,
      description: produit.description,
      prix: produit.prix,
      categorie: produit.categorie,
      stock: produit.stock,
      images: Array.isArray(produit.images) ? produit.images.join(",") : produit.images || "",
    });
    setEditingId(produit._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer ce produit ?")) {
      try {
        await axios.delete(`/api/artisan/produits/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchProduits();
      } catch (err) {
        console.error("Erreur suppression", err);
      }
    }
  };

  if (!user || user.role !== "artisan") {
    return <div className="p-6 text-red-600">Accès réservé à l'artisan.</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestion des produits</h2>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded shadow mb-6">
        {["nom", "description", "prix", "categorie", "stock", "images"].map((field) => (
          <input
            key={field}
            type={field === "prix" || field === "stock" ? "number" : "text"}
            name={field}
            value={form[field]}
            onChange={handleChange}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            className="border p-2 rounded"
            required
          />
        ))}
        <button type="submit" className="col-span-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          {editingId ? "Modifier le produit" : "Ajouter le produit"}
        </button>
      </form>

      {/* Liste des produits */}
      <div className="grid gap-4">
        {produits.map((p) => (
          <div key={p._id} className="p-4 bg-gray-100 rounded shadow flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">{p.nom}</h3>
              <p className="text-sm text-gray-600">{p.description}</p>
              <p className="text-sm">💰 {p.prix} DH | 🏷️ {p.categorie} | 📦 Stock: {p.stock}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(p)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(p._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArtisanProduitsPage; 