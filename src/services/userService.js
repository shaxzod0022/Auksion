const API_URL = "https://auksion-backend-production.up.railway.app/api/user";

const getAuthHeaders = () => {
  if (typeof window === "undefined") return {};
  const adminToken = sessionStorage.getItem("adminToken");
  const userToken = sessionStorage.getItem("userToken");
  const token = userToken || adminToken;

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const userService = {
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      return await response.json();
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  getAllUsers: async () => {
    const response = await fetch(API_URL, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  createUser: async (userData) => {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  register: async (userData) => {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  getMe: async () => {
    try {
      const response = await fetch(`${API_URL}/me`, {
        headers: getAuthHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error("GetMe error:", error);
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  deleteUser: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return response.json();
  },
};

export default userService;
