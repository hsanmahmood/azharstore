import React, { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DataContext } from '../../context/DataContext';
import { apiService } from '../../services/api';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { useNotifier } from '../../context/NotificationContext';
import Modal from '../../components/Modal';
import LoadingScreen from '../../components/LoadingScreen';
import ConfirmationModal from '../../components/ConfirmationModal';
import SimpleRichTextEditor from '../../components/SimpleRichTextEditor';

const Settings = () => {
  const { t } = useTranslation();
  const notify = useNotifier();
  const { deliveryAreas, appSettings, isLoading, error: dataError, addDeliveryArea, updateDeliveryArea, deleteDeliveryArea, updateAppSettings } = useContext(DataContext);

  const [activeTab, setActiveTab] = useState('delivery');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArea, setEditingArea] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingAreaId, setDeletingAreaId] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '' });

  // Settings state
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState('');
  const [deliveryMessage, setDeliveryMessage] = useState('');
  const [pickupMessage, setPickupMessage] = useState('');

  useEffect(() => {
    if (appSettings) {
      setFreeDeliveryThreshold(appSettings.free_delivery_threshold || '');
      setDeliveryMessage(appSettings.delivery_message || '');
      setPickupMessage(appSettings.pickup_message || '');
    }
  }, [appSettings]);

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
    try {
      if (editingArea) {
        const updatedArea = await apiService.updateDeliveryArea(editingArea.id, formData);
        updateDeliveryArea(updatedArea);
        notify(t('settings.areaUpdatedSuccess'));
      } else {
        const newArea = await apiService.createDeliveryArea(formData);
        addDeliveryArea(newArea);
        notify(t('settings.areaAddedSuccess'));
      }
      closeModal();
    } catch (err) {
      notify(t('settings.areaSaveError'), 'error');
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
      await apiService.deleteDeliveryArea(deletingAreaId);
      deleteDeliveryArea(deletingAreaId);
      notify(t('settings.areaDeletedSuccess'));
    } catch (err) {
      notify(t('settings.areaDeleteError'), 'error');
    } finally {
      setDeletingAreaId(null);
    }
  };

  const handleDeliverySettingsSave = async () => {
    setIsSubmitting(true);
    try {
      const updatedSettings = {
        free_delivery_threshold: parseFloat(freeDeliveryThreshold) || 0,
      };
      const newSettings = await apiService.updateAppSettings(updatedSettings);
      updateAppSettings(newSettings);
      notify(t('settings.deliverySettingsSaved'));
    } catch (err) {
      notify(t('settings.deliverySettingsError'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMessagesSave = async () => {
    setIsSubmitting(true);
    try {
      const updatedSettings = {
        delivery_message: deliveryMessage,
        pickup_message: pickupMessage,
      };
      const newSettings = await apiService.updateAppSettings(updatedSettings);
      updateAppSettings(newSettings);
      notify(t('settings.messagesSaved'));
    } catch (err) {
      notify(t('settings.messagesError'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <LoadingScreen fullScreen={false} />;

  const TabButton = ({ tabName, label }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`py-2 px-4 text-lg font-semibold transition-colors duration-200 ${
        activeTab === tabName
          ? 'text-brand-purple border-b-2 border-brand-purple'
          : 'text-text-light hover:text-brand-purple'
      }`}
    >
      {label}
    </button>
  );

  return (
    <>
      <h1 className="text-3xl font-bold text-text-dark mb-8">{t('settings.title')}</h1>

      <div className="mb-8 border-b border-soft-border">
        <nav className="flex space-x-4">
          <TabButton tabName="delivery" label={t('settings.delivery')} />
          <TabButton tabName="messages" label={t('settings.messages')} />
        </nav>
      </div>

      {activeTab === 'delivery' && (
        <div>
          <div className="bg-card-background border border-soft-border rounded-20 p-6 mb-8">
            <h2 className="text-2xl font-bold text-text-dark mb-4">{t('settings.deliverySettings')}</h2>
            <div className="flex items-center gap-4">
              <label htmlFor="freeDeliveryThreshold" className="text-text-light">{t('settings.freeDeliveryThreshold')}</label>
              <input
                id="freeDeliveryThreshold"
                type="number"
                value={freeDeliveryThreshold}
                onChange={(e) => setFreeDeliveryThreshold(e.target.value)}
                className="w-40 bg-brand-white border border-soft-border text-text-dark p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
              />
               <button
                onClick={handleDeliverySettingsSave}
                className="bg-brand-purple text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-all duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : t('common.save')}
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-text-dark">{t('settings.deliveryAreas')}</h2>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 bg-brand-purple text-white font-bold py-2.5 px-5 rounded-lg hover:bg-opacity-90 transition-all duration-200 transform active:scale-95"
            >
              <Plus size={20} /> {t('settings.addArea')}
            </button>
          </div>
          {dataError && !isModalOpen && <div className="text-red-500 mb-6">{dataError}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {deliveryAreas.map((area) => (
              <div key={area.id} className="bg-card-background border border-soft-border rounded-20 p-5 flex justify-between items-center">
                <div>
                  <span className="text-lg font-semibold text-text-dark">{area.name}</span>
                  <p className="text-text-light">{area.price} {t('common.currency')}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => openModal(area)} className="text-text-light hover:text-brand-purple"><Edit size={20} /></button>
                  <button onClick={() => openDeleteConfirm(area.id)} className="text-text-light hover:text-stock-red"><Trash2 size={20} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-text-dark mb-4">{t('settings.deliveryMessage')}</h2>
            <SimpleRichTextEditor
              initialValue={deliveryMessage}
              onChange={(content) => setDeliveryMessage(content)}
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text-dark mb-4">{t('settings.pickupMessage')}</h2>
            <SimpleRichTextEditor
              initialValue={pickupMessage}
              onChange={(content) => setPickupMessage(content)}
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleMessagesSave}
              className="bg-brand-purple text-white font-bold py-2.5 px-5 rounded-lg hover:bg-opacity-90 transition-all duration-200 transform active:scale-95 flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : t('common.saveChanges')}
            </button>
          </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingArea ? t('settings.editArea') : t('settings.addArea')}>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-light mb-2">{t('settings.areaName')}</label>
            <input type="text" name="name" value={formData.name} onChange={handleFormChange} required className="w-full bg-brand-white border border-soft-border text-text-dark p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/50 placeholder-text-light" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-light mb-2">{t('settings.deliveryPrice')}</label>
            <div className="relative">
              <input type="number" name="price" value={formData.price} onChange={handleFormChange} required className="w-full bg-brand-white border border-soft-border text-text-dark p-3 rounded-lg pl-12 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 placeholder-text-light" />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light">
                {t('common.currency')}
              </span>
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={closeModal} className="bg-gray-200 text-text-dark font-bold py-2 px-4 rounded-lg">{t('common.cancel')}</button>
            <button type="submit" className="bg-brand-purple text-white font-bold py-2 px-4 rounded-lg" disabled={isSubmitting}>
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
