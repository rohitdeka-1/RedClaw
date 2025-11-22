import { useState, useCallback } from 'react';
import { addToCartAPI, updateCartQuantity, removeFromCart } from '../utils/cart';
import { toast } from 'react-toastify';

/**
 * Custom hook for optimistic cart updates
 * Updates UI immediately, then syncs with server
 */
export const useOptimisticCart = (cart, setCart, loadCartFromServer) => {
    const [isUpdating, setIsUpdating] = useState(false);

    // Optimistic add to cart
    const addToCartOptimistic = useCallback(async (product) => {
        // Immediately update UI
        const newItem = {
            product: {
                _id: product._id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
            },
            quantity: 1,
            _id: `temp-${Date.now()}`, // temporary ID
        };

        setCart(prev => [...prev, newItem]);
        toast.success("Added to cart!", { duration: 2000 });
        
        // Then sync with server
        try {
            await addToCartAPI(product._id);
            // Reload to get actual cart with correct IDs
            await loadCartFromServer();
        } catch (error) {
            // Revert on error
            setCart(prev => prev.filter(item => item._id !== newItem._id));
            toast.error("Failed to add to cart. Please try again.");
            throw error;
        }
    }, [setCart, loadCartFromServer]);

    // Optimistic quantity update
    const updateQuantityOptimistic = useCallback(async (productId, newQuantity) => {
        if (newQuantity < 1) return;

        // Store old cart for rollback
        const oldCart = [...cart];
        
        // Immediately update UI
        setCart(prev => prev.map(item => 
            item.product._id === productId 
                ? { ...item, quantity: newQuantity }
                : item
        ));

        setIsUpdating(true);
        
        try {
            await updateCartQuantity(productId, newQuantity);
            await loadCartFromServer(); // Sync with server
        } catch (error) {
            // Revert on error
            setCart(oldCart);
            toast.error("Failed to update quantity. Please try again.");
            throw error;
        } finally {
            setIsUpdating(false);
        }
    }, [cart, setCart, loadCartFromServer]);

    // Optimistic remove from cart
    const removeFromCartOptimistic = useCallback(async (productId) => {
        // Store old cart for rollback
        const oldCart = [...cart];
        const removedItem = cart.find(item => item.product._id === productId);
        
        // Immediately update UI
        setCart(prev => prev.filter(item => item.product._id !== productId));
        toast.success("Removed from cart", { duration: 2000 });

        try {
            await removeFromCart(productId);
            await loadCartFromServer();
        } catch (error) {
            // Revert on error
            setCart(oldCart);
            toast.error("Failed to remove item. Please try again.");
            throw error;
        }
    }, [cart, setCart, loadCartFromServer]);

    return {
        addToCartOptimistic,
        updateQuantityOptimistic,
        removeFromCartOptimistic,
        isUpdating,
    };
};
