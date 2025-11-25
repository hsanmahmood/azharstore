import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { DataContext } from '../../context/DataContext';
import { SearchContext } from '../../context/SearchContext';
import { apiService } from '../../services/api';
import SearchBar from '../../components/SearchBar';
import { Plus, Loader2, X, Trash2, Save, Upload, FileArchive, Eye, Star, Download, CheckCircle } from 'lucide-react';
import Modal from '../../components/Modal';
import Dropdown from '../../components/Dropdown';
import ProductCard from './ProductCard';
import LoadingScreen from '../../components/LoadingScreen';
import ConfirmationModal from '../../components/ConfirmationModal';
import ImageUploader from '../../components/ImageUploader';
import ProductImage from '../../components/ProductImage';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';


const ProductManagement = () => {
  const { t } = useTranslation();
  const {
    products,
    categories,
    orders,
    isLoading,
    error: dataError,
    addProduct,
    updateProduct,
    removeProduct,
    setProducts // Keep for error recovery on delete
  } = useContext(DataContext);
  const { searchTerm, setSearchTerm } = useContext(SearchContext);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [orderFilter, setOrderFilter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState('');


  const initialFormState = {
    name: '',
    description: '',
    price: '',
    category_id: '',
    stock_quantity: '',
  };
  const [formData, setFormData] = useState(initialFormState);
  const variants = editingProduct ? editingProduct.product_variants || [] : [];

  const setVariants = (newVariants) => {
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, product_variants: newVariants });
    }
  };

  const handleVariantImageUpload = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const variant = variants[index];
    if (!variant.id) {
      setError("Please save the variant before uploading an image.");
      return;
    }

    setUploadingImages(true);
    try {
      const response = await apiService.uploadVariantImage(variant.id, file);
      const updatedProduct = await apiService.getProduct(editingProduct.id);
      setEditingProduct(updatedProduct.data);
    } catch (err) {
      setError(t('productManagement.errors.uploadError'));
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSaveVariant = async (index) => {
    const variant = variants[index];
    try {
      if (variant.id) {
        await apiService.updateVariant(variant.id, { name: variant.name, stock_quantity: variant.stock_quantity });
      } else {
        await apiService.createVariant(editingProduct.id, { name: variant.name, stock_quantity: variant.stock_quantity });
      }
      const updatedProduct = await apiService.getProduct(editingProduct.id);
      setEditingProduct(updatedProduct.data);
    } catch (err) {
      setError(t('productManagement.errors.updateVariantError'));
    }
  };

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
    if (product) {
      setEditingProduct({
        ...product,
        product_images: product.product_images || [],
        product_variants: product.product_variants || []
      });
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price || '',
        category_id: product.category_id || '',
        stock_quantity: product.stock_quantity || '',
      });
    } else {
      setEditingProduct({ product_images: [], product_variants: [] });
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
    setActiveTab('details');
    setError('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0 || !editingProduct) return;

    const newImages = files.map(file => ({
      id: `new_${Date.now()}_${Math.random()}`,
      file: file,
      image_url: URL.createObjectURL(file),
      is_primary: false
    }));

    // Add new images for preview
    const updatedImages = [...editingProduct.product_images, ...newImages];

    // If no primary image exists, set the first new one as primary
    if (!updatedImages.some(img => img.is_primary)) {
      updatedImages[0].is_primary = true;
    }

    setEditingProduct(prev => ({ ...prev, product_images: updatedImages }));
  };


  const handleRemoveImage = (imageToRemove) => {
    if (!editingProduct) return;
    const updatedImages = editingProduct.product_images.filter(img => img.id !== imageToRemove.id);

    // If the removed image was primary, set a new primary if possible
    if (imageToRemove.is_primary && updatedImages.length > 0) {
      updatedImages[0].is_primary = true;
    }

    setEditingProduct({ ...editingProduct, product_images: updatedImages });
  };

  const handleSetPrimary = (imageToSet) => {
    if (!editingProduct) return;
    const updatedImages = editingProduct.product_images.map(img => ({
      ...img,
      is_primary: img.id === imageToSet.id
    }));
    setEditingProduct({ ...editingProduct, product_images: updatedImages });
  };

  const handleViewImage = (imageUrl) => {
    setLightboxImageUrl(imageUrl);
    setIsLightboxOpen(true);
  };

  const handleDownloadImage = async (image) => {
    const imageUrl = image.file ? URL.createObjectURL(image.file) : image.image_url;
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const fileName = image.image_url ? image.image_url.split('/').pop() : image.file.name;
    saveAs(blob, fileName);
  };

  const handleDownloadAll = async () => {
    if (!editingProduct || editingProduct.product_images.length === 0) return;
    const zip = new JSZip();
    const promises = editingProduct.product_images.map(async (image) => {
      const imageUrl = image.file ? URL.createObjectURL(image.file) : image.image_url;
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const fileName = image.image_url ? image.image_url.split('/').pop() : image.file.name;
      zip.file(fileName, blob);
    });
    await Promise.all(promises);
    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, `${formData.name || 'product'}_images.zip`);
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    let currentProductId = editingProduct?.id;

    // 1. Create or Update Product Details
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        category_id: formData.category_id ? parseInt(formData.category_id) : null,
      };

      if (currentProductId) {
        const updated = await apiService.updateProduct(currentProductId, payload);
        updateProduct(updated.data);
      } else {
        const newProd = await apiService.createProduct(payload);
        addProduct(newProd.data);
        currentProductId = newProd.data.id;
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save product details.');
      setIsSubmitting(false);
      return;
    }

    // 2. Upload New Images
    try {
      const newImageFiles = editingProduct.product_images.filter(img => img.file);
      if (newImageFiles.length > 0) {
        setUploadingImages(true);
        const uploadPromises = newImageFiles.map(img => apiService.uploadImage(currentProductId, img.file));
        await Promise.all(uploadPromises);
      }
    } catch (err) {
      setError('Failed to upload new images.');
      // Continue to update other things
    } finally {
      setUploadingImages(false);
    }

    // 3. Update Image Metadata (Primary status and removals)
    try {
      const finalProductState = await apiService.getProduct(currentProductId);
      const existingImages = finalProductState.data.product_images;
      const clientImageIds = editingProduct.product_images.filter(img => !img.file).map(img => img.id);

      const imagesToUpdate = editingProduct.product_images
        .filter(img => !img.file)
        .map(img => ({ id: img.id, is_primary: img.is_primary }));

      // Add a default primary if none is set
      if (imagesToUpdate.length > 0 && !imagesToUpdate.some(img => img.is_primary)) {
        imagesToUpdate[0].is_primary = true;
      }

      const updatePayload = {
        product_images: imagesToUpdate,
        // Also send variant updates
        product_variants: variants.map(({ id, name, stock_quantity, image_url, price }) => ({
            id, name, price: price ?? 0, stock_quantity, image_url,
        })),
      };

      const updatedProduct = await apiService.updateProduct(currentProductId, updatePayload);
      updateProduct(updatedProduct.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update image metadata.');
    }

    setIsSubmitting(false);
    closeModal();
  };

  const openDeleteConfirm = (id) => {
    setDeletingProductId(id);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProductId) return;

    const originalProducts = [...products];
    // Optimistically remove the product from the UI
    removeProduct(deletingProductId);
    setIsConfirmModalOpen(false);

    try {
      await apiService.deleteProduct(deletingProductId);
    } catch (err) {
      setError(t('productManagement.errors.delete'));
      console.error(err);
      // If the delete fails, revert the state
      setProducts(originalProducts);
    } finally {
      setDeletingProductId(null);
    }
  };

  const filteredProducts = products.filter(product => {
    const searchMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = selectedCategory ? product.category_id === selectedCategory : true;

    const productHasOrders = orders.some(order => order.order_items.some(item => item.product_id === product.id));
    const orderMatch = orderFilter ? (orderFilter === 'with-orders' ? productHasOrders : !productHasOrders) : true;

    return searchMatch && categoryMatch && orderMatch;
  });

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

      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <Dropdown
          options={[{ value: null, label: t('common.allCategories') }, ...categories.map(c => ({ value: c.id, label: c.name }))]}
          value={selectedCategory}
          onChange={(option) => setSelectedCategory(option.value)}
          placeholder={t('common.filterByCategory')}
        />
        <Dropdown
          options={[
            { value: null, label: t('common.allProducts') },
            { value: 'with-orders', label: t('common.productsWithOrders') },
            { value: 'without-orders', label: t('common.productsWithoutOrders') },
          ]}
          value={orderFilter}
          onChange={(option) => setOrderFilter(option.value)}
          placeholder={t('common.filterByOrders')}
        />
      </div>

      {dataError && !isModalOpen && (
        <div className="bg-red-900/20 border border-red-500/30 text-red-300 p-4 rounded-lg mb-6">
          {dataError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
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
        maxWidth="max-w-5xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-900/20 border border-red-500/30 text-red-300 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="tabs-container">
            <nav className="flex space-x-4 border-b border-soft-border" aria-label="Tabs">
              <button
                type="button"
                className={`py-2 px-4 text-base font-semibold transition-colors duration-200 ${activeTab === 'details' ? 'text-brand-purple border-b-2 border-brand-purple' : 'text-text-light hover:text-brand-purple'}`}
                onClick={() => setActiveTab('details')}
              >
                {t('productManagement.tabs.details')}
              </button>
              <button
                type="button"
                className={`py-2 px-4 text-base font-semibold transition-colors duration-200 ${activeTab === 'images' ? 'text-brand-purple border-b-2 border-brand-purple' : 'text-text-light hover:text-brand-purple'}`}
                onClick={() => setActiveTab('images')}
              >
                {t('productManagement.tabs.images')}
              </button>
              <button
                type="button"
                className={`py-2 px-4 text-base font-semibold transition-colors duration-200 ${activeTab === 'variants' ? 'text-brand-purple border-b-2 border-brand-purple' : 'text-text-light hover:text-brand-purple'}`}
                onClick={() => setActiveTab('variants')}
              >
                {t('productManagement.tabs.variants')}
              </button>
            </nav>
          </div>

          <div className="pt-4">
            <div className={`${activeTab === 'details' ? '' : 'hidden'} space-y-6`}>
              {/* DETAILS FORM */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  className="w-full bg-brand-white border border-soft-border text-text-dark p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/50 placeholder-text-light"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-text-light mb-2">
                  {t('productManagement.form.category')}
                </label>
                <Dropdown
                  options={categories.filter(cat => cat && cat.name).map((cat) => ({ value: cat.id, label: cat.name }))}
                  value={formData.category_id}
                  onChange={(option) => handleFormChange({ target: { name: 'category_id', value: option.value } })}
                  placeholder={t('productManagement.form.selectCategory')}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-light mb-2">
                {t('productManagement.form.description')}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                rows="3"
                className="w-full bg-brand-white border border-soft-border text-text-dark p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/50 placeholder-text-light"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-light mb-2">
                  {t('productManagement.form.price')}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    required
                    className="w-full bg-brand-white border border-soft-border text-text-dark p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/50 pl-12 placeholder-text-light"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light">
                    د.ب
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-light mb-2">
                  {t('productManagement.form.stock')}
                </label>
                <input
                  type="number"
                  name="stock_quantity"
                  value={formData.stock_quantity}
                  onChange={handleFormChange}
                  className="w-full bg-brand-white border border-soft-border text-text-dark p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/50 placeholder-text-light"
                  disabled={variants.length > 0}
                />
              </div>
            </div>
            </div>

            <div className={`${activeTab === 'images' ? '' : 'hidden'}`}>
              {/* IMAGES FORM */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-brand-purple">{t('productManagement.form.galleryImages')}</h3>
                <button
                    type="button"
                    onClick={handleDownloadAll}
                    disabled={!editingProduct?.product_images || editingProduct.product_images.length === 0}
                    className="flex items-center gap-2 text-sm text-brand-purple bg-brand-purple/10 hover:bg-brand-purple/20 px-3 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FileArchive size={16} />
                    {t('productManagement.form.downloadAll')}
                </button>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4">
                {editingProduct?.product_images.map((image) => (
                  <ProductImage
                    key={image.id}
                    image={image}
                    isPrimary={image.is_primary}
                    onRemove={handleRemoveImage}
                    onSetPrimary={handleSetPrimary}
                    onView={handleViewImage}
                    onDownload={handleDownloadImage}
                  />
                ))}
                <ImageUploader
                  onUpload={handleImageUpload}
                  uploading={uploadingImages}
                  multiple
                  size="aspect-square w-full"
                />
              </div>
            </div>

            <div className={`${activeTab === 'variants' ? '' : 'hidden'} variants-container`}>
             {/* VARIANTS FORM */}
             <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-brand-purple">{t('productManagement.form.variants')}</h3>
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center gap-2 text-sm text-brand-purple bg-brand-purple/10 hover:bg-brand-purple/20 px-3 py-2 rounded-lg transition-colors"
              >
                <Plus size={16} /> {t('productManagement.form.addVariant')}
              </button>
            </div>

            <div className="space-y-4">
              {/* Header */}
              <div className="variant-item header text-text-light">
                <div className="w-20 text-center">{t('productManagement.form.image')}</div>
                <div className="flex-1 px-2">{t('productManagement.form.variantName')}</div>
                <div className="w-32 px-2">{t('productManagement.form.stock')}</div>
                <div className="w-28 text-center">{t('common.actions')}</div>
              </div>

              {/* Variant Rows */}
              {variants.map((variant, index) => (
                <div key={index} className="variant-item">
                  <div className="w-20 flex justify-center">
                    <ImageUploader
                      onUpload={(e) => handleVariantImageUpload(index, e)}
                      preview={variant.image_url}
                      uploading={uploadingImages}
                      size="h-12 w-12"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder={t('productManagement.form.variantName')}
                    value={variant.name}
                    onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                    className="flex-1 bg-brand-white border border-soft-border text-text-dark p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/50 placeholder-text-light"
                  />
                  <input
                    type="number"
                    placeholder={t('productManagement.form.stock')}
                    value={variant.stock_quantity}
                    onChange={(e) => handleVariantChange(index, 'stock_quantity', parseInt(e.target.value) || 0)}
                    className="w-32 bg-brand-white border border-soft-border text-text-dark p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/50 placeholder-text-light"
                  />
                  <div className="w-28 flex justify-center items-center gap-2">
                    <button type="button" onClick={() => handleSaveVariant(index)} className="text-green-500 hover:text-green-400 bg-green-500/10 hover:bg-green-500/20 p-2 rounded-lg relative">
                      {variant.id && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green-500"></span>}
                      <Save size={18} />
                    </button>
                    <button type="button" onClick={() => removeVariant(index)} className="text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 p-2 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                  </div>
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
                  <Loader2 className="animate-spin mr-2" />
                  <span>{uploadingImages ? t('productManagement.uploadingImages') : t('productManagement.saving')}</span>
                </>
              ) : (
                t('common.save')
              )}
            </button>
          </div>
        </form>
      </Modal>

      {isLightboxOpen && (
        <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
            onClick={() => setIsLightboxOpen(false)}
        >
            <img src={lightboxImageUrl} alt="Product full view" className="max-w-[90vw] max-h-[90vh] object-contain"/>
            <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2"
            >
                <X size={24} />
            </button>
        </div>
      )}

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
