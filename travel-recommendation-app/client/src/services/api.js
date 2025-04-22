import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getDestinations = async (params) => {
  try {
    const response = await api.get('/recommendations', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching destinations:', error);
    throw error;
  }
};

export const searchDestinations = async (searchParams) => {
  try {
    const response = await api.get('/recommendations/search', { params: searchParams });
    return response.data;
  } catch (error) {
    console.error('Error searching destinations:', error);
    throw error;
  }
};

export const getDestinationById = async (id) => {
  try {
    const response = await api.get(`/recommendations/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching destination ${id}:`, error);
    throw error;
  }
};

export default api;