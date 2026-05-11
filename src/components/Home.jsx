import React, { useContext, useEffect, useState } from 'react'
import ProductCards from "./ProductCards.jsx";
import { Link } from "react-router-dom";
import AppContext from "../context/Context.jsx";

const Home = ({ selectedCategory }) => {

    const [allProducts, setAllProducts] = useState([]);
    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [error, setError] = useState(false);

    const { data, refreshData, cart, addToCart, removeFromCart, } = useContext(AppContext);




    useEffect(() => {
        const fetchProductsWithImages = async () => {

            try {

                setLoading(true);

                const res = await fetch("http://localhost:8080/api/products");

                const data = await res.json();

                const updatedProducts = await Promise.all(
                    data.map(async (product) => {

                        try {

                            const imgRes = await fetch(
                                `http://localhost:8080/api/product/${product.id}/image`
                            );

                            const blob = await imgRes.blob();

                            const imageUrl = URL.createObjectURL(blob);

                            return {
                                ...product,
                                imageUrl
                            };

                        } catch {

                            return {
                                ...product,
                                imageUrl: null
                            };
                        }
                    })
                );

                setAllProducts(updatedProducts);
                setProducts(updatedProducts);

            } catch (err) {

                setError(true);
                setErrorMessage(err.message);

            } finally {

                setLoading(false);
            }
        };

        fetchProductsWithImages();

    }, []);

    useEffect(() => {

        if (!selectedCategory || selectedCategory === "ALL") {

            setProducts(allProducts);

            return;
        }

        const filteredProducts = allProducts.filter(
            (product) =>
                product.category.toLowerCase() ===
                selectedCategory.toLowerCase()
        );

        setProducts(filteredProducts);

    }, [selectedCategory, allProducts]);



    if (loading) {

        return (
            <div className="flex justify-center items-center w-full h-[50%]">
                <img
                    src="/loading.gif"
                    alt="loading"
                    className="w-[50%] h-[50%]"
                />
            </div>
        );
    }

    if (error) {

        return (
            <div className="flex justify-center items-center min-h-[50%] h-100vh w-full">
                <img
                    src="/error.gif"
                    alt="error"
                    className="w-40 h-full object-contain"
                />
            </div>
        );
    }

    return (

        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {products.map((product) => (


                    <ProductCards product={product}
                        addToCart={addToCart}
                    />
            ))}

        </div>
    );
};

export default Home;