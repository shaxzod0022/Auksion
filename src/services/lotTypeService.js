const API_URL = "http://localhost:8080/api/lot-type";

const getAuthHeaders = () => {
  const token = sessionStorage.getItem("adminToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const lotTypeService = {
  getAllLotTypes: async () => {
    const response = await fetch(API_URL);
    return response.json();
  },

  createLotType: async (data) => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  updateLotType: async (id, data) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  deleteLotType: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return response.json();
  },
};

export default lotTypeService;
