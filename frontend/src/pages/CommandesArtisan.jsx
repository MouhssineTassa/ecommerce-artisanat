import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

// Loader animé simple
function Loader() {
  return (
    <div className="flex justify-center items-center py-4">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
    </div>
  );
}

const CommandesArtisan = () => {
  const [commandes, setCommandes] = useState([]);
  const [filtreStatut, setFiltreStatut] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchCommandes = async () => {
      setLoading(true);
      try {
        let url = '/api/artisan/commandes';
        if (user && (user.role === 'admin' || user.role === 'artisan')) {
          url = '/api/artisan/commandes/all';
        }
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setCommandes(res.data);
      } catch (err) {
        console.error("Erreur chargement commandes", err);
      }
      setLoading(false);
    };
    fetchCommandes();
  }, [user]);

  const updateStatut = async (id, statut) => {
    try {
      await axios.put(`/api/artisan/commandes/${id}/status`, { statut }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setCommandes(prev =>
        prev.map(cmd => cmd._id === id
          ? { ...cmd, statut }
          : cmd
        )
      );
    } catch (err) {
      console.error("Erreur mise à jour statut:", err);
    }
  };

  // Filtrage par statut (optionnel)
  const commandesFiltrees = filtreStatut
    ? commandes.filter(cmd => cmd.statut === filtreStatut)
    : commandes;

  return (
    <div className="p-2 sm:p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-green-800">📦 Commandes reçues</h2>
      <div className="mb-4 flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <label className="font-semibold">Filtrer par statut :</label>
        <select value={filtreStatut} onChange={e => setFiltreStatut(e.target.value)} className="border rounded px-2 py-1">
          <option value="">Toutes</option>
          <option value="en_attente">🕒 En attente</option>
          <option value="en_livraison">🚚 En livraison</option>
          <option value="livree">📦 Livrée</option>
          <option value="annulee">❌ Annulée</option>
        </select>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="space-y-4">
          {commandesFiltrees.length === 0 ? (
            <p className="text-gray-500">Aucune commande trouvée.</p>
          ) : commandesFiltrees.map((cmd) => (
            <div key={cmd._id} className="border p-4 rounded bg-white shadow transition-transform duration-200 hover:scale-[1.02]">
              <p><span className="font-semibold">Commande :</span> {cmd._id}</p>
              <p><span className="font-semibold">Date :</span> {new Date(cmd.date_creation || cmd.date).toLocaleDateString()}</p>
              <p><span className="font-semibold">Client :</span> {cmd.utilisateur?.nom || 'Inconnu'}</p>
              <p><span className="font-semibold">Statut :</span> 
                <select
                  value={cmd.statut}
                  onChange={e => updateStatut(cmd._id, e.target.value)}
                  className="ml-2 border rounded px-2 py-1"
                >
                  <option value="en_attente">🕒 En attente</option>
                  <option value="en_livraison">🚚 En livraison</option>
                  <option value="livree">📦 Livrée</option>
                  <option value="annulee">❌ Annulée</option>
                </select>
              </p>
              <div className="mt-2">
                {cmd.produits.map((p, idx) => (
                  <div key={idx} className="border-t pt-2 mt-2">
                    <p><span className="font-semibold">Produit :</span> {p.produit?.nom || p.nom}</p>
                    <p><span className="font-semibold">Quantité :</span> {p.quantite}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommandesArtisan; 