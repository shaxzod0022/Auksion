const API_URL =
  "https://considerate-integrity-production.up.railway.app/api/category";

const getAuthHeaders = () => {
  const token = sessionStorage.getItem("adminToken");
  return {
    Authorization: `Bearer ${token}`,
  };
};

const categoryService = {
  getAllCategories: async () => {
    const response = await fetch(API_URL);
    return response.json();
  },

  createCategory: async (formData) => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData, // FormData handles its own Content-Type
    });
    return response.json();
  },

  updateCategory: async (id, formData) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: formData,
    });
    return response.json();
  },

  deleteCategory: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return response.json();
  },
};

export default categoryService;
