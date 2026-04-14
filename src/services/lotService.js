const API_URL =
  "https://considerate-integrity-production.up.railway.app/api/lot";

const getAuthHeaders = () => {
  const token = sessionStorage.getItem("adminToken");
  return {
    Authorization: `Bearer ${token}`,
  };
};

const lotService = {
  getAllLots: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page);
    if (params.limit) query.append("limit", params.limit);
    if (params.category) query.append("category", params.category);
    if (params.lotType) query.append("lotType", params.lotType);
    if (params.name) query.append("name", params.name);
    if (params.province) query.append("province", params.province);
    if (params.region) query.append("region", params.region);
    if (params.all) query.append("all", params.all);

    const response = await fetch(`${API_URL}?${query.toString()}`);
    return response.json();
  },

  getLatestLots: async () => {
    const response = await fetch(`${API_URL}/latest`);
    return response.json();
  },

  getLotBySlug: async (slug) => {
    const response = await fetch(`${API_URL}/slug/${slug}`);
    return response.json();
  },

  createLot: async (formData) => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    });
    return response.json();
  },

  updateLot: async (id, formData) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: formData,
    });
    return response.json();
  },

  deleteLot: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return response.json();
  },
};

export default lotService;
