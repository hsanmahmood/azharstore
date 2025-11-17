import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { DataContext } from '../../context/DataContext';
import { productService } from '../../services/api';
import { Plus, Loader2, Upload, X, Image as ImageIcon, ChevronDown, Trash2, Save } from 'lucide-react';
import Modal from '../../components/Modal';
import Dropdown from '../../components/Dropdown';
import ProductCard from './ProductCard';
import LoadingScreen from '../../components/LoadingScreen';
import ConfirmationModal from '../../components/ConfirmationModal';
import ImageUploader from '../../components/ImageUploader';

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
  const [imagePreviews, setImagePreviews] = useState([]);
  const [primaryImage, setPrimaryImage] = useState(null);
  const variants = editingProduct ? editingProduct.product_variants || [] : [];

  const setVariants = (newVariants) => {
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, product_variants: newVariants });
    }
  };

  const handlePrimaryImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImages(true);
    setError('');

    let currentProductId = editingProduct ? editingProduct.id : null;

    if (!currentProductId) {
      try {
        const draftPayload = {
          name: formData.name || t('productManagement.form.draftName'),
          price: parseFloat(formData.price) || 0,
        };
        const productResponse = await productService.createProduct(draftPayload);
        currentProductId = productResponse.data.id;
        setEditingProduct(productResponse.data);
        addProduct(productResponse.data);
      } catch (err) {
        setError(t('productManagement.errors.draftError'));
        setUploadingImages(false);
        return;
      }
    }

    try {
      await productService.uploadImage(currentProductId, file);

      // Fetch the updated product to get all images, including the new primary one
      const updatedProductResponse = await productService.getProduct(currentProductId);
      const updatedImages = updatedProductResponse.data.product_images;

      const primaryImg = updatedImages.find(img => img.is_primary);
      setPrimaryImage(primaryImg ? primaryImg.image_url : null);

      // Update the gallery previews as well
      setImagePreviews(updatedImages.filter(img => !img.is_primary).map(img => img.image_url));

    } catch (err) {
      setError(t('productManagement.errors.uploadError'));
    } finally {
      setUploadingImages(false);
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
      const response = await productService.uploadVariantImage(variant.id, file);
      const updatedProduct = await productService.getProduct(editingProduct.id);
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
        await productService.updateVariant(variant.id, { name: variant.name, stock_quantity: variant.stock_quantity });
      } else {
        await productService.createVariant(editingProduct.id, { name: variant.name, stock_quantity: variant.stock_quantity });
      }
      const updatedProduct = await productService.getProduct(editingProduct.id);
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
    setEditingProduct(product);
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price || '',
        category_id: product.category_id || '',
        stock_quantity: product.stock_quantity || '',
      });
      const primaryImg = product.product_images.find(img => img.is_primary);
      setPrimaryImage(primaryImg ? primaryImg.image_url : null);
      setImagePreviews(product.product_images.filter(img => !img.is_primary).map(img => img.image_url));
    } else {
      setEditingProduct({ product_variants: [] }); // Initialize with empty variants
      setFormData(initialFormState);
      setImagePreviews([]);
    }
    setIsModalOpen(true);
  };

  const removeImage = async (imageUrlToRemove, isPrimary = false) => {
    if (!editingProduct || !editingProduct.product_images) return;

    const imageToRemove = editingProduct.product_images.find(img => img.image_url === imageUrlToRemove);
    if (!imageToRemove) return;

    try {
      await productService.deleteImage(imageToRemove.id);

      const updatedImages = editingProduct.product_images.filter(img => img.id !== imageToRemove.id);

      if (isPrimary) {
        setPrimaryImage(null);
      }

      setEditingProduct({ ...editingProduct, product_images: updatedImages });

      const newPrimary = updatedImages.find(img => img.is_primary);
      const newPrimaryUrl = newPrimary ? newPrimary.image_url : (updatedImages.length > 0 ? updatedImages[0].image_url : null);

      setPrimaryImage(newPrimaryUrl);
      setImagePreviews(updatedImages.filter(img => img.image_url !== newPrimaryUrl).map(img => img.image_url));

    } catch (err) {
      setError(t('productManagement.errors.deleteImageError'));
      console.error("Failed to delete image:", err);
    }
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
    if (files.length === 0) return;

    setUploadingImages(true);
    setError('');

    let currentProductId = editingProduct ? editingProduct.id : null;

    // If it's a new product, create a draft first
    if (!currentProductId) {
      try {
        const draftPayload = {
          name: formData.name || t('productManagement.form.draftName'),
          price: parseFloat(formData.price) || 0,
        };
        const productResponse = await productService.createProduct(draftPayload);
        currentProductId = productResponse.data.id;
        setEditingProduct(productResponse.data);
        addProduct(productResponse.data);
      } catch (err) {
        setError(t('productManagement.errors.draftError'));
        setUploadingImages(false);
        return;
      }
    }

    // Upload images one by one
    try {
      const uploadPromises = files.map(file => productService.uploadImage(currentProductId, file));
      const responses = await Promise.all(uploadPromises);
      const newImages = responses.map(res => res.data);

      const updatedProduct = await productService.getProduct(currentProductId);
      setEditingProduct(updatedProduct.data);

      const updatedImages = updatedProduct.data.product_images;
      const primaryImg = updatedImages.find(img => img.is_primary);

      setPrimaryImage(primaryImg ? primaryImg.image_url : null);
      setImagePreviews(updatedImages.filter(img => !img.is_primary).map(img => img.image_url));
    } catch (err) {
      setError(t('productManagement.errors.uploadError'));
    } finally {
      setUploadingImages(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.id) {
        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                stock_quantity: parseInt(formData.stock_quantity) || 0,
                category_id: formData.category_id ? parseInt(formData.category_id) : null,
            };
            const productResponse = await productService.createProduct(payload);

            const newProductId = productResponse.data.id;
            const variantPromises = variants.map(variant =>
                productService.createVariant(newProductId, { name: variant.name, stock_quantity: variant.stock_quantity })
            );
            await Promise.all(variantPromises);

            const finalProduct = await productService.getProduct(newProductId);
            addProduct(finalProduct.data);
            closeModal();
        } catch (err) {
            setError(t('productManagement.errors.add'));
            console.error("Failed to create product:", err.response ? err.response.data : err);
        }
        return;
    }

    setIsSubmitting(true);
    setError('');

    try {
        const allImages = editingProduct.product_images || [];
        const primaryImageObject = allImages.find(img => img.image_url === primaryImage);
        const imagesPayload = allImages.map(img => ({
            id: img.id,
            is_primary: primaryImageObject ? img.id === primaryImageObject.id : false,
        }));

        const payload = {
            ...formData,
            price: parseFloat(formData.price),
            stock_quantity: parseInt(formData.stock_quantity) || 0,
            category_id: formData.category_id ? parseInt(formData.category_id) : null,
            product_images: imagesPayload,
            product_variants: variants.map(({ id, name, stock_quantity, image_url }) => ({
                id,
                name,
                stock_quantity,
                image_url,
            })),
        };

        const updatedProduct = await productService.updateProduct(editingProduct.id, payload);
        updateProduct(updatedProduct.data);
        closeModal();
    } catch (err) {
        setError(t('productManagement.errors.update'));
        console.error("Failed to update product:", err.response ? err.response.data : err);
    } finally {
        setIsSubmitting(false);
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

          <div className={`${activeTab === 'details' ? '' : 'hidden'} space-y-6`}>
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
                className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-brand-secondary mb-2">
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
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleFormChange}
                  required
                  className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50 pl-12"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-secondary">
                  د.ب
                </span>
              </div>
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

        <div className={`${activeTab === 'variants' ? '' : 'hidden'} variants-container`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-brand-primary">{t('productManagement.form.variants')}</h3>
            <button
              type="button"
              onClick={addVariant}
              className="flex items-center gap-2 text-sm text-brand-primary bg-brand-primary/10 hover:bg-brand-primary/20 px-3 py-2 rounded-lg transition-colors"
            >
              <Plus size={16} /> {t('productManagement.form.addVariant')}
            </button>
          </div>

          <div className="space-y-4">
            {/* Header */}
            <div className="variant-item header">
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
                  className="flex-1 bg-black/30 border border-brand-border text-brand-primary p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                />
                <input
                  type="number"
                  placeholder={t('productManagement.form.stock')}
                  value={variant.stock_quantity}
                  onChange={(e) => handleVariantChange(index, 'stock_quantity', parseInt(e.target.value) || 0)}
                  className="w-32 bg-black/30 border border-brand-border text-brand-primary p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
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

        <div className={activeTab === 'images' ? '' : 'hidden'}>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-brand-primary mb-4">{t('productManagement.form.primaryImage')}</h3>
              <div className="relative w-40 h-40">
                <ImageUploader
                  onUpload={handlePrimaryImageUpload}
                  preview={primaryImage}
                  uploading={uploadingImages}
                  size="h-40 w-40"
                />
                {primaryImage && (
                  <button
                    type="button"
                    onClick={() => removeImage(primaryImage, true)}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white shadow-lg"
                    aria-label={t('common.remove')}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            <hr className="border-brand-border" />

            <div>
              <h3 className="text-lg font-medium text-brand-primary mb-4">{t('productManagement.form.galleryImages')}</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative w-24 h-24">
                    <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover rounded-lg" />
                    <button type="button" onClick={() => removeImage(preview)} className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white shadow-lg">
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <ImageUploader
                  onUpload={handleImageUpload}
                  uploading={uploadingImages}
                  multiple
                  size="h-24 w-24"
                />
              </div>
            </div>
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
