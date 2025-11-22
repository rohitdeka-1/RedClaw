import React from 'react';
import { ArrowLeft, Package } from "lucide-react";

/**
 * Skeleton for order details page
 */
export const OrderDetailsSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
                        <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Order Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6 animate-pulse">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="space-y-3">
                            <div className="h-8 bg-gray-200 rounded w-48" />
                            <div className="h-4 bg-gray-200 rounded w-32" />
                        </div>
                        <div className="h-8 bg-gray-200 rounded-full w-24" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Timeline Skeleton */}
                        <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                            <div className="h-6 bg-gray-200 rounded w-32 mb-6" />
                            <div className="space-y-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
                                        <div className="flex-1">
                                            <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                                            <div className="h-3 bg-gray-200 rounded w-32" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Products Skeleton */}
                        <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                            <div className="h-6 bg-gray-200 rounded w-32 mb-6" />
                            <div className="space-y-4">
                                {[1, 2].map((i) => (
                                    <div key={i} className="flex gap-4 pb-4 border-b last:border-b-0">
                                        <div className="w-20 h-20 bg-gray-200 rounded" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-5 bg-gray-200 rounded w-3/4" />
                                            <div className="h-4 bg-gray-200 rounded w-1/4" />
                                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Price Summary Skeleton */}
                        <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                            <div className="h-6 bg-gray-200 rounded w-32 mb-4" />
                            <div className="space-y-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex justify-between">
                                        <div className="h-4 bg-gray-200 rounded w-20" />
                                        <div className="h-4 bg-gray-200 rounded w-16" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Address Skeleton */}
                        <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                            <div className="h-6 bg-gray-200 rounded w-40 mb-4" />
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-full" />
                                <div className="h-4 bg-gray-200 rounded w-5/6" />
                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                            </div>
                        </div>

                        {/* Billing Address Skeleton */}
                        <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                            <div className="h-6 bg-gray-200 rounded w-40 mb-4" />
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-full" />
                                <div className="h-4 bg-gray-200 rounded w-5/6" />
                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
