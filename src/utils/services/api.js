import axios from "axios";

const API_BASE = "http://localhost:5000/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

// ✅ Create entry
export const createEntry = async (data) => {
  const res = await axios.post(`${API_BASE}/entries`, data, getAuthHeader());
  return res.data;
};

// ✅ Get all entries
export const getEntries = async () => {
  const res = await axios.get(`${API_BASE}/entries`, getAuthHeader());
  return res;
};

// ✅ Delete entry
export const deleteEntry = async (id) => {
  const res = await axios.delete(`${API_BASE}/entries/${id}`, getAuthHeader());
  return res.data;
};

// Update an existing entry
export const updateEntry = (id, data) => API.put(`/entries/${id}`, data);
