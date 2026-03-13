import api from './api';
import { ApiResponse, Vaccine } from '../types';

export const vaccineService = {
  getVaccines: async (): Promise<ApiResponse<Vaccine[]>> => {
    const response = await api.get<ApiResponse<Vaccine[]>>('/vaccines');
    return response.data;
  },

  getVaccine: async (id: string): Promise<ApiResponse<Vaccine>> => {
    const response = await api.get<ApiResponse<Vaccine>>(`/vaccines/${id}`);
    return response.data;
  },

  getRecommendedVaccines: async (ageMonths: number): Promise<ApiResponse<Vaccine[]>> => {
    const response = await api.get<ApiResponse<Vaccine[]>>(`/vaccines/recommended?ageMonths=${ageMonths}`);
    return response.data;
  },
};
