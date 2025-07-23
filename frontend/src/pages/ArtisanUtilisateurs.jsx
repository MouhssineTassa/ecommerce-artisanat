import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useTranslation } from 'react-i18next';

// Loader animé simple
function Loader() {
  const { t } = useTranslation();
  return (
    <div className="flex justify-center items-center py-4">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
      <span className="ml-2 text-green-700">{t('loading')}</span>
    </div>
  );
}

function ArtisanUtilisateurs() {
  const { t } = useTranslation();
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [showAvisModal, setShowAvisModal] = useState(false);
  const [avis, setAvis] = useState([]);
  const [avisLoading, setAvisLoading] = useState(false);
  const [avisError, setAvisError] = useState(null);

  const fetchUtilisateurs = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/artisan/utilisateurs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUtilisateurs(res.data);
    } catch (err) {
      setError(t('error_loading_users'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUtilisateurs();
    // eslint-disable-next-line
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(t('confirm_delete_user'))) return;
    setDeletingId(id);
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/artisan/utilisateurs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUtilisateurs(utilisateurs.filter(u => u._id !== id));
    } catch (err) {
      alert(t('error_deleting_user'));
    } finally {
      setDeletingId(null);
    }
  };

  const handleShowOrders = async (user) => {
    setSelectedUser(user);
    setShowOrdersModal(true);
    setOrders([]);
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await api.get(`/artisan/utilisateurs/${user._id}/commandes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      setOrdersError(t('error_loading_orders'));
    } finally {
      setOrdersLoading(false);
    }
  };

  const closeOrdersModal = () => {
    setShowOrdersModal(false);
    setSelectedUser(null);
    setOrders([]);
    setOrdersError(null);
  };

  const handleShowAvis = async (user) => {
    setSelectedUser(user);
    setShowAvisModal(true);
    setAvis([]);
    setAvisLoading(true);
    setAvisError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await api.get(`/artisan/utilisateurs/${user._id}/avis`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAvis(res.data);
    } catch (err) {
      setAvisError(t('error_loading_reviews'));
    } finally {
      setAvisLoading(false);
    }
  };

  const closeAvisModal = () => {
    setShowAvisModal(false);
    setSelectedUser(null);
    setAvis([]);
    setAvisError(null);
  };

  return (
    <div className="p-2 sm:p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-green-800">{t('user_management')}</h1>
      <div className="bg-white rounded-lg shadow-md p-2 sm:p-6">
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 text-sm sm:text-base">
              <thead>
                <tr>
                  <th className="py-2 px-2 sm:px-4 border-b text-left bg-green-50">{t('name')}</th>
                  <th className="py-2 px-2 sm:px-4 border-b text-left bg-green-50">{t('email')}</th>
                  <th className="py-2 px-2 sm:px-4 border-b text-left bg-green-50">{t('role')}</th>
                  <th className="py-2 px-2 sm:px-4 border-b text-left bg-green-50">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {utilisateurs.filter(u => u.role === 'client').map((u) => (
                  <tr key={u._id} className="hover:bg-green-50 transition-colors duration-200">
                    <td className="py-2 px-2 sm:px-4 border-b font-medium">{u.nom}</td>
                    <td className="py-2 px-2 sm:px-4 border-b">{u.email}</td>
                    <td className="py-2 px-2 sm:px-4 border-b capitalize">{u.role}</td>
                    <td className="py-2 px-2 sm:px-4 border-b space-x-1 sm:space-x-2 flex flex-col sm:flex-row gap-1 sm:gap-0">
                      <button
                        className="bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-all duration-200"
                        onClick={() => handleShowOrders(u)}
                      >
                        {t('purchase_history')}
                      </button>
                      <button
                        className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded hover:bg-yellow-200 transition-all duration-200"
                        onClick={() => handleShowAvis(u)}
                      >
                        {t('reviews_notes')}
                      </button>
                      <button
                        className={`bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 transition-all duration-200 disabled:opacity-50 ${deletingId === u._id ? 'cursor-not-allowed' : ''}`}
                        onClick={() => handleDelete(u._id)}
                        disabled={deletingId === u._id}
                      >
                        {deletingId === u._id ? <Loader /> : t('delete')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal historique achats */}
      {showOrdersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-2xl relative animate-fade-in">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl transition-colors duration-200"
              onClick={closeOrdersModal}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-green-800">{t('purchase_history_of', { name: selectedUser?.nom })}</h2>
            {ordersLoading ? (
              <Loader />
            ) : ordersError ? (
              <div className="text-red-500">{ordersError}</div>
            ) : orders.length === 0 ? (
              <div>{t('no_orders')}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 text-sm sm:text-base">
                  <thead>
                    <tr>
                      <th className="py-2 px-2 sm:px-4 border-b bg-green-50">{t('date')}</th>
                      <th className="py-2 px-2 sm:px-4 border-b bg-green-50">{t('products')}</th>
                      <th className="py-2 px-2 sm:px-4 border-b bg-green-50">{t('total')} (€)</th>
                      <th className="py-2 px-2 sm:px-4 border-b bg-green-50">{t('status')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-green-50 transition-colors duration-200">
                        <td className="py-2 px-2 sm:px-4 border-b">{new Date(order.date_creation).toLocaleDateString()}</td>
                        <td className="py-2 px-2 sm:px-4 border-b">
                          <ul className="list-disc ml-4">
                            {order.produits.map((item, idx) => (
                              <li key={idx}>
                                {item.produit?.nom || t('product_deleted')} x {item.quantite}
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="py-2 px-2 sm:px-4 border-b">{order.prix_total.toFixed(2)}</td>
                        <td className="py-2 px-2 sm:px-4 border-b capitalize">{order.statut}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal avis & notes */}
      {showAvisModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-2xl relative animate-fade-in">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl transition-colors duration-200"
              onClick={closeAvisModal}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-green-800">{t('reviews_notes_of', { name: selectedUser?.nom })}</h2>
            {avisLoading ? (
              <Loader />
            ) : avisError ? (
              <div className="text-red-500">{avisError}</div>
            ) : avis.length === 0 ? (
              <div>{t('no_reviews')}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 text-sm sm:text-base">
                  <thead>
                    <tr>
                      <th className="py-2 px-2 sm:px-4 border-b bg-green-50">{t('product')}</th>
                      <th className="py-2 px-2 sm:px-4 border-b bg-green-50">{t('note')}</th>
                      <th className="py-2 px-2 sm:px-4 border-b bg-green-50">{t('comment')}</th>
                      <th className="py-2 px-2 sm:px-4 border-b bg-green-50">{t('date')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {avis.map((a) => (
                      <tr key={a._id} className="hover:bg-green-50 transition-colors duration-200">
                        <td className="py-2 px-2 sm:px-4 border-b">{a.produit?.nom || t('product_deleted')}</td>
                        <td className="py-2 px-2 sm:px-4 border-b">{a.note} / 5</td>
                        <td className="py-2 px-2 sm:px-4 border-b">{a.commentaire || '-'}</td>
                        <td className="py-2 px-2 sm:px-4 border-b">{new Date(a.date_creation).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ArtisanUtilisateurs; 