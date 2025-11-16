import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { DataContext } from '../../context/DataContext';
import { productService } from '../../services/api';
import { Plus, Loader2, Upload, X, Image as ImageIcon, ChevronDown, Trash2 } from 'lucide-react';
import Modal from '../../components/Modal';
import Dropdown from '../../components/Dropdown';
import ProductCard from './ProductCard';
import LoadingScreen from '../../components/LoadingScreen';
import ConfirmationModal from '../../components/ConfirmationModal';

const ProductManagement = () => {
  const { t } = useTranslation();
  const {
    products,
    categories,
    isLoading,
    error: dataError,
    addProduct,
    updateProduct,
    removeProduct,
    setProducts // Keep for error recovery on delete
  } = useContext(DataContext);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

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
  const [variants, setVariants] = useState([]);

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants([...variants, { name: '', stock_quantity: 0 }]);
  };

  const removeVariant = (index) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

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
      setVariants(product.product_variants || []);
    } else {
      setFormData(initialFormState);
      setImagePreviews([]);
      setVariants([]);
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

      // Handle variants
      const existingVariants = editingProduct ? editingProduct.product_variants : [];
      const variantPromises = variants.map(variant => {
        if (variant.id) {
          // Update existing variant
          const originalVariant = existingVariants.find(v => v.id === variant.id);
          if (originalVariant.name !== variant.name || originalVariant.stock_quantity !== variant.stock_quantity) {
            return productService.updateVariant(variant.id, { name: variant.name, stock_quantity: variant.stock_quantity });
          }
        } else {
          // Create new variant
          return productService.createVariant(productId, { name: variant.name, stock_quantity: variant.stock_quantity });
        }
        return Promise.resolve();
      });

      // Handle deleted variants
      const deletedVariantPromises = existingVariants
        .filter(ev => !variants.some(v => v.id === ev.id))
        .map(ev => productService.deleteVariant(ev.id));

      await Promise.all([...variantPromises, ...deletedVariantPromises]);

      // Upload images if any selected
      if (selectedImages.length > 0) {
        setUploadingImages(true);
        await Promise.all(selectedImages.map(image => productService.uploadImage(productId, image)));
        setUploadingImages(false);
      }

      // After all API calls, fetch the final state of the product from the backend
      // This ensures the UI has the most up-to-date data, including image URLs, variants, etc.
      const finalProductResponse = await productService.getProduct(productId);
      const finalProduct = finalProductResponse.data;

      if (editingProduct) {
        updateProduct(finalProduct);
      } else {
        addProduct(finalProduct);
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

    const originalProducts = [...products];
    const productToDelete = products.find(p => p.id === deletingProductId);

    // Optimistically remove the product from the UI
    removeProduct(deletingProductId);
    setIsConfirmModalOpen(false);

    try {
      await productService.deleteProduct(deletingProductId);
    } catch (err) {
      setError(t('productManagement.errors.delete'));
      console.error(err);
      // If the delete fails, revert the state
      setProducts(originalProducts);
    } finally {
      setDeletingProductId(null);
    }
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

          <div className="tabs-container">
            <nav className="flex space-x-4" aria-label="Tabs">
              <button
                type="button"
                className={`tab-item ${activeTab === 'details' ? 'active' : ''}`}
                onClick={() => setActiveTab('details')}
              >
                {t('productManagement.tabs.details')}
              </button>
              <button
                type="button"
                className={`tab-item ${activeTab === 'images' ? 'active' : ''}`}
                onClick={() => setActiveTab('images')}
              >
                {t('productManagement.tabs.images')}
              </button>
              <button
                type="button"
                className={`tab-item ${activeTab === 'variants' ? 'active' : ''}`}
                onClick={() => setActiveTab('variants')}
              >
                {t('productManagement.tabs.variants')}
              </button>
            </nav>
          </div>

          <div className={activeTab === 'details' ? '' : 'hidden'}>
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
              <Dropdown
                options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
                value={formData.category_id}
                onChange={(option) => handleFormChange({ target: { name: 'category_id', value: option.value } })}
                placeholder={t('productManagement.form.selectCategory')}
              />
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
                disabled={variants.length > 0}
              />
            </div>
          </div>
        </div>

        <div className={activeTab === 'variants' ? '' : 'hidden'}>
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-medium text-brand-secondary">
                {t('productManagement.form.variants')}
              </label>
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-2 text-sm text-brand-primary hover:text-brand-primary/80 bg-brand-primary/10 hover:bg-brand-primary/20 px-3 py-2 rounded-lg"
              >
                <Plus size={16} /> {t('productManagement.form.addVariant')}
              </button>
            </div>
            <div className="space-y-4">
              {variants.map((variant, index) => (
                <div key={index} className="variant-item">
                  <input
                    type="text"
                    placeholder={t('productManagement.form.variantName')}
                    value={variant.name}
                    onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                    className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                  />
                  <input
                    type="number"
                    placeholder={t('productManagement.form.stock')}
                    value={variant.stock_quantity}
                    onChange={(e) => handleVariantChange(index, 'stock_quantity', parseInt(e.target.value))}
                    className="w-40 bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                  />
                  <button type="button" onClick={() => removeVariant(index)} className="text-red-500 hover:text-red-400">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
            {variants.length > 0 && (
              <div className="mt-4 text-right">
                <span className="text-sm font-medium text-brand-secondary">
                  {t('productManagement.form.totalStock')}:{' '}
                </span>
                <span className="font-bold text-brand-primary">
                  {variants.reduce((acc, v) => acc + (v.stock_quantity || 0), 0)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className={activeTab === 'images' ? '' : 'hidden'}>
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
                    ? t('productManagement.form.imagesSelected', { count: selectedImages.length })
                    : t('productManagement.form.clickToUpload')}
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
                  <span>{uploadingImages ? t('productManagement.uploadingImages') : t('productManagement.saving')}</span>
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
