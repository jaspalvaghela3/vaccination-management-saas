import api from './api';
import { TOKEN_KEYS } from '../constants';
import {
  ApiResponse,
  AuthTokens,
  LoginFormInputs,
  RegisterDoctorFormInputs,
  RegisterParentFormInputs,
  User,
} from '../types';

interface AuthResponseData {
  user: User;
  tokens: AuthTokens;
}

export const authService = {
  login: async (data: LoginFormInputs): Promise<ApiResponse<AuthResponseData>> => {
    const response = await api.post<ApiResponse<AuthResponseData>>('/auth/login', data);
    const { accessToken, refreshToken } = response.data.data.tokens;
    localStorage.setItem(TOKEN_KEYS.ACCESS, accessToken);
    localStorage.setItem(TOKEN_KEYS.REFRESH, refreshToken);
    return response.data;
  },

  registerDoctor: async (data: RegisterDoctorFormInputs): Promise<ApiResponse<AuthResponseData>> => {
    const response = await api.post<ApiResponse<AuthResponseData>>('/auth/register/doctor', data);
    const { accessToken, refreshToken } = response.data.data.tokens;
    localStorage.setItem(TOKEN_KEYS.ACCESS, accessToken);
    localStorage.setItem(TOKEN_KEYS.REFRESH, refreshToken);
    return response.data;
  },

  registerParent: async (data: RegisterParentFormInputs): Promise<ApiResponse<AuthResponseData>> => {
    const response = await api.post<ApiResponse<AuthResponseData>>('/auth/register/parent', data);
    const { accessToken, refreshToken } = response.data.data.tokens;
    localStorage.setItem(TOKEN_KEYS.ACCESS, accessToken);
    localStorage.setItem(TOKEN_KEYS.REFRESH, refreshToken);
    return response.data;
  },

  forgotPassword: async (email: string): Promise<ApiResponse<null>> => {
    const response = await api.post<ApiResponse<null>>('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, password: string): Promise<ApiResponse<null>> => {
    const response = await api.post<ApiResponse<null>>('/auth/reset-password', { token, password });
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>('/auth/profile');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEYS.ACCESS);
    localStorage.removeItem(TOKEN_KEYS.REFRESH);
  },
};
