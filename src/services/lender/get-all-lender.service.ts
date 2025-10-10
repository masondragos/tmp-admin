import { PaginatedResponse } from "@/@types/paginated-response";
import { Instance } from "../instance";

export interface LendereListItem {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  is_active: boolean;
  invite_status: string;
}

export interface GetAllLendersResponse {
  data: LendereListItem[];
  total: number;
  page: number;
  limit: number;
}

export interface GetAllLendersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const getAllLenders = async (
  params?: GetAllLendersParams
): Promise<PaginatedResponse<LendereListItem>> => {
  const response = await Instance.get("/lender", {
    params: {
      page: params?.page || 1,
      limit: params?.limit || 10,
      search: params?.search || "",
    },
  });
  return response.data;
};
