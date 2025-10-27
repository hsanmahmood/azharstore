import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus } from 'lucide-react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/productService';
import { getCategories } from '../../services/categoryService';
import Section from '../../components/ui/Section';
import DataTable from '../../components/ui/DataTable';
import Modal from '../../components/ui/Modal';
import ConfirmationModal from '../../components/ui/ConfirmationModal';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.preprocess((val) => parseFloat(val), z.number().positive('Price must be a positive number')),
  stock_quantity: z.preprocess((val) => parseInt(val, 10), z.number().int().min(0, 'Stock cannot be negative')),
  category_id: z.preprocess((val) => parseInt(val, 10), z.number().int().positive('Please select a category')),
});

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [productsRes, categoriesRes] = await Promise.all([getProducts(), getCategories()]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      setError('Failed to fetch data.');
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (product = null) => {
    setSelectedProduct(product);
    reset(product || { name: '', description: '', price: '', stock_quantity: '', category_id: '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const openConfirmModal = (product) => {
    setSelectedProduct(product);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setSelectedProduct(null);
  };

  const onSubmit = async (data) => {
    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct.id, data);
      } else {
        await createProduct(data);
      }
      fetchData();
      closeModal();
    } catch (err) {
      console.error('Failed to save product:', err);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    try {
      await deleteProduct(selectedProduct.id);
      fetchData();
      closeConfirmModal();
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  const columns = [
    { Header: 'Name', accessor: 'name' },
    { Header: 'Price', accessor: 'price' },
    { Header: 'Stock', accessor: 'stock_quantity' },
    { Header: 'Category', accessor: 'category_name' },
  ];

  const productsWithCategoryNames = products.map(p => ({
    ...p,
    category_name: categories.find(c => c.id === p.category_id)?.name || 'N/A'
  }));

  return (
    <Section
      title="Products"
      subtitle="Manage your products."
    >
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2.5 font-bold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {isLoading && <p>Loading products...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!isLoading && !error && (
        <DataTable
          columns={columns}
          data={productsWithCategoryNames}
          onEdit={(product) => openModal(products.find(p => p.id === product.id))}
          onDelete={(id) => openConfirmModal(products.find(p => p.id === id))}
        />
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedProduct ? 'Edit Product' : 'Add Product'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name">Name</label>
            <input id="name" {...register('name')} className="w-full bg-gray-700 rounded-md p-2" />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea id="description" {...register('description')} className="w-full bg-gray-700 rounded-md p-2" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price">Price</label>
              <input id="price" type="number" step="0.01" {...register('price')} className="w-full bg-gray-700 rounded-md p-2" />
              {errors.price && <p className="text-red-500 text-xs">{errors.price.message}</p>}
            </div>
            <div>
              <label htmlFor="stock_quantity">Stock</label>
              <input id="stock_quantity" type="number" {...register('stock_quantity')} className="w-full bg-gray-700 rounded-md p-2" />
              {errors.stock_quantity && <p className="text-red-500 text-xs">{errors.stock_quantity.message}</p>}
            </div>
          </div>
          <div>
            <label htmlFor="category_id">Category</label>
            <select id="category_id" {...register('category_id')} className="w-full bg-gray-700 rounded-md p-2">
              <option value="">Select a category</option>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
            {errors.category_id && <p className="text-red-500 text-xs">{errors.category_id.message}</p>}
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={closeModal} className="px-4 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:bg-purple-800">
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the product "${selectedProduct?.name}"?`}
      />
    </Section>
  );
};

export default ProductsPage;
