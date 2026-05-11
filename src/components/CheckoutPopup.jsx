import React, { useEffect, useState } from "react";
import API from "../axios";

const CheckoutPopup = ({
                           show,
                           handleClose,
                           cartItems,
                           totalPrice,
                           handleCheckout,
                           setName,
                           setEmailId,
                           name,
                           emailId,
                       }) => {
    const [imageUrls, setImageUrls] = useState({});

    // Customer Details


    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!show) return;

        const fetchImages = async () => {
            const urls = {};

            for (const item of cartItems) {
                try {
                    const res = await API.get(`/product/${item.id}/image`, {
                        responseType: "blob",
                    });

                    urls[item.id] = URL.createObjectURL(res.data);
                } catch {
                    urls[item.id] = null;
                }
            }

            setImageUrls(urls);
        };

        fetchImages();

        return () => {
            Object.values(imageUrls).forEach(
                (url) => url && URL.revokeObjectURL(url)
            );
        };
    }, [show]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-lg mx-4 bg-[#161b27] border border-[#1e2a3a] rounded-xl p-5">

                {/* Header */}
                <div className="flex justify-between items-center border-b border-[#1e2a3a] pb-3 mb-4">
                    <h2 className="text-base font-bold text-white">
                        Order Summary
                    </h2>

                    <button
                        onClick={handleClose}
                        className="text-slate-500 hover:text-red-500 text-sm"
                    >
                        ✕
                    </button>
                </div>

                {/* Customer Fields */}
                <div className="space-y-3 mb-4">

                    <div>
                        <label className="block text-sm text-slate-400 mb-1">
                            Name
                        </label>

                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-[#0f1722] border border-[#1e2a3a] text-white outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-slate-400 mb-1">
                            Email ID
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={emailId}
                            onChange={(e) => setEmailId(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-[#0f1722] border border-[#1e2a3a] text-white outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Items */}
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {cartItems.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center gap-3 border-b border-[#1e2a3a] pb-3"
                        >
                            <img
                                src={imageUrls[item.id] || "/placeholder.png"}
                                alt={item.name}
                                className="w-12 h-12 rounded-lg object-cover bg-[#1e2a3a] flex-shrink-0"
                            />

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-100 truncate">
                                    {item.name}
                                </p>

                                <p className="text-xs text-slate-500 mt-0.5">
                                    Qty: {item.quantity}
                                </p>
                            </div>

                            <p className="text-sm font-bold text-blue-400">
                                ₹
                                {(item.price * item.quantity).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center border-t border-[#1e2a3a] mt-4 pt-4">
                    <span className="text-sm text-slate-400">
                        Total
                    </span>

                    <span className="text-xl font-extrabold text-blue-400">
                        ₹{totalPrice.toLocaleString()}
                    </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-5">

                    <button
                        onClick={handleClose}
                        className="flex-1 py-2.5 rounded-lg border border-[#1e2a3a] text-slate-400 hover:bg-[#1e2a3a] text-sm"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleCheckout}
                        disabled={loading}
                        className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold disabled:opacity-50"
                    >
                        {loading ? "Placing Order..." : "Confirm Purchase"}
                    </button>

                </div>
            </div>
        </div>
    );
};

export default CheckoutPopup;