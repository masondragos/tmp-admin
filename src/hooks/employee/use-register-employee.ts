import { useMutation } from "@tanstack/react-query"
import { registerEmployeeService } from "@/services/employee/register-employee.service"

export interface RegisterEmployeeRequest {
    password: string;
    token: string;
}

export const useRegisterEmployee = () => {
    return useMutation({
        mutationFn: (data: RegisterEmployeeRequest) => registerEmployeeService(data),
        mutationKey: ['registerEmployee']
    })
}
