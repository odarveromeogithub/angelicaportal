import axios from "axios";
import { apiUrl } from "../config/index";
const BASEURL = apiUrl;

const httpClient = axios.create({
  baseURL: BASEURL,
    headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    },

    // withCredentials: true, // Enable this if you need to send cookies with requests
    // timeout: 10000, // Set a timeout for requests (in milliseconds)
    // You can add other custom settings here
});

// You can also set up interceptors here if needed
// For example, to add an authorization token to every request
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);



export default httpClient;