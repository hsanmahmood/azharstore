import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { DataContext } from '../../context/DataContext';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import Modal from '../../components/Modal';
import LoadingScreen from '../../components/LoadingScreen';
import ConfirmationModal from '../../components/ConfirmationModal';

const Settings = () => {
  const { t } = useTranslation();
  const { deliveryAreas, appSettings, isLoading, error: dataError, addDeliveryArea, updateDeliveryArea, deleteDeliveryArea, updateAppSettings } = useContext(DataContext);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArea, setEditingArea] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingAreaId, setDeletingAreaId] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '' });
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(appSettings.free_delivery_threshold || '');

  const openModal = (area = null) => {
    setEditingArea(area);
    setFormData(area ? { name: area.name, price: area.price } : { name: '', price: '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingArea(null);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) return;

    setIsSubmitting(true);
    setError('');

    try {
      if (editingArea) {
        await updateDeliveryArea(editingArea.id, formData);
      } else {
        await addDeliveryArea(formData);
      }
      closeModal();
    } catch (err) {
      setError('Failed to save delivery area.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteConfirm = (id) => {
    setDeletingAreaId(id);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingAreaId) return;
    setIsConfirmModalOpen(false);

    try {
      await deleteDeliveryArea(deletingAreaId);
    } catch (err) {
      setError('Failed to delete delivery area.');
    } finally {
      setDeletingAreaId(null);
    }
  };

  const handleSettingsSave = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      await updateAppSettings({ free_delivery_threshold: parseFloat(freeDeliveryThreshold) });
    } catch (err) {
      setError('Failed to save settings.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <LoadingScreen fullScreen={false} />;

  return (
    <>
      <h1 className="text-3xl font-bold text-brand-primary mb-8">{t('settings.title')}</h1>

      <div className="mb-8 border-b border-brand-border">
        <nav className="flex space-x-4">
          <button className="py-2 px-4 text-lg font-semibold text-brand-primary border-b-2 border-brand-primary">
            {t('settings.delivery')}
          </button>
        </nav>
      </div>

      <div className="bg-black/20 border border-brand-border rounded-20 p-6 mb-8">
        <h2 className="text-2xl font-bold text-brand-primary mb-4">{t('settings.deliverySettings')}</h2>
        <div className="flex items-center gap-4">
          <label htmlFor="freeDeliveryThreshold" className="text-brand-secondary">{t('settings.freeDeliveryThreshold')}</label>
          <input
            id="freeDeliveryThreshold"
            type="number"
            value={freeDeliveryThreshold}
            onChange={(e) => setFreeDeliveryThreshold(e.target.value)}
            className="w-40 bg-black/30 border border-brand-border text-brand-primary p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
          />
          <button
            onClick={handleSettingsSave}
            className="bg-brand-primary text-brand-background font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-all duration-200"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : t('common.save')}
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-brand-primary">{t('settings.deliveryAreas')}</h2>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-brand-primary text-brand-background font-bold py-2.5 px-5 rounded-lg hover:bg-opacity-90 transition-all duration-200 transform active:scale-95"
        >
          <Plus size={20} /> {t('settings.addArea')}
        </button>
      </div>

      {dataError && !isModalOpen && <div className="text-red-500 mb-6">{dataError}</div>}
      {error && <div className="text-red-500 mb-6">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {deliveryAreas.map((area) => (
          <div key={area.id} className="bg-black/20 border border-brand-border rounded-20 p-5 flex justify-between items-center">
            <div>
              <span className="text-lg font-semibold">{area.name}</span>
              <p className="text-brand-secondary">{area.price} {t('common.currency')}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => openModal(area)} className="text-brand-secondary hover:text-brand-primary"><Edit size={20} /></button>
              <button onClick={() => openDeleteConfirm(area.id)} className="text-brand-secondary hover:text-red-500"><Trash2 size={20} /></button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingArea ? t('settings.editArea') : t('settings.addArea')}>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-secondary mb-2">{t('settings.areaName')}</label>
            <input type="text" name="name" value={formData.name} onChange={handleFormChange} required className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-secondary mb-2">{t('settings.deliveryPrice')}</label>
            <div className="relative">
              <input type="number" name="price" value={formData.price} onChange={handleFormChange} required className="w-full bg-black/30 border border-brand-border text-brand-primary p-3 rounded-lg pl-12" />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-secondary">
                {t('common.currency')}
              </span>
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={closeModal} className="bg-brand-border/10 text-brand-primary font-bold py-2 px-4 rounded-lg">{t('common.cancel')}</button>
            <button type="submit" className="bg-brand-primary text-brand-background font-bold py-2 px-4 rounded-lg" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : t('common.save')}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={t('common.delete')}
        message={t('settings.confirmDeleteArea')}
      />
    </>
  );
};

export default Settings;