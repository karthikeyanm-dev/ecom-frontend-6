import React, {useContext, useEffect, useRef, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../axios";
import AppContext from "../context/Context.jsx";
import {toast} from "react-toastify/unstyled";

const Navbar = ({ onSelectCategory }) => {

    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [input, setInput] = useState("");
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showNoProducts, setShowNoProducts] = useState(false);
    const { cart } = useContext(AppContext);
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const dropdownRef = useRef(null);
    const searchRef = useRef(null);
    const navigate = useNavigate();
    const[categories, setCategory] = useState(["Laptop", "Mobile", "Headphone", "Electronics", "Toys", "Fashion"]);


    // ── Theme ──────────────────────────────────────────────
    const toggleTheme = () => {
        const next = theme === "dark" ? "light" : "dark";
        setTheme(next);
        localStorage.setItem("theme", next);
    };

    useEffect(()=>{
        const fetchCategories = async () => {
            try{
                const res = await API.get(`/products/all-categories`);
                const productCategories = res.data;
                console.log(productCategories);
                setCategory(productCategories);
            }catch(err){
                console.log(err);
                toast(err)
            }
        }
        fetchCategories();
    },[location.pathname]);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        console.log(cart.length);
    }, [theme]);

    // ── Close dropdowns on outside click ──────────────────
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target))
                setDropdownOpen(false);
            if (searchRef.current && !searchRef.current.contains(e.target))
                setShowResults(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // ── Search ─────────────────────────────────────────────
    const handleSearch = async (value) => {
        setInput(value);
        if (!value.trim()) { setShowResults(false); setResults([]); return; }
        setIsLoading(true);
        setShowResults(true);
        try {
            const res = await API.get(`/products/search?keyword=${value}`);
            setResults(res.data);
        } catch {
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResultClick = (id) => {
        setShowResults(false);
        setInput("");
        navigate(`/product/${id}`);
    };

    // ── Nav link style ─────────────────────────────────────
    const navLink = "text-slate-400 hover:text-white text-sm font-medium transition-colors";

    return (
        <header className="fixed top-0 w-full z-50">

            {/* Top accent bar */}
            <div className="bg-blue-600 text-white text-xs py-1 text-center tracking-wide">
                Free shipping on orders above ₹999
            </div>

            {/* Main nav */}
            <nav className="bg-[#0f1117] border-b border-[#1e2a3a]">
                <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-6">

                    {/* Logo */}
                    <Link to="/" className="text-white font-extrabold text-lg tracking-tight shrink-0">
                        Gopal<span className="text-blue-400">Cart</span>
                    </Link>

                    {/* Desktop links */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/" className={navLink}>Home</Link>
                        <Link to="/add-product" className={navLink}>Add Product</Link>
                        <Link to="/orders" className={navLink}>Orders</Link>

                        {/* Categories dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className={`${navLink} flex items-center gap-1`}
                            >
                                Categories
                                <svg className={`w-3 h-3 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {dropdownOpen && (
                                <div className="absolute top-8 left-0 w-44 bg-[#161b27] border border-[#1e2a3a] rounded-lg shadow-xl overflow-hidden">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.categoryId}
                                            onClick={() => { onSelectCategory(cat.categories); setDropdownOpen(false); }}
                                            className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-[#1e2a3a] hover:text-white transition-colors"
                                        >
                                            {cat.categories}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="hidden md:flex items-center gap-3 flex-1 justify-end">


                        {/* Search */}
                        <div className="relative" ref={searchRef}>
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();

                                    if (!input.trim()) return;

                                    setIsLoading(true);

                                    try {
                                        const res = await API.get(
                                            `/products/search?keyword=${input}`
                                        );

                                        if (res.data.length === 0) {
                                            setShowResults(false);
                                            setResults([]);
                                            setShowNoProducts(true);
                                        } else {
                                            setShowNoProducts(false);
                                            navigate("/search-results", {
                                                state: { searchData: res.data },
                                            });
                                        }
                                    } catch (err) {
                                        console.error(err);
                                        setShowNoProducts(true);
                                    } finally {
                                        setIsLoading(false);
                                    }
                                }}
                                className="flex items-center bg-[#161b27] border border-[#1e2a3a] rounded-lg px-3 h-9 gap-2 w-60 focus-within:border-blue-500"
                            >
                                <svg
                                    className="w-4 h-4 text-slate-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                                    />
                                </svg>

                                <input
                                    value={input}
                                    onChange={(e) => {
                                        setInput(e.target.value);
                                        setShowNoProducts(false);
                                    }}
                                    placeholder="Search products..."
                                    className="bg-transparent text-sm text-white placeholder-slate-500 outline-none w-full"
                                />

                                {/* Button / Loader */}
                                {isLoading ? (
                                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <button
                                        type="submit"
                                        className="text-xs text-blue-400 hover:text-white"
                                    >
                                        Search
                                    </button>
                                )}
                            </form>

                            {/* ❗ No Results Message */}
                            {showNoProducts && (
                                <div className="absolute top-11 left-0 w-full bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-3 py-2 rounded-lg">
                                    No products found
                                </div>
                            )}
                        </div>

                        {/* Cart */}
                        <Link
                            to="/cart"
                            className="relative flex items-center gap-1.5 px-3 h-9 rounded-lg bg-[#161b27] border border-[#1e2a3a] text-slate-300 hover:text-white hover:border-blue-500 text-sm font-medium transition-colors"
                        >

                            {/* 🛒 Icon wrapper */}
                            <div className="relative">

                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13M7 13L5.4 5M10 21a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm8 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"
                                    />
                                </svg>

                                {/* 🔴 Badge */}
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-[1px] rounded-full min-w-[16px] text-center leading-none shadow">
                                        {cartCount}
                                    </span>
                                )}
                            </div>

                            Cart
                        </Link>

                        {/* Theme toggle */}
                        <button
                            onClick={toggleTheme}
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#161b27] border border-[#1e2a3a] text-slate-400 hover:text-white hover:border-blue-500 transition-colors text-base"
                        >
                            {theme === "dark" ? "☀️" : "🌙"}
                        </button>
                    </div>

                    {/* Mobile toggle */}
                    <button
                        className="md:hidden text-slate-400 hover:text-white"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>
                </div>

                {/* Mobile menu */}
                {menuOpen && (
                    <div className="md:hidden border-t border-[#1e2a3a] px-4 py-4 space-y-1 bg-[#0f1117]">
                        {[{ to: "/", label: "Home" }, { to: "/add-product", label: "Add Product" }, { to: "/orders", label: "Orders" }, { to: "/cart", label: "Cart" }].map(({ to, label }) => (
                            <Link
                                key={to}
                                to={to}
                                onClick={() => setMenuOpen(false)}
                                className="block px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-[#161b27] hover:text-white transition-colors"
                            >
                                {label}
                            </Link>
                        ))}

                        <div className="pt-2 border-t border-[#1e2a3a]">
                            <p className="text-xs text-slate-500 px-3 mb-2">Categories</p>
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => { onSelectCategory(cat); setMenuOpen(false); }}
                                    className="w-full text-left px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-[#161b27] rounded-lg transition-colors"
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="pt-2 border-t border-[#1e2a3a]">
                            <div className="flex items-center bg-[#161b27] border border-[#1e2a3a] rounded-lg px-3 h-9 gap-2">
                                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                                </svg>
                                <input
                                    value={input}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    placeholder="Search products..."
                                    className="bg-transparent text-sm text-white placeholder-slate-500 outline-none w-full"
                                />
                            </div>
                            {showResults && results.length > 0 && (
                                <div className="mt-1 bg-[#161b27] border border-[#1e2a3a] rounded-lg overflow-hidden">
                                    {results.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => { handleResultClick(item.id); setMenuOpen(false); }}
                                            className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-[#1e2a3a] border-b border-[#1e2a3a] last:border-0"
                                        >
                                            {item.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Navbar;