"use client";

import { useState, useEffect } from "react";
import { EyeOff, Eye, Download, AlertCircle, Loader2 } from "lucide-react";

export default function AdminProtocols() {
  const [protocols, setProtocols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProtocols();
  }, []);

  const fetchProtocols = async () => {
    try {
      const token = sessionStorage.getItem("adminToken");
      const res = await fetch("http://localhost:8080/api/protocol", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
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

  const toggleStatus = async (id, currentStatus) => {
    try {
      const token = sessionStorage.getItem("adminToken");
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      const res = await fetch(`http://localhost:8080/api/protocol/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchProtocols();
      }
    } catch (err) {
      alert("Xatolik");
    }
  };

  return (
    <div>
      <div className="admin-header">
        <h1 className="admin-title">Bayonnomalar (Protocols)</h1>
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
                    <div>{p.lot.name}</div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--admin-text-muted)",
                      }}
                    >
                      Lot: {p.lot.lotNumber}
                    </div>
                  </td>
                  <td>
                    {p.winner.lastName} {p.winner.firstName}
                  </td>
                  <td>{p.winner.jshshir}</td>
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
                      {p.status.toUpperCase()}
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
                        href={`http://localhost:8080/api/protocol/${p._id}/download`}
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
    </div>
  );
}
