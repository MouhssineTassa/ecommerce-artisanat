import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import DashboardStats from "./DashboardStats";
import CommandesArtisan from "./CommandesArtisan";

// Loader animé simple
function Loader() {
  return (
    <div className="flex justify-center items-center py-4">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
    </div>
  );
}

function ArtisanDashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get("/api/artisan/dashboard/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      console.error("Erreur stats", err);
    }
  };

  if (!user || (user.role !== "artisan" && user.role !== "admin")) {
    return <div className="p-6 text-red-600">Accès réservé à l'artisan.</div>;
  }

  return (
    <div className="p-2 sm:p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-green-800">Tableau de bord Artisan</h2>
      {/* Statistiques clés */}
      {stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Produits" value={stats.nombreProduits} color="green" />
          <StatCard title="Commandes" value={stats.nombreCommandes} color="blue" />
          <StatCard title="Revenus" value={`${stats.revenusTotaux} DH`} color="yellow" />
          <StatCard title="Rupture de stock" value={stats.produitsRupture} color="red" />
        </div>
      ) : (
        <Loader />
      )}
      {/* Statistiques avancées */}
      <DashboardStats />
      {/* Gestion des commandes */}
      <div className="mt-12">
        <CommandesArtisan />
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  const bg = {
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    yellow: "bg-yellow-100 text-yellow-700",
    red: "bg-red-100 text-red-700",
  }[color];

  return (
    <div className={`p-4 rounded shadow ${bg} transition-transform duration-200 hover:scale-105`}> 
      <h4 className="text-sm font-medium mb-1">{title}</h4>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

export default ArtisanDashboard; 