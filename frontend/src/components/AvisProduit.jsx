import React, { useEffect, useState } from "react";
import axios from "axios";

function AvisProduit({ produitId }) {
  const [avis, setAvis] = useState([]);
  const [note, setNote] = useState(5);
  const [commentaire, setCommentaire] = useState("");
  const [moyenne, setMoyenne] = useState(0);
  const token = localStorage.getItem("token");

  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Charger les avis existants
  useEffect(() => {
    const fetchAvis = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/avis/${produitId}`);
        setAvis(res.data);
        calculerMoyenne(res.data);
      } catch (err) {
        console.error("Erreur chargement avis:", err);
      }
    };
    fetchAvis();
  }, [produitId]);

  // Calcul de la moyenne
  const calculerMoyenne = (avisList) => {
    if (avisList.length === 0) {
      setMoyenne(0);
      return;
    }
    const total = avisList.reduce((acc, a) => acc + a.note, 0);
    setMoyenne((total / avisList.length).toFixed(1));
  };

  // Soumettre un nouvel avis
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert("Veuillez vous connecter pour laisser un avis.");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/avis",
        {
          produitId,
          note,
          commentaire,
        },
        headers
      );
      const newAvis = [...avis, res.data];
      setAvis(newAvis);
      calculerMoyenne(newAvis);
      setNote(5);
      setCommentaire("");
    } catch (err) {
      console.error("Erreur envoi avis:", err);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-2">Avis des clients</h3>
      <p className="mb-4">Note moyenne : ⭐ {moyenne} / 5</p>

      {/* Liste des avis */}
      {avis.map((a, idx) => (
        <div key={idx} className="border p-3 rounded mb-2 bg-gray-50">
          <p className="font-semibold">⭐ {a.note} / 5</p>
          <p>{a.commentaire}</p>
          <p className="text-sm text-gray-500">— {a.utilisateur?.nom || "Utilisateur"}</p>
        </div>
      ))}

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label className="block font-medium">Note</label>
          <select
            value={note}
            onChange={(e) => setNote(Number(e.target.value))}
            className="border rounded p-2"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} étoiles
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Commentaire</label>
          <textarea
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            className="w-full border rounded p-2"
            rows="3"
          />
        </div>

        <button
          type="submit"
          className="bg-green-700 text-white py-2 px-4 rounded hover:bg-green-800"
        >
          Envoyer l’avis
        </button>
      </form>
    </div>
  );
}

export default AvisProduit; 