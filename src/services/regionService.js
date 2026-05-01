const API_URL =
  "https://considerate-integrity-production.up.railway.app/api/region";

const getAuthHeaders = () => {
  const token = sessionStorage.getItem("adminToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const regionService = {
  getAllRegions: async () => {
    const response = await fetch(API_URL);
    return response.json();
  },

  getRegionsByProvince: async (provinceId) => {
    const response = await fetch(`${API_URL}/province/${provinceId}`);
    return response.json();
  },

  createRegion: async (data) => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  updateRegion: async (id, data) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  deleteRegion: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return response.json();
  },
};

export default regionService;
