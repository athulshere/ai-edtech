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
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
};

export const studentAPI = {
  getStudents: () => api.get('/students'),
  getStudent: (id: string) => api.get(`/students/${id}`),
  createStudent: (data: any) => api.post('/students', data),
  updateStudent: (id: string, data: any) => api.put(`/students/${id}`, data),
  getProgress: (studentId: string, params?: any) =>
    api.get(`/students/${studentId}/progress`, { params }),
};

export const assessmentAPI = {
  uploadAssessment: (formData: FormData) =>
    api.post('/assessments/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getAssessment: (id: string) => api.get(`/assessments/${id}`),
  getAssessmentById: (id: string) => api.get(`/assessments/${id}`),
  getStudentAssessments: (studentId: string, params?: any) =>
    api.get(`/assessments/student/${studentId}`, { params }),
  generatePersonalizedTest: (data: any) =>
    api.post('/assessments/personalized-test', data),
};

export default api;
