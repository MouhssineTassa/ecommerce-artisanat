import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      users: 'Utilisateurs',
      products: 'Produits',
      orders: 'Commandes',
      logout: 'Déconnexion',
      dashboard: 'Tableau de bord',
      categories: 'Catégories',
      reviews: 'Avis',
      add_product: 'Ajouter un produit',
      search: 'Rechercher...',
      no_data: 'Aucune donnée',
      loading: 'Chargement...'
    }
  },
  en: {
    translation: {
      users: 'Users',
      products: 'Products',
      orders: 'Orders',
      logout: 'Logout',
      dashboard: 'Dashboard',
      categories: 'Categories',
      reviews: 'Reviews',
      add_product: 'Add product',
      search: 'Search...',
      no_data: 'No data',
      loading: 'Loading...'
    }
  },
  ar: {
    translation: {
      users: 'المستخدمون',
      products: 'المنتجات',
      orders: 'الطلبات',
      logout: 'تسجيل الخروج',
      dashboard: 'لوحة التحكم',
      categories: 'الفئات',
      reviews: 'المراجعات',
      add_product: 'إضافة منتج',
      search: 'بحث...',
      no_data: 'لا توجد بيانات',
      loading: 'جار التحميل...'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr',
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 