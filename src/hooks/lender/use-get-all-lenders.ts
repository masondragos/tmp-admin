
import { getAllLenders, GetAllLendersParams } from "@/services/lender/get-all-lender.service"
import { useQuery } from "@tanstack/react-query"

export const useGetAllLenders = (params?: GetAllLendersParams) => {
    return useQuery({
        queryKey: ['getAllLenders', params],
        queryFn: () => getAllLenders(params),
    })
}
