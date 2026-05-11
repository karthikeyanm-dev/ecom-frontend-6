import React, { useState, useRef, useEffect } from "react";

const DEFAULT_CATEGORIES = ["Laptop", "Mobile", "Headphone", "Electronics", "Toys", "Fashion"];

const CategoryInput = ({ value, onChange }) => {
    const [open, setOpen]         = useState(false);
    const [search, setSearch]     = useState(value || "");
    const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
    const containerRef = useRef();

    // Sync external value → internal search text
    useEffect(() => { setSearch(value || ""); }, [value]);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (!containerRef.current?.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const filtered = categories.filter(c =>
        c.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (cat) => {
        setSearch(cat);
        onChange({ target: { name: "category", value: cat } });
        setOpen(false);
    };

    const handleInputChange = (e) => {
        setSearch(e.target.value);
        onChange({ target: { name: "category", value: e.target.value } });
        setOpen(true);
    };

    // Add new category if it doesn't already exist
    const handleAddNew = () => {
        const trimmed = search.trim();
        if (!trimmed || categories.includes(trimmed)) return;
        setCategories(prev => [...prev, trimmed]);
        handleSelect(trimmed);
    };

    const showAddNew = search.trim() &&
        !categories.some(c => c.toLowerCase() === search.trim().toLowerCase());

    return (
        <div ref={containerRef} className="relative">
            <label className="block text-xs font-semibold tracking-widest uppercase text-slate-400 mb-1.5">
                Category
            </label>

            {/* Input row */}
            <div className={`flex items-center bg-slate-800/60 border rounded-xl px-4 py-2.5
                             transition-all duration-200 hover:border-slate-600
                             ${open ? "border-blue-500 ring-2 ring-blue-500/60" : "border-slate-700"}`}>
                <input
                    type="text"
                    value={search}
                    onChange={handleInputChange}
                    onFocus={() => setOpen(true)}
                    placeholder="Select or type a category..."
                    className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500
                               focus:outline-none"
                />
                {/* Chevron toggle */}
                <button
                    type="button"
                    onClick={() => setOpen(o => !o)}
                    className="ml-2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                    <svg className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            {/* Dropdown */}
            {open && (
                <div className="absolute z-50 mt-1.5 w-full bg-slate-900 border border-slate-700
                                rounded-xl shadow-xl shadow-black/40 overflow-hidden">

                    <ul className="max-h-48 overflow-y-auto py-1">
                        {filtered.length > 0 ? filtered.map(cat => (
                            <li key={cat}>
                                <button
                                    type="button"
                                    onClick={() => handleSelect(cat)}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-150
                                                flex items-center justify-between
                                                ${value === cat
                                        ? "text-blue-400 bg-blue-500/10"
                                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                    }`}
                                >
                                    {cat}
                                    {value === cat && (
                                        <svg className="w-3.5 h-3.5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15 3.293 9.879a1 1 0 011.414-1.414L8.414 12.172l6.879-6.879a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            </li>
                        )) : (
                            <li className="px-4 py-3 text-xs text-slate-500 text-center">
                                No matching categories
                            </li>
                        )}
                    </ul>

                    {/* Add new option */}
                    {showAddNew && (
                        <>
                            <div className="h-px bg-slate-800 mx-3" />
                            <button
                                type="button"
                                onClick={handleAddNew}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm
                                           text-blue-400 hover:bg-blue-500/10 transition-colors duration-150"
                            >
                                <span className="w-5 h-5 rounded-md bg-blue-500/20 border border-blue-500/40
                                                 flex items-center justify-center text-xs font-bold">+</span>
                                Add <span className="font-semibold">"{search.trim()}"</span> as new category
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default CategoryInput;