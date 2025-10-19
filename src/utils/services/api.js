import axios from "axios";

const API_BASE = "https://expensetracker-backend-8t6v.onrender.com/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const signupUser = async (data) => {
  const res = await axios.post(`${API_BASE}/auth/signup`, data);
  return res;
};

//  Login
export const loginUser = async (data) => {
  const res = await axios.post(`${API_BASE}/auth/login`, data);
  return res;
};

// ✅ Get Logged-in User
export const getUserProfile = async () => {
  const res = await axios.get(`${API_BASE}/auth/me`, getAuthHeader());
  return res;
};

// ✅ Forgot Password (send OTP)
export const sendOtp = async (email) => {
  const res = await axios.post(`${API_BASE}/auth/forgot-password`, { email });
  return res;
};

// ✅ Verify OTP
export const verifyOtp = async (email, otp) => {
  const res = await axios.post(`${API_BASE}/auth/verify-otp`, { email, otp });
  return res;
};

// ✅ Reset Password
export const resetPassword = async (token, password) => {
  const res = await axios.post(`${API_BASE}/auth/reset-password`, { token, password });
  return res;
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
