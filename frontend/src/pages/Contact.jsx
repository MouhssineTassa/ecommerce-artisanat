import React, { useState } from 'react';
import '../styles/Contact.css';

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const contactInfo = {
    email: 'contact@menuisierart.com',
    phone: '+212 600-000000',
    location: 'Maroc'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1 className="contact-title">Contactez-nous</h1>
        <p className="contact-subtitle">Prêt à discuter de vos besoins ? Prenons contact !</p>
      </div>

      <div className="contact-container">
        <div className="contact-content">
          <div className="left-section">
            <h2 className="section-title">Travaillons ensemble</h2>
            <p className="section-description">
              Nous sommes toujours intéressés à échanger sur vos projets d'artisanat.
              N'hésitez pas à nous contacter !
            </p>
            
            <div className="info-list">
              <div className="info-item">
                <div className="info-icon">📧</div>
                <span>{contactInfo.email}</span>
              </div>
              <div className="info-item">
                <div className="info-icon">📞</div>
                <span>{contactInfo.phone}</span>
              </div>
              <div className="info-item">
                <div className="info-icon">📍</div>
                <span>{contactInfo.location}</span>
              </div>
            </div>
          </div>

          <div className="right-section">
            <div className="form-wrapper">
              <h2 className="form-title">Envoyez un message</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Nom complet</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea
                    className="form-textarea"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="submit-button">
                  Envoyer le message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;