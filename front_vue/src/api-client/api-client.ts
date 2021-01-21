import axios from "axios";

const baseDomain = "localhost:1488";
const baseURL = `${baseDomain}`; // Incase of /api/v1;

export const Client =  axios.create({
  baseURL,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Authorization': `Bearer`
  }
});
