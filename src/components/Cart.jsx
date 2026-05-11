import React, { useContext, useEffect, useState } from "react";
import AppContext from "../context/Context.jsx";
import API from "../axios";
import CheckoutPopup from "./CheckoutPopup";
import {Link} from "react-router-dom";
import {toast} from "react-toastify/unstyled";

const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const res = await API.get(`/product/${item.id}/image`, {
                    responseType: "blob",
                });
                setImageUrl(URL.createObjectURL(res.data));
            } catch {
                setImageUrl(null);
            }
        };
        fetchImage();

        return () => {
            if (imageUrl) URL.revokeObjectURL(imageUrl);
        };
    }, [item.id]);

    return (
        <div className="flex items-center gap-4 bg-[#161b27] border border-[#1e2a3a] rounded-xl px-4 py-3">
            {/* Image */}
            <img
                src={imageUrl || "/placeholder.png"}
                alt={item.name}
                className="w-14 h-14 rounded-lg object-cover bg-[#1e2a3a] flex-shrink-0"
            />

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-100 truncate">{item.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.brand}</p>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onDecrease(item.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-md border border-[#1e3a5f] bg-[#0d1f35] text-blue-300 hover:bg-[#1e3a5f] text-lg leading-none"
                >
                    −
                </button>
                <span className="w-5 text-center text-sm text-slate-200">{item.quantity}</span>
                <button
                    onClick={() => onIncrease(item.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-md border border-[#1e3a5f] bg-[#0d1f35] text-blue-300 hover:bg-[#1e3a5f] text-lg leading-none"
                >
                    +
                </button>
            </div>

            {/* Price */}
            <p className="w-20 text-right text-sm font-bold text-blue-400">
                ₹{(item.price * item.quantity).toLocaleString()}
            </p>

            {/* Remove */}
            <button
                onClick={() => onRemove(item.id)}
                className="text-slate-600 hover:text-red-500 text-sm px-1"
            >
                ✕
            </button>
        </div>
    );
};

const Cart = () => {
    const { cart, removeFromCart, clearCart } = useContext(AppContext);

    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState("");
    const [emailId, setEmailId] = useState("");

    useEffect(() => {
        setCartItems(cart.length ? cart : []);
    }, [cart]);

    useEffect(() => {
        const total = cartItems.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );
        setTotalPrice(total);
    }, [cartItems]);


    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

    const increaseQty = (id) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id && item.quantity < item.stockQuantity
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );

    };

    const decreaseQty = (id) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity - 1) }
                    : item
            )
        );
    };

    const removeItem = (id) => {
        removeFromCart(id);
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const handleCheckout = async () => {
        try {

            const orderRequest = {
                customerName: name,
                email: emailId,
                items: cartItems.map((item) => ({
                    productId: item.id,
                    quantity: item.quantity,
                })),
            };

            const response = await API.post(
                "/orders/place",
                orderRequest
            );

            console.log("Order placed:", response.data);
            toast(response.data.message);
            clearCart();
            setCartItems([]);
            setShowModal(false);

            setName("");
            setEmailId("");

        } catch (err) {
            console.error("Checkout error:", err);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <p className="text-2xl mb-2">🛒</p>
                <p className="text-slate-500 text-sm">Your cart is empty</p>
                <Link
                    to="/"
                    className="relative flex items-center gap-1.5 px-3 h-10 px-20 py-5 mt-5 rounded-lg bg-[#161b27] border border-[#1e2a3a] text-slate-300 hover:text-white hover:border-blue-500 text-sm font-medium transition-colors"
                >
                    Shop Now
                </Link>

            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-10">
            {/* Header */}
            <h1 className="text-xl font-bold text-white mb-1">Shopping Cart</h1>
            <p className="text-xs text-slate-500 mb-6">{cartItems.length} item{cartItems.length > 1 ? "s" : ""}</p>

            {/* Items */}
            <div className="space-y-2">
                {cartItems.map((item) => (
                    <CartItem
                        key={item.id}
                        item={item}
                        onIncrease={increaseQty}
                        onDecrease={decreaseQty}
                        onRemove={removeItem}
                    />
                ))}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center border-t border-[#1e2a3a] mt-6 pt-5">
                <span className="text-sm text-slate-400 font-medium">Total</span>
                <span className="text-2xl font-extrabold text-blue-400">
                    ₹{totalPrice.toLocaleString()}
                </span>
            </div>

            {/* Checkout */}
            <button
                onClick={() => setShowModal(true)}
                className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
                Proceed to Checkout
            </button>

            <CheckoutPopup
                show={showModal}
                handleClose={() => setShowModal(false)}
                cartItems={cartItems}
                totalPrice={totalPrice}
                handleCheckout={handleCheckout}
                setName={setName}
                name={name}
                emaiId={emailId}
                setEmailId={setEmailId}

            />
        </div>
    );
};

export default Cart;