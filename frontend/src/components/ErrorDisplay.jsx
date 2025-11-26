import React from 'react';
import { AlertTriangle } from 'lucide-react';

const fieldTranslations = {
    customer_id: 'الزبون',
    shipping_method: 'طريقة الشحن',
    order_items: 'المنتجات',
    product_variant_id: 'صنف المنتج',
    name: "الاسم",
    phone_number: "رقم الهاتف"
};

const ErrorDisplay = ({ error }) => {
    if (!error) return null;

    const parseError = (err) => {
        if (typeof err === 'string') {
            return [err];
        }

        if (err.detail && Array.isArray(err.detail)) {
            return err.detail.map(e => {
                const fieldName = e.loc && e.loc.length > 1 ? fieldTranslations[e.loc[1]] || e.loc[1] : 'الحقل';
                const index = e.loc && e.loc.length > 2 ? ` في المنتج رقم ${e.loc[2] + 1}`: ''
                switch (e.type) {
                    case 'missing':
                        return `${fieldName}${index} مطلوب`;
                    case 'value_error':
                        if (e.msg.includes('Cannot provide both product_id and product_variant_id')) {
                            return 'لا يمكن تحديد منتج وصنف في نفس الوقت'
                        }
                        return `خطأ في القيمة المدخلة لـ ${fieldName}${index}: ${e.msg}`;
                    default:
                        return e.msg;
                }
            });
        }

        return ['حدث خطأ غير متوقع'];
    };

    const errorMessages = parseError(error);

    return (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md my-4" role="alert" dir="rtl">
            <div className="flex">
                <div className="py-1">
                    <AlertTriangle className="h-6 w-6 text-red-500 mr-4" />
                </div>
                <div>
                    <p className="font-bold">حدث خطأ</p>
                    <ul className="list-disc list-inside mt-2">
                        {errorMessages.map((msg, index) => (
                            <li key={index}>{msg}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ErrorDisplay;
