import axios from "axios";
import { toast } from "sonner";
import { getApiErrorMessage } from "../utils/api-error";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;

let failedQueue: {
  resolve: () => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      originalRequest?.url !== "/auth/refresh"
    ) {
      // Refresh already running
      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
          });
        }).then(() => {
          return api(originalRequest);
        });
      }

      // Start refresh
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Refresh token is sent automatically through HTTP-only cookie
        await api.post("/auth/refresh");

        // Refresh successful → release waiting requests
        processQueue();

        // Retry the request that originally failed
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh itself is an internal request,
        // so don't show its error to the user.
        processQueue(refreshError);

        // Show the ORIGINAL request's error to the user.
        toast.error(getApiErrorMessage(error));

        // Reject the original request
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    // Don't show refresh endpoint errors directly.
    if (originalRequest?.url !== "/auth/refresh") {
      toast.error(getApiErrorMessage(error));
    }

    return Promise.reject(error);
  },
);

export default api;