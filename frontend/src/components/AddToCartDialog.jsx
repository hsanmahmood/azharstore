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
        <Modal isOpen={isOpen} onClose={onClose} title={`إضافة ${product.name} إلى السلة`}>
            <div className="space-y-4">
                {/* Variants */}
                {variants.length > 0 && (
                    <div>
                        <h3 className="font-semibold mb-2">اختر النوع</h3>
                        <div className="flex flex-wrap gap-2">
                            {variants.map(variant => (
                                <button
                                    key={variant.id}
                                    onClick={() => setSelectedVariant(variant)}
                                    className={`px-3 py-1 text-sm rounded-lg border-2 transition-all ${selectedVariant?.id === variant.id ? 'border-brand-purple bg-brand-purple text-white' : 'border-soft-border bg-white text-text-dark hover:border-brand-purple'}`}
                                >
                                    {variant.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quantity */}
                <div>
                    <h3 className="font-semibold mb-2">الكمية</h3>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2 border rounded-lg hover:bg-gray-100">
                            <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-lg font-bold">{quantity}</span>
                        <button onClick={() => setQuantity(q => q + 1)} className="p-2 border rounded-lg hover:bg-gray-100">
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    className="w-full bg-brand-purple text-white font-semibold py-3 px-4 rounded-lg hover:bg-brand-purple/90 transition-all duration-200 flex items-center justify-center gap-2 mt-4"
                >
                    <ShoppingCart className="h-5 w-5" />
                    <span>إضافة إلى السلة</span>
                </button>
            </div>
        </Modal>
    );
};

export default AddToCartDialog;
