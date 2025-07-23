import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [motdepasse, setMotdepasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !motdepasse) {
      setErreur("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);
    setErreur("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        mot_de_passe: motdepasse, // correspondance correcte
      });

      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setErreur("Email ou mot de passe incorrect.");
      } else {
        setErreur("Erreur lors de la connexion. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-center text-green-800">Connexion</h2>

      {erreur && <p className="text-red-500 mb-4 text-center">{erreur}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 px-3 py-2 mb-4 rounded focus:outline-none focus:ring focus:border-green-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full border border-gray-300 px-3 py-2 mb-4 rounded focus:outline-none focus:ring focus:border-green-500"
          value={motdepasse}
          onChange={(e) => setMotdepasse(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded font-semibold ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}

export default Login;
