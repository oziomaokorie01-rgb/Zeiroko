import axios from 'axios';
const API = process.env.REACT_APP_API_URL || 'http://localhost:4000';
const instance = axios.create({ baseURL: API, withCredentials: true });
export default instance;