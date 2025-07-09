// src/api/api.js
const API_URL = "http://127.0.0.1:8000/api";

export const loginUser = async (email, password) => {
  const res = await fetch(`${API_URL}/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const registerUser = async (email, full_name, password) => {
  const res = await fetch(`${API_URL}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, full_name, password }),
  });
  return res.json();
};

export const getProducts = async () => {
  const res = await fetch(`${API_URL}/products/`);
  return res.json();
};
