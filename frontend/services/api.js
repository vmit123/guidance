const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create a simple API client using fetch (no axios dependency issues)
const api = {
  _getHeaders: () => {
    const headers = { 'Content-Type': 'application/json' };
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  },

  get: async (url) => {
    const response = await fetch(`${API_URL}${url}`, {
      headers: api._getHeaders(),
    });
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
      throw new Error('Unauthorized');
    }
    if (!response.ok) throw new Error('API request failed');
    return { data: await response.json() };
  },

  post: async (url, data) => {
    const response = await fetch(`${API_URL}${url}`, {
      method: 'POST',
      headers: api._getHeaders(),
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    if (!response.ok) {
      throw { response: { data: responseData } };
    }
    return { data: responseData };
  },

  put: async (url, data) => {
    const response = await fetch(`${API_URL}${url}`, {
      method: 'PUT',
      headers: api._getHeaders(),
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    if (!response.ok) {
      throw { response: { data: responseData } };
    }
    return { data: responseData };
  },

  delete: async (url) => {
    const response = await fetch(`${API_URL}${url}`, {
      method: 'DELETE',
      headers: api._getHeaders(),
    });
    if (!response.ok) throw new Error('API request failed');
    return { data: await response.json() };
  }
};

// Auth API
export const login = async (username, password) => {
  const response = await api.post('/api/token', { username, password });
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/api/users/', userData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/api/users/me');
  return response.data;
};

// Colleges API
export const fetchColleges = async () => {
  const response = await api.get('/api/colleges/');
  return response.data;
};

export const fetchCollege = async (id) => {
  const response = await api.get(`/api/colleges/${id}`);
  return response.data;
};

// Scholarships API
export const fetchScholarships = async () => {
  const response = await api.get('/api/scholarships/');
  return response.data;
};

export const fetchScholarship = async (id) => {
  const response = await api.get(`/api/scholarships/${id}`);
  return response.data;
};

// Quiz API
export const fetchQuizQuestions = async () => {
  const response = await api.get('/api/quiz/questions');
  return response.data;
};

export const submitQuizResults = async (results) => {
  const response = await api.post('/api/quiz/results', results);
  return response.data;
};

// Recommendations API
export const fetchRecommendations = async (data) => {
  const response = await api.post('/api/recommendations', data);
  return response.data;
};

// Chatbot API
export const sendChatMessage = async (message, userId, conversationHistory) => {
  const response = await api.post('/api/chatbot', {
    message,
    user_id: userId,
    conversation_history: conversationHistory || []
  });
  return response.data;
};

export default api;
