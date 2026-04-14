"use client";

import { useState, useEffect } from "react";
import categoryService from "@/services/categoryService";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getAllCategories();
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        setError("Kategoriyalar ro'yxatini yuklab bo'lmadi");
      }
    } catch (err) {
      setError("Server bilan aloqa uzildi");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
      });
      setImagePreview(
        `https://considerate-integrity-production.up.railway.app/upload/${category.image}`,
      );
      setSelectedImage(null);
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
      });
      setImagePreview(null);
      setSelectedImage(null);
    }
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const data = new FormData();
    data.append("name", formData.name);
    if (selectedImage) {
      data.append("image", selectedImage);
    }

    try {
      if (editingCategory) {
        // Update
        const result = await categoryService.updateCategory(
          editingCategory._id,
          data,
        );
        if (result.message && result.message.includes("muvaffaqiyatli")) {
          fetchCategories();
          setIsModalOpen(false);
        } else {
          setError(result.message || "Yangilashda xatolik yuz berdi");
        }
      } else {
        // Create
        if (!selectedImage) {
          setError("Rasm yuklanishi majburiy!");
          setIsSubmitting(false);
          return;
        }
        const result = await categoryService.createCategory(data);
        if (result.message && result.message.includes("muvaffaqiyatli")) {
          fetchCategories();
          setIsModalOpen(false);
        } else {
          setError(result.message || "Yaratishda xatolik yuz berdi");
        }
      }
    } catch (err) {
      setError("Server xatosi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Haqiqatan ham ushbu kategoriyani o'chirmoqchimisiz?"))
      return;
    try {
      const result = await categoryService.deleteCategory(id);
      if (result.message) {
        fetchCategories();
      }
    } catch (err) {
      alert("O'chirishda xatolik");
    }
  };

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Kategoriyalar Boshqaruvi</h1>
        <button
          onClick={() => handleOpenModal()}
          className="admin-btn admin-btn-primary"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <Plus size={20} />
          Yangi Kategoriya
        </button>
      </div>

      {loading ? (
        <div style={{ padding: "4rem", textAlign: "center" }}>
          <Loader2
            className="animate-spin"
            size={40}
            style={{ color: "var(--admin-accent)" }}
          />
          <p style={{ marginTop: "1rem", color: "var(--admin-text-muted)" }}>
            Yuklanmoqda...
          </p>
        </div>
      ) : error ? (
        <div
          className="admin-card"
          style={{
            border: "1px solid #ef4444",
            background: "rgba(239, 68, 68, 0.05)",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            color: "#ef4444",
          }}
        >
          <AlertCircle />
          {error}
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Rasm</th>
                <th>Nomi</th>
                <th>Slug</th>
                <th style={{ textAlign: "right" }}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id}>
                  <td>
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "0.5rem",
                        overflow: "hidden",
                        background: "var(--admin-bg-secondary)",
                      }}
                    >
                      <img
                        src={`https://considerate-integrity-production.up.railway.app/upload/${cat.image}`}
                        alt={cat.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.src = "/placeholder.png";
                        }}
                      />
                    </div>
                  </td>
                  <td style={{ fontWeight: "600" }}>{cat.name}</td>
                  <td
                    style={{
                      color: "var(--admin-text-muted)",
                      fontSize: "0.875rem",
                    }}
                  >
                    {cat.slug}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "0.5rem",
                      }}
                    >
                      <button
                        onClick={() => handleOpenModal(cat)}
                        className="admin-nav-item"
                        style={{ padding: "0.5rem" }}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="admin-nav-item"
                        style={{ padding: "0.5rem", color: "#ef4444" }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                      color: "var(--admin-text-muted)",
                    }}
                  >
                    Kategoriyalar topilmadi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                {editingCategory
                  ? "Kategoriyani Tahrirlash"
                  : "Yangi Kategoriya Qo'shish"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--admin-text-muted)",
                  cursor: "pointer",
                }}
              >
                <X size={24} />
              </button>
            </div>

            {error && (
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  color: "#ef4444",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  marginBottom: "1.5rem",
                  fontSize: "0.875rem",
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.875rem",
                  }}
                >
                  Kategoriya Nomi
                </label>
                <input
                  className="admin-input"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  placeholder="Masalan: Avtomobillar"
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.875rem",
                  }}
                >
                  Kategoriya Rasmi
                </label>
                <div
                  onClick={() =>
                    document.getElementById("image-upload").click()
                  }
                  style={{
                    border: "2px dashed var(--admin-border)",
                    borderRadius: "0.75rem",
                    padding: "2rem",
                    textAlign: "center",
                    cursor: "pointer",
                    background: "var(--admin-bg-secondary)",
                    transition: "all 0.2s",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.borderColor = "var(--admin-accent)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.borderColor = "var(--admin-border)")
                  }
                >
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        opacity: 0.3,
                      }}
                    />
                  ) : (
                    <div style={{ color: "var(--admin-text-muted)" }}>
                      <ImageIcon
                        size={40}
                        style={{ marginBottom: "1rem", opacity: 0.5 }}
                      />
                      <p>Rasm yuklash uchun bosing</p>
                      <p style={{ fontSize: "0.75rem" }}>
                        PNG, JPG, WEBP formatlari
                      </p>
                    </div>
                  )}
                  {imagePreview && (
                    <div
                      style={{
                        position: "relative",
                        zIndex: 1,
                        fontWeight: "600",
                      }}
                    >
                      Rasm tanlandi. O'zgartirish uchun bosing.
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="admin-btn admin-btn-primary"
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Save size={20} />
                )}
                {editingCategory ? "Saqlash" : "Yaratish"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
