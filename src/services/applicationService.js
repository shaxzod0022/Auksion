const API_URL = "http://localhost:8080/api/application";

const getAuthHeaders = () => {
  const token =
    sessionStorage.getItem("userToken") || sessionStorage.getItem("adminToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const applicationService = {
  applyForLot: async (lotId) => {
    const response = await fetch(`${API_URL}/apply`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ lotId }),
    });
    return response.json();
  },

  getLotApplications: async (lotId) => {
    const response = await fetch(`${API_URL}/lot/${lotId}`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  getMyApplications: async () => {
    const response = await fetch(`${API_URL}/my`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  checkMyApplication: async (lotId) => {
    const response = await fetch(`${API_URL}/check/${lotId}`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  updateApplicationStatus: async (id, status) => {
    const response = await fetch(`${API_URL}/${id}/status`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return response.json();
  },

  deleteApplication: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return response.json();
  },
};

export default applicationService;
