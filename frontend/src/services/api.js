import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const studentAPI = {
  getStudents: () => api.get('/students'),
  getStudent: (id) => api.get(`/students/${id}`),
  createStudent: (data) => api.post('/students', data),
  updateStudent: (id, data) => api.put(`/students/${id}`, data),
  getProgress: (studentId, params) =>
    api.get(`/students/${studentId}/progress`, { params }),
};

export const assessmentAPI = {
  uploadAssessment: (formData) =>
    api.post('/assessments/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getAssessment: (id) => api.get(`/assessments/${id}`),
  getAssessmentById: (id) => api.get(`/assessments/${id}`),
  getStudentAssessments: (studentId, params) =>
    api.get(`/assessments/student/${studentId}`, { params }),
  generatePersonalizedTest: (data) =>
    api.post('/assessments/personalized-test', data),
};

export const userAPI = {
  getAllUsers: (params) => api.get('/users', { params }),
  createUser: (data) => api.post('/users', data),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deactivateUser: (id) => api.post(`/users/${id}/deactivate`),
  reactivateUser: (id) => api.post(`/users/${id}/reactivate`),
  resetPassword: (id) => api.post(`/users/${id}/reset-password`),
};

export default api;
