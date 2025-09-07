// Laravel API билан алоқа учун сервис
const getApiBaseUrl = () => {
  // Production режимида Laravel meta tag дан API URL олиш
  const metaApiUrl = document.querySelector('meta[name="api-base-url"]');
  if (metaApiUrl) {
    return metaApiUrl.getAttribute('content');
  }

  // Development режимида .env файлдан олиш
  return import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
};

const API_BASE_URL = getApiBaseUrl();

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('auth_token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET so'rov
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST so'rov
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT so'rov
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE so'rov
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Токенни созлаш
  setToken(token) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  // Токенни ўчириш
  removeToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Фойдаланувчилар билан ишлаш
  async getUsers() {
    return this.get('/users');
  }

  async getUser(id) {
    return this.get(`/users/${id}`);
  }

  async createUser(userData) {
    return this.post('/users', userData);
  }

  async updateUser(id, userData) {
    return this.put(`/users/${id}`, userData);
  }

  async deleteUser(id) {
    return this.delete(`/users/${id}`);
  }

  // Аутентификация
  async login(credentials) {
    const response = await this.post('/auth/login', credentials);
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async register(userData) {
    const response = await this.post('/auth/register', userData);
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async logout() {
    await this.post('/auth/logout');
    this.removeToken();
  }
}

export default new ApiService();
