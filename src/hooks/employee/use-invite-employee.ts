import { useMutation } from "@tanstack/react-query"
import { inviteEmployeeService } from "@/services/employee/invite-employee.service"

export interface InviteEmployeeRequest {
    name: string;
    email: string;
}

export const useInviteEmployee = () => {
    return useMutation({
        mutationFn: (data: InviteEmployeeRequest) => inviteEmployeeService(data),
        mutationKey: ['inviteEmployee']
    })
}
