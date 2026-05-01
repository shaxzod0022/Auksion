const API_URL = "http://localhost:8080/api/protocol";

const getAuthHeaders = () => {
  const token =
    sessionStorage.getItem("userToken") || sessionStorage.getItem("adminToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const protocolService = {
  createProtocol: async (data) => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  createManualProtocol: async (data) => {
    const isFormData = data instanceof FormData;
    const headers = { ...getAuthHeaders() };

    if (isFormData) {
      delete headers["Content-Type"];
    }

    const response = await fetch(`${API_URL}/manual`, {
      method: "POST",
      headers: headers,
      body: isFormData ? data : JSON.stringify(data),
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

  updateProtocol: async (id, data) => {
    const isFormData = data instanceof FormData;
    const headers = { ...getAuthHeaders() };

    if (isFormData) {
      delete headers["Content-Type"];
    }

    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: headers,
      body: isFormData ? data : JSON.stringify(data),
    });
    return response.json();
  },

  getDownloadUrl: (id) => {
    return `${API_URL}/${id}/download`;
  },

  deleteProtocol: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return response.json();
  },
};

export default protocolService;
