import api from './api';
import { ApiResponse, PaginatedResponse, Child, AddChildFormInputs } from '../types';

export const childService = {
  getChildren: async (): Promise<ApiResponse<Child[]>> => {
    const response = await api.get<ApiResponse<Child[]>>('/children');
    return response.data;
  },

  getChild: async (id: string): Promise<ApiResponse<Child>> => {
    const response = await api.get<ApiResponse<Child>>(`/children/${id}`);
    return response.data;
  },

  createChild: async (data: AddChildFormInputs): Promise<ApiResponse<Child>> => {
    const response = await api.post<ApiResponse<Child>>('/children', data);
    return response.data;
  },

  updateChild: async (id: string, data: Partial<AddChildFormInputs>): Promise<ApiResponse<Child>> => {
    const response = await api.put<ApiResponse<Child>>(`/children/${id}`, data);
    return response.data;
  },

  deleteChild: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/children/${id}`);
    return response.data;
  },

  getDoctorPatients: async (
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<PaginatedResponse<Child>> => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.append('search', search);
    const response = await api.get<PaginatedResponse<Child>>(`/children/patients?${params}`);
    return response.data;
  },
};
