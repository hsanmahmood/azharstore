import React, { useState } from 'react';
import Modal from './Modal';
import { Loader2 } from 'lucide-react';

const CheckoutDialog = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone_number: '',
        town: '',
        address_home: '',
        address_road: '',
        address_block: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.phone_number.length !== 8) {
            setError('رقم الهاتف يجب أن يتكون من 8 أرقام');
            return;
        }
        setIsSubmitting(true);
        setError('');
        try {
            await onSubmit(formData);
            onClose();
        } catch (err) {
            setError('حدث خطأ ما، يرجى المحاولة مرة أخرى');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="إتمام الطلب" maxWidth="max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-6 p-4" dir="rtl">
                {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-text-light text-right">الاسم</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full bg-brand-white border border-soft-border text-text-dark p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/50 text-right"
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-text-light text-right">رقم الهاتف</label>
                    <input
                        type="text"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        required
                        className="w-full bg-brand-white border border-soft-border text-text-dark p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/50 text-right"
                    />
                     <p className="text-xs text-text-light text-right mt-1">
                        الرجاء إدخال 8 أرقام فقط
                    </p>
                </div>

                <div className="text-right my-4">
                    <span className="text-lg text-text-dark">العنوان</span>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                    <div className="space-y-2">
                        <label className="block text-xs font-medium text-text-light text-right">الشارع</label>
                        <input
                            type="text"
                            name="address_road"
                            value={formData.address_road}
                            onChange={handleChange}
                            className="w-full bg-brand-white border border-soft-border text-text-dark p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-purple/50 text-right"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-xs font-medium text-text-light text-right">رقم المنزل</label>
                        <input
                            type="text"
                            name="address_home"
                            value={formData.address_home}
                            onChange={handleChange}
                            className="w-full bg-brand-white border border-soft-border text-text-dark p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-purple/50 text-right"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-xs font-medium text-text-light text-right">رقم المجمع</label>
                        <input
                            type="text"
                            name="address_block"
                            value={formData.address_block}
                            onChange={handleChange}
                            className="w-full bg-brand-white border border-soft-border text-text-dark p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-purple/50 text-right"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-xs font-medium text-text-light text-right">المدينة</label>
                        <input
                            type="text"
                            name="town"
                            value={formData.town}
                            onChange={handleChange}
                            className="w-full bg-brand-white border border-soft-border text-text-dark p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-purple/50 text-right"
                        />
                    </div>
                </div>

                <div className="flex justify-start gap-4 pt-4">
                    <button
                        type="submit"
                        className="bg-brand-primary hover:bg-opacity-90 text-brand-background font-bold py-2 px-4 rounded-md transition-colors"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : 'تأكيد الطلب'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default CheckoutDialog;
