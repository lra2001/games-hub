import axios from "axios";

const rawBase = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

const baseURL = rawBase.replace(/\/+$/, "") + "/api/";

const api = axios.create({ baseURL });

// ------------------------
// ADD AUTH HEADER
// ------------------------
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ------------------------
// REFRESH TOKEN HANDLER
// ------------------------
let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If unauthorized AND request wasn't retried yet:
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refresh = localStorage.getItem("refresh");
      if (!refresh) {
        // No refresh token → logout
        return Promise.reject(error);
      }

      // Avoid multiple simultaneous refresh calls
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(
          import.meta.env.VITE_BACKEND_URL + "/api/users/token/refresh/",
          { refresh }
        );

        const newAccess = res.data.access;
        localStorage.setItem("access", newAccess);

        api.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`;
        processQueue(null, newAccess);

        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;