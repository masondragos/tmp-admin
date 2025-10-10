import { PaginatedResponse } from "@/@types/paginated-response";
import { Instance } from "../instance";

export interface EmployeeListItem {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  invite_status: string;
}

export interface GetAllEmployeesResponse {
  data: EmployeeListItem[];
  total: number;
  page: number;
  limit: number;
}

export interface GetAllEmployeesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const getAllEmployeesService = async (
  params?: GetAllEmployeesParams
): Promise<PaginatedResponse<EmployeeListItem>> => {
  const response = await Instance.get("/employee", {
    params: {
      page: params?.page || 1,
      limit: params?.limit || 10,
      search: params?.search || "",
    },
  });
  return response.data;
};
