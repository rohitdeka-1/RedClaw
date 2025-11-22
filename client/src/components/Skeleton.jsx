import React from 'react';

/**
 * Base skeleton component with shimmer animation
 */
export const Skeleton = ({ className = "", width, height }) => {
    return (
        <div
            className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded ${className}`}
            style={{
                width: width || '100%',
                height: height || '1rem',
                animation: 'shimmer 1.5s infinite',
            }}
        />
    );
};

/**
 * Skeleton for cart item card
 */
export const CartItemSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 flex gap-4 animate-pulse">
            {/* Image skeleton */}
            <div className="w-24 h-24 bg-gray-200 rounded-lg" />
            
            {/* Content skeleton */}
            <div className="flex-1 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="flex items-center gap-4">
                    <div className="h-8 w-24 bg-gray-200 rounded" />
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                </div>
            </div>
            
            {/* Delete button skeleton */}
            <div className="w-8 h-8 bg-gray-200 rounded" />
        </div>
    );
};

/**
 * Skeleton for checkout page
 */
export const CheckoutSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left column - Cart & Addresses */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Cart section skeleton */}
                        <div className="bg-white rounded-lg shadow p-6 space-y-4">
                            <div className="h-6 bg-gray-200 rounded w-32 mb-4" />
                            <CartItemSkeleton />
                            <CartItemSkeleton />
                        </div>

                        {/* Address section skeleton */}
                        <div className="bg-white rounded-lg shadow p-6 space-y-4">
                            <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <AddressCardSkeleton />
                                <AddressCardSkeleton />
                            </div>
                        </div>
                    </div>

                    {/* Right column - Order summary */}
                    <div className="lg:col-span-1">
                        <OrderSummarySkeleton />
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Skeleton for address card
 */
export const AddressCardSkeleton = () => {
    return (
        <div className="border-2 border-gray-200 rounded-lg p-4 space-y-2 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
    );
};

/**
 * Skeleton for order summary
 */
export const OrderSummarySkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow p-6 space-y-4 sticky top-8 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-40 mb-4" />
            
            <div className="space-y-3 border-b pb-4">
                <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-20" />
                    <div className="h-4 bg-gray-200 rounded w-16" />
                </div>
                <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-24" />
                    <div className="h-4 bg-gray-200 rounded w-16" />
                </div>
                <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-20" />
                    <div className="h-4 bg-gray-200 rounded w-16" />
                </div>
            </div>
            
            <div className="flex justify-between pt-2">
                <div className="h-6 bg-gray-200 rounded w-16" />
                <div className="h-6 bg-gray-200 rounded w-24" />
            </div>
            
            <div className="h-12 bg-gray-200 rounded-lg w-full mt-6" />
        </div>
    );
};

/**
 * Skeleton for orders page
 */
export const OrderCardSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow p-6 space-y-4 animate-pulse">
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-32" />
                    <div className="h-4 bg-gray-200 rounded w-24" />
                </div>
                <div className="h-6 bg-gray-200 rounded-full w-20" />
            </div>
            
            <div className="flex gap-4 overflow-x-auto">
                <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0" />
                <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0" />
                <div className="w-16 h-16 bg-gray-200 rounded flex-shrink-0" />
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t">
                <div className="h-5 bg-gray-200 rounded w-28" />
                <div className="h-10 bg-gray-200 rounded w-32" />
            </div>
        </div>
    );
};

/**
 * Full page skeleton for orders list
 */
export const OrdersPageSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="h-8 bg-gray-200 rounded w-48 mb-8 animate-pulse" />
                <div className="space-y-4">
                    <OrderCardSkeleton />
                    <OrderCardSkeleton />
                    <OrderCardSkeleton />
                </div>
            </div>
        </div>
    );
};

/**
 * Product card skeleton for home page
 */
export const ProductSkeleton = () => {
    return (
        <div className="min-h-screen w-full animate-pulse bg-gray-900">
            <div className="max-w-6xl mx-auto px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    {/* Left side - Text content */}
                    <div className="space-y-6">
                        <div className="h-16 bg-gray-700 rounded w-3/4" />
                        <div className="h-4 bg-gray-700 rounded w-full" />
                        <div className="h-4 bg-gray-700 rounded w-5/6" />
                        <div className="space-y-3 pt-8">
                            <div className="h-12 bg-gray-700 rounded w-40" />
                            <div className="h-12 bg-gray-700 rounded w-48" />
                        </div>
                    </div>
                    
                    {/* Right side - Image */}
                    <div className="h-96 bg-gray-700 rounded-lg" />
                </div>
            </div>
        </div>
    );
};

// Add shimmer animation to global CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes shimmer {
        0% {
            background-position: -200% 0;
        }
        100% {
            background-position: 200% 0;
        }
    }
`;
document.head.appendChild(style);
