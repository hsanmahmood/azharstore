import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product, variant, quantity) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.product.id === product.id && (variant ? item.variant?.id === variant.id : true));

            if (existingItem) {
                return prevItems.map(item =>
                    item.product.id === product.id && (variant ? item.variant?.id === variant.id : true)
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [...prevItems, { product, variant, quantity }];
            }
        });
    };

    const removeFromCart = (productId, variantId) => {
        setCartItems(prevItems => prevItems.filter(item => !(item.product.id === productId && (variantId ? item.variant?.id === variantId : true))));
    };

    const updateQuantity = (productId, variantId, quantity) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.product.id === productId && (variantId ? item.variant?.id === variantId : true)
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    const totalPrice = cartItems.reduce((total, item) => {
        const price = item.variant?.price || item.product.price;
        return total + price * item.quantity;
    }, 0);

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartCount,
        totalPrice,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
