import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { DataContext } from '../../context/DataContext';
import { productService } from '../../services/api';
import { Plus, Loader2, Upload, X, Image as ImageIcon, ChevronDown } from 'lucide-react';
import Modal from '../../components/Modal';
import ProductCard from './ProductCard';
import LoadingScreen from '../../components/LoadingScreen';
import ConfirmationModal from '../../components/ConfirmationModal';

const ProductManagement = () => {
  const { t } = useTranslation();
  const { products, setProducts, categories, isLoading, error: dataError, refreshData } = useContext(DataContext);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  const initialFormState = {
    name: '',
    description: '',
    price: '',
    category_id: '',
    stock_quantity: '',
  };
  const [formData, setFormData] = useState(initialFormState);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const openModal = (product = null) => {
    setEditingProduct(product);
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        category_id: product.category_id || '',
        stock_quantity: product.stock_quantity || 0,
      });
      setImagePreviews(product.product_images.map(img => img.image_url));
    } else {
      setFormData(initialFormState);
      setImagePreviews([]);
    }
    setSelectedImages([]);
    setIsModalOpen(true);
  };

  const removeImage = (index) => {
    const newImages = [...selectedImages];
    const newPreviews = [...imagePreviews];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setSelectedImages([]);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
      };

      let productResponse;
      if (editingProduct) {
        productResponse = await productService.updateProduct(editingProduct.id, payload);
      } else {
        productResponse = await productService.createProduct(payload);
      }

      const productId = productResponse.data.id;

      // Upload images if any selected
      if (selectedImages.length > 0) {
        setUploadingImages(true);
        for (const image of selectedImages) {
          await productService.uploadImage(productId, image);
        }
        setUploadingImages(false);
      }

      if (editingProduct) {
        setProducts(products.map(p => p.id === editingProduct.id ? productResponse.data : p));
      } else {
        setProducts([productResponse.data, ...products]);
      }
      closeModal();
    } catch (err) {
      setError(t(editingProduct ? 'productManagement.errors.update' : 'productManagement.errors.add'));
      console.error(err);
    } finally {
      setIsSubmitting(false);
      setUploadingImages(false);
    }
  };

  const openDeleteConfirm = (id) => {
    setDeletingProductId(id);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProductId) return;
    setIsConfirmModalOpen(false);

    setProducts(prev => prev.map(p => p.id === deletingProductId ? { ...p, deleting: true } : p));

    setTimeout(async () => {
      try {
        await productService.deleteProduct(deletingProductId);
        setProducts(prev => prev.filter(p => p.id !== deletingProductId));
      } catch (err) {
        setError(t('productManagement.errors.delete'));
        console.error(err);
        await refreshData();
      } finally {
        setDeletingProductId(null);
      }
    }, 300);
  };

  if (isLoading) return <LoadingScreen fullScreen={false} />;

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-brand-primary">{t('productManagement.title')}</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-brand-primary text-brand-background font-bold py-2.5 px-5 rounded-lg hover:bg-opacity-90 transition-all duration-200 transform active:scale-95"
        >
          <Plus size={20} /> {t('productManagement.addProduct')}
        </button>
      </div>

      {dataError && !isModalOpen && (
        <div className="bg-red-900/20 border border-red-500/30 text-red-300 p-4 rounded-lg mb-6">
          {dataError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={openModal}
            onDelete={openDeleteConfirm}
          />
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingProduct ? t('productManagement.editProduct') : t('productManagement.addProduct')}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-900/20 border border-red-500/30 text-red-300 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-secondary mb-2">
                {t('productManagement.form.name')}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
                className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-brand-secondary mb-2">
                {t('productManagement.form.category')}
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleFormChange}
                className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 appearance-none"
              >
                <option value="">{t('productManagement.form.selectCategory')}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute bottom-0 left-0 flex items-center px-3 pb-3">
                <ChevronDown className="h-5 w-5 text-brand-secondary" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-secondary mb-2">
              {t('productManagement.form.description')}
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              rows="3"
              className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-secondary mb-2">
                {t('productManagement.form.price')}
              </label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleFormChange}
                required
                className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-secondary mb-2">
                {t('productManagement.form.stock')}
              </label>
              <input
                type="number"
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleFormChange}
                className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-secondary mb-2">
              {t('productManagement.form.images')}
            </label>
            <div className="grid grid-cols-3 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img src={preview} alt={`Preview ${index}`} className="w-full h-24 object-cover rounded-lg" />
                  <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-black/50 rounded-full p-1 text-white">
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            <label className="mt-4 flex justify-center items-center w-full h-32 px-6 border-2 border-brand-border border-dashed rounded-lg cursor-pointer hover:border-brand-primary/50 transition-colors">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-10 w-10 text-brand-secondary" />
                <p className="text-sm text-brand-secondary">
                  {selectedImages.length > 0
                    ? `${selectedImages.length} images selected`
                    : 'Click to upload images'}
                </p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                className="sr-only"
              />
            </label>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            {!isSubmitting && (
              <button
                type="button"
                onClick={closeModal}
                className="bg-brand-border/10 hover:bg-brand-border/20 text-brand-primary font-bold py-2.5 px-5 rounded-lg transition-colors"
              >
                {t('common.cancel')}
              </button>
            )}
            <button
              type="submit"
              className="bg-brand-primary hover:bg-opacity-90 text-brand-background font-bold py-2.5 px-5 rounded-lg transition-colors transform active:scale-95 flex items-center justify-center min-w-[120px]"
              disabled={isSubmitting || uploadingImages}
            >
              {isSubmitting || uploadingImages ? (
                <>
                  <Loader2 className="animate-spin ml-2" />
                  <span>{uploadingImages ? 'جاري رفع الصور...' : 'جاري الحفظ...'}</span>
                </>
              ) : (
                t('common.save')
              )}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={t('common.delete')}
        message={t('productManagement.confirmDelete')}
      />
    </>
  );
};

export default ProductManagement;
