"use client";

import { useState, useEffect } from "react";
import adminService from "@/services/adminService";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { Plus, Edit2, Trash2, X, Save, AlertCircle, Loader2 } from "lucide-react";

export default function AdminsPage() {
  const { admin: currentAdmin } = useAdminAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    oldPassword: "",
    newPassword: "",
    role: "admin"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllAdmins();
      if (Array.isArray(data)) {
        setAdmins(data);
      } else {
        setError("Adminlar ro'yxatini yuklab bo'lmadi");
      }
    } catch (err) {
      setError("Server bilan aloqa uzildi");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (admin = null) => {
    if (admin) {
      setEditingAdmin(admin);
      setFormData({
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        password: "",
        oldPassword: "",
        newPassword: "",
        role: admin.role
      });
    } else {
      setEditingAdmin(null);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        oldPassword: "",
        newPassword: "",
        role: "admin"
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (editingAdmin) {
        // Update
        const payload = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
          role: formData.role
        };
        const result = await adminService.updateAdmin(editingAdmin._id, payload);
        if (result.message && result.message.includes("muvaffaqiyatli")) {
          fetchAdmins();
          setIsModalOpen(false);
        } else {
          setError(result.message || "Yangilashda xatolik yuz berdi");
        }
      } else {
        // Create
        const result = await adminService.createAdmin({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: formData.role
        });
        if (result.message && result.message.includes("muvaffaqiyatli")) {
          fetchAdmins();
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
    if (!window.confirm("Haqiqatan ham ushbu adminni o'chirmoqchimisiz?")) return;
    try {
      const result = await adminService.deleteAdmin(id);
      if (result.message) {
        fetchAdmins();
      }
    } catch (err) {
      alert("O'chirishda xatolik");
    }
  };

  if (currentAdmin && currentAdmin.role !== "superadmin") {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ color: '#ef4444' }}>Ruxsat yo'q!</h2>
        <p>Siz ushbu bo'limga kirish huquqiga ega emassiz.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Adminlar Boshqaruvi</h1>
        <button onClick={() => handleOpenModal()} className="admin-btn admin-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={20} />
          Yangi Admin
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
          <Loader2 className="animate-spin" size={40} style={{ color: 'var(--admin-accent)' }} />
          <p style={{ marginTop: '1rem', color: 'var(--admin-text-muted)' }}>Yuklanmoqda...</p>
        </div>
      ) : error ? (
        <div className="admin-card" style={{ border: '1px solid #ef4444', background: 'rgba(239, 68, 68, 0.05)', display: 'flex', alignItems: 'center', gap: '1rem', color: '#ef4444' }}>
          <AlertCircle />
          {error}
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ism</th>
                <th>Familiya</th>
                <th>Email</th>
                <th>Rol</th>
                <th style={{ textAlign: 'right' }}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin._id}>
                  <td>{admin.firstName}</td>
                  <td>{admin.lastName}</td>
                  <td style={{ color: 'var(--admin-text-muted)' }}>{admin.email}</td>
                  <td>
                    <span style={{ background: 'rgba(56, 189, 248, 0.1)', color: 'var(--admin-accent)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 'bold' }}>
                      {admin.role === "superadmin" ? "SUPER ADMIN" : "ADMIN"}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button onClick={() => handleOpenModal(admin)} className="admin-nav-item" style={{ padding: '0.5rem' }}>
                        <Edit2 size={18} />
                      </button>
                      {currentAdmin && currentAdmin._id !== admin._id && (
                        <button onClick={() => handleDelete(admin._id)} className="admin-nav-item" style={{ padding: '0.5rem', color: '#ef4444' }}>
                          <Trash2 size={18} />
                        </button>
                      )}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                {editingAdmin ? "Adminni Tahrirlash" : "Yangi Admin Qo'shish"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--admin-text-muted)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            {error && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Ism</label>
                  <input
                    className="admin-input"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Familiya</label>
                  <input
                    className="admin-input"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem', marginTop: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Email</label>
                <input
                  type="email"
                  className="admin-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              {!editingAdmin ? (
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Parol</label>
                  <input
                    type="password"
                    className="admin-input"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Eski Parol (O'zgartirish uchun kerak)</label>
                    <input
                      type="password"
                      className="admin-input"
                      value={formData.oldPassword}
                      onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                      required
                    />
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Yangi Parol (Ixtiyoriy)</label>
                    <input
                      type="password"
                      className="admin-input"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      placeholder="O'zgartirish uchun kiriting"
                    />
                  </div>
                </>
              )}

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Rol</label>
                <select
                  className="admin-input"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                  style={{ width: '100%', background: 'var(--admin-bg-secondary)', color: 'var(--admin-text)', border: '1px solid var(--admin-border)' }}
                >
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="admin-btn admin-btn-primary" 
                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                {editingAdmin ? "Saqlash" : "Yaratish"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
