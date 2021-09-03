const axios = require('axios');
const API_URL = 'http://localhost:5000';

export const getCredentials = async roomName => {
  return axios.get(`${API_URL}/session/${roomName}`);
};

export const getSignedUrl = async uuid => {
  return axios.get(`${API_URL}/api/signed-url/${uuid}`);
};

export const getUrlForDownload = async uuid => {
  return axios.get(`${API_URL}/api/download-url/${uuid}`);
};
