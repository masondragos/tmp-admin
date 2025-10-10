import { getLoanProducts } from "@/services/loan-products/get-loan-products.service";
import { useQuery } from "@tanstack/react-query";
import { LoanProduct } from "./use-best-lender-products";
import { ApiError } from "@/services/instance";
import { PaginatedResponse } from "@/@types/paginated-response";

export const useGetLoanProducts = (lenderId: number, page: number = 1, limit: number = 10) => {
  return useQuery<PaginatedResponse<LoanProduct>, ApiError>({
    queryKey: ["loan-products", lenderId, page, limit],
    queryFn: () => getLoanProducts(lenderId, page, limit),
  });
};
