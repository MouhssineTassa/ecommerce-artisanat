import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function Signup() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [motdepasse, setMotdepasse] = useState("");
  const [nom, setNom] = useState("");
  const [erreur, setErreur] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        nom,
        email,
        mot_de_passe: motdepasse, // correspondance correcte
        role: "client", // optionnel mais recommandé
      });
      login(res.data.utilisateur, res.data.token);
      navigate("/");
    } catch (err) {
      setErreur("Erreur lors de l'inscription. Veuillez réessayer.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Inscription</h2>
      {erreur && <p className="text-red-500 mb-4">{erreur}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom"
          className="w-full border px-3 py-2 mb-4 rounded"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border px-3 py-2 mb-4 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full border px-3 py-2 mb-4 rounded"
          value={motdepasse}
          onChange={(e) => setMotdepasse(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          S'inscrire
        </button>
      </form>
    </div>
  );
}

export default Signup; 