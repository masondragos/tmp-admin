import { getAllEmployeesService, GetAllEmployeesParams } from "@/services/employee/get-all-employees.service"
import { useQuery } from "@tanstack/react-query"

export const useGetAllEmployees = (params?: GetAllEmployeesParams) => {
    return useQuery({
        queryKey: ['getAllEmployees', params],
        queryFn: () => getAllEmployeesService(params),
    })
}
