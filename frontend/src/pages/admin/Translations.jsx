import React, { useState, useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { updateTranslation } from '../../services/api';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { DataContext } from '../../context/DataContext';

const Translations = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { translations, updateTranslation: updateTranslationInContext } = useContext(DataContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTranslation, setSelectedTranslation] = useState(null);
  const [newValue, setNewValue] = useState('');

  const mutation = useMutation(updateTranslation, {
    onSuccess: (data) => {
      updateTranslationInContext(data.data);
      queryClient.invalidateQueries('translations');
      toast.success(t('admin.translations.updateSuccess'));
      setIsModalOpen(false);
    },
    onError: () => {
      toast.error(t('admin.translations.updateError'));
    },
  });

  const handleEditClick = (translation) => {
    setSelectedTranslation(translation);
    setNewValue(translation.value);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    mutation.mutate({ id: selectedTranslation.id, value: newValue });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{t('admin.translations.title')}</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {t('admin.translations.key')}
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {t('admin.translations.value')}
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
            </tr>
          </thead>
          <tbody>
            {translations.map((translation) => (
              <tr key={translation.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{translation.key}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{translation.value}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                  <button
                    onClick={() => handleEditClick(translation)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    {t('admin.translations.edit')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">{t('admin.translations.editTitle')}</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{selectedTranslation.key}</p>
                  <textarea
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="mt-2 w-full px-3 py-2 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:shadow-outline"
                    rows="4"
                  ></textarea>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleSave}
                  disabled={mutation.isLoading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {mutation.isLoading ? t('admin.translations.saving') : t('admin.translations.save')}
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {t('admin.translations.cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Translations;
