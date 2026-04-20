"use client";

import { useState, useEffect } from "react";
import {
  EyeOff,
  Eye,
  Download,
  AlertCircle,
  Loader2,
  Plus,
  X,
  Save,
  Trash2,
} from "lucide-react";
import protocolService from "@/services/protocolService";
import { formatDateForInput } from "@/utils/dateUtils";

export default function AdminProtocols() {
  const [protocols, setProtocols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    protocolNumber: "",
    participantsList: "",
    status: "active",
    manualData: {
      lotNumber: "",
      organizer: "“uai” mchj nf – uai.uz",
      auctionType:
        "Narxi oshib borish tartibida o'tkaziladigan ochiq elektron onlayn auktsion savdosi. Xususiy buyurtmalar",
      basisDocument: "Buyurtma asosida olingan.",
      description: "",
      startPrice: "",
      finalPrice: "",
      winnerName: "",
      winnerJshshir: "",
      winnerAddress: "",
      startDate: formatDateForInput(new Date()),
      attributes: [{ key: "", value: "" }],
    },
  });

  useEffect(() => {
    fetchProtocols();
  }, []);

  const fetchProtocols = async () => {
    try {
      const data = await protocolService.getProtocols();
      if (Array.isArray(data)) {
        setProtocols(data);
      } else {
        setError(data.message || "Xatolik");
      }
    } catch (err) {
      setError("Server bilan aloqa uzildi");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setFormData({
      protocolNumber: "",
      participantsList: "",
      status: "active",
      manualData: {
        lotNumber: "",
        organizer: "“uai” mchj nf – uai.uz",
        auctionType:
          "Narxi oshib borish tartibida o'tkaziladigan ochiq elektron onlayn auktsion savdosi. Xususiy buyurtmalar",
        basisDocument: "Buyurtma asosida olingan.",
        description: "",
        startPrice: "",
        finalPrice: "",
        winnerName: "",
        winnerJshshir: "",
        winnerAddress: "",
        startDate: formatDateForInput(new Date()),
        attributes: [{ key: "", value: "" }],
      },
    });
    setIsModalOpen(true);
  };

  const handleAddAttribute = () => {
    setFormData({
      ...formData,
      manualData: {
        ...formData.manualData,
        attributes: [...formData.manualData.attributes, { key: "", value: "" }],
      },
    });
  };

  const handleAttributeChange = (index, field, value) => {
    const newAttributes = [...formData.manualData.attributes];
    newAttributes[index][field] = value;
    setFormData({
      ...formData,
      manualData: {
        ...formData.manualData,
        attributes: newAttributes,
      },
    });
  };

  const handleRemoveAttribute = (index) => {
    const newAttributes = formData.manualData.attributes.filter(
      (_, i) => i !== index,
    );
    setFormData({
      ...formData,
      manualData: {
        ...formData.manualData,
        attributes: newAttributes,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await protocolService.createManualProtocol(formData);
      if (res.protocol) {
        fetchProtocols();
        setIsModalOpen(false);
        alert("Bayonnoma muvaffaqiyatli yaratildi");
      } else {
        alert(res.message || "Xatolik");
      }
    } catch (err) {
      alert("Server bilan aloqa uzildi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      const res = await protocolService.updateProtocolStatus(id, newStatus);
      if (res.message) {
        fetchProtocols();
      }
    } catch (err) {
      alert("Xatolik");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Haqiqatan ham ushbu bayonnomani o'chirmoqchimisiz?"))
      return;
    try {
      const res = await protocolService.deleteProtocol(id);
      if (res.message) {
        fetchProtocols();
        alert(res.message);
      }
    } catch (err) {
      alert("O'chirishda xatolik");
    }
  };

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Bayonnomalar (Protocols)</h1>
        <button
          onClick={handleOpenModal}
          className="admin-btn admin-btn-primary"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <Plus size={20} />
          Bayonnoma yaratish
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
                <th>Raqami</th>
                <th>Lot Nomi / Raqami</th>
                <th>G'olib</th>
                <th>G'olib PINFL</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {protocols.map((p) => (
                <tr key={p._id}>
                  <td>
                    <strong>{p.protocolNumber}</strong>
                  </td>
                  <td>
                    <div>{p.lot?.name || "O'chirilgan lot"}</div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--admin-text-muted)",
                      }}
                    >
                      Lot: {p.lot?.lotNumber || "-"}
                    </div>
                  </td>
                  <td>
                    {p.winner ? (
                      `${p.winner.lastName} ${p.winner.firstName}`
                    ) : (
                      <span style={{ color: "var(--admin-text-muted)" }}>
                        Noma'lum g'olib
                      </span>
                    )}
                  </td>
                  <td>{p.winner?.jshshir || "-"}</td>
                  <td>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        backgroundColor:
                          p.status === "active" ? "#dcfce7" : "#f1f5f9",
                        color: p.status === "active" ? "#166534" : "#475569",
                      }}
                    >
                      {p.status?.toUpperCase() || "PENDING"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "0.5rem",
                      }}
                    >
                      <a
                        href={`https://considerate-integrity-production.up.railway.app/api/protocol/${p._id}/download`}
                        target="_blank"
                        rel="noreferrer"
                        className="admin-nav-item"
                        style={{ padding: "0.5rem", color: "#18436E" }}
                        title="Yuklab olish"
                      >
                        <Download size={18} />
                      </a>
                      <button
                        onClick={() => toggleStatus(p._id, p.status)}
                        className="admin-nav-item"
                        style={{
                          padding: "0.5rem",
                          color: p.status === "active" ? "#eab308" : "#22c55e",
                        }}
                        title={
                          p.status === "active" ? "Berkitish" : "Ko'rsatish"
                        }
                      >
                        {p.status === "active" ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="admin-nav-item"
                        style={{
                          padding: "0.5rem",
                          color: "#ef4444",
                        }}
                        title="O'chirish"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {protocols.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                      color: "var(--admin-text-muted)",
                    }}
                  >
                    Bayonnomalar topilmadi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div
            className="admin-modal"
            style={{ maxWidth: "850px", maxHeight: "90vh", overflowY: "auto" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                Yangi Bayonnoma Yaratish (To'liq Manual)
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

            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                {/* Basic Section */}
                <div className="admin-card" style={{ padding: "1rem" }}>
                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      marginBottom: "1rem",
                      color: "var(--admin-accent)",
                    }}
                  >
                    Asosiy ma'lumotlar
                  </h3>

                  <div style={{ marginBottom: "1rem" }}>
                    <label className="admin-label">Lot raqami</label>
                    <input
                      className="admin-input"
                      value={formData.manualData.lotNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          manualData: {
                            ...formData.manualData,
                            lotNumber: e.target.value,
                          },
                        })
                      }
                      required
                    />
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <label className="admin-label">
                      Bayonnoma raqami (ixtiyoriy)
                    </label>
                    <input
                      className="admin-input"
                      placeholder="Avto-generatsiya uchun bo'sh qoldiring"
                      value={formData.protocolNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          protocolNumber: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <label className="admin-label">O'tkazilgan sana</label>
                    <input
                      type="date"
                      className="admin-input"
                      value={formData.manualData.startDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          manualData: {
                            ...formData.manualData,
                            startDate: e.target.value,
                          },
                        })
                      }
                      required
                    />
                  </div>
                </div>

                {/* Auction Details */}
                <div className="admin-card" style={{ padding: "1rem" }}>
                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      marginBottom: "1rem",
                      color: "var(--admin-accent)",
                    }}
                  >
                    Auktsion Tafsilotlari
                  </h3>

                  <div style={{ marginBottom: "1rem" }}>
                    <label className="admin-label">Savdo tashkilotchisi</label>
                    <input
                      className="admin-input"
                      value={formData.manualData.organizer}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          manualData: {
                            ...formData.manualData,
                            organizer: e.target.value,
                          },
                        })
                      }
                      required
                    />
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <label className="admin-label">
                      Auktsion shakli va turi
                    </label>
                    <textarea
                      className="admin-input"
                      rows="2"
                      value={formData.manualData.auctionType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          manualData: {
                            ...formData.manualData,
                            auctionType: e.target.value,
                          },
                        })
                      }
                      required
                    />
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <label className="admin-label">
                      Auksionga qo'yish uchun asos
                    </label>
                    <textarea
                      className="admin-input"
                      rows="2"
                      value={formData.manualData.basisDocument}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          manualData: {
                            ...formData.manualData,
                            basisDocument: e.target.value,
                          },
                        })
                      }
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Object Description & Pricing */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.5fr 1fr",
                  gap: "1.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <div className="admin-card" style={{ padding: "1rem" }}>
                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      marginBottom: "1rem",
                      color: "var(--admin-accent)",
                    }}
                  >
                    Obyekt va G'olib ma'lumotlari
                  </h3>

                  <div style={{ marginBottom: "1rem" }}>
                    <label className="admin-label">Obyekt tavsifi</label>
                    <textarea
                      className="admin-input"
                      rows="3"
                      placeholder="Obyekt haqida qisqacha ma'lumot..."
                      value={formData.manualData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          manualData: {
                            ...formData.manualData,
                            description: e.target.value,
                          },
                        })
                      }
                    />
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <label className="admin-label">G'olib F.I.O.</label>
                    <input
                      className="admin-input"
                      placeholder="Ism Familiya Sharif"
                      value={formData.manualData.winnerName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          manualData: {
                            ...formData.manualData,
                            winnerName: e.target.value,
                          },
                        })
                      }
                      required
                    />
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <label className="admin-label">
                      G'olib JSHSHIR (PINFL)
                    </label>
                    <input
                      className="admin-input"
                      placeholder="Masalan: 12345678901234"
                      value={formData.manualData.winnerJshshir}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          manualData: {
                            ...formData.manualData,
                            winnerJshshir: e.target.value,
                          },
                        })
                      }
                      required
                    />
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <label className="admin-label">G'olib manzili</label>
                    <input
                      className="admin-input"
                      placeholder="Viloyat, shahar, ko'cha..."
                      value={formData.manualData.winnerAddress}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          manualData: {
                            ...formData.manualData,
                            winnerAddress: e.target.value,
                          },
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="admin-card" style={{ padding: "1rem" }}>
                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      marginBottom: "1rem",
                      color: "var(--admin-accent)",
                    }}
                  >
                    Narxlar va Ishtirokchilar
                  </h3>

                  <div style={{ marginBottom: "1rem" }}>
                    <label className="admin-label">
                      Boshlang'ich baho (so'm)
                    </label>
                    <input
                      type="number"
                      className="admin-input"
                      value={formData.manualData.startPrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          manualData: {
                            ...formData.manualData,
                            startPrice: e.target.value,
                          },
                        })
                      }
                      required
                    />
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <label className="admin-label">Sotilgan baho (so'm)</label>
                    <input
                      type="number"
                      className="admin-input"
                      value={formData.manualData.finalPrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          manualData: {
                            ...formData.manualData,
                            finalPrice: e.target.value,
                          },
                        })
                      }
                      required
                    />
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <label className="admin-label">
                      Ishtirokchilar ro'yxati
                    </label>
                    <input
                      className="admin-input"
                      placeholder="Ishtirokchi 1, Ishtirokchi 2..."
                      value={formData.participantsList}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          participantsList: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Attributes Section */}
              <div
                className="admin-card"
                style={{ padding: "1rem", marginBottom: "1.5rem" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "var(--admin-accent)",
                    }}
                  >
                    Obyekt xususiyatlari (Jadval uchun)
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddAttribute}
                    className="admin-btn admin-btn-primary"
                    style={{ padding: "4px 12px", fontSize: "0.8rem" }}
                  >
                    <Plus size={14} /> Xususiyat qo'shish
                  </button>
                </div>

                {formData.manualData.attributes.map((attr, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      gap: "1rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <input
                      className="admin-input"
                      placeholder="Key (masalan: Holati)"
                      style={{ flex: 1 }}
                      value={attr.key}
                      onChange={(e) =>
                        handleAttributeChange(index, "key", e.target.value)
                      }
                    />
                    <input
                      className="admin-input"
                      placeholder="Value (masalan: Zo'r)"
                      style={{ flex: 2 }}
                      value={attr.value}
                      onChange={(e) =>
                        handleAttributeChange(index, "value", e.target.value)
                      }
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveAttribute(index)}
                      style={{
                        padding: "0.5rem",
                        color: "#ef4444",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <div style={{ flex: 1 }}>
                  <label className="admin-label">Status</label>
                  <select
                    className="admin-input"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="active">Faol</option>
                    <option value="inactive">Nofaol</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  style={{
                    flex: 2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "0.5rem",
                    height: "44px",
                    marginTop: "auto",
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Save size={20} />
                  )}
                  Bayonnoma yaratish va saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
