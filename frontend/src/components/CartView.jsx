import React, { useState } from 'react';
import Modal from './Modal';
import { useCart } from '../context/CartContext';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import CheckoutDialog from './CheckoutDialog';
import { apiService } from '../services/api';

const CartView = ({ isOpen, onClose }) => {
    const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const handleCheckout = async (checkoutData) => {
        const deliveryCost = checkoutData.deliveryMethod === 'delivery' ? checkoutData.deliveryArea.price : 0;
        const finalTotal = totalPrice + deliveryCost;

        const orderData = {
            customer: checkoutData.customer,
            order_items: cartItems.map(item => {
                const orderItem = {
                    quantity: item.quantity,
                };
                if (item.variant) {
                    orderItem.product_variant_id = item.variant.id;
                } else {
                    orderItem.product_id = item.product.id;
                }
                return orderItem;
            }),
            total_price: finalTotal,
            delivery_method: checkoutData.deliveryMethod,
            delivery_area_id: checkoutData.deliveryArea?.id,
        };

        console.log("Submitting order data:", orderData);
        await apiService.createCustomerAndOrder(orderData);
        clearCart();
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title="سلة التسوق" maxWidth="max-w-2xl">
                {cartItems.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-lg text-text-light">سلة التسوق فارغة</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {cartItems.map(item => {
                        const imageUrl = item.variant?.image_url || item.product.primary_image_url || item.product.product_images?.[0]?.image_url;
                        return (
                            <div key={`${item.product.id}-${item.variant?.id}`} className="flex items-center gap-4 p-4 border rounded-lg">
                                <img src={imageUrl} alt={item.product.name} className="w-20 h-20 object-cover rounded-lg bg-gray-100" />
                                <div className="flex-grow">
                                    <h3 className="font-semibold">{item.product.name}</h3>
                                    {item.variant && <p className="text-sm text-text-light">{item.variant.name}</p>}
                                <p className="font-bold text-brand-purple">{item.variant?.price || item.product.price} د.ب</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => updateQuantity(item.product.id, item.variant?.id, item.quantity - 1)} disabled={item.quantity <= 1} className="p-1 border rounded hover:bg-gray-100 disabled:opacity-50">
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span>{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.product.id, item.variant?.id, item.quantity + 1)} className="p-1 border rounded hover:bg-gray-100">
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                            <button onClick={() => removeFromCart(item.product.id, item.variant?.id)} className="text-red-500 hover:text-red-700">
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>
                        )
                    })}
                    <div className="pt-4 border-t">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold">المجموع</span>
                            <span className="text-xl font-bold text-brand-purple">{totalPrice.toFixed(2)} د.ب</span>
                        </div>
                        <button
                            onClick={() => setIsCheckoutOpen(true)}
                            className="w-full mt-4 bg-brand-purple text-white font-semibold py-3 px-4 rounded-lg hover:bg-brand-purple/90 transition-all"
                        >
                            إتمام الطلب
                        </button>
                    </div>
                </div>
            )}
        </Modal>
        <CheckoutDialog
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            onSubmit={handleCheckout}
            cartItems={cartItems}
            totalPrice={totalPrice}
        />
    </>
    );
};

export default CartView;
