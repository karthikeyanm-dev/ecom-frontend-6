import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppContext from "../context/Context.jsx";
import {toast} from "react-toastify/unstyled";

const SearchResults = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { addToCart } = useContext(AppContext);

    const [searchData, setSearchData] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ Load search results
    useEffect(() => {
        if (location.state?.searchData) {
            setSearchData(location.state.searchData);
            setLoading(false);
        } else {
            navigate("/");
        }
    }, [location, navigate]);

    // ✅ Image handling
    const getImage = (img) => {
        if (!img) return null;

        if (img.startsWith("data:") || img.startsWith("http")) {
            return img;
        }

        return `data:image/jpeg;base64,${img}`;
    };

    const handleAdd = (product) => {
        addToCart({
            ...product,
            productId: product.productId || product.id,
        });
        toast.success("Product added successfully.");
    };

    // ✅ Loading UI
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );

    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">

            <h1 className="text-2xl font-bold mb-2 dark:text-white">
                Search Results
            </h1>

            <p className="text-gray-500 mb-6">
                {searchData.length} product(s) found
            </p>

            {/* EMPTY */}
            {searchData.length === 0 ? (
                <div className="text-center text-gray-500 mt-20">
                    No products found 😕
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                    {searchData.map((product) => (
                        <div
                            key={product.productId || product.id}
                            className="group bg-white dark:bg-gray-900 rounded-2xl shadow hover:shadow-xl transition overflow-hidden border dark:border-gray-800"
                        >

                            {/* IMAGE */}
                            <div
                                className="h-40 bg-gray-100 dark:bg-gray-800 flex items-center justify-center cursor-pointer"
                                onClick={() =>
                                    navigate(`/product/${product.productId || product.id}`)
                                }
                            >
                                {product.productImage ? (
                                    <img
                                        src={getImage(product.productImage)}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition"
                                    />
                                ) : (
                                    <span className="text-gray-400 text-sm">
                    No Image
                  </span>
                                )}
                            </div>

                            {/* CONTENT */}
                            <div className="p-4">

                                <p className="text-sm text-gray-500">
                                    {product.brand}
                                </p>

                                <h2 className="font-semibold dark:text-white group-hover:text-blue-500">
                                    {product.name}
                                </h2>

                                <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded mt-1 inline-block">
                  {product.category}
                </span>

                                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                                    {product.description}
                                </p>

                                <div className="flex justify-between items-center mt-3">

                  <span className="font-bold text-blue-600">
                    ₹{new Intl.NumberFormat("en-IN").format(product.price)}
                  </span>

                                    <span
                                        className={`text-xs ${
                                            product.available && product.stockQuantity > 0
                                                ? "text-green-500"
                                                : "text-red-500"
                                        }`}
                                    >
                    {product.available && product.stockQuantity > 0
                        ? "In Stock"
                        : "Out of Stock"}
                  </span>
                                </div>

                                {/* ACTIONS */}
                                <div className="flex gap-2 mt-4">

                                    <button
                                        onClick={() =>
                                            navigate(`/product/${product.productId || product.id}`)
                                        }
                                        className="flex-1 px-3 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                                    >
                                        View
                                    </button>

                                    <button
                                        onClick={() => handleAdd(product)}
                                        disabled={
                                            !product.available || product.stockQuantity <= 0
                                        }
                                        className={`flex-1 px-3 py-2 rounded-lg text-white ${
                                            product.available && product.stockQuantity > 0
                                                ? "bg-blue-600 hover:bg-blue-700"
                                                : "bg-gray-400 cursor-not-allowed"
                                        }`}
                                    >
                                        Add
                                    </button>

                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchResults;