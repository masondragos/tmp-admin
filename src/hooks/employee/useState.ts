import { getDashboardStats } from "@/services/employee/get-dashboard-stats.service"
import { ApiError } from "@/services/instance";
import { useQuery } from "@tanstack/react-query"

type Response  = {
    totalLenders: number,
    loanProducts: number,
    totalApplicants: number,
    matchesMade: number,
    totalTermSheets: number
  };
export const useStates = ()=>{
    return useQuery<Response, ApiError>({
        queryKey: ['dashboardStats'],
        queryFn: () => getDashboardStats(),
    })
}