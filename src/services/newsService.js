const API_URL = "http://localhost:8080/api/news";

const getAuthHeaders = () => {
  const token = sessionStorage.getItem("adminToken");
  return {
    Authorization: `Bearer ${token}`,
  };
};

let latestNewsCache = null;

const newsService = {
  getAllNews: async (page, limit) => {
    let url = API_URL;
    if (page) {
      url += `?page=${page}`;
      if (limit) {
        url += `&limit=${limit}`;
      }
    }
    const response = await fetch(url);
    return response.json();
  },

  getLatestNews: async () => {
    if (latestNewsCache) {
      return latestNewsCache;
    }
    const response = await fetch(`${API_URL}/latest`);
    const data = await response.json();
    latestNewsCache = data;
    return data;
  },

  getNewsBySlug: async (slug) => {
    const response = await fetch(`${API_URL}/slug/${slug}`);
    return response.json();
  },

  createNews: async (formData) => {
    latestNewsCache = null;
    const response = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    });
    return response.json();
  },

  updateNews: async (id, formData) => {
    latestNewsCache = null;
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: formData,
    });
    return response.json();
  },

  deleteNews: async (id) => {
    latestNewsCache = null;
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return response.json();
  },
};

export default newsService;
