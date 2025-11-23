import React, { useState, useContext, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { DataContext } from '../../context/DataContext';
import { apiService } from '../../services/api';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import Modal from '../../components/Modal';
import LoadingScreen from '../../components/LoadingScreen';
import ConfirmationModal from '../../components/ConfirmationModal';
import { Editor } from '@tinymce/tinymce-react';

const Settings = () => {
  const { t } = useTranslation();
  const { deliveryAreas, appSettings, isLoading, error: dataError, addDeliveryArea, updateDeliveryArea, deleteDeliveryArea, updateAppSettings } = useContext(DataContext);

  const [activeTab, setActiveTab] = useState('delivery');
  const [error, setError] = useState('');
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

  const editorDeliveryRef = useRef(null);
  const editorPickupRef = useRef(null);

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
    setError('');
    try {
      if (editingArea) {
        const updatedArea = await apiService.updateDeliveryArea(editingArea.id, formData);
        updateDeliveryArea(updatedArea);
      } else {
        const newArea = await apiService.createDeliveryArea(formData);
        addDeliveryArea(newArea);
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
      await apiService.deleteDeliveryArea(deletingAreaId);
      deleteDeliveryArea(deletingAreaId);
    } catch (err) {
      setError('Failed to delete delivery area.');
    } finally {
      setDeletingAreaId(null);
    }
  };

  const handleDeliverySettingsSave = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      const updatedSettings = {
        free_delivery_threshold: parseFloat(freeDeliveryThreshold) || 0,
      };
      const newSettings = await apiService.updateAppSettings(updatedSettings);
      updateAppSettings(newSettings);
    } catch (err) {
      setError('Failed to save delivery settings.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMessagesSave = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      const updatedSettings = {
        delivery_message: editorDeliveryRef.current ? editorDeliveryRef.current.getContent() : deliveryMessage,
        pickup_message: editorPickupRef.current ? editorPickupRef.current.getContent() : pickupMessage,
      };
      const newSettings = await apiService.updateAppSettings(updatedSettings);
      updateAppSettings(newSettings);
    } catch (err) {
      setError('Failed to save messages.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const imageUploadHandler = async (blobInfo) => {
    const formData = new FormData();
    formData.append('file', blobInfo.blob(), blobInfo.filename());

    try {
      const response = await apiService.uploadImage(formData);
      return response.location;
    } catch (error) {
      throw new Error('Image upload failed');
    }
  };

  if (isLoading) return <LoadingScreen fullScreen={false} />;

  const TabButton = ({ tabName, label }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`py-2 px-4 text-lg font-semibold transition-colors duration-200 ${
        activeTab === tabName
          ? 'text-brand-primary border-b-2 border-brand-primary'
          : 'text-brand-secondary hover:text-brand-primary'
      }`}
    >
      {label}
    </button>
  );

  return (
    <>
      <h1 className="text-3xl font-bold text-brand-primary mb-8">{t('settings.title')}</h1>

      <div className="mb-8 border-b border-brand-border">
        <nav className="flex space-x-4">
          <TabButton tabName="delivery" label={t('settings.delivery')} />
          <TabButton tabName="messages" label={t('settings.messages')} />
        </nav>
      </div>

      {error && <div className="text-red-500 mb-6 bg-red-900/20 p-3 rounded-lg">{error}</div>}

      {activeTab === 'delivery' && (
        <div>
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
                onClick={handleDeliverySettingsSave}
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
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-brand-primary mb-4">{t('settings.deliveryMessage')}</h2>
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
              onInit={(_evt, editor) => editorDeliveryRef.current = editor}
              initialValue={deliveryMessage}
              init={{
                height: 300,
                menubar: false,
                plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                toolbar: 'undo redo | blocks fontselect fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                skin: 'oxide-dark',
                images_upload_handler: imageUploadHandler,
                automatic_uploads: true,
                font_formats: 'Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats; Tajawal=tajawal,sans-serif',
                content_style: "@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800;900&display=swap'); body { font-family: 'Tajawal', sans-serif; }"
              }}
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-brand-primary mb-4">{t('settings.pickupMessage')}</h2>
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
              onInit={(_evt, editor) => editorPickupRef.current = editor}
              initialValue={pickupMessage}
              init={{
                height: 300,
                menubar: false,
                plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                toolbar: 'undo redo | blocks fontselect fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                skin: 'oxide-dark',
                images_upload_handler: imageUploadHandler,
                automatic_uploads: true,
                font_formats: 'Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats; Tajawal=tajawal,sans-serif',
                content_style: "@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800;900&display=swap'); body { font-family: 'Tajawal', sans-serif; }"
              }}
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleMessagesSave}
              className="bg-brand-primary text-brand-background font-bold py-2.5 px-5 rounded-lg hover:bg-opacity-90 transition-all duration-200 transform active:scale-95 flex items-center"
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
