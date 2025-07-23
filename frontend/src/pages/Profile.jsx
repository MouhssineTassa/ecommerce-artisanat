import React, { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function ProfilUtilisateur() {
  const { user, setUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [nom, setNom] = useState(user?.nom || "");
  const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState("");

  if (!user) {
    return <p className="text-center mt-10 text-red-500">Utilisateur non connecté</p>;
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    setErreur("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "http://localhost:5000/api/utilisateur/update",
        { nom, email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(res.data.utilisateur);
      setMessage("Profil mis à jour avec succès !");
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
      setErreur("Échec de la mise à jour du profil.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6 text-green-800 text-center">Mon Profil</h2>
      
      {/* Affichage des informations actuelles */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Informations actuelles</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Nom :</span>
            <span className="text-gray-900">{user.nom || "Non renseigné"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Email :</span>
            <span className="text-gray-900">{user.email || "Non renseigné"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Rôle :</span>
            <span className="text-gray-900 capitalize">{user.role || "Non renseigné"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">ID utilisateur :</span>
            <span className="text-gray-900 text-sm">{user.id || "Non renseigné"}</span>
          </div>
        </div>
      </div>

      {/* Formulaire de modification */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Modifier mes informations</h3>
        {message && <p className="text-green-600 text-center mb-4">{message}</p>}
        {erreur && <p className="text-red-500 text-center mb-4">{erreur}</p>}
        
        <form onSubmit={handleUpdate}>
          <label className="block mb-2 text-gray-700">Nom :</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            className="w-full border px-3 py-2 mb-4 rounded focus:outline-none focus:ring focus:border-green-500"
            placeholder="Votre nom"
          />
          <label className="block mb-2 text-gray-700">Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 mb-4 rounded focus:outline-none focus:ring focus:border-green-500"
            placeholder="votre@email.com"
          />
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
          >
            Enregistrer les modifications
          </button>
        </form>
      </div>

      {/* Bouton de déconnexion */}
      <div className="mt-6 pt-6 border-t">
        <button
          onClick={handleLogout}
          className="w-full text-red-600 hover:text-red-800 hover:underline text-center font-medium"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
}

export default ProfilUtilisateur; 