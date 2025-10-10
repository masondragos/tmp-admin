import { useMutation } from "@tanstack/react-query"
import { deleteEmployeeService } from "@/services/employee/delete-employee.service"

export const useDeleteEmployee = () => {
    return useMutation({
        mutationFn: (id: string) => deleteEmployeeService(id),
        mutationKey: ['deleteEmployee']
    })
}
