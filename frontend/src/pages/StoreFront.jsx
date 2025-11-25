import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Globe, Search, X, Instagram } from 'lucide-react';
import CategorySlider from '../components/CategorySlider';
import ProductGrid from '../components/ProductGrid';
import { apiService } from '../services/api';

const StoreFront = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Fetch categories and products on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesData, productsResponse] = await Promise.all([
          apiService.getAllCategories(),
          apiService.getAllProducts()
        ]);

        setCategories(categoriesData);
        setProducts(productsResponse.data || []);
        setFilteredProducts(productsResponse.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setCategories([]);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products when category or search changes
  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category_id === selectedCategory);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, searchTerm, products]);

  const clearSearch = () => {
    setSearchTerm('');
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div className="min-h-screen bg-primary-background">
      {/* Header */}
      <header className="border-b bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center min-w-0 flex-1">
            <div className="bg-brand-purple text-white px-4 py-2 rounded-lg font-bold text-xl h-20 flex items-center">
              أزهار ستور
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            {/* Instagram */}
            <button className="inline-flex items-center justify-center gap-2 h-10 px-5 border border-border-gray bg-white text-text-gray rounded-md hover:bg-soft-hover hover:border-brand-purple transition-all duration-200">
              <span className="text-sm font-bold">Instagram</span>
              <Instagram className="h-4 w-4" />
            </button>

            {/* Language */}
            <button className="inline-flex items-center justify-center gap-2 h-10 px-5 border border-border-gray bg-white text-text-gray rounded-md hover:bg-soft-hover hover:border-brand-purple transition-all duration-200">
              <span className="text-sm font-bold">العربية</span>
              <Globe className="h-4 w-4" />
            </button>

            {/* Cart */}
            <button className="relative inline-flex items-center justify-center gap-2 h-10 px-5 border border-border-gray bg-white text-text-gray rounded-md hover:bg-soft-hover hover:border-brand-purple transition-all duration-200">
              <span className="text-sm font-bold">السلة</span>
              <ShoppingCart className="h-4 w-4" />
              <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Search + Categories */}
      <div className="border-b bg-gray-50/50">
        <div className="container mx-auto px-3 py-6 space-y-4">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto w-full relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="البحث في المنتجات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 h-12 text-base bg-white border border-soft-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            <CategorySlider
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryClick={handleCategoryClick}
              loading={loading}
            />
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <main className="container mx-auto px-3 py-8">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-border-gray shadow-sm overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-3 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  <div className="flex items-center justify-between">
                    <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-light text-lg">لا توجد منتجات</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <ProductGrid products={filteredProducts} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-soft-border mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-text-light text-sm">
          <p>© 2025 أزهار ستور. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
};

export default StoreFront;
