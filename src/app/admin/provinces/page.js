"use client";

import { useState, useEffect } from "react";
import provinceService from "@/services/provinceService";
import { Plus, Edit2, Trash2, X, Save, AlertCircle, Loader2 } from "lucide-react";

export default function ProvincesPage() {
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProvince, setEditingProvince] = useState(null);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    setLoading(true);
    try {
      const data = await provinceService.getAllProvinces();
      if (Array.isArray(data)) {
        setProvinces(data);
      } else {
        setError("Ma'lumotlarni yuklab bo'lmadi");
      }
    } catch (err) {
      setError("Server bilan aloqa uzildi");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (province = null) => {
    if (province) {
      setEditingProvince(province);
      setName(province.name);
    } else {
      setEditingProvince(null);
      setName("");
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (editingProvince) {
        const result = await provinceService.updateProvince(editingProvince._id, { name });
        if (result.message && result.message.includes("muvaffaqiyatli")) {
          fetchProvinces();
          setIsModalOpen(false);
        } else {
          setError(result.message || "Xatolik yuz berdi");
        }
      } else {
        const result = await provinceService.createProvince({ name });
        if (result.message && result.message.includes("muvaffaqiyatli")) {
          fetchProvinces();
          setIsModalOpen(false);
        } else {
          setError(result.message || "Xatolik yuz berdi");
        }
      }
    } catch (err) {
      setError("Server xatosi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Haqiqatan ham ushbu viloyatni o'chirmoqchimisiz?")) return;
    try {
      const result = await provinceService.deleteProvince(id);
      if (result.message) {
        fetchProvinces();
      }
    } catch (err) {
      alert("O'chirishda xatolik");
    }
  };

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Viloyatlar Boshqaruvi</h1>
        <button onClick={() => handleOpenModal()} className="admin-btn admin-btn-primary">
          <Plus size={20} />
          Yangi Viloyat
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <Loader2 className="animate-spin" size={40} style={{ color: 'var(--admin-accent)' }} />
          <p style={{ marginTop: '1rem', color: 'var(--admin-text-muted)' }}>Yuklanmoqda...</p>
        </div>
      ) : error ? (
        <div className="admin-card" style={{ border: '1px solid #ef4444', color: '#ef4444' }}>
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
                <th style={{ textAlign: 'right' }}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {provinces.map((province) => (
                <tr key={province._id}>
                  <td style={{ fontWeight: '600' }}>{province.name}</td>
                  <td style={{ color: 'var(--admin-text-muted)' }}>{province.slug}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button onClick={() => handleOpenModal(province)} className="admin-nav-item">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(province._id)} className="admin-nav-item" style={{ color: '#ef4444' }}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                {editingProvince ? "Viloyatni Tahrirlash" : "Yangi Viloyat Qo'shish"}
              </h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Viloyat Nomi</label>
                <input
                  className="admin-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Masalan: Toshkent viloyati"
                />
              </div>

              <button type="submit" className="admin-btn admin-btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />}
                Saqlash
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
