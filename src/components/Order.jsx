import React, { useEffect, useState } from "react";
import API from "../axios";

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [expandedOrder, setExpandedOrder] = useState(null);

    // Fetch orders
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await API.get("/orders");
                console.log(res.data)
                setOrders(res.data);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch orders. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // Enhanced status styling with consistent color palette
    const getStatusConfig = (status) => {
        const configs = {
            PLACED: {
                bg: "bg-amber-50 dark:bg-amber-900/20",
                text: "text-amber-700 dark:text-amber-400",
                border: "border-amber-200 dark:border-amber-800",
                dot: "bg-amber-500"
            },
            SHIPPED: {
                bg: "bg-blue-50 dark:bg-blue-900/20",
                text: "text-blue-700 dark:text-blue-400",
                border: "border-blue-200 dark:border-blue-800",
                dot: "bg-blue-500"
            },
            DELIVERED: {
                bg: "bg-emerald-50 dark:bg-emerald-900/20",
                text: "text-emerald-700 dark:text-emerald-400",
                border: "border-emerald-200 dark:border-emerald-800",
                dot: "bg-emerald-500"
            },
            CANCELLED: {
                bg: "bg-rose-50 dark:bg-rose-900/20",
                text: "text-rose-700 dark:text-rose-400",
                border: "border-rose-200 dark:border-rose-800",
                dot: "bg-rose-500"
            }
        };
        return configs[status] || {
            bg: "bg-gray-50 dark:bg-gray-800",
            text: "text-gray-700 dark:text-gray-400",
            border: "border-gray-200 dark:border-gray-700",
            dot: "bg-gray-500"
        };
    };

    // Helpers
    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount);

    const getTotal = (items = []) => {
        return items.reduce((sum, item) => {
            return sum + Number(item.total || 0);
        }, 0);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[70vh] gap-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">Loading orders...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="max-w-md mx-auto mt-20 px-4">
                <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-6 text-center">
                    <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-rose-900 dark:text-rose-200 mb-2">
                        Unable to Load Orders
                    </h3>
                    <p className="text-rose-700 dark:text-rose-400 text-sm">
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    My Orders
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    View and track your order history
                </p>
            </div>

            {/* Stats bar */}
            {orders.length > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 mb-6 border border-blue-100 dark:border-blue-900">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            You have <span className="font-bold text-blue-700 dark:text-blue-400">{orders.length}</span> {orders.length === 1 ? 'order' : 'orders'}
                        </p>
                    </div>
                </div>
            )}

            {/* Empty state */}
            {orders.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        No Orders Yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Start shopping to see your orders here
                    </p>
                    <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200">
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => {
                        const statusConfig = getStatusConfig(order.status);
                        const isExpanded = expandedOrder === order.orderId;

                        return (
                            <div
                                key={order.orderId}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:shadow-md"
                            >
                                {/* Order Header */}
                                <div className="p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">

                                        {/* Order ID & Customer Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                        Order #{order.orderId}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {formatDate(order.orderDate)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="ml-13 space-y-1">
                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {order.customerName}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {order.email}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Status Badge */}
                                        <div className="flex-shrink-0">
                                            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                                                <span className={`w-2 h-2 rounded-full ${statusConfig.dot} animate-pulse`}></span>
                                                {order.status}
                                            </span>
                                        </div>

                                        {/* Total Amount */}
                                        <div className="flex-shrink-0 text-right lg:text-left">
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                                Order Total
                                            </p>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {formatCurrency(getTotal(order.items))}
                                            </p>
                                        </div>

                                        {/* Toggle Button */}
                                        <div className="flex-shrink-0">
                                            <button
                                                onClick={() =>
                                                    setExpandedOrder(
                                                        isExpanded ? null : order.orderId
                                                    )
                                                }
                                                className="w-full lg:w-auto px-5 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                                            >
                                                <span>{isExpanded ? "Hide Details" : "View Details"}</span>
                                                <svg
                                                    className={`w-4 h-4 transition-transform duration-200 ${
                                                        isExpanded ? "rotate-180" : ""
                                                    }`}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Expandable Order Details */}
                                {isExpanded && (
                                    <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-6">
                                        <h4 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            Order Items ({order.items.length})
                                        </h4>

                                        {/* Items Table */}
                                        <div className="space-y-3">
                                            {order.items.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                                                >
                                                    <div className="flex items-center justify-between gap-4">
                                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center">
                                                                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                                </svg>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h5 className="font-semibold text-gray-900 dark:text-white truncate">
                                                                    {item.productName}
                                                                </h5>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                                                    Quantity: <span className="font-medium text-gray-700 dark:text-gray-300">{item.quantity}</span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex-shrink-0 text-right">
                                                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                                {formatCurrency(item.total)}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                {formatCurrency(item.total / item.quantity)} each
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Order Summary */}
                                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                            <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                                            Order Total
                                                        </span>
                                                    </div>
                                                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                        {formatCurrency(getTotal(order.items))}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Order;