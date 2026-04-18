import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const registerStudent = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Students
export const getStudents = () => API.get('/students');
export const getStudent = (id) => API.get(`/students/${id}`);
export const updateStudent = (id, data) => API.put(`/students/${id}`, data);
export const deleteStudent = (id) => API.delete(`/students/${id}`);

// Events
export const getEvents = (params) => API.get('/events', { params });
export const getEvent = (id) => API.get(`/events/${id}`);
export const createEvent = (data) => API.post('/events', data);
export const updateEvent = (id, data) => API.put(`/events/${id}`, data);
export const deleteEvent = (id) => API.delete(`/events/${id}`);

// Registrations
export const registerForEvent = (eventId) => API.post('/registrations', { eventId });
export const unregisterFromEvent = (eventId) => API.delete(`/registrations/${eventId}`);
export const getMyRegistrations = () => API.get('/registrations/my');
export const getEventParticipants = (eventId) => API.get(`/registrations/event/${eventId}`);
export const checkInParticipant = (regId) => API.post('/registrations/checkin', { regId });
export const getQRCode = (regId) => API.get(`/registrations/qr/${regId}`);

// Coordinators
export const getCoordinators = () => API.get('/coordinators');
export const createCoordinator = (data) => API.post('/coordinators', data);
export const deleteCoordinator = (id) => API.delete(`/coordinators/${id}`);

// Feedback
export const submitFeedback = (data) => API.post('/feedback', data);
export const getEventFeedback = (eventId) => API.get(`/feedback/event/${eventId}`);

// Admin
export const getAdminStats = () => API.get('/admin/stats');
export const getAdminAnalytics = () => API.get('/admin/analytics');

export default API;
