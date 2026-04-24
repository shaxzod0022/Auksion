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
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import protocolService from "@/services/protocolService";
import { formatDateForInput } from "@/utils/dateUtils";

export default function AdminProtocols() {
  const [protocols, setProtocols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [formData, setFormData] = useState({
    protocolNumber: "",
    participantsList: "",
    status: "active",
    manualData: {
      lotNumber: "",
      organizer: "uainf-auksion.uz",
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
        organizer: "uainf-auksion.uz",
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
    setSelectedFiles([]);
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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    // Append new files, and cap at 4
    setSelectedFiles((prev) => [...prev, ...files].slice(0, 4));
  };

  const removeFile = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  const getStatusMessage = () => {
    const count = selectedFiles.length;
    if (count === 0)
      return { text: "Rasm yuklash majburiy emas", color: "#64748b" };
    if (count === 1)
      return { text: "Kamida 2 ta rasm yuklang", color: "#ef4444" };
    if (count >= 2 && count <= 4)
      return { text: `Zo'r! ${count} ta rasm tanlandi`, color: "#22c55e" };
    return { text: "Ko'pi bilan 4 ta rasm yuklang", color: "#ef4444" };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      selectedFiles.length > 0 &&
      (selectedFiles.length < 2 || selectedFiles.length > 4)
    ) {
      alert("Iltimos, kamida 2 ta va ko'pi bilan 4 ta rasm tanlang");
      return;
    }

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("protocolNumber", formData.protocolNumber);
      fd.append("participantsList", formData.participantsList);
      fd.append("status", formData.status);
      fd.append("manualData", JSON.stringify(formData.manualData));

      selectedFiles.forEach((file) => {
        fd.append("images", file);
      });

      const res = await protocolService.createManualProtocol(fd);
      if (res.protocol) {
        fetchProtocols();
        setIsModalOpen(false);
        setSelectedFiles([]);
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
                <th>Lot №</th>
                <th>Lot Nomi / Raqami</th>
                <th>G'olib</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {protocols.map((p) => (
                <tr key={p._id}>
                  <td>
                    <strong>
                      {p.isManual
                        ? p.manualData?.lotNumber
                        : p.lot?.lotNumber || p.manualData?.lotNumber || "—"}
                    </strong>
                  </td>
                  <td>
                    <div style={{ fontWeight: "500" }}>
                      {p.lot?.name ||
                        p.manualData?.description ||
                        "O'chirilgan lot"}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--admin-text-muted)",
                      }}
                    >
                      Lot: {p.lot?.lotNumber || p.manualData?.lotNumber || "-"}
                    </div>
                  </td>
                  <td>
                    {p.winner ? (
                      `${p.winner.lastName} ${p.winner.firstName}`
                    ) : p.manualData?.winnerName ? (
                      p.manualData.winnerName
                    ) : (
                      <span style={{ color: "var(--admin-text-muted)" }}>
                        Noma'lum g'olib
                      </span>
                    )}
                  </td>
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
                    <label className="admin-label">Lot nomi</label>
                    <input
                      className="admin-input"
                      placeholder="Lot nomi..."
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
                      G'olib haqida ma'lumotlar
                    </label>
                    <input
                      className="admin-input"
                      placeholder="JSHSHIR, pasport yoki boshqa ma'lumotlar"
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

              {/* Sequential Grid Images Section */}
              <div
                className="admin-card"
                style={{ padding: "1.5rem", marginBottom: "1.5rem" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1.25rem",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "var(--admin-accent)",
                    }}
                  >
                    Obyekt rasmlari (2 yoki 4 ta)
                  </h3>
                  <div
                    style={{
                      backgroundColor: getStatusMessage().color + "20",
                      color: getStatusMessage().color,
                      padding: "4px 12px",
                      borderRadius: "99px",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    {selectedFiles.length >= 2 && selectedFiles.length <= 4 && (
                      <CheckCircle2 size={14} />
                    )}
                    {getStatusMessage().text}
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(120px, 120px))",
                    gap: "1rem",
                  }}
                >
                  {/* Existing Previews */}
                  {selectedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: "relative",
                        width: "120px",
                        height: "120px",
                        borderRadius: "12px",
                        overflow: "hidden",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                      }}
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        style={{
                          position: "absolute",
                          top: "6px",
                          right: "6px",
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          color: "#ef4444",
                          border: "none",
                          borderRadius: "50%",
                          width: "24px",
                          height: "24px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          zIndex: 10,
                        }}
                        title="O'chirish"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}

                  {/* Plus Button Slot */}
                  {selectedFiles.length < 4 && (
                    <div
                      onClick={() =>
                        document.getElementById("fileInput").click()
                      }
                      style={{
                        width: "120px",
                        height: "120px",
                        borderRadius: "12px",
                        border: "2px dashed #cbd5e1",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        backgroundColor: "#f8fafc",
                        color: "#64748b",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor =
                          "var(--admin-accent)";
                        e.currentTarget.style.color = "var(--admin-accent)";
                        e.currentTarget.style.backgroundColor = "#eff6ff";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = "#cbd5e1";
                        e.currentTarget.style.color = "#64748b";
                        e.currentTarget.style.backgroundColor = "#f8fafc";
                      }}
                    >
                      <Plus size={32} />
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: "500",
                          marginTop: "4px",
                        }}
                      >
                        Qo'shish
                      </span>
                      <input
                        id="fileInput"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                      />
                    </div>
                  )}
                </div>

                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--admin-text-muted)",
                    marginTop: "1rem",
                  }}
                >
                  Pdf faylda rasmlar 2x2 grid (katakcha) ko'rinishida chiqadi.
                </p>
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
