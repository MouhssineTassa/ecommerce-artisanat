import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function DashboardStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get("/api/artisan/stats", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Erreur chargement stats:", err));
  }, []);

  if (!stats) return <div>Chargement des statistiques...</div>;

  const revenuData = Object.entries(stats.revenusParMois).map(([mois, total]) => ({
    mois,
    total,
  }));

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Statistiques de vente</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">💰 Revenus par mois</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenuData}>
              <XAxis dataKey="mois" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">🔥 Top produits vendus</h3>
          <ul className="space-y-2">
            {stats.topProduits.map((p, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{p.nom}</span>
                <span className="font-semibold">{p.quantite} vendus</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-green-100 p-4 rounded text-center">
          <p className="text-xl font-bold">{stats.totalProduits}</p>
          <p>Produits publiés</p>
        </div>
        <div className="bg-blue-100 p-4 rounded text-center">
          <p className="text-xl font-bold">{stats.totalCommandes}</p>
          <p>Commandes reçues</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardStats; 