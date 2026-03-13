import api from './api';
import { ApiResponse, VaccinationRecord, VaccinationFormInputs, DoctorStats, ParentStats } from '../types';

export const scheduleService = {
  getChildVaccinations: async (childId: string): Promise<ApiResponse<VaccinationRecord[]>> => {
    const response = await api.get<ApiResponse<VaccinationRecord[]>>(`/vaccinations/child/${childId}`);
    return response.data;
  },

  createVaccination: async (data: VaccinationFormInputs): Promise<ApiResponse<VaccinationRecord>> => {
    const response = await api.post<ApiResponse<VaccinationRecord>>('/vaccinations', data);
    return response.data;
  },

  updateVaccination: async (
    id: string,
    data: Partial<VaccinationFormInputs>
  ): Promise<ApiResponse<VaccinationRecord>> => {
    const response = await api.put<ApiResponse<VaccinationRecord>>(`/vaccinations/${id}`, data);
    return response.data;
  },

  markAsAdministered: async (
    id: string,
    data: { administeredDate: string; batchNumber?: string; notes?: string; sideEffects?: string }
  ): Promise<ApiResponse<VaccinationRecord>> => {
    const response = await api.patch<ApiResponse<VaccinationRecord>>(`/vaccinations/${id}/administer`, data);
    return response.data;
  },

  getDoctorStats: async (): Promise<ApiResponse<DoctorStats>> => {
    const response = await api.get<ApiResponse<DoctorStats>>('/dashboard/doctor/stats');
    return response.data;
  },

  getParentStats: async (): Promise<ApiResponse<ParentStats>> => {
    const response = await api.get<ApiResponse<ParentStats>>('/dashboard/parent/stats');
    return response.data;
  },

  getUpcomingVaccinations: async (): Promise<ApiResponse<VaccinationRecord[]>> => {
    const response = await api.get<ApiResponse<VaccinationRecord[]>>('/vaccinations/upcoming');
    return response.data;
  },

  getOverdueVaccinations: async (): Promise<ApiResponse<VaccinationRecord[]>> => {
    const response = await api.get<ApiResponse<VaccinationRecord[]>>('/vaccinations/overdue');
    return response.data;
  },
};
