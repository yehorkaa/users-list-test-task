import axios from 'axios';

export const usersPlatformApiClient = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:3000/api',
  timeout: 10000,
});
