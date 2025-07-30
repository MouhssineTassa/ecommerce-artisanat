import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import '../styles/Sign.css';

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    email: "",
    motdepasse: "",
    confirmMotdepasse: "",
    nom: ""
  });
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleChange = (e) => {
    setErreur(""); // Réinitialise l'erreur à chaque modification
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateEmail = async (email) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/check-email", {
        email
      });
      return res.data.exists;
    } catch (err) {
      console.error("Erreur lors de la vérification de l'email:", err);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation des champs
    if (!formData.email || !formData.motdepasse) {
      setErreur("Veuillez remplir tous les champs.");
      return;
    }

    if (!isLogin) {
      // Validations supplémentaires pour l'inscription
      if (!formData.nom) {
        setErreur("Le nom est obligatoire.");
        return;
      }

      // Vérification du format de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setErreur("Format d'email invalide.");
        return;
      }

      // Vérification de l'existence de l'email
      const emailExists = await validateEmail(formData.email);
      if (emailExists) {
        setErreur("Cette adresse email est déjà utilisée.");
        return;
      }

      // Validation du mot de passe
      if (!passwordRegex.test(formData.motdepasse)) {
        setErreur(
          "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial"
        );
        return;
      }
      if (formData.motdepasse !== formData.confirmMotdepasse) {
        setErreur("Les mots de passe ne correspondent pas.");
        return;
      }
    }

    setLoading(true);
    setErreur("");

    try {
      if (isLogin) {
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          email: formData.email,
          mot_de_passe: formData.motdepasse,
        });
        login(res.data.user, res.data.token);
        navigate("/");
      } else {
        const res = await axios.post("http://localhost:5000/api/auth/register", {
          nom: formData.nom,
          email: formData.email,
          mot_de_passe: formData.motdepasse,
        });
        login(res.data.user, res.data.token);
        navigate("/");
      }
    } catch (err) {
      setErreur(err.response?.data?.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sign-container">
      <img 
        src="/images/sign-bg.png" 
        alt="Background" 
        className="sign-background"
      />
      <div className="sign-content">
        <div className="sign-form-container">
          <div className="sign-header">
            <button 
              className={`tab-btn ${isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(true)}
            >
              Se connecter
            </button>
            <button 
              className={`tab-btn ${!isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(false)}
            >
              Créer un compte
            </button>
          </div>

          <form onSubmit={handleSubmit} className="sign-form">
            {erreur && <p className="error-message">{erreur}</p>}
            
            <div className={`form-fields ${isLogin ? 'slide-left' : 'slide-right'}`}>
              {!isLogin && (
                <div className="form-group">
                  <input
                    type="text"
                    name="nom"
                    placeholder="Nom"
                    value={formData.nom}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Adresse email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="password"
                  name="motdepasse"
                  placeholder="Mot de passe"
                  value={formData.motdepasse}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              {!isLogin && (
                <div className="form-group">
                  <input
                    type="password"
                    name="confirmMotdepasse"
                    placeholder="Confirmer le mot de passe"
                    value={formData.confirmMotdepasse}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              )}
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Chargement..." : isLogin ? "Se connecter" : "Créer un compte"}
            </button>
          </form>

          <p className="switch-mode">
            {isLogin ? (
              <>
                Vous n'avez pas de compte ?{" "}
                <span onClick={() => setIsLogin(false)}>Créer un compte</span>
              </>
            ) : (
              <>
                Vous avez déjà un compte ?{" "}
                <span onClick={() => setIsLogin(true)}>Se connecter</span>
              </>
            )}
          </p>
        </div>
        <div className="sign-image">
          <img src="/images/sign-up.jpg" alt="Sign up illustration" />
        </div>
      </div>
    </div>
  );
}

export default Login;