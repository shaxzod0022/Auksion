const API_URL =
  "https://auksion-backend-production.up.railway.app/api/protocol";

const getAuthHeaders = () => {
  const token =
    sessionStorage.getItem("userToken") || sessionStorage.getItem("adminToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const protocolService = {
  createProtocol: async (lotId, winnerId) => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ lotId, winnerId }),
    });
    return response.json();
  },

  getProtocols: async () => {
    const response = await fetch(API_URL, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  getMyProtocols: async () => {
    const response = await fetch(`${API_URL}/my`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  updateProtocolStatus: async (id, status) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    return response.json();
  },

  getDownloadUrl: (id) => {
    return `${API_URL}/${id}/download`;
  },
};

export default protocolService;
