"use client";

import { useState, useEffect } from "react";
import newsService from "@/services/newsService";
import { Plus, Edit2, Trash2, X, Save, AlertCircle, Loader2, Image as ImageIcon, Eye } from "lucide-react";

export default function NewsPage() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    longDescription: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const data = await newsService.getAllNews();
      if (Array.isArray(data)) {
        setNewsList(data);
      } else {
        setError("Yangiliklar ro'yxatini yuklab bo'lmadi");
      }
    } catch (err) {
      setError("Server bilan aloqa uzildi");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (news = null) => {
    if (news) {
      setEditingNews(news);
      setFormData({
        name: news.name,
        shortDescription: news.shortDescription,
        longDescription: news.longDescription,
      });
      setImagePreview(`http://localhost:8080/upload/${news.image}`);
      setSelectedImage(null);
    } else {
      setEditingNews(null);
      setFormData({
        name: "",
        shortDescription: "",
        longDescription: "",
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
    data.append("shortDescription", formData.shortDescription);
    data.append("longDescription", formData.longDescription);
    if (selectedImage) {
      data.append("image", selectedImage);
    }

    try {
      if (editingNews) {
        const result = await newsService.updateNews(editingNews._id, data);
        if (result.message && result.message.includes("muvaffaqiyatli")) {
          fetchNews();
          setIsModalOpen(false);
        } else {
          setError(result.message || "Yangilashda xatolik yuz berdi");
        }
      } else {
        if (!selectedImage) {
          setError("Rasm yuklanishi majburiy!");
          setIsSubmitting(false);
          return;
        }
        const result = await newsService.createNews(data);
        if (result.message && result.message.includes("muvaffaqiyatli")) {
          fetchNews();
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
    if (!window.confirm("Haqiqatan ham ushbu yangilikni o'chirmoqchimisiz?")) return;
    try {
      const result = await newsService.deleteNews(id);
      if (result.message) {
        fetchNews();
      }
    } catch (err) {
      alert("O'chirishda xatolik");
    }
  };

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Yangiliklar Boshqaruvi</h1>
        <button onClick={() => handleOpenModal()} className="admin-btn admin-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={20} />
          Yangi Yangilik
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
                <th>Rasm</th>
                <th>Sarlavha</th>
                <th>Ko'rishlar</th>
                <th>Sana</th>
                <th style={{ textAlign: 'right' }}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {newsList.map((news) => (
                <tr key={news._id}>
                  <td>
                    <div style={{ width: '60px', height: '40px', borderRadius: '0.25rem', overflow: 'hidden', background: 'var(--admin-bg-secondary)' }}>
                      <img 
                        src={`http://localhost:8080/upload/${news.image}`} 
                        alt={news.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{news.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {news.shortDescription}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--admin-text-muted)' }}>
                      <Eye size={16} />
                      {news.views || 0}
                    </div>
                  </td>
                  <td style={{ fontSize: '0.875rem' }}>{new Date(news.createdAt).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button onClick={() => handleOpenModal(news)} className="admin-nav-item" style={{ padding: '0.5rem' }}>
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(news._id)} className="admin-nav-item" style={{ padding: '0.5rem', color: '#ef4444' }}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {newsList.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--admin-text-muted)' }}>
                    Yangiliklar topilmadi
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
                {editingNews ? "Yangilikni Tahrirlash" : "Yangi Yangilik Qo'shish"}
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
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Sarlavha</label>
                <input
                  className="admin-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Yangilik sarlavhasini kiriting"
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Qisqa tavsif</label>
                <textarea
                  className="admin-input"
                  style={{ minHeight: '80px', resize: 'vertical' }}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  required
                  placeholder="Yangilik haqida qisqacha ma'lumot..."
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>To'liq matn</label>
                <textarea
                  className="admin-input"
                  style={{ minHeight: '200px', resize: 'vertical' }}
                  value={formData.longDescription}
                  onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                  required
                  placeholder="Yangilikning to'liq matnini kiriting..."
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Yangilik Rasmi</label>
                <div 
                  onClick={() => document.getElementById('news-image-upload').click()}
                  style={{ 
                    border: '2px dashed var(--admin-border)', 
                    borderRadius: '0.75rem', 
                    padding: '2rem', 
                    textAlign: 'center', 
                    cursor: 'pointer',
                    background: 'var(--admin-bg-secondary)',
                    transition: 'all 0.2s',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <input 
                    id="news-image-upload"
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    style={{ display: 'none' }}
                  />
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }} />
                  ) : (
                    <div style={{ color: 'var(--admin-text-muted)' }}>
                      <ImageIcon size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                      <p>Rasm yuklash uchun bosing</p>
                    </div>
                  )}
                  {imagePreview && (
                    <div style={{ position: 'relative', zIndex: 1, fontWeight: '600' }}>
                      Rasm tanlandi. O'zgartirish uchun bosing.
                    </div>
                  )}
                </div>
              </div>

              <button 
                type="submit" 
                className="admin-btn admin-btn-primary" 
                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                {editingNews ? "Saqlash" : "Yaratish"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
