import api from "./api";

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const register = async (data: RegisterPayload) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const login = async (data: LoginPayload) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const refreshToken = async () => {
  const response = await api.post("/auth/refresh");
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const logoutAll = async () => {
  const response = await api.post("/auth/logout-all");
  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/users/me");
  return response.data;
};