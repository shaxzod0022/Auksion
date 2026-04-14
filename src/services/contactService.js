const API_URL = "https://auksion-backend-production.up.railway.app/api/contact";

const getAuthHeaders = () => {
  if (typeof window !== "undefined") {
    const token = sessionStorage.getItem("adminToken");
    return {
      Authorization: `Bearer ${token}`,
    };
  }
  return {};
};

const contactService = {
  async submitContact(data) {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Xatolik yuz berdi");
      }

      return result;
    } catch (error) {
      console.error("Contact service error:", error);
      throw error;
    }
  },

  async getAllContacts() {
    try {
      const response = await fetch(API_URL, {
        headers: getAuthHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error("Error fetching all contacts:", error);
      throw error;
    }
  },

  async getContactById(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        headers: getAuthHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error("Error fetching contact by ID:", error);
      throw error;
    }
  },

  async deleteContact(id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error("Error deleting contact:", error);
      throw error;
    }
  },
};

export default contactService;
