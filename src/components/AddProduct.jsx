import React, { useState, useRef } from "react";
import axios from "../axios";
import CategoryInput from "./CategoryInput.jsx";
import {toast} from "react-toastify/unstyled";

const CATEGORIES = ["Laptop", "Mobile", "Headphone", "Electronics", "Toys", "Fashion"];

const InputField = ({ label, name, type = "text", value, onChange, placeholder }) => (
    <div className="group relative">
        <label className="block text-xs font-semibold tracking-widest uppercase text-slate-400 mb-1.5">
            {label}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-slate-800/60 border border-slate-700 text-slate-100 placeholder-slate-500
                       px-4 py-2.5 rounded-xl text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500
                       hover:border-slate-600 transition-all duration-200"
        />
    </div>
);


const AddProduct = () => {
    const [product, setProduct] = useState({
        name: "", brand: "", description: "", price: "",
        category: "", stockQuantity: "", releaseDate: "", available: false,
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleImageFile = (file) => {
        if (!file) return;
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleImageChange = (e) => handleImageFile(e.target.files[0]);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        handleImageFile(e.dataTransfer.files[0]);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("image", image);
            formData.append("product", new Blob([JSON.stringify(product)], { type: "application/json" }));
            const res = await axios.post("/product", formData);
            toast("Product added successfully");
            console.log(res.data);
            setProduct({ name: "", brand: "", description: "", price: "", category: "", stockQuantity: "", releaseDate: "", available: false });
            setImage(null);
            setPreview(null);
        } catch (err) {
            console.error(err);
            toast("Failed to add product " + err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 px-4 py-10 font-sans">

            {/* Page Header */}
            <div className="max-w-5xl mx-auto mb-8 flex items-center gap-3">
                <div className="w-1 h-8 rounded-full bg-blue-500" />
                <div>
                    <p className="text-xs font-semibold tracking-widest uppercase text-blue-400 mb-0.5">
                        Inventory Management
                    </p>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                        Add New Product
                    </h1>
                </div>
            </div>

            <div className="max-w-5xl mx-auto">
                <form onSubmit={submitHandler} className="grid lg:grid-cols-5 gap-6">

                    {/* ── Left Column (details) ── */}
                    <div className="lg:col-span-3 space-y-5">

                        {/* Basic Info Card */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                            <SectionHeading icon="📦" title="Basic Information" />
                            <div className="grid sm:grid-cols-2 gap-4">
                                <InputField label="Product Name" name="name" value={product.name}
                                            onChange={handleInputChange} placeholder="e.g. Sony WH-1000XM5" />
                                <InputField label="Brand" name="brand" value={product.brand}
                                            onChange={handleInputChange} placeholder="e.g. Sony" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold tracking-widest uppercase text-slate-400 mb-1.5">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={product.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    placeholder="Write a compelling product description..."
                                    className="w-full bg-slate-800/60 border border-slate-700 text-slate-100 placeholder-slate-500
                                               px-4 py-2.5 rounded-xl text-sm resize-none
                                               focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500
                                               hover:border-slate-600 transition-all duration-200"
                                />
                            </div>
                        </div>

                        {/* Pricing & Inventory Card */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                            <SectionHeading icon="🏷️" title="Pricing & Inventory" />
                            <div className="grid sm:grid-cols-2 gap-4">
                                {/* Price with ₹ prefix */}
                                <div>
                                    <label className="block text-xs font-semibold tracking-widest uppercase text-slate-400 mb-1.5">
                                        Price (₹)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">₹</span>
                                        <input
                                            type="number"
                                            name="price"
                                            value={product.price}
                                            onChange={handleInputChange}
                                            placeholder="0.00"
                                            className="w-full bg-slate-800/60 border border-slate-700 text-slate-100 placeholder-slate-500
                                                       pl-8 pr-4 py-2.5 rounded-xl text-sm
                                                       focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500
                                                       hover:border-slate-600 transition-all duration-200"
                                        />
                                    </div>
                                </div>
                                <InputField label="Stock Quantity" name="stockQuantity" type="number"
                                            value={product.stockQuantity} onChange={handleInputChange} placeholder="0" />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {/* Category */}
                                <div>
                                    <CategoryInput
                                        value={product.category}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <InputField label="Release Date" name="releaseDate" type="date"
                                            value={product.releaseDate} onChange={handleInputChange} />
                            </div>
                        </div>
                    </div>

                    {/* ── Right Column (image + availability + submit) ── */}
                    <div className="lg:col-span-2 space-y-5">

                        {/* Image Upload Card */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                            <SectionHeading icon="🖼️" title="Product Image" />

                            {/* Drop Zone */}
                            <div
                                onClick={() => fileInputRef.current.click()}
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                                className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 overflow-hidden
                                    ${dragOver
                                    ? "border-blue-400 bg-blue-500/10"
                                    : "border-slate-700 hover:border-slate-500 bg-slate-800/40"
                                }`}
                                style={{ minHeight: "180px" }}
                            >
                                {preview ? (
                                    <>
                                        <img src={preview} alt="Preview"
                                             className="w-full h-full object-cover rounded-xl" style={{ maxHeight: "220px" }} />
                                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 hover:opacity-100 transition-opacity
                                                        flex flex-col items-center justify-center gap-1 rounded-xl">
                                            <span className="text-2xl">🔄</span>
                                            <span className="text-xs text-slate-300 font-medium">Click to replace</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
                                        <div className="w-12 h-12 rounded-full bg-slate-700/60 flex items-center justify-center text-2xl">
                                            📂
                                        </div>
                                        <p className="text-sm font-medium text-slate-300">Drop image here</p>
                                        <p className="text-xs text-slate-500">or click to browse · PNG, JPG, WEBP</p>
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                            {image && (
                                <p className="text-xs text-slate-400 truncate">
                                    <span className="text-green-400 font-medium">✓</span> {image.name}
                                </p>
                            )}
                        </div>

                        {/* Availability Card */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-slate-200">Product Availability</p>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        {product.available ? "Listed & visible to customers" : "Hidden from the storefront"}
                                    </p>
                                </div>
                                {/* Toggle switch */}
                                <button
                                    type="button"
                                    onClick={() => setProduct({ ...product, available: !product.available })}
                                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none
                                        ${product.available ? "bg-blue-500" : "bg-slate-700"}`}
                                >
                                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow
                                        transition-transform duration-300 ${product.available ? "translate-x-6" : "translate-x-0"}`}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200
                                ${loading
                                ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
                            }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                                    </svg>
                                    Adding Product...
                                </span>
                            ) : "Add Product →"}
                        </button>

                        {/* Discard link */}
                        <button type="button"
                                onClick={() => {
                                    setProduct({ name: "", brand: "", description: "", price: "", category: "", stockQuantity: "", releaseDate: "", available: false });
                                    setImage(null); setPreview(null);
                                }}
                                className="w-full py-2.5 rounded-xl text-xs font-semibold tracking-wide text-slate-500
                                       hover:text-slate-300 hover:bg-slate-800 transition-all duration-200">
                            Discard Changes
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

const SectionHeading = ({ icon, title }) => (
    <div className="flex items-center gap-2 pb-1 border-b border-slate-800">
        <span className="text-base">{icon}</span>
        <h3 className="text-xs font-bold tracking-widest uppercase text-slate-400">{title}</h3>
    </div>
);

export default AddProduct;