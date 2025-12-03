import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Package, ShoppingCart, TrendingUp } from 'lucide-react';
import Footer from '../../../components/layout/Footer';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div dir="rtl" className="flex flex-col min-h-screen">
      <header className="bg-black/20 border-b border-brand-border py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          <Link to="/">
            <img src="/logo.jpeg" alt="AzharStore Logo" className="h-12" />
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
              أهلاً بك في AzharStore
            </h1>
            <p className="text-xl text-brand-gray max-w-2xl mx-auto">
              منصة التجارة الإلكترونية الحديثة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-black/40 border border-brand-border rounded-20 p-8 text-center hover:border-brand-primary/50 transition-all duration-300 hover:-translate-y-1">
              <Package className="w-12 h-12 mx-auto mb-4 text-brand-primary" />
              <h3 className="text-xl font-bold mb-2">إدارة المنتجات</h3>
              <p className="text-brand-secondary">إدارة كاملة لمنتجاتك وصورها</p>
            </div>

            <div className="bg-black/40 border border-brand-border rounded-20 p-8 text-center hover:border-brand-primary/50 transition-all duration-300 hover:-translate-y-1">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-brand-primary" />
              <h3 className="text-xl font-bold mb-2">سهولة البيع</h3>
              <p className="text-brand-secondary">واجهة بسيطة وسهلة الاستخدام</p>
            </div>

            <div className="bg-black/40 border border-brand-border rounded-20 p-8 text-center hover:border-brand-primary/50 transition-all duration-300 hover:-translate-y-1">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-brand-primary" />
              <h3 className="text-xl font-bold mb-2">تحليلات متقدمة</h3>
              <p className="text-brand-secondary">تتبع مبيعاتك ومخزونك</p>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/admin"
              className="inline-block bg-white text-brand-background font-bold px-8 py-3 rounded-lg hover:bg-gray-200 transition-all duration-200 transform hover:scale-105"
            >
              {t('Admin Panel')}
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
