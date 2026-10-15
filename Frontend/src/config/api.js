// ===============================================
// DAZZLING SKY — CENTRALIZED API CONFIGURATION
// ===============================================

// Reads the base URL from Vite (.env / VITE_API_URL) or legacy CRA (.env / REACT_APP_API_URL)
// Defaults to the deployed Render backend URL: https://dazzling-sky-backend.onrender.com
export const API_BASE_URL = 
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) ||
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) ||
  'https://dazzling-sky-backend.onrender.com';

export default API_BASE_URL;
