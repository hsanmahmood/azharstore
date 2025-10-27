import React from 'react';
import CrudPageLayout from '../../components/layout/CrudPageLayout';
import apiService from '../../services/categoriesApi';
import CategoryCard from '../../components/cards/CategoryCard';
import AddEditCategoryModal from '../../components/modals/AddEditCategoryModal';
import { useTranslation } from 'react-i18next';

const CategoriesPage = () => {
  const { t } = useTranslation();

  return (
    <CrudPageLayout
      title={t('admin.categories.title')}
      apiService={apiService}
      CardComponent={CategoryCard}
      ModalComponent={AddEditCategoryModal}
    />
  );
};

export default CategoriesPage;
