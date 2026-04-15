const API_URL =
  "https://considerate-integrity-production.up.railway.app/api/province";

const getAuthHeaders = () => {
  const token = sessionStorage.getItem("adminToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const provinceService = {
  getAllProvinces: async () => {
    const response = await fetch(API_URL);
    return response.json();
  },

  createProvince: async (data) => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  updateProvince: async (id, data) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  deleteProvince: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return response.json();
  },
};

export default provinceService;
