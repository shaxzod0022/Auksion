"use client";

import { useState, useEffect } from "react";
import lotTypeService from "@/services/lotTypeService";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function LotTypesPage() {
  const [lotTypes, setLotTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLotType, setEditingLotType] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    fetchLotTypes();
  }, []);

  const fetchLotTypes = async () => {
    setLoading(true);
    try {
      const data = await lotTypeService.getAllLotTypes();
      if (Array.isArray(data)) {
        setLotTypes(data);
      } else {
        setError("Ma'lumotlarni yuklab bo'lmadi");
      }
    } catch (err) {
      setError("Server bilan aloqa uzildi");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (lotType = null) => {
    if (lotType) {
      setEditingLotType(lotType);
      setFormData({
        name: lotType.name,
      });
    } else {
      setEditingLotType(null);
      setFormData({
        name: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (editingLotType) {
        // Update
        const result = await lotTypeService.updateLotType(
          editingLotType._id,
          formData,
        );
        if (result.message && result.message.includes("muvaffaqiyatli")) {
          fetchLotTypes();
          setIsModalOpen(false);
        } else {
          setError(result.message || "Yangilashda xatolik yuz berdi");
        }
      } else {
        // Create
        const result = await lotTypeService.createLotType(formData);
        if (result.message && result.message.includes("muvaffaqiyatli")) {
          fetchLotTypes();
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
    if (!window.confirm("Haqiqatan ham ushbu ma'lumotni o'chirmoqchimisiz?"))
      return;
    try {
      const result = await lotTypeService.deleteLotType(id);
      if (result.message) {
        fetchLotTypes();
      }
    } catch (err) {
      alert("O'chirishda xatolik");
    }
  };

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Lot toifalari (Savdo shakllari)</h1>
        <button
          onClick={() => handleOpenModal()}
          className="admin-btn admin-btn-primary"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <Plus size={20} />
          Yangi Qo'shish
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
                <th>Nomi</th>
                <th>Slug</th>
                <th style={{ textAlign: "right" }}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {lotTypes.map((type) => (
                <tr key={type._id}>
                  <td style={{ fontWeight: "600" }}>{type.name}</td>
                  <td
                    style={{
                      color: "var(--admin-text-muted)",
                      fontSize: "0.875rem",
                    }}
                  >
                    {type.slug}
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
                        onClick={() => handleOpenModal(type)}
                        className="admin-nav-item"
                        style={{ padding: "0.5rem" }}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(type._id)}
                        className="admin-nav-item"
                        style={{ padding: "0.5rem", color: "#ef4444" }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {lotTypes.length === 0 && (
                <tr>
                  <td
                    colSpan="3"
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                      color: "var(--admin-text-muted)",
                    }}
                  >
                    Ma'lumotlar topilmadi
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
                {editingLotType ? "Tahrirlash" : "Yangi Qo'shish"}
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
                  Nomi
                </label>
                <input
                  className="admin-input"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  placeholder="Masalan: Yuk"
                />
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
                {editingLotType ? "Saqlash" : "Yaratish"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
