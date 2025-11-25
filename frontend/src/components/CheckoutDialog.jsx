import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Loader2 } from 'lucide-react';
import { apiService } from '../services/api';

const CustomerDetailsStep = ({ data, handleChange, onNext, error }) => (
    <form onSubmit={onNext} className="space-y-6 p-4" dir="rtl">
        {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}
        <div className="space-y-2">
            <label className="block text-sm font-medium text-text-light text-right">الاسم</label>
            <input type="text" name="name" value={data.name} onChange={handleChange} required className="w-full bg-brand-white border border-soft-border text-text-dark p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/50 text-right" />
        </div>
        <div className="space-y-2">
            <label className="block text-sm font-medium text-text-light text-right">رقم الهاتف</label>
            <input type="text" name="phone_number" value={data.phone_number} onChange={handleChange} required className="w-full bg-brand-white border border-soft-border text-text-dark p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple/50 text-right" />
            <p className="text-xs text-text-light text-right mt-1">الرجاء إدخال 8 أرقام فقط</p>
        </div>
        <div className="text-right my-4"><span className="text-lg text-text-dark">العنوان</span></div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
            <div className="space-y-2">
                <label className="block text-xs font-medium text-text-light text-right">الشارع</label>
                <input type="text" name="address_road" value={data.address_road} onChange={handleChange} className="w-full bg-brand-white border border-soft-border text-text-dark p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-purple/50 text-right" />
            </div>
            <div className="space-y-2">
                <label className="block text-xs font-medium text-text-light text-right">رقم المنزل</label>
                <input type="text" name="address_home" value={data.address_home} onChange={handleChange} className="w-full bg-brand-white border border-soft-border text-text-dark p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-purple/50 text-right" />
            </div>
            <div className="space-y-2">
                <label className="block text-xs font-medium text-text-light text-right">رقم المجمع</label>
                <input type="text" name="address_block" value={data.address_block} onChange={handleChange} className="w-full bg-brand-white border border-soft-border text-text-dark p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-purple/50 text-right" />
            </div>
            <div className="space-y-2">
                <label className="block text-xs font-medium text-text-light text-right">المدينة</label>
                <input type="text" name="town" value={data.town} onChange={handleChange} className="w-full bg-brand-white border border-soft-border text-text-dark p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-purple/50 text-right" />
            </div>
        </div>
        <div className="flex justify-start gap-4 pt-4">
            <button type="submit" className="bg-brand-primary hover:bg-opacity-90 text-brand-background font-bold py-2 px-4 rounded-md transition-colors">التالي</button>
        </div>
    </form>
);

const DeliveryMethodStep = ({ onNext, onBack, onSelect, selectedMethod }) => (
    <div className="p-4" dir="rtl">
        <h2 className="text-xl font-semibold mb-4 text-right">اختر طريقة الاستلام</h2>
        <div className="flex gap-4">
            <button onClick={() => onSelect('delivery')} className={`flex-1 p-4 border rounded-lg ${selectedMethod === 'delivery' ? 'border-brand-purple' : ''}`}>
                توصيل
            </button>
            <button onClick={() => onSelect('pickup')} className={`flex-1 p-4 border rounded-lg ${selectedMethod === 'pickup' ? 'border-brand-purple' : ''}`}>
                استلام من المتجر
            </button>
        </div>
        <div className="flex justify-between mt-6">
            <button onClick={onBack} className="bg-gray-200 text-text-dark font-bold py-2 px-4 rounded-md">السابق</button>
            <button onClick={onNext} disabled={!selectedMethod} className="bg-brand-primary text-brand-background font-bold py-2 px-4 rounded-md disabled:opacity-50">التالي</button>
        </div>
    </div>
);

const DeliveryAreaStep = ({ onNext, onBack, onSelect, selectedArea, deliveryAreas }) => (
    <div className="p-4" dir="rtl">
        <h2 className="text-xl font-semibold mb-4 text-right">اختر منطقة التوصيل</h2>
        <div className="space-y-2">
            {deliveryAreas && deliveryAreas.length > 0 ? (
                deliveryAreas.map(area => (
                    <button key={area.id} onClick={() => onSelect(area)} className={`w-full p-4 border rounded-lg text-right ${selectedArea?.id === area.id ? 'border-brand-purple' : ''}`}>
                        {area.name} - {area.price} د.ب
                    </button>
                ))
            ) : (
                <p className="text-center text-text-light">لا توجد مناطق توصيل متاحة حالياً.</p>
            )}
        </div>
        <div className="flex justify-between mt-6">
            <button onClick={onBack} className="bg-gray-200 text-text-dark font-bold py-2 px-4 rounded-md">السابق</button>
            <button onClick={onNext} disabled={!selectedArea} className="bg-brand-primary text-brand-background font-bold py-2 px-4 rounded-md disabled:opacity-50">التالي</button>
        </div>
    </div>
);

const OrderSummaryStep = ({ onBack, onSubmit, data, cartItems, totalPrice, isSubmitting }) => {
    const deliveryCost = data.deliveryMethod === 'delivery' ? data.deliveryArea?.price || 0 : 0;
    const finalTotal = totalPrice + deliveryCost;

    return (
        <div className="p-4" dir="rtl">
            <h2 className="text-xl font-semibold mb-4 text-right">ملخص الطلب</h2>
            <div className="space-y-4">
                <div>
                    <h3 className="font-semibold">المنتجات</h3>
                    {cartItems.map(item => (
                        <div key={item.product.id} className="flex justify-between">
                            <span>{item.product.name} x {item.quantity}</span>
                            <span>{(item.product.price * item.quantity).toFixed(2)} د.ب</span>
                        </div>
                    ))}
                </div>
                <div>
                    <h3 className="font-semibold">معلومات الزبون</h3>
                    <p>{data.customer.name}</p>
                    <p>{data.customer.phone_number}</p>
                    <p>{data.customer.town}, {data.customer.address_road}, {data.customer.address_home}, {data.customer.address_block}</p>
                </div>
                <div>
                    <h3 className="font-semibold">طريقة الاستلام</h3>
                    <p>{data.deliveryMethod === 'delivery' ? `توصيل الى ${data.deliveryArea.name}` : 'استلام من المتجر'}</p>
                </div>
                <div className="border-t pt-4">
                    <div className="flex justify-between">
                        <span>المجموع</span>
                        <span>{totalPrice.toFixed(2)} د.ب</span>
                    </div>
                    <div className="flex justify-between">
                        <span>التوصيل</span>
                        <span>{deliveryCost.toFixed(2)} د.ب</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                        <span>المجموع الكلي</span>
                        <span>{finalTotal.toFixed(2)} د.ب</span>
                    </div>
                </div>
            </div>
            <div className="flex justify-between mt-6">
                <button onClick={onBack} className="bg-gray-200 text-text-dark font-bold py-2 px-4 rounded-md">السابق</button>
                <button onClick={onSubmit} disabled={isSubmitting} className="bg-brand-primary text-brand-background font-bold py-2 px-4 rounded-md">
                    {isSubmitting ? <Loader2 className="animate-spin" /> : 'تأكيد الطلب'}
                </button>
            </div>
        </div>
    );
};

const CheckoutDialog = ({ isOpen, onClose, onSubmit, cartItems, totalPrice }) => {
    const [step, setStep] = useState(1);
    const [checkoutData, setCheckoutData] = useState({
        customer: { name: '', phone_number: '', town: '', address_home: '', address_road: '', address_block: '' },
        deliveryMethod: null,
        deliveryArea: null,
    });
    const [deliveryAreas, setDeliveryAreas] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            const fetchDeliveryAreas = async () => {
                try {
                    const response = await apiService.getAllDeliveryAreas();
                    setDeliveryAreas(response.data);
                } catch (err) {
                    console.error('Failed to fetch delivery areas', err);
                }
            };
            fetchDeliveryAreas();
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCheckoutData(prev => ({ ...prev, customer: { ...prev.customer, [name]: value } }));
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (step === 1 && checkoutData.customer.phone_number.length !== 8) {
            setError('رقم الهاتف يجب أن يتكون من 8 أرقام');
            return;
        }
        setError('');
        if (step === 2 && checkoutData.deliveryMethod === 'pickup') {
            setStep(4); // Skip to summary
        } else {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        if (step === 4 && checkoutData.deliveryMethod === 'pickup') {
            setStep(2);
        } else {
            setStep(step - 1);
        }
    };

    const handleSelectMethod = (method) => {
        setCheckoutData(prev => ({ ...prev, deliveryMethod: method }));
    };

    const handleSelectArea = (area) => {
        setCheckoutData(prev => ({ ...prev, deliveryArea: area }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            await onSubmit(checkoutData);
            onClose();
        } catch (err) {
            setError('Failed to create order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <CustomerDetailsStep data={checkoutData.customer} handleChange={handleChange} onNext={handleNext} error={error} />;
            case 2:
                return <DeliveryMethodStep onNext={handleNext} onBack={handleBack} onSelect={handleSelectMethod} selectedMethod={checkoutData.deliveryMethod} />;
            case 3:
                return <DeliveryAreaStep onNext={handleNext} onBack={handleBack} onSelect={handleSelectArea} selectedArea={checkoutData.deliveryArea} deliveryAreas={deliveryAreas} />;
            case 4:
                return <OrderSummaryStep onBack={handleBack} onSubmit={handleSubmit} data={checkoutData} cartItems={cartItems} totalPrice={totalPrice} isSubmitting={isSubmitting} />;
            default:
                return <div>خطوة غير معروفة</div>;
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="إتمام الطلب" maxWidth="max-w-2xl">
            <div className="p-4">
                <div className="text-center text-sm text-text-light mb-4">
                    خطوة {step} من 4
                </div>
                <div style={{ minHeight: '350px' }}>
                    {renderStep()}
                </div>
            </div>
        </Modal>
    );
};

export default CheckoutDialog;
