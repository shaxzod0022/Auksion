"use client";

import { useState, useEffect } from "react";
import contactService from "@/services/contactService";
import { Trash2, X, AlertCircle, Loader2, Mail, User, Phone, Tag, Info, Calendar, Eye, InfoIcon } from "lucide-react";

export default function ContactPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const data = await contactService.getAllContacts();
      if (Array.isArray(data)) {
        setContacts(data);
      } else {
        setError("Murojaatlar ro'yxatini yuklab bo'lmadi");
      }
    } catch (err) {
      setError("Server bilan aloqa uzildi");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Haqiqatan ham ushbu murojaatni o'chirmoqchimisiz?")) return;
    try {
      const result = await contactService.deleteContact(id);
      if (result.message) {
        fetchContacts();
        if (selectedContact && selectedContact._id === id) {
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      alert("O'chirishda xatolik");
    }
  };

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Murojaatlar (Aloqa)</h1>
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
                <th>Kimdan</th>
                <th>Mavzu</th>
                <th>Yo'nalish</th>
                <th>Sana</th>
                <th style={{ textAlign: 'right' }}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact._id} onClick={() => handleOpenModal(contact)} style={{ cursor: 'pointer' }}>
                  <td>
                    <div style={{ fontWeight: '600' }}>{contact.fullName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>{contact.email}</div>
                  </td>
                  <td>{contact.topic}</td>
                  <td>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '1rem', 
                      fontSize: '0.75rem', 
                      background: 'rgba(59, 130, 246, 0.1)', 
                      color: 'var(--admin-accent)',
                      fontWeight: '600'
                    }}>
                      {contact.direction}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.875rem', color: 'var(--admin-text-muted)' }}>
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModal(contact);
                        }}
                        className="admin-nav-item"
                        style={{
                          padding: "0.5rem",
                          color: "var(--admin-accent)",
                          display: "inline-flex",
                        }}
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, contact._id)}
                        className="admin-nav-item"
                        style={{
                          padding: "0.5rem",
                          color: "#ef4444",
                          display: "inline-flex",
                        }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {contacts.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--admin-text-muted)' }}>
                    Murojaatlar topilmadi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && selectedContact && (
        <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Murojaat tafsilotlari</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--admin-text-muted)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="admin-card" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--admin-text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                    <User size={14} /> F.I.SH
                  </div>
                  <div style={{ fontWeight: '600' }}>{selectedContact.fullName}</div>
                </div>
                <div className="admin-card" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--admin-text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                    <Phone size={14} /> Telefon
                  </div>
                  <div style={{ fontWeight: '600' }}>{selectedContact.phoneNumber}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="admin-card" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--admin-text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                    <Mail size={14} /> Email
                  </div>
                  <div style={{ fontWeight: '600' }}>{selectedContact.email}</div>
                </div>
                <div className="admin-card" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--admin-text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                    <Calendar size={14} /> Sana
                  </div>
                  <div style={{ fontWeight: '600' }}>{new Date(selectedContact.createdAt).toLocaleString()}</div>
                </div>
              </div>

              <div className="admin-card" style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--admin-text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                  <Tag size={14} /> Mavzu va Yo'nalish
                </div>
                <div style={{ fontWeight: '600' }}>{selectedContact.direction} - {selectedContact.topic}</div>
              </div>

              <div className="admin-card" style={{ padding: '1rem', background: '#f8fafc' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--admin-text-muted)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                  <InfoIcon size={14} /> Xabar matni
                </div>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: 'var(--admin-text)' }}>
                  {selectedContact.message}
                </div>
              </div>

              <button 
                onClick={(e) => handleDelete(e, selectedContact._id)} 
                className="admin-btn" 
                style={{ background: '#ef4444', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
              >
                <Trash2 size={20} />
                Ushbu murojaatni o'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
