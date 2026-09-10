import axios from "axios";
import { toast } from "sonner";
import { getApiErrorMessage } from "../utils/api-error";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    toast.error(getApiErrorMessage(error));

    return Promise.reject(error);
  },
);

export default api;