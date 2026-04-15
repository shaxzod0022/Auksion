"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import lotService from "@/services/lotService";
import categoryService from "@/services/categoryService";
import lotTypeService from "@/services/lotTypeService";
import provinceService from "@/services/provinceService";
import regionService from "@/services/regionService";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  AlertCircle,
  Loader2,
  Eye,
  Image as ImageIcon,
  MapPin,
  DollarSign,
  Calendar,
  Phone,
  LayoutGrid,
  Package,
  Users,
  InfoIcon,
  Gavel,
  Trophy,
} from "lucide-react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import LotSearchBar from "@/components/lots/LotSearchBar";
import protocolService from "@/services/protocolService";

export default function LotsPage() {
  const router = useRouter();
  const [lots, setLots] = useState([]);
  const [categories, setCategories] = useState([]);
  const [lotTypes, setLotTypes] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [regions, setRegions] = useState([]);
  const [filteredRegions, setFilteredRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLot, setEditingLot] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewLot, setPreviewLot] = useState(null);

  const [isApplicantsModalOpen, setIsApplicantsModalOpen] = useState(false);
  const [currentApplicants, setCurrentApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [currentLotForApplicants, setCurrentLotForApplicants] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    lotNumber: "",
    lotType: "",
    category: "",
    startPrice: "",
    startDate: "",
    endDate: "",
    salesVolume: "",
    description: "",
    province: "",
    region: "",
    address: "",
    phone1: "",
    phone2: "",
    customer: "",
    style: "",
    formTrade: "",
    firstStep: "",
    consultationPrice: "",
    consultingPrice: "",
    status: "active",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async (searchParams = {}) => {
    // Admin panel uchun barcha lotlarni olish
    const finalParams = { ...searchParams, all: true };
    setLoading(true);
    try {
      const [lotsData, catsData, typesData, provincesData] = await Promise.all([
        lotService.getAllLots(finalParams),
        categoryService.getAllCategories(),
        lotTypeService.getAllLotTypes(),
        provinceService.getAllProvinces(),
      ]);

      setLots(Array.isArray(lotsData) ? lotsData : []);
      setCategories(catsData);
      setLotTypes(typesData);
      setProvinces(provincesData);

      // Fetch all regions for initial table display or filtering
      const regionsData = await regionService.getAllRegions();
      setRegions(regionsData);
    } catch (err) {
      setError("Ma'lumotlarni yuklab bo'lmadi");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSearch = (filters) => {
    fetchInitialData(filters);
  };

  const handleAdminClear = () => {
    fetchInitialData();
  };

  const handleOpenModal = (lot = null) => {
    if (lot) {
      setEditingLot(lot);
      setFormData({
        name: lot.name,
        lotNumber: lot.lotNumber,
        lotType: lot.lotType?._id || lot.lotType,
        category: lot.category?._id || lot.category,
        startPrice: lot.startPrice,
        startDate: new Date(lot.startDate).toISOString().slice(0, 16),
        endDate: new Date(lot.endDate).toISOString().slice(0, 16),
        salesVolume: lot.salesVolume,
        description: lot.description,
        province: lot.province,
        region: lot.region,
        address: lot.address || "",
        phone1: lot.phone1,
        phone2: lot.phone2 || "",
        customer: lot.customer,
        style: lot.style,
        formTrade: lot.formTrade,
        firstStep: lot.firstStep,
        consultationPrice: lot.consultationPrice,
        consultingPrice: lot.consultingPrice || "",
        status: lot.status,
      });
      setImagePreview(`http://localhost:8080/upload/${lot.image}`);
      setSelectedImage(null);

      if (lot.province?._id || lot.province) {
        handleProvinceChange(lot.province?._id || lot.province, true);
      }
    } else {
      setEditingLot(null);
      setFormData({
        name: "",
        lotNumber: "",
        lotType: "",
        category: "",
        startPrice: "",
        startDate: "",
        endDate: "",
        salesVolume: "",
        description: "",
        province: "",
        region: "",
        address: "",
        phone1: "",
        phone2: "",
        customer: "",
        style: "",
        formTrade: "",
        firstStep: "",
        consultationPrice: "",
        consultingPrice: "",
        status: "active",
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

  const handleOpenPreview = (lot) => {
    setPreviewLot(lot);
    setIsPreviewModalOpen(true);
  };

  const handleProvinceChange = async (provinceId, isInitial = false) => {
    if (!isInitial) {
      setFormData((prev) => ({ ...prev, province: provinceId, region: "" }));
    }

    if (provinceId) {
      try {
        const data = await regionService.getRegionsByProvince(provinceId);
        setFilteredRegions(data);
      } catch (err) {
        console.error("Tumanlarni yuklashda xatolik:", err);
      }
    } else {
      setFilteredRegions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    if (selectedImage) {
      data.append("image", selectedImage);
    }

    try {
      if (editingLot) {
        const result = await lotService.updateLot(editingLot._id, data);
        if (result.message && result.message.includes("muvaffaqiyatli")) {
          fetchInitialData();
          setIsModalOpen(false);
        } else {
          setError(result.message || "Xatolik yuz berdi");
        }
      } else {
        if (!selectedImage) {
          setError("Rasm yuklanishi majburiy!");
          setIsSubmitting(false);
          return;
        }
        const result = await lotService.createLot(data);
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

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Haqiqatan ham ushbu lotni o'chirmoqchimisiz?")) return;
    try {
      const result = await lotService.deleteLot(id);
      if (result.message) {
        fetchInitialData();
      }
    } catch (err) {
      alert("O'chirishda xatolik");
    }
  };

  const handleViewApplicants = async (lot) => {
    setCurrentLotForApplicants(lot);
    setIsApplicantsModalOpen(true);
    setLoadingApplicants(true);
    setCurrentApplicants([]);

    try {
      const token = sessionStorage.getItem("adminToken");
      const res = await fetch(
        `http://localhost:8080/api/application/lot/${lot._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      setCurrentApplicants(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleUpdateAppStatus = async (appId, newStatus) => {
    try {
      const token = sessionStorage.getItem("adminToken");
      const res = await fetch(
        `http://localhost:8080/api/application/${appId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );
      if (res.ok) {
        setCurrentApplicants((prev) =>
          prev.map((app) =>
            app._id === appId ? { ...app, status: newStatus } : app,
          ),
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteApplicant = async (appId) => {
    if (
      !window.confirm(
        "Haqiqatan ham ushbu arizani bekor qilib o'chirmoqchimisiz?",
      )
    )
      return;
    try {
      const token = sessionStorage.getItem("adminToken");
      const res = await fetch(
        `http://localhost:8080/api/application/${appId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.ok) {
        setCurrentApplicants((prev) => prev.filter((app) => app._id !== appId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProtocol = async (lotId, winnerId) => {
    if (
      !window.confirm(
        "Ushbu foydalanuvchini lot g'olibi deb e'lon qilib, bayonnoma yaratmoqchimisiz?",
      )
    )
      return;
    try {
      const res = await protocolService.createProtocol(lotId, winnerId);
      if (res.message && res.message.includes("yaratildi")) {
        alert("Bayonnoma muvaffaqiyatli yaratildi!");
        setIsApplicantsModalOpen(false);
        router.push("/admin/protocols");
      } else {
        alert(res.message || "Xatolik yuz berdi");
      }
    } catch (err) {
      alert("Server xatosi");
    }
  };

  return (
    <div className="lot-management">
      <div className="admin-header">
        <h1 className="admin-title">Lotlar Boshqaruvi</h1>
        <button
          onClick={() => handleOpenModal()}
          className="admin-btn admin-btn-primary"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <Plus size={20} />
          Yangi Lot Qo'shish
        </button>
      </div>

      <div
        className="admin-search-container"
        style={{ marginBottom: "1.5rem" }}
      >
        <LotSearchBar
          onSearch={handleAdminSearch}
          onClear={handleAdminClear}
          className="admin-card"
          style={{ padding: "1.5rem", background: "#fff" }}
        />
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
                <th>Lot № / Nomi</th>
                <th>Kategoriya</th>
                <th>Narxi</th>
                <th>Holat</th>
                <th style={{ textAlign: "right" }}>Amallar</th>
              </tr>
            </thead>
            <tbody>
              {lots.map((lot) => (
                <tr key={lot._id}>
                  <td>
                    <div
                      style={{
                        width: "60px",
                        height: "40px",
                        borderRadius: "0.25rem",
                        overflow: "hidden",
                        background: "#f1f5f9",
                      }}
                    >
                      <img
                        src={`http://localhost:8080/upload/${lot.image}`}
                        alt={lot.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  </td>
                  <td>
                    <div
                      style={{
                        fontWeight: "700",
                        fontSize: "0.8125rem",
                        color: "var(--admin-accent)",
                      }}
                    >
                      № {lot.lotNumber}
                    </div>
                    <div style={{ fontWeight: "600", fontSize: "0.9375rem" }}>
                      {lot.name}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: "0.875rem" }}>
                      {lot.category?.name || "—"}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--admin-text-muted)",
                      }}
                    >
                      {lot.province?.name || "—"}, {lot.region?.name || "—"}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--admin-text-muted)",
                      }}
                    >
                      {lot.lotType?.name || "—"}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: "700" }}>
                      {lot.startPrice.toLocaleString()} UZS
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--admin-text-muted)",
                      }}
                    >
                      Qadam: {lot.firstStep.toLocaleString()}
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: "0.25rem 0.6rem",
                        borderRadius: "0.5rem",
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        background:
                          lot.status === "active" ? "#dcfce7" : "#fee2e2",
                        color: lot.status === "active" ? "#166534" : "#991b1b",
                        textTransform: "uppercase",
                      }}
                    >
                      {lot.status === "active" ? "Faol" : "Nofaol"}
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
                      <button
                        onClick={() => handleOpenPreview(lot)}
                        className="admin-nav-item"
                        style={{
                          padding: "0.5rem",
                          color: "var(--admin-accent)",
                        }}
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleViewApplicants(lot)}
                        className="admin-nav-item"
                        style={{
                          padding: "0.5rem",
                          color: "#3b82f6",
                        }}
                        title="Arizalarni ko'rish"
                      >
                        <Users size={18} />
                      </button>
                      <button
                        onClick={() =>
                          router.push(`/admin/auction/${lot.slug}`)
                        }
                        className="admin-nav-item"
                        style={{
                          padding: "0.5rem",
                          color: (lot.status !== "active" || new Date(lot.endDate) < new Date()) ? "#9ca3af" : "#8b5cf6",
                          cursor: (lot.status !== "active" || new Date(lot.endDate) < new Date()) ? "not-allowed" : "pointer",
                          opacity: (lot.status !== "active" || new Date(lot.endDate) < new Date()) ? 0.5 : 1,
                        }}
                        title={
                          lot.status !== "active" ? "Auksion yakunlangan" :
                          new Date(lot.endDate) < new Date() ? "Vaqti o'tib ketgan" :
                          "Auksion xonasiga kirish"
                        }
                        disabled={lot.status !== "active" || new Date(lot.endDate) < new Date()}
                      >
                        <Gavel size={18} />
                      </button>
                      <button
                        onClick={() => handleOpenModal(lot)}
                        className="admin-nav-item"
                        style={{ padding: "0.5rem" }}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, lot._id)}
                        className="admin-nav-item"
                        style={{ padding: "0.5rem", color: "#ef4444" }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {lots.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "3rem",
                      color: "var(--admin-text-muted)",
                    }}
                  >
                    Lotlar topilmadi. Yangi lot yarating.
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
            style={{
              maxWidth: "900px",
              height: "90vh",
              display: "flex",
              flexDirection: "column",
              padding: 0,
            }}
          >
            <div
              style={{
                padding: "1.5rem 2rem",
                borderBottom: "1px solid var(--admin-border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#fff",
                borderTopLeftRadius: "1.25rem",
                borderTopRightRadius: "1.25rem",
              }}
            >
              <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                {editingLot ? "Lotni Tahrirlash" : "Yangi Lot Qo'shish"}
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

            <div style={{ overflowY: "auto", padding: "2rem", flex: 1 }}>
              <form onSubmit={handleSubmit} id="lot-form">
                {/* SECTION 1: ASOSIY */}
                <div style={{ marginBottom: "2rem" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "1.25rem",
                      color: "var(--admin-accent)",
                      fontWeight: "700",
                    }}
                  >
                    <LayoutGrid size={20} />
                    Asosiy Ma'lumotlar
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <label className="admin-label">Lot Nomi</label>
                      <input
                        className="admin-input"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Misol: Malibu mashinasi, qora rangli, 2022 yil"
                      />
                    </div>
                    {editingLot && (
                      <div>
                        <label className="admin-label">Lot Raqami</label>
                        <input
                          className="admin-input"
                          value={formData.lotNumber}
                          disabled
                          style={{
                            background: "#f8fafc",
                            cursor: "not-allowed",
                          }}
                        />
                      </div>
                    )}
                    <div>
                      <label className="admin-label">Kategoriya</label>
                      <select
                        className="admin-input"
                        required
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                      >
                        <option value="">Tanlang...</option>
                        {categories.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="admin-label">Lot Turi</label>
                      <select
                        className="admin-input"
                        required
                        value={formData.lotType}
                        onChange={(e) =>
                          setFormData({ ...formData, lotType: e.target.value })
                        }
                      >
                        <option value="">Tanlang...</option>
                        {lotTypes.map((t) => (
                          <option key={t._id} value={t._id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: NARX VA SANA */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "2rem",
                    marginBottom: "2rem",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        marginBottom: "1.25rem",
                        color: "var(--admin-accent)",
                        fontWeight: "700",
                      }}
                    >
                      <DollarSign size={20} />
                      Narx va To'lov
                    </div>
                    <div style={{ display: "grid", gap: "1rem" }}>
                      <div>
                        <label className="admin-label">Boshlang'ich narx</label>
                        <input
                          type="number"
                          className="admin-input"
                          required
                          value={formData.startPrice}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              startPrice: e.target.value,
                            })
                          }
                          placeholder="Misol: 50000000"
                        />
                      </div>
                      <div>
                        <label className="admin-label">Qadam miqdori (%)</label>
                        <input
                          type="number"
                          className="admin-input"
                          required
                          value={formData.firstStep}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              firstStep: e.target.value,
                            })
                          }
                          placeholder="Misol: 1"
                        />
                      </div>
                      <div>
                        <label className="admin-label">Zakalat puli (%)</label>
                        <input
                          type="number"
                          className="admin-input"
                          required
                          value={formData.consultationPrice}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              consultationPrice: e.target.value,
                            })
                          }
                          placeholder="Misol: 5"
                        />
                      </div>
                      <div>
                        <label className="admin-label">Konsalting xizmati narxi</label>
                        <input
                          type="number"
                          className="admin-input"
                          required
                          value={formData.consultingPrice}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              consultingPrice: e.target.value,
                            })
                          }
                          placeholder="Misol: 100000"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        marginBottom: "1.25rem",
                        color: "var(--admin-accent)",
                        fontWeight: "700",
                      }}
                    >
                      <Calendar size={20} />
                      Sana va Vaqt
                    </div>
                    <div style={{ display: "grid", gap: "1rem" }}>
                      <div>
                        <label className="admin-label">Boshlanish vaqti</label>
                        <input
                          type="datetime-local"
                          className="admin-input"
                          required
                          value={formData.startDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              startDate: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="admin-label">
                          Ariza berishning tugash vaqti
                        </label>
                        <input
                          type="datetime-local"
                          className="admin-input"
                          required
                          value={formData.endDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              endDate: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 3: MANZIL */}
                <div style={{ marginBottom: "2rem" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "1.25rem",
                      color: "var(--admin-accent)",
                      fontWeight: "700",
                    }}
                  >
                    <MapPin size={20} />
                    Manzil va Joylashuv
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <label className="admin-label">Viloyat</label>
                      <select
                        className="admin-input"
                        required
                        value={formData.province}
                        onChange={(e) => handleProvinceChange(e.target.value)}
                      >
                        <option value="">Viloyatni tanlang...</option>
                        {provinces.map((p) => (
                          <option key={p._id} value={p._id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="admin-label">Tuman / Shahar</label>
                      <select
                        className="admin-input"
                        required
                        value={formData.region}
                        onChange={(e) =>
                          setFormData({ ...formData, region: e.target.value })
                        }
                        disabled={!formData.province}
                      >
                        <option value="">Tuman tanlang...</option>
                        {filteredRegions.map((r) => (
                          <option key={r._id} value={r._id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="admin-label">Manzil (ko'cha, uy)</label>
                      <input
                        className="admin-input"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        placeholder="Misol: Shayxontohur tumani, 15-uy"
                      />
                    </div>
                  </div>
                </div>
                {/* SECTION 4: BOG'LANISH VA BOSHQA */}
                <div style={{ marginBottom: "2rem" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "1.25rem",
                      color: "var(--admin-accent)",
                      fontWeight: "700",
                    }}
                  >
                    <Phone size={20} />
                    Bog'lanish va Tafsilotlar
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <label className="admin-label">Telefon 1</label>
                      <PhoneInput
                        defaultCountry="uz"
                        value={formData.phone1}
                        onChange={(phone) => setFormData({ ...formData, phone1: phone })}
                        className="admin-phone-input"
                        inputClassName="admin-input"
                        style={{ width: "100%" }}
                      />
                    </div>
                    <div>
                      <label className="admin-label">Telefon 2</label>
                      <PhoneInput
                        defaultCountry="uz"
                        value={formData.phone2}
                        onChange={(phone) => setFormData({ ...formData, phone2: phone })}
                        className="admin-phone-input"
                        inputClassName="admin-input"
                        style={{ width: "100%" }}
                      />
                    </div>
                    <div>
                      <label className="admin-label">Mijoz (Sotuvchi)</label>
                      <input
                        className="admin-input"
                        required
                        value={formData.customer}
                        onChange={(e) =>
                          setFormData({ ...formData, customer: e.target.value })
                        }
                        placeholder="Misol: Toshkent shahar hokimiyati"
                      />
                    </div>
                    <div>
                      <label className="admin-label">Savdo shakli</label>
                      <input
                        className="admin-input"
                        required
                        value={formData.formTrade}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            formTrade: e.target.value,
                          })
                        }
                        placeholder="Misol: Ochiq yoki yopiq"
                      />
                    </div>
                    <div>
                      <label className="admin-label">Hajmi / Soni</label>
                      <input
                        type="number"
                        className="admin-input"
                        required
                        value={formData.salesVolume}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            salesVolume: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="admin-label">Uslub</label>
                      <input
                        className="admin-input"
                        required
                        value={formData.style}
                        onChange={(e) =>
                          setFormData({ ...formData, style: e.target.value })
                        }
                        placeholder="Misol: Narx oshib borish tartibida"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 5: TAVSIF VA RASM */}
                <div style={{ marginBottom: "2rem" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "1.25rem",
                      color: "var(--admin-accent)",
                      fontWeight: "700",
                    }}
                  >
                    <InfoIcon size={20} />
                    Tavsif va Rasm
                  </div>
                  <div style={{ marginBottom: "1.5rem" }}>
                    <label className="admin-label">To'liq Tavsif</label>
                    <textarea
                      className="admin-input"
                      style={{ minHeight: "120px", resize: "vertical" }}
                      required
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div
                    onClick={() =>
                      document.getElementById("lot-image-upload").click()
                    }
                    style={{
                      border: "2px dashed var(--admin-border)",
                      borderRadius: "1rem",
                      padding: "3rem",
                      textAlign: "center",
                      cursor: "pointer",
                      background: "#f8fafc",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <input
                      id="lot-image-upload"
                      type="file"
                      absorb="image/*"
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                    />
                    {imagePreview ? (
                      <>
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
                            opacity: 0.2,
                          }}
                        />
                        <div style={{ position: "relative", zIndex: 1 }}>
                          <ImageIcon
                            size={40}
                            style={{
                              margin: "0 auto 1rem",
                              color: "var(--admin-accent)",
                            }}
                          />
                          <p style={{ fontWeight: "700" }}>
                            Rasm tanlandi. O'zgartirish uchun bosing.
                          </p>
                        </div>
                      </>
                    ) : (
                      <div style={{ color: "var(--admin-text-muted)" }}>
                        <ImageIcon
                          size={48}
                          style={{ margin: "0 auto 1rem", opacity: 0.5 }}
                        />
                        <p style={{ fontWeight: "600" }}>
                          Asosiy rasm yuklash uchun bu yerga bosing
                        </p>
                        <p style={{ fontSize: "0.875rem" }}>
                          PNG, JPG yoki WEBP (max 5MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ marginBottom: "2rem" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.status === "active"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.checked ? "active" : "inactive",
                        })
                      }
                      style={{ width: "1.25rem", height: "1.25rem" }}
                    />
                    <span style={{ fontWeight: "600" }}>
                      Ushbu lot hozirda faol bo'lsin
                    </span>
                  </label>
                </div>
              </form>
            </div>

            <div
              style={{
                padding: "1.5rem 2rem",
                borderTop: "1px solid var(--admin-border)",
                background: "#fff",
                borderBottomLeftRadius: "1.25rem",
                borderBottomRightRadius: "1.25rem",
              }}
            >
              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="admin-btn"
                  style={{ flex: 1, background: "#f1f5f9", color: "#64748b" }}
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  form="lot-form"
                  className="admin-btn admin-btn-primary"
                  style={{
                    flex: 2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Save size={20} />
                  )}
                  {editingLot ? "Saqlash" : "Lotni yaratish"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isPreviewModalOpen && previewLot && (
        <div className="admin-modal-overlay">
          <div
            className="admin-modal"
            style={{
              maxWidth: "800px",
              height: "85vh",
              display: "flex",
              flexDirection: "column",
              padding: 0,
            }}
          >
            <div
              style={{
                padding: "1.5rem 2rem",
                borderBottom: "1px solid var(--admin-border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#fff",
                borderTopLeftRadius: "1.25rem",
                borderTopRightRadius: "1.25rem",
              }}
            >
              <div>
                <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                  Lot Ma'lumotlari
                </h2>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--admin-text-muted)",
                  }}
                >
                  {previewLot.lotNumber}
                </p>
              </div>
              <button
                onClick={() => setIsPreviewModalOpen(false)}
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

            <div style={{ overflowY: "auto", padding: "2rem", flex: 1 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "300px 1fr",
                  gap: "2rem",
                }}
              >
                <div>
                  <div
                    style={{
                      width: "100%",
                      borderRadius: "1rem",
                      overflow: "hidden",
                      aspectRatio: "4/3",
                      background: "#f1f5f9",
                      marginBottom: "1rem",
                    }}
                  >
                    <img
                      src={`http://localhost:8080/upload/${previewLot.image}`}
                      alt={previewLot.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div className="admin-card" style={{ padding: "1rem" }}>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--admin-text-muted)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      STATUS
                    </p>
                    <span
                      style={{
                        padding: "0.25rem 0.6rem",
                        borderRadius: "0.5rem",
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        background:
                          previewLot.status === "active"
                            ? "#dcfce7"
                            : "#fee2e2",
                        color:
                          previewLot.status === "active"
                            ? "#166534"
                            : "#991b1b",
                        textTransform: "uppercase",
                      }}
                    >
                      {previewLot.status === "active" ? "Faol" : "Nofaol"}
                    </span>
                  </div>
                </div>

                <div>
                  <h3
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "800",
                      marginBottom: "1rem",
                      color: "var(--admin-text-dark)",
                    }}
                  >
                    {previewLot.name}
                  </h3>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1.5rem",
                      marginBottom: "2rem",
                    }}
                  >
                    <div
                      style={{
                        padding: "1rem",
                        background: "rgba(59, 130, 246, 0.05)",
                        borderRadius: "0.75rem",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--admin-text-muted)",
                          fontWeight: "600",
                          marginBottom: "0.25rem",
                        }}
                      >
                        BOSHLANG'ICH NARX
                      </p>
                      <p
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: "800",
                          color: "var(--admin-accent)",
                        }}
                      >
                        {previewLot.startPrice?.toLocaleString()} UZS
                      </p>
                    </div>
                    <div
                      style={{
                        padding: "1rem",
                        background: "rgba(59, 130, 246, 0.05)",
                        borderRadius: "0.75rem",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--admin-text-muted)",
                          fontWeight: "600",
                          marginBottom: "0.25rem",
                        }}
                      >
                        QADAM MIQDORI
                      </p>
                      <p
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: "800",
                          color: "var(--admin-accent)",
                        }}
                      >
                        {previewLot.firstStep?.toLocaleString()} %
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "grid", gap: "1.5rem" }}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "140px 1fr",
                        gap: "1rem",
                        borderBottom: "1px solid #f1f5f9",
                        paddingBottom: "0.75rem",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--admin-text-muted)",
                          fontSize: "0.875rem",
                          fontWeight: "600",
                        }}
                      >
                        Kategoriya:
                      </span>
                      <span style={{ fontSize: "0.875rem", fontWeight: "700" }}>
                        {previewLot.category?.name || "—"}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "140px 1fr",
                        gap: "1rem",
                        borderBottom: "1px solid #f1f5f9",
                        paddingBottom: "0.75rem",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--admin-text-muted)",
                          fontSize: "0.875rem",
                          fontWeight: "600",
                        }}
                      >
                        Savdo shakli:
                      </span>
                      <span style={{ fontSize: "0.875rem", fontWeight: "700" }}>
                        {previewLot.lotType?.name || "—"}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "140px 1fr",
                        gap: "1rem",
                        borderBottom: "1px solid #f1f5f9",
                        paddingBottom: "0.75rem",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--admin-text-muted)",
                          fontSize: "0.875rem",
                          fontWeight: "600",
                        }}
                      >
                        Manzil:
                      </span>
                      <span style={{ fontSize: "0.875rem" }}>
                        {previewLot.province?.name}, {previewLot.region?.name},{" "}
                        {previewLot.address}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "140px 1fr",
                        gap: "1rem",
                        borderBottom: "1px solid #f1f5f9",
                        paddingBottom: "0.75rem",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--admin-text-muted)",
                          fontSize: "0.875rem",
                          fontWeight: "600",
                        }}
                      >
                        Mijoz:
                      </span>
                      <span style={{ fontSize: "0.875rem" }}>
                        {previewLot.customer}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "140px 1fr",
                        gap: "1rem",
                        borderBottom: "1px solid #f1f5f9",
                        paddingBottom: "0.75rem",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--admin-text-muted)",
                          fontSize: "0.875rem",
                          fontWeight: "600",
                        }}
                      >
                        Boshlanish vaqti:
                      </span>
                      <span style={{ fontSize: "0.875rem" }}>
                        {new Date(previewLot.startDate).toLocaleString("uz-UZ")}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "140px 1fr",
                        gap: "1rem",
                        borderBottom: "1px solid #f1f5f9",
                        paddingBottom: "0.75rem",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--admin-text-muted)",
                          fontSize: "0.875rem",
                          fontWeight: "600",
                        }}
                      >
                        Tugash vaqti:
                      </span>
                      <span style={{ fontSize: "0.875rem" }}>
                        {new Date(previewLot.endDate).toLocaleString("uz-UZ")}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "140px 1fr",
                        gap: "1rem",
                        borderBottom: "1px solid #f1f5f9",
                        paddingBottom: "0.75rem",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--admin-text-muted)",
                          fontSize: "0.875rem",
                          fontWeight: "600",
                        }}
                      >
                        Telefonlar:
                      </span>
                      <span style={{ fontSize: "0.875rem" }}>
                        {previewLot.phone1}{" "}
                        {previewLot.phone2 && `, ${previewLot.phone2}`}
                      </span>
                    </div>
                  </div>

                  <div style={{ marginTop: "2rem" }}>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--admin-text-muted)",
                        fontWeight: "600",
                        marginBottom: "0.75rem",
                      }}
                    >
                      TAVSIFI
                    </p>
                    <div
                      style={{
                        fontSize: "0.875rem",
                        lineHeight: "1.6",
                        color: "#475569",
                        background: "#f8fafc",
                        padding: "1rem",
                        borderRadius: "0.5rem",
                      }}
                    >
                      {previewLot.description}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                padding: "1.5rem 2rem",
                borderTop: "1px solid var(--admin-border)",
                background: "#fff",
                borderBottomLeftRadius: "1.25rem",
                borderBottomRightRadius: "1.25rem",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="admin-btn admin-btn-primary"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {isApplicantsModalOpen && (
        <div className="admin-modal-overlay">
          <div
            className="admin-modal"
            style={{ maxWidth: "800px", padding: 0 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1.5rem 2rem",
                borderBottom: "1px solid var(--admin-border)",
                background: "#fff",
                borderTopLeftRadius: "1.25rem",
                borderTopRightRadius: "1.25rem",
              }}
            >
              <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                №{currentLotForApplicants?.lotNumber} - Arizachilar
              </h2>
              <button
                onClick={() => setIsApplicantsModalOpen(false)}
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
            {loadingApplicants ? (
              <div style={{ padding: "4rem", textAlign: "center" }}>
                <Loader2
                  className="animate-spin"
                  size={30}
                  style={{ color: "var(--admin-accent)", margin: "0 auto" }}
                />
              </div>
            ) : (
              <div
                style={{
                  overflowY: "auto",
                  padding: "2rem",
                  maxHeight: "60vh",
                }}
              >
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>F.I.O</th>
                      <th>JSHSHIR</th>
                      <th>Telefon / Email</th>
                      <th>Sana</th>
                      <th>Holati</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(currentApplicants) &&
                      currentApplicants.map((app) => (
                        <tr key={app._id}>
                          <td>
                            {app.user?.lastName} {app.user?.firstName}{" "}
                            {app.user?.middleName}
                          </td>
                          <td>{app.user?.jshshir}</td>
                          <td>
                            <div>{app.user?.phoneNumber}</div>
                            <div
                              style={{
                                fontSize: "0.75rem",
                                color: "var(--admin-text-muted)",
                              }}
                            >
                              {app.user?.email}
                            </div>
                          </td>
                          <td>
                            {new Date(app.createdAt).toLocaleString("uz-UZ")}
                          </td>
                          <td>
                            <div
                              style={{
                                display: "flex",
                                gap: "0.5rem",
                                alignItems: "center",
                              }}
                            >
                              <select
                                value={app.status || "pending"}
                                onChange={(e) =>
                                  handleUpdateAppStatus(app._id, e.target.value)
                                }
                                style={{
                                  padding: "0.25rem 0.5rem",
                                  borderRadius: "0.25rem",
                                  border: "1px solid #e2e8f0",
                                  fontSize: "0.75rem",
                                  fontWeight: "bold",
                                  background:
                                    app.status === "approved"
                                      ? "#dcfce7"
                                      : app.status === "rejected"
                                        ? "#fee2e2"
                                        : "#fef9c3",
                                  outline: "none",
                                }}
                              >
                                <option value="pending">Kutilmoqda</option>
                                <option value="approved">Qabul kilingan</option>
                                <option value="rejected">Rad etilgan</option>
                              </select>
                              <button
                                onClick={() => handleDeleteApplicant(app._id)}
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  color: "#ef4444",
                                  cursor: "pointer",
                                  padding: "0.25rem",
                                }}
                                title="Arizani o'chirish"
                              >
                                <Trash2 size={16} />
                              </button>
                              {app.status === "approved" && (
                                <button
                                  onClick={() =>
                                    handleCreateProtocol(
                                      currentLotForApplicants._id,
                                      app.user?._id,
                                    )
                                  }
                                  style={{
                                    background: "#18436E",
                                    border: "none",
                                    color: "#fff",
                                    cursor: "pointer",
                                    padding: "0.25rem 0.5rem",
                                    borderRadius: "4px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                  }}
                                  title="G'olib deb e'lon qilish"
                                >
                                  <Trophy size={14} />
                                  <span
                                    style={{
                                      fontSize: "10px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    G'OLIB
                                  </span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    {(!Array.isArray(currentApplicants) ||
                      currentApplicants.length === 0) && (
                      <tr>
                        <td
                          colSpan="5"
                          style={{
                            textAlign: "center",
                            padding: "2rem",
                            color: "var(--admin-text-muted)",
                          }}
                        >
                          Ushbu lotga hali hech kim ariza bermagan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            <div
              style={{
                padding: "1.5rem 2rem",
                borderTop: "1px solid var(--admin-border)",
                display: "flex",
                justifyContent: "flex-end",
                background: "#fff",
                borderBottomLeftRadius: "1.25rem",
                borderBottomRightRadius: "1.25rem",
              }}
            >
              <button
                onClick={() => setIsApplicantsModalOpen(false)}
                className="admin-btn admin-btn-primary"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--admin-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }
      `}</style>
    </div>
  );
}
