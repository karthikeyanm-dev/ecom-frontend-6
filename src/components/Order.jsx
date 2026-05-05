import React, { useEffect, useState } from "react";
import API from "../axios";

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [expandedOrder, setExpandedOrder] = useState(null);

    // ✅ Fetch orders
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await API.get("/orders");
                setOrders(res.data);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // ✅ Status styling
    const statusStyle = (status) => {
        switch (status) {
            case "PLACED":
                return "bg-yellow-100 text-yellow-700";
            case "SHIPPED":
                return "bg-blue-100 text-blue-700";
            case "DELIVERED":
                return "bg-green-100 text-green-700";
            case "CANCELLED":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    // ✅ Helpers
    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount);

    const getTotal = (items) =>
        items.reduce((acc, item) => acc + item.totalPrice, 0);

    // ✅ Loading
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // ✅ Error
    if (error) {
        return (
            <div className="text-center mt-20 text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">

            <h1 className="text-2xl font-bold mb-6 dark:text-white">
                Orders ({orders.length})
            </h1>

            {orders.length === 0 ? (
                <div className="text-center text-gray-500">
                    No orders found
                </div>
            ) : (
                <div className="space-y-4">

                    {orders.map((order) => (
                        <div
                            key={order.orderId}
                            className="bg-white dark:bg-gray-900 rounded-xl shadow p-5"
                        >

                            {/* HEADER */}
                            <div className="flex flex-col md:flex-row md:justify-between gap-3">

                                <div>
                                    <p className="font-semibold">
                                        Order #{order.orderId}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {order.customerName}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        {order.email}
                                    </p>
                                </div>

                                <div className="text-sm text-gray-500">
                                    {new Date(order.orderDate).toLocaleDateString("en-IN")}
                                </div>

                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle(
                                        order.status
                                    )}`}
                                >
                  {order.status}
                </span>

                                <div className="font-bold text-blue-600">
                                    {formatCurrency(getTotal(order.items))}
                                </div>

                                <button
                                    onClick={() =>
                                        setExpandedOrder(
                                            expandedOrder === order.orderId
                                                ? null
                                                : order.orderId
                                        )
                                    }
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    {expandedOrder === order.orderId
                                        ? "Hide"
                                        : "View"}
                                </button>
                            </div>

                            {/* DETAILS */}
                            {expandedOrder === order.orderId && (
                                <div className="mt-4 border-t pt-4">

                                    <h3 className="font-semibold mb-3 dark:text-white">
                                        Order Items
                                    </h3>

                                    <div className="space-y-2">

                                        {order.items.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex justify-between text-sm"
                                            >
                                                <span>{item.productName}</span>
                                                <span>Qty: {item.quantity}</span>
                                                <span className="font-medium">
                          {formatCurrency(item.totalPrice)}
                        </span>
                                            </div>
                                        ))}

                                    </div>

                                    <div className="mt-3 border-t pt-2 flex justify-between font-semibold">
                                        <span>Total</span>
                                        <span>
                      {formatCurrency(getTotal(order.items))}
                    </span>
                                    </div>

                                </div>
                            )}

                        </div>
                    ))}

                </div>
            )}
        </div>
    );
};

export default Order;