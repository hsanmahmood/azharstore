import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Loader2, Truck, Package, Check } from 'lucide-react';
import { apiService } from '../../services/api';
import ErrorDisplay from '../common/ErrorDisplay';
import { useTranslation } from 'react-i18next';

const ProgressBar = ({ currentStep, totalSteps }) => {
    const progress = (currentStep / totalSteps) * 100;

    return (
        <div className="mb-6" dir="rtl">
            <div className="text-center text-sm text-gray-600 mb-2">
                خطوة {currentStep} من {totalSteps}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className="h-full bg-brand-purple rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};

const CustomerDetailsStep = ({ data, handleChange, onNext, error, deliveryMethod }) => {
    return (
        <form onSubmit={onNext} className="space-y-6 p-4" dir="rtl">
            <ErrorDisplay error={error} />
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                <div className="space-y-2">
                    <label className="block text-xs font-medium text-text-light text-right">الشارع</label>
                    <input type="text" name="address_road" value={data.address_road} onChange={handleChange} required={deliveryMethod === 'delivery'} className="w-full bg-brand-white border border-soft-border text-text-dark p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-purple/50 text-right" />
                </div>
                <div className="space-y-2">
                    <label className="block text-xs font-medium text-text-light text-right">رقم المنزل</label>
                    <input type="text" name="address_home" value={data.address_home} onChange={handleChange} required={deliveryMethod === 'delivery'} className="w-full bg-brand-white border border-soft-border text-text-dark p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-purple/50 text-right" />
                </div>
                <div className="space-y-2">
                    <label className="block text-xs font-medium text-text-light text-right">رقم المجمع</label>
                    <input type="text" name="address_block" value={data.address_block} onChange={handleChange} required={deliveryMethod === 'delivery'} className="w-full bg-brand-white border border-soft-border text-text-dark p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-purple/50 text-right" />
                </div>
                <div className="space-y-2">
                    <label className="block text-xs font-medium text-text-light text-right">المدينة</label>
                    <input type="text" name="town" value={data.town} onChange={handleChange} required={deliveryMethod === 'delivery'} className="w-full bg-brand-white border border-soft-border text-text-dark p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-purple/50 text-right" />
                </div>
            </div>
            <div className="flex justify-start gap-4 pt-4">
                <button type="submit" className="bg-brand-primary hover:bg-opacity-90 text-brand-background font-bold py-2 px-4 rounded-md transition-colors">التالي</button>
            </div>
        </form>
    );
};

const DeliveryMethodStep = ({ onNext, onBack, onSelect, selectedMethod }) => (
    <div className="p-4" dir="rtl">
        <h2 className="text-xl font-semibold mb-4 text-right">اختر طريقة الاستلام</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
                onClick={() => onSelect('delivery')}
                className={`p-6 border-2 rounded-lg flex flex-col items-center justify-center ${selectedMethod === 'delivery'
                        ? 'border-brand-purple bg-brand-purple/10'
                        : 'border-gray-300 hover:border-brand-purple'
                    }`}
            >
                <Truck className="w-12 h-12 mb-2 text-brand-purple" />
                <span className="font-semibold">توصيل</span>
            </button>
            <button
                onClick={() => onSelect('pick_up')}
                className={`p-6 border-2 rounded-lg flex flex-col items-center justify-center ${selectedMethod === 'pick_up'
                        ? 'border-brand-purple bg-brand-purple/10'
                        : 'border-gray-300 hover:border-brand-purple'
                    }`}
            >
                <Package className="w-12 h-12 mb-2 text-brand-purple" />
                <span className="font-semibold">استلام من المتجر</span>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {deliveryAreas && deliveryAreas.length > 0 ? (
                deliveryAreas.map(area => (
                    <button
                        key={area.id}
                        onClick={() => onSelect(area)}
                        className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center ${selectedArea?.id === area.id
                                ? 'border-brand-purple bg-brand-purple/10'
                                : 'border-gray-300 hover:border-brand-purple'
                            }`}
                    >
                        <span className="font-semibold">{area.name}</span>
                        <span className="text-sm text-text-light">{area.price} د.ب</span>
                    </button>
                ))
            ) : (
                <p className="col-span-2 text-center text-text-light">لا توجد مناطق توصيل متاحة حالياً.</p>
            )}
        </div>
        <div className="flex justify-between mt-6">
            <button onClick={onBack} className="bg-gray-200 text-text-dark font-bold py-2 px-4 rounded-md">السابق</button>
            <button onClick={onNext} disabled={!selectedArea} className="bg-brand-primary text-brand-background font-bold py-2 px-4 rounded-md disabled:opacity-50">التالي</button>
        </div>
    </div>
);

const OrderSummaryStep = ({ onBack, onSubmit, data, cartItems, totalPrice, isSubmitting, error }) => {
    const deliveryCost = data.deliveryMethod === 'delivery' ? data.deliveryArea?.price || 0 : 0;
    const finalTotal = totalPrice + deliveryCost;

    return (
        <div className="p-4" dir="rtl">
            <h2 className="text-xl font-semibold mb-4 text-right">ملخص الطلب</h2>
            <ErrorDisplay error={error} />
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

const ThankYouStep = ({ onClose, message }) => (
    <div className="p-8 text-center flex flex-col items-center justify-center min-h-[400px]" dir="rtl">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <Check className="w-12 h-12 text-green-600" />
        </div>
        <div className="prose max-w-md" dangerouslySetInnerHTML={{ __html: message }} />
        <button onClick={onClose} className="mt-8 bg-brand-primary text-brand-background font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors">إغلاق</button>
    </div>
);

const CheckoutDialog = ({ isOpen, onClose, onSubmit, cartItems, totalPrice }) => {
    const { t } = useTranslation();
    const [step, setStep] = useState(1);
    const [checkoutData, setCheckoutData] = useState({
        customer: { name: '', phone_number: '', town: '', address_home: '', address_road: '', address_block: '' },
        deliveryMethod: null,
        deliveryArea: null,
    });
    const [deliveryAreas, setDeliveryAreas] = useState([]);
    const [appSettings, setAppSettings] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            const fetchInitialData = async () => {
                try {
                    const [areasResponse, settingsResponse] = await Promise.all([
                        apiService.getAllDeliveryAreas(),
                        apiService.getAppSettings(),
                    ]);
                    setDeliveryAreas(areasResponse.data);
                    setAppSettings(settingsResponse.data);
                } catch (err) {
                    console.error('Failed to fetch initial data', err);
                }
            };
            fetchInitialData();
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCheckoutData(prev => ({ ...prev, customer: { ...prev.customer, [name]: value } }));
    };

    const handleNext = (e) => {
        e.preventDefault();
        setError(null);

        if (step === 1) {
            const { name, phone_number } = checkoutData.customer;
            if (!name.trim()) {
                setError({ detail: "الاسم مطلوب" });
                return;
            }
            if (phone_number.length !== 8 || !/^\d{8}$/.test(phone_number)) {
                setError({ detail: "رقم الهاتف يجب أن يتكون من 8 أرقام" });
                return;
            }
        }

        if (step === 2 && checkoutData.deliveryMethod === 'pick_up') {
            setStep(4);
        } else {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        if (step === 4 && checkoutData.deliveryMethod === 'pick_up') {
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
            setStep(5);
        } catch (err) {
            const errorData = err.response?.data || { detail: 'Failed to create order. Please try again.' };
            setError(errorData);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getThankYouMessage = () => {
        if (!appSettings) return '';
        return checkoutData.deliveryMethod === 'pick_up'
            ? appSettings.pickup_message
            : appSettings.delivery_message;
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <CustomerDetailsStep data={checkoutData.customer} handleChange={handleChange} onNext={handleNext} error={error} deliveryMethod={checkoutData.deliveryMethod} />;
            case 2:
                return <DeliveryMethodStep onNext={handleNext} onBack={handleBack} onSelect={handleSelectMethod} selectedMethod={checkoutData.deliveryMethod} />;
            case 3:
                return <DeliveryAreaStep onNext={handleNext} onBack={handleBack} onSelect={handleSelectArea} selectedArea={checkoutData.deliveryArea} deliveryAreas={deliveryAreas} />;
            case 4:
                return <OrderSummaryStep onBack={handleBack} onSubmit={handleSubmit} data={checkoutData} cartItems={cartItems} totalPrice={totalPrice} isSubmitting={isSubmitting} error={error} />;
            case 5:
                return <ThankYouStep onClose={onClose} message={getThankYouMessage()} />;
            default:
                return <div>خطوة غير معروفة</div>;
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="إتمام الطلب" maxWidth="max-w-2xl">
            <div className="p-6">
                {step < 5 && <ProgressBar currentStep={step} totalSteps={4} />}
                <div className={step === 5 ? '' : 'min-h-[400px]'}>
                    {renderStep()}
                </div>
            </div>
        </Modal>
    );
};

export default CheckoutDialog;
