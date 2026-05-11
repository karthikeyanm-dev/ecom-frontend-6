import "./App.css";
import React, { useState } from "react";

import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import AddProduct from "./components/AddProduct";
import Product from "./components/Product";
import Footer from "./components/Footer";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/Context.jsx";
import UpdateProduct from "./components/UpdateProduct.jsx";
import {ToastContainer} from "react-toastify/unstyled";
import Order from "./components/Order.jsx";
import SearchResults from "./components/SearchResults.jsx";
import "react-toastify/dist/ReactToastify.css";
import {Slide} from "react-toastify";

function App() {
    const [selectedCategory, setSelectedCategory] = useState("");

    //  Category filter
    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };


    return (
        <AppProvider>
            <BrowserRouter>
                <div className="bg-slate-950 min-h-screen flex flex-col">  {/* 👈 */}
                    <ToastContainer
                        autoClose={2000}
                        hideProgressBar={false}
                        theme={"dark"}
                        pauseOnHover
                        transition={Slide}
                    />

                    <Navbar onSelectCategory={handleCategorySelect} />

                    <main className="pt-16 min-h-screen flex-1">
                        <Routes>
                            <Route path="/" element={<Home selectedCategory={selectedCategory} />} />
                            <Route path="/add-product" element={<AddProduct />} />
                            <Route path="/product/:id" element={<Product />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/product/update/:id" element={<UpdateProduct />} />
                            <Route path="/orders" element={<Order />} />
                            <Route path="/search-results" element={<SearchResults />} />
                        </Routes>
                    </main>

                    <Footer />
                </div>
            </BrowserRouter>
        </AppProvider>
    );
}

export default App;