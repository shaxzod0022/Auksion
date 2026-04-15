const API_URL = "http://localhost:8080/api/admin";

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Serverda xatolik yuz berdi" };
  }
};

export const verifyToken = async () => {
  try {
    const token = sessionStorage.getItem("adminToken");
    if (!token) return { isValid: false };

    const response = await fetch(`${API_URL}/verify-token`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Token verification error:", error);
    return { isValid: false };
  }
};

export const getDashboardStats = async () => {
  try {
    const token = sessionStorage.getItem("adminToken");
    const response = await fetch(`${API_URL}/dashboard/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return null;
  }
};

export const getAllAdmins = async () => {
  try {
    const token = sessionStorage.getItem("adminToken");
    const response = await fetch(`${API_URL}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Get all admins error:", error);
    return [];
  }
};

export const createAdmin = async (adminData) => {
  try {
    const token = sessionStorage.getItem("adminToken");
    const response = await fetch(`${API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(adminData),
    });
    return await response.json();
  } catch (error) {
    console.error("Create admin error:", error);
    return { success: false, message: "Serverda xatolik yuz berdi" };
  }
};

export const updateAdmin = async (id, adminData) => {
  try {
    const token = sessionStorage.getItem("adminToken");
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(adminData),
    });
    return await response.json();
  } catch (error) {
    console.error("Update admin error:", error);
    return { success: false, message: "Serverda xatolik yuz berdi" };
  }
};

export const deleteAdmin = async (id) => {
  try {
    const token = sessionStorage.getItem("adminToken");
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Delete admin error:", error);
    return { success: false, message: "Serverda xatolik yuz berdi" };
  }
};

// Also keep default for backward compatibility if needed, but we'll update consumers
const adminService = {
  login,
  verifyToken,
  getDashboardStats,
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
};

export default adminService;
