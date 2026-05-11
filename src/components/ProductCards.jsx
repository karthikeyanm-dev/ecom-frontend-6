import React from "react";
import {Link} from "react-router-dom";
import {toast} from "react-toastify/unstyled";

const ProductCards = ({ product,addToCart }) => {
    return (
        <div className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden
                        hover:border-slate-600 hover:-translate-y-1
                        transition-all duration-300 ease-out flex flex-col">

            {/* ── IMAGE ── */}
            <div className="relative h-44 bg-slate-800 overflow-hidden flex items-center justify-center shrink-0">
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-600">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs font-medium tracking-wide">No Image</span>
                    </div>
                )}

                {/* Availability Badge */}
                <div className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-semibold tracking-wide
                    ${product.available
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "bg-slate-700/60 text-slate-400 border border-slate-600/30"
                }`}>
                    {product.available ? "● In Stock" : "● Out of Stock"}
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Thin accent line */}
            <div className="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* ── CONTENT ── */}
            <div className="p-4 flex flex-col flex-1 gap-3">

                {/* Brand + Category */}
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-widest uppercase text-slate-500">
                        {product.brand}
                    </span>
                    {product.category && (
                        <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-400 font-medium">
                            {product.category}
                        </span>
                    )}
                </div>

                {/* Product Name */}
                <h2 className="text-sm font-bold text-slate-100 leading-snug
                               group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                    {product.name}
                </h2>

                {/* Price */}
                <div className="flex items-baseline gap-1 mt-auto">
                    <span className="text-xs text-slate-500 font-medium">₹</span>
                    <span className="text-xl font-bold text-white tracking-tight">
                        {Number(product.price).toLocaleString("en-IN")}
                    </span>
                </div>

                {/* ── BUTTONS ── */}
                <div className="flex gap-2 pt-1">
                    <Link
                        to={`/product/${product.id}`}
                        className="w-[50%]"
                    >
                        <button className="flex-1 w-full py-2 text-xs font-semibold tracking-wide rounded-xl
                                       border border-slate-700 text-slate-300
                                       hover:border-slate-500 hover:text-white hover:bg-slate-800
                                       transition-all duration-200"

                                to={`/product/${product.id}`}
                                style={{
                                    textDecoration: "none",
                                    color: "inherit"
                                }}
                        >
                            View
                        </button>
                    </Link>
                    <button className={`flex-1 w-[50%] py-2 text-xs font-semibold tracking-wide rounded-xl
                                       
                                       
                                       
                                       ${
                                            product.available ? "bg-blue-600 text-white hover:bg-blue-500 active:scale-95 " +
                                                "shadow-md shadow-blue-500/20 hover:shadow-blue-500/40" :
                                                "bg-slate-700/60 text-slate-400 cursor-not-allowed"
                    
                                        }
                                       
                                       
                                       transition-all duration-200
                                       `}

                            disabled={!product.available}
                            onClick={() => {
                                addToCart(product)
                                toast(
                                    <div className="flex items-center gap-3">
                                        {/* Image */}
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-10 h-10 rounded object-cover"
                                        />

                                        {/* Text */}
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold">
                                              {product.name}
                                            </span>
                                            <span className="text-xs text-green-300">
                                              Added to cart
                                            </span>
                                        </div>
                                    </div>,
                                    {
                                        className:
                                            "bg-[#161b27] text-white border border-[#1e2a3a] rounded-xl shadow-lg",
                                    }
                                );
                            }}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>

        </div>
    );
};

export default ProductCards;