import { useQuery } from "@tanstack/react-query"
import { getEmployeeService } from "@/services/employee/get-employee.service"
import { Employee } from "@/services/employee/get-me.service"
import { ApiError } from "@/services/instance"

export const useGetEmployee = (id: string) => {
    return useQuery<Employee, ApiError>({
        queryKey: ['getEmployee', id],
        queryFn: () => getEmployeeService(id),
        enabled: !!id
    })
}
