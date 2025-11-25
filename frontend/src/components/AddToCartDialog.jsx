import React, { useState } from 'react';
import Modal from './Modal';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

const AddToCartDialog = ({ isOpen, onClose, product }) => {
    const { addToCart } = useCart();
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        addToCart(product, selectedVariant, quantity);
        onClose();
    };

    const variants = product.product_variants || [];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`إضافة ${product.name} إلى السلة`} maxWidth="max-w-md">
            <div className="space-y-3">
                {/* Variants */}
                {variants.length > 0 && (
                    <div>
                        <h3 className="font-semibold text-sm mb-2">اختر النوع</h3>
                        <div className="flex flex-wrap gap-2">
                            {variants.map(variant => (
                                <button
                                    key={variant.id}
                                    onClick={() => setSelectedVariant(variant)}
                                    className={`px-2 py-1 text-xs rounded-md border-2 transition-all ${selectedVariant?.id === variant.id ? 'border-brand-purple bg-brand-purple text-white' : 'border-soft-border bg-white text-text-dark hover:border-brand-purple'}`}
                                >
                                    {variant.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quantity */}
                <div>
                    <h3 className="font-semibold text-sm mb-2">الكمية</h3>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2 border rounded-md hover:bg-gray-100">
                            <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-base font-bold">{quantity}</span>
                        <button onClick={() => setQuantity(q => q + 1)} className="p-2 border rounded-md hover:bg-gray-100">
                            <Plus className="h-3 w-3" />
                        </button>
                    </div>
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    className="w-full bg-brand-purple text-white font-semibold py-2 px-3 rounded-md hover:bg-brand-purple/90 transition-all duration-200 flex items-center justify-center gap-2 mt-3"
                >
                    <ShoppingCart className="h-4 w-4" />
                    <span className="text-sm">إضافة إلى السلة</span>
                </button>
            </div>
        </Modal>
    );
};

export default AddToCartDialog;
