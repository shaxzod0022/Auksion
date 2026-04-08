"use client";

import { useState, useEffect } from "react";
import userService from "@/services/userService";
import { Plus, Edit2, Trash2, X, Save, AlertCircle, Loader2 } from "lucide-react";

export default function MembersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    dateOfBirth: "",
    jshshir: "",
    passportSeries: "",
    passportNumber: "",
    phoneNumber: "",
    email: "",
    password: "",
    oldPassword: "",
    newPassword: ""
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers();
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setError("Foydalanuvchilar ro'yxatini yuklab bo'lmadi");
      }
    } catch (err) {
      setError("Server bilan aloqa uzildi");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        middleName: user.middleName || "",
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : "",
        jshshir: user.jshshir || "",
        passportSeries: user.passportSeries || "",
        passportNumber: user.passportNumber || "",
        phoneNumber: user.phoneNumber || "",
        email: user.email || "",
        password: "",
        oldPassword: "",
        newPassword: ""
      });
    } else {
      setEditingUser(null);
      setFormData({
        firstName: "",
        lastName: "",
        middleName: "",
        dateOfBirth: "",
        jshshir: "",
        passportSeries: "",
        passportNumber: "",
        phoneNumber: "",
        email: "",
        password: "",
        oldPassword: "",
        newPassword: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Strict Validation
    if (formData.passportSeries.length !== 2 || !/^[A-Z]{2}$/.test(formData.passportSeries)) {
      setError("Passport seriyasi 2 ta bosh harf bo'lishi kerak (masalan: AA)");
      setIsSubmitting(false);
      return;
    }
    if (formData.passportNumber.length !== 7 || !/^\d{7}$/.test(formData.passportNumber)) {
      setError("Passport raqami 7 ta raqam bo'lishi kerak");
      setIsSubmitting(false);
      return;
    }
    if (formData.jshshir.length !== 14 || !/^\d{14}$/.test(formData.jshshir)) {
      setError("JSHSHIR 14 ta raqam bo'lishi kerak");
      setIsSubmitting(false);
      return;
    }
    if (formData.phoneNumber.length !== 13 || !/^\+998\d{9}$/.test(formData.phoneNumber)) {
      setError("Telefon raqami noto'g'ri formatda (+998901234567)");
      setIsSubmitting(false);
      return;
    }

    try {
      if (editingUser) {
        // Update
        const payload = { ...formData };
        delete payload.password; // Update handles old/new password
        const result = await userService.updateUser(editingUser._id, payload);
        if (result.message && result.message.includes("muvaffaqiyatli")) {
          fetchUsers();
          setIsModalOpen(false);
        } else {
          setError(result.message || "Yangilashda xatolik yuz berdi");
        }
      } else {
        // Create
        const result = await userService.createUser({
          ...formData,
          role: "user",
        });
        if (result.message && result.message.includes("muvaffaqiyatli")) {
          fetchUsers();
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
    if (!window.confirm("Haqiqatan ham ushbu foydalanuvchini o'chirmoqchimisiz?")) return;
    try {
      const result = await userService.deleteUser(id);
      if (result.message) {
        fetchUsers();
      }
    } catch (err) {
      alert("O'chirishda xatolik");
    }
  };

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Foydalanuvchilar (A'zolar)</h1>
        <button onClick={() => handleOpenModal()} className="admin-btn admin-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={20} />
          Yangi Foydalanuvchi
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
                <th>F.I.O</th>
                <th>Email / Tel</th>
                <th>Passport / JSHSHIR</th>
                <th>Tug'ilgan sana</th>
                <th style={{ textAlign: 'right' }}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div style={{ fontWeight: '600' }}>{user.lastName} {user.firstName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>{user.middleName}</div>
                  </td>
                  <td>
                    <div>{user.email}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>{user.phoneNumber}</div>
                  </td>
                  <td>
                    <div>{user.passportSeries} {user.passportNumber}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>{user.jshshir}</div>
                  </td>
                  <td>{new Date(user.dateOfBirth).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button onClick={() => handleOpenModal(user)} className="admin-nav-item" style={{ padding: '0.5rem' }}>
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(user._id)} className="admin-nav-item" style={{ padding: '0.5rem', color: '#ef4444' }}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--admin-text-muted)' }}>
                    Foydalanuvchilar topilmadi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: '800px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                {editingUser ? "Foydalanuvchini Tahrirlash" : "Yangi Foydalanuvchi Qo'shish"}
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
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
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Sharif (Otasining ismi)</label>
                  <input
                    className="admin-input"
                    value={formData.middleName}
                    onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Tug'ilgan sana</label>
                  <input
                    type="date"
                    className="admin-input"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>JSHSHIR</label>
                  <input
                    className="admin-input"
                    value={formData.jshshir}
                    maxLength={14}
                    placeholder="14 ta raqam"
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 14);
                      setFormData({ ...formData, jshshir: value });
                    }}
                    required
                  />
                </div>
              </div>
 
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Passport Seriya</label>
                  <input
                    className="admin-input"
                    value={formData.passportSeries}
                    maxLength={2}
                    placeholder="AA"
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 2);
                      setFormData({ ...formData, passportSeries: value });
                    }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Passport Raqam</label>
                  <input
                    className="admin-input"
                    value={formData.passportNumber}
                    maxLength={7}
                    placeholder="1234567"
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 7);
                      setFormData({ ...formData, passportNumber: value });
                    }}
                    required
                  />
                </div>
              </div>
 
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Telefon raqam</label>
                  <input
                    className="admin-input"
                    value={formData.phoneNumber}
                    maxLength={13}
                    placeholder="+998901234567"
                    onChange={(e) => {
                      let value = e.target.value;
                      if (!value.startsWith("+")) {
                        value = "+" + value.replace(/\D/g, "");
                      } else {
                        value = "+" + value.slice(1).replace(/\D/g, "");
                      }
                      setFormData({ ...formData, phoneNumber: value.slice(0, 13) });
                    }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Email</label>
                  <input
                    type="email"
                    className="admin-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              {!editingUser ? (
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Eski Parol (O'zgartirish uchun)</label>
                    <input
                      type="password"
                      className="admin-input"
                      value={formData.oldPassword}
                      onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Yangi Parol (Ixtiyoriy)</label>
                    <input
                      type="password"
                      className="admin-input"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                className="admin-btn admin-btn-primary" 
                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                {editingUser ? "Saqlash" : "Yaratish"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
