import axios from 'axios';

const API = 'http://localhost:5000/api';

export async function loginUser(email, password) {
  const response = await axios.post(`${API}/auth/login`, { email, password });
  return response.data;
}

export async function registerUser(name, email, password) {
  const response = await axios.post(`${API}/auth/register`, { name, email, password });
  return response.data;
}
