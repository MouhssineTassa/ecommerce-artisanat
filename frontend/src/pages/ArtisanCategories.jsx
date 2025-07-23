import React, { useEffect, useState } from 'react';
import api from '../services/api';

// Loader animé simple
function Loader() {
  return (
    <div className="flex justify-center items-center py-4">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
    </div>
  );
}

function ArtisanCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCat, setNewCat] = useState('');
  const [catError, setCatError] = useState('');
  const [newSousCat, setNewSousCat] = useState({}); // {catId: nom}
  const [actionLoading, setActionLoading] = useState(false);
  const [editCatId, setEditCatId] = useState(null);
  const [editCatNom, setEditCatNom] = useState('');
  const [editSousCat, setEditSousCat] = useState({}); // {sousCatId: nom}

  const token = localStorage.getItem('token');
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  // Charger les catégories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      setCatError("Erreur de chargement des catégories");
    }
    setLoading(false);
  };

  // Ajouter une catégorie
  const handleAddCategorie = async (e) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    setActionLoading(true);
    setCatError('');
    try {
      await api.post('/categories', { nom: newCat }, headers);
      setNewCat('');
      fetchCategories();
    } catch (err) {
      setCatError("Erreur lors de l'ajout de la catégorie");
    }
    setActionLoading(false);
  };

  // Supprimer une catégorie
  const handleDeleteCategorie = async (catId) => {
    if (!window.confirm('Supprimer cette catégorie ?')) return;
    setActionLoading(true);
    try {
      await api.delete(`/categories/${catId}`, headers);
      fetchCategories();
    } catch (err) {
      setCatError("Erreur lors de la suppression");
    }
    setActionLoading(false);
  };

  // Ajouter une sous-catégorie
  const handleAddSousCategorie = async (catId) => {
    if (!newSousCat[catId] || !newSousCat[catId].trim()) return;
    setActionLoading(true);
    try {
      await api.post(`/categories/${catId}/sous-categories`, { nom: newSousCat[catId] }, headers);
      setNewSousCat({ ...newSousCat, [catId]: '' });
      fetchCategories();
    } catch (err) {
      setCatError("Erreur lors de l'ajout de la sous-catégorie");
    }
    setActionLoading(false);
  };

  // Supprimer une sous-catégorie
  const handleDeleteSousCategorie = async (catId, sousCatId) => {
    if (!window.confirm('Supprimer cette sous-catégorie ?')) return;
    setActionLoading(true);
    try {
      await api.delete(`/categories/${catId}/sous-categories/${sousCatId}`, headers);
      fetchCategories();
    } catch (err) {
      setCatError("Erreur lors de la suppression de la sous-catégorie");
    }
    setActionLoading(false);
  };

  // Modifier une catégorie
  const handleEditCategorie = (cat) => {
    setEditCatId(cat._id);
    setEditCatNom(cat.nom);
  };
  const handleSaveEditCategorie = async (catId) => {
    if (!editCatNom.trim()) return;
    setActionLoading(true);
    try {
      await api.put(`/categories/${catId}`, { nom: editCatNom }, headers);
      setEditCatId(null);
      setEditCatNom('');
      fetchCategories();
    } catch (err) {
      setCatError("Erreur lors de la modification de la catégorie");
    }
    setActionLoading(false);
  };

  // Modifier une sous-catégorie
  const handleEditSousCat = (catId, sousCat) => {
    setEditSousCat({ ...editSousCat, [sousCat._id]: sousCat.nom });
  };
  const handleSaveEditSousCat = async (catId, sousCatId) => {
    if (!editSousCat[sousCatId] || !editSousCat[sousCatId].trim()) return;
    setActionLoading(true);
    try {
      await api.put(`/categories/${catId}/sous-categories/${sousCatId}`, { nom: editSousCat[sousCatId] }, headers);
      setEditSousCat({ ...editSousCat, [sousCatId]: undefined });
      fetchCategories();
    } catch (err) {
      setCatError("Erreur lors de la modification de la sous-catégorie");
    }
    setActionLoading(false);
  };

  return (
    <div className="p-2 sm:p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-green-800">Gestion des catégories</h2>
      <form onSubmit={handleAddCategorie} className="flex flex-col sm:flex-row gap-2 mb-6">
        <input
          type="text"
          placeholder="Nom de la nouvelle catégorie"
          value={newCat}
          onChange={e => setNewCat(e.target.value)}
          className="border p-2 rounded flex-1"
          disabled={actionLoading}
        />
        <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded transition-all duration-200 hover:bg-green-800" disabled={actionLoading}>
          Ajouter
        </button>
      </form>
      {catError && <div className="text-red-600 mb-4">{catError}</div>}
      {loading ? (
        <Loader />
      ) : (
        <div className="space-y-6">
          {categories.length === 0 && <p>Aucune catégorie.</p>}
          {categories.map(cat => (
            <div key={cat._id} className="bg-white rounded shadow p-4 transition-transform duration-200 hover:scale-[1.02]">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                <span className="font-bold text-lg text-green-800">
                  {editCatId === cat._id ? (
                    <>
                      <input
                        type="text"
                        value={editCatNom}
                        onChange={e => setEditCatNom(e.target.value)}
                        className="border p-1 rounded mr-2"
                        disabled={actionLoading}
                      />
                      <button
                        onClick={() => handleSaveEditCategorie(cat._id)}
                        className="bg-green-600 text-white px-2 py-1 rounded text-sm mr-1 transition-all duration-200 hover:bg-green-800"
                        disabled={actionLoading}
                      >
                        Enregistrer
                      </button>
                      <button
                        onClick={() => { setEditCatId(null); setEditCatNom(''); }}
                        className="text-gray-500 text-sm"
                        disabled={actionLoading}
                      >
                        Annuler
                      </button>
                    </>
                  ) : (
                    <>
                      {cat.nom}
                      <button
                        onClick={() => handleEditCategorie(cat)}
                        className="ml-2 text-blue-600 text-xs hover:underline transition-colors duration-200"
                        disabled={actionLoading}
                      >
                        Modifier
                      </button>
                    </>
                  )}
                </span>
                <button
                  onClick={() => handleDeleteCategorie(cat._id)}
                  className="text-red-600 hover:underline text-sm transition-colors duration-200"
                  disabled={actionLoading}
                >
                  Supprimer
                </button>
              </div>
              {/* Sous-catégories */}
              <div className="ml-4">
                <ul className="mb-2">
                  {cat.sousCategories && cat.sousCategories.length > 0 ? (
                    cat.sousCategories.map(sous => (
                      <li key={sous._id} className="flex items-center justify-between group">
                        <span>
                          {editSousCat[sous._id] !== undefined ? (
                            <>
                              <input
                                type="text"
                                value={editSousCat[sous._id]}
                                onChange={e => setEditSousCat({ ...editSousCat, [sous._id]: e.target.value })}
                                className="border p-1 rounded mr-2"
                                disabled={actionLoading}
                              />
                              <button
                                onClick={() => handleSaveEditSousCat(cat._id, sous._id)}
                                className="bg-green-600 text-white px-2 py-1 rounded text-xs mr-1 transition-all duration-200 hover:bg-green-800"
                                disabled={actionLoading}
                              >
                                Enregistrer
                              </button>
                              <button
                                onClick={() => setEditSousCat({ ...editSousCat, [sous._id]: undefined })}
                                className="text-gray-500 text-xs"
                                disabled={actionLoading}
                              >
                                Annuler
                              </button>
                            </>
                          ) : (
                            <>
                              - {sous.nom}
                              <button
                                onClick={() => handleEditSousCat(cat._id, sous)}
                                className="ml-2 text-blue-600 text-xs hover:underline transition-colors duration-200"
                                disabled={actionLoading}
                              >
                                Modifier
                              </button>
                            </>
                          )}
                        </span>
                        <button
                          onClick={() => handleDeleteSousCategorie(cat._id, sous._id)}
                          className="text-xs text-red-500 ml-2 opacity-0 group-hover:opacity-100 transition"
                          disabled={actionLoading}
                        >
                          Supprimer
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 text-sm">Aucune sous-catégorie</li>
                  )}
                </ul>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nouvelle sous-catégorie"
                    value={newSousCat[cat._id] || ''}
                    onChange={e => setNewSousCat({ ...newSousCat, [cat._id]: e.target.value })}
                    className="border p-1 rounded flex-1"
                    disabled={actionLoading}
                  />
                  <button
                    onClick={() => handleAddSousCategorie(cat._id)}
                    className="bg-blue-600 text-white px-2 py-1 rounded text-sm transition-all duration-200 hover:bg-blue-800"
                    disabled={actionLoading}
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ArtisanCategories; 