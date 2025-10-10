import { useMutation } from "@tanstack/react-query"
import { disableEmployeeService } from "@/services/employee/disable-employee.service"

export const useDisableEmployee = () => {
    return useMutation({
        mutationFn: (id: string) => disableEmployeeService(id),
        mutationKey: ['disableEmployee']
    })
}
