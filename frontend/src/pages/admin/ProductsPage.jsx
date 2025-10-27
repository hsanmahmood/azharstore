import React from 'react';
import CrudPageLayout from '../../components/layout/CrudPageLayout';
import apiService from '../../services/productsApi';
import ProductCard from '../../components/cards/ProductCard';
import AddEditProductModal from '../../components/modals/AddEditProductModal';
import { useTranslation } from 'react-i18next';

const ProductsPage = () => {
  const { t } = useTranslation();

  return (
    <CrudPageLayout
      title={t('admin.products.title')}
      apiService={apiService}
      CardComponent={ProductCard}
      ModalComponent={AddEditProductModal}
    />
  );
};

export default ProductsPage;
