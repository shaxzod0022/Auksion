"use client";

import { useState, useEffect } from "react";
import regionService from "@/services/regionService";
import provinceService from "@/services/provinceService";
import { Plus, Edit2, Trash2, X, Save, AlertCircle, Loader2 } from "lucide-react";

export default function RegionsPage() {
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRegion, setEditingRegion] = useState(null);
  const [formData, setFormData] = useState({ name: "", province: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [regionsData, provincesData] = await Promise.all([
        regionService.getAllRegions(),
        provinceService.getAllProvinces()
      ]);
      setRegions(Array.isArray(regionsData) ? regionsData : []);
      setProvinces(Array.isArray(provincesData) ? provincesData : []);
    } catch (err) {
      setError("Ma'lumotlarni yuklab bo'lmadi");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (region = null) => {
    if (region) {
      setEditingRegion(region);
      setFormData({ name: region.name, province: region.province?._id || region.province });
    } else {
      setEditingRegion(null);
      setFormData({ name: "", province: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (editingRegion) {
        const result = await regionService.updateRegion(editingRegion._id, formData);
        if (result.message && result.message.includes("muvaffaqiyatli")) {
          fetchInitialData();
          setIsModalOpen(false);
        } else {
          setError(result.message || "Xatolik yuz berdi");
        }
      } else {
        const result = await regionService.createRegion(formData);
        if (result.message && result.message.includes("muvaffaqiyatli")) {
          fetchInitialData();
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
    if (!window.confirm("Haqiqatan ham ushbu tuman/shaharni o'chirmoqchimisiz?")) return;
    try {
      const result = await regionService.deleteRegion(id);
      if (result.message) {
        fetchInitialData();
      }
    } catch (err) {
      alert("O'chirishda xatolik");
    }
  };

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Tuman va Shaharlar Boshqaruvi</h1>
        <button onClick={() => handleOpenModal()} className="admin-btn admin-btn-primary">
          <Plus size={20} />
          Yangi Tuman
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
                <th>Viloyat</th>
                <th>Slug</th>
                <th style={{ textAlign: 'right' }}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {regions.map((region) => (
                <tr key={region._id}>
                  <td style={{ fontWeight: '600' }}>{region.name}</td>
                  <td>
                    <span style={{ padding: '0.25rem 0.6rem', borderRadius: '0.5rem', fontSize: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--admin-accent)' }}>
                      {region.province?.name || '—'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.875rem' }}>{region.slug}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button onClick={() => handleOpenModal(region)} className="admin-nav-item">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(region._id)} className="admin-nav-item" style={{ color: '#ef4444' }}>
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
                {editingRegion ? "Tumanni Tahrirlash" : "Yangi Tuman Qo'shish"}
              </h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Tuman/Shahar Nomi</label>
                <input
                  className="admin-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Masalan: Chilonzor tumani"
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Viloyat</label>
                <select 
                  className="admin-input"
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  required
                >
                  <option value="">Viloyatni tanlang...</option>
                  {provinces.map(p => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
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
