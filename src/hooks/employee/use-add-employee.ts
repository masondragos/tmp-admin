import { useMutation } from "@tanstack/react-query"
import { addEmployeeService } from "../../services/employee/add-employee.service"

export const useAddEmployee = () => {
    return useMutation({
        mutationFn: addEmployeeService,
        mutationKey: ['add-employee']
    })
}