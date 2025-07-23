import React, { useEffect, useState } from "react";
import axios from "axios";

function DashboardArtisan() {
  const [stats, setStats] = useState({
    nombreProduits: 0,
    nombreCommandes: 0,
    revenusTotaux: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/artisan/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des statistiques", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-green-800">Tableau de bord Artisan</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h2 className="text-lg font-semibold text-gray-700">Produits</h2>
          <p className="text-3xl text-green-700">{stats.nombreProduits}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h2 className="text-lg font-semibold text-gray-700">Commandes</h2>
          <p className="text-3xl text-green-700">{stats.nombreCommandes}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h2 className="text-lg font-semibold text-gray-700">Revenus</h2>
          <p className="text-3xl text-green-700">{Number.isFinite(stats.revenusTotaux) ? stats.revenusTotaux.toFixed(2) : '0.00'} DH</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardArtisan; 