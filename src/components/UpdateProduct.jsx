import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../axios";

const UpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        brand: "",
        description: "",
        price: "",
        category: "",
        stockQuantity: "",
        releaseDate: "",
        available: false,
    });

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await API.get(`/products/${id}`);
                const data = res.data;
                const p = data["product"] || data;
                setProduct(p);
                setFormData(p);

                if (p?.imageName) {
                    const imgRes = await API.get(`/product/${id}/image`, {
                        responseType: "blob",
                    });
                    setPreview(URL.createObjectURL(imgRes.data));
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    };

    const handleImageChange = (file) => {
        if (!file) return;
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) handleImageChange(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const data = new FormData();
            if (image) data.append("image", image);
            data.append("product", new Blob([JSON.stringify(formData)], { type: "application/json" }));
            await API.put(`/product/${id}`, data);
            alert("✅ Product updated successfully");
            navigate(`/product/${id}`);
        } catch (err) {
            console.error(err);
            alert("❌ Failed to update product");
        } finally {
            setSubmitting(false);
        }
    };

    if (!product) {
        return (
            <div style={styles.loaderWrap}>
                <div style={styles.loader} />
            </div>
        );
    }

    return (
        <>
            <style>{css}</style>
            <div style={styles.page}>
                {/* Decorative background blobs */}
                <div style={styles.blob1} />
                <div style={styles.blob2} />

                <div style={styles.container}>
                    {/* Header */}
                    <div style={styles.header}>
                        <button onClick={() => navigate(-1)} style={styles.backBtn}>
                            ← Back
                        </button>
                        <div>
                            <p style={styles.eyebrow}>PRODUCT #{id}</p>
                            <h1 style={styles.title}>Edit Product</h1>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} style={styles.form}>
                        {/* LEFT COLUMN */}
                        <div style={styles.leftCol}>

                            {/* Image Upload */}
                            <div
                                style={{ ...styles.dropZone, ...(dragOver ? styles.dropZoneActive : {}) }}
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                                onClick={() => document.getElementById("fileInput").click()}
                            >
                                {preview ? (
                                    <>
                                        <img src={preview} alt="preview" style={styles.previewImg} />
                                        <div style={styles.previewOverlay}>
                                            <span style={styles.previewOverlayText}>Change Image</span>
                                        </div>
                                    </>
                                ) : (
                                    <div style={styles.dropPlaceholder}>
                                        <div style={styles.uploadIcon}>⬆</div>
                                        <p style={styles.dropText}>Drop image here</p>
                                        <p style={styles.dropSubText}>or click to browse</p>
                                    </div>
                                )}
                                <input
                                    id="fileInput"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    onChange={(e) => handleImageChange(e.target.files[0])}
                                />
                            </div>

                            {/* Availability Toggle */}
                            <div style={styles.toggleCard}>
                                <div>
                                    <p style={styles.toggleLabel}>Availability</p>
                                    <p style={styles.toggleSub}>
                                        {formData.available ? "Visible to buyers" : "Hidden from store"}
                                    </p>
                                </div>
                                <label style={styles.switch}>
                                    <input
                                        type="checkbox"
                                        name="available"
                                        checked={formData.available}
                                        onChange={handleChange}
                                        style={{ display: "none" }}
                                    />
                                    <span style={{
                                        ...styles.track,
                                        background: formData.available ? "#169af9" : "#374151",
                                    }}>
                                        <span style={{
                                            ...styles.thumb,
                                            transform: formData.available ? "translateX(24px)" : "translateX(2px)",
                                        }} />
                                    </span>
                                </label>
                            </div>

                            {/* Stock */}
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>STOCK QTY</label>
                                <input
                                    type="number"
                                    name="stockQuantity"
                                    value={formData.stockQuantity}
                                    onChange={handleChange}
                                    style={styles.input}
                                    placeholder="0"
                                    className="up-input"
                                />
                            </div>

                            {/* Release Date */}
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>RELEASE DATE</label>
                                <input
                                    type="date"
                                    name="releaseDate"
                                    value={formData.releaseDate?.split("T")[0] || ""}
                                    onChange={handleChange}
                                    style={styles.input}
                                    className="up-input"
                                />
                            </div>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div style={styles.rightCol}>

                            {/* Name */}
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>PRODUCT NAME</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Samsung Galaxy S25"
                                    style={{ ...styles.input, ...styles.inputLarge }}
                                    className="up-input"
                                />
                            </div>

                            {/* Brand + Category */}
                            <div style={styles.row}>
                                <div style={{ ...styles.fieldGroup, flex: 1 }}>
                                    <label style={styles.label}>BRAND</label>
                                    <input
                                        type="text"
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleChange}
                                        placeholder="e.g. Samsung"
                                        style={styles.input}
                                        className="up-input"
                                    />
                                </div>
                                <div style={{ ...styles.fieldGroup, flex: 1 }}>
                                    <label style={styles.label}>CATEGORY</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        style={styles.input}
                                        className="up-input"
                                    >
                                        <option value="">Select…</option>
                                        <option>Laptop</option>
                                        <option>Mobile</option>
                                        <option>Headphone</option>
                                        <option>Electronics</option>
                                        <option>Toys</option>
                                        <option>Fashion</option>
                                    </select>
                                </div>
                            </div>

                            {/* Price */}
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>PRICE (₹)</label>
                                <div style={styles.priceWrap}>
                                    <span style={styles.currencySymbol}>₹</span>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        style={{ ...styles.input, paddingLeft: "2.5rem" }}
                                        className="up-input"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div style={{ ...styles.fieldGroup, flex: 1 }}>
                                <label style={styles.label}>DESCRIPTION</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe the product…"
                                    rows={6}
                                    style={{ ...styles.input, ...styles.textarea }}
                                    className="up-input"
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={submitting}
                                style={styles.submitBtn}
                                className="up-submit"
                            >
                                {submitting ? (
                                    <span style={styles.btnInner}>
                                        <span style={styles.btnSpinner} /> Saving…
                                    </span>
                                ) : (
                                    <span style={styles.btnInner}>
                                        Save Changes →
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

const styles = {
    page: {
        minHeight: "100vh",
        background: "#0a0a0f",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        position: "relative",
        overflow: "hidden",
        padding: "2rem 1rem",
    },
    blob1: {
        position: "fixed",
        top: "-100px",
        right: "-100px",
        width: "500px",
        height: "500px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
    },
    blob2: {
        position: "fixed",
        bottom: "-150px",
        left: "-100px",
        width: "600px",
        height: "600px",
        background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)",
        borderRadius: "50%",
        pointerEvents: "none",
    },
    container: {
        maxWidth: "1100px",
        margin: "0 auto",
        position: "relative",
        zIndex: 1,
    },
    header: {
        display: "flex",
        alignItems: "flex-end",
        gap: "1.5rem",
        marginBottom: "2.5rem",
    },
    backBtn: {
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "#9ca3af",
        padding: "0.5rem 1rem",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "0.85rem",
        transition: "all 0.2s",
        marginBottom: "4px",
    },
    eyebrow: {
        color: "#16a2f9",
        fontSize: "0.7rem",
        fontWeight: "700",
        letterSpacing: "0.2em",
        margin: 0,
    },
    title: {
        color: "#fff",
        fontSize: "2rem",
        fontWeight: "800",
        margin: "0.15rem 0 0 0",
        letterSpacing: "-0.03em",
    },
    form: {
        display: "grid",
        gridTemplateColumns: "340px 1fr",
        gap: "1.5rem",
        alignItems: "start",
    },
    leftCol: {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
    },
    rightCol: {
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
    },
    dropZone: {
        borderRadius: "16px",
        border: "2px dashed rgba(255,255,255,0.12)",
        background: "rgba(255,255,255,0.03)",
        height: "280px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.2s, background 0.2s",
    },
    dropZoneActive: {
        borderColor: "#16aaf9",
        background: "rgba(249,115,22,0.05)",
    },
    previewImg: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        position: "absolute",
        inset: 0,
    },
    previewOverlay: {
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: 0,
        transition: "opacity 0.2s",
    },
    previewOverlayText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: "0.9rem",
    },
    dropPlaceholder: {
        textAlign: "center",
    },
    uploadIcon: {
        fontSize: "2rem",
        marginBottom: "0.5rem",
        opacity: 0.4,
    },
    dropText: {
        color: "#9ca3af",
        fontSize: "0.95rem",
        margin: "0 0 0.25rem 0",
        fontWeight: "500",
    },
    dropSubText: {
        color: "#4b5563",
        fontSize: "0.8rem",
        margin: 0,
    },
    toggleCard: {
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "12px",
        padding: "1rem 1.25rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    toggleLabel: {
        color: "#e5e7eb",
        fontWeight: "600",
        fontSize: "0.85rem",
        margin: "0 0 0.2rem 0",
    },
    toggleSub: {
        color: "#6b7280",
        fontSize: "0.75rem",
        margin: 0,
    },
    switch: {
        cursor: "pointer",
    },
    track: {
        display: "block",
        width: "52px",
        height: "28px",
        borderRadius: "999px",
        position: "relative",
        transition: "background 0.25s",
    },
    thumb: {
        position: "absolute",
        top: "3px",
        width: "22px",
        height: "22px",
        background: "#fff",
        borderRadius: "50%",
        transition: "transform 0.25s",
        boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
    },
    fieldGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "0.4rem",
    },
    label: {
        color: "#6b7280",
        fontSize: "0.65rem",
        fontWeight: "700",
        letterSpacing: "0.15em",
    },
    input: {
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "10px",
        color: "#f3f4f6",
        fontSize: "0.95rem",
        padding: "0.75rem 1rem",
        outline: "none",
        width: "100%",
        boxSizing: "border-box",
        fontFamily: "inherit",
        transition: "border-color 0.2s, background 0.2s",
    },
    inputLarge: {
        fontSize: "1.1rem",
        fontWeight: "600",
        padding: "0.9rem 1rem",
    },
    textarea: {
        resize: "vertical",
        minHeight: "130px",
        lineHeight: "1.6",
    },
    row: {
        display: "flex",
        gap: "1rem",
    },
    priceWrap: {
        position: "relative",
    },
    currencySymbol: {
        position: "absolute",
        left: "1rem",
        top: "50%",
        transform: "translateY(-50%)",
        color: "#1685ff",
        fontWeight: "700",
        fontSize: "1rem",
        zIndex: 1,
    },
    submitBtn: {
        marginTop: "0.5rem",
        background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
        color: "#fff",
        border: "none",
        borderRadius: "12px",
        padding: "1rem",
        fontSize: "1rem",
        fontWeight: "700",
        cursor: "pointer",
        letterSpacing: "0.02em",
        transition: "opacity 0.2s, transform 0.15s",
        width: "100%",
        fontFamily: "inherit",
    },
    btnInner: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
    },
    btnSpinner: {
        width: "16px",
        height: "16px",
        border: "2px solid rgba(255,255,255,0.4)",
        borderTopColor: "#fff",
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
        display: "inline-block",
    },
    loaderWrap: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
        background: "#0a0a0f",
    },
    loader: {
        width: "36px",
        height: "36px",
        border: "3px solid rgba(249,115,22,0.2)",
        borderTopColor: "#1685ff",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
    },
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

@keyframes spin {
    to { transform: rotate(360deg); }
}

.up-input:focus {
    border-color: rgba(249, 115, 22, 0.5) !important;
    background: rgba(249, 115, 22, 0.04) !important;
    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.08);
}

.up-input::placeholder {
    color: #4b5563;
}

.up-input option {
    background: #1a1a2e;
    color: #f3f4f6;
}

.up-submit:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
}

.up-submit:active:not(:disabled) {
    transform: translateY(0);
}

.up-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Image overlay reveal on hover */
div[style*="dropZone"]:hover > div[style*="previewOverlay"],
div:hover > div[style*="opacity: 0"] {
    opacity: 1 !important;
}

/* Responsive */
@media (max-width: 768px) {
    form[style] {
        grid-template-columns: 1fr !important;
    }
}
`;

export default UpdateProduct;