import { useMutation } from "@tanstack/react-query"
import { inviteLender } from "@/services/lender/invite-lender.service";

export interface InviteEmployeeRequest {
    name: string;
    email: string;
}

export const useInviteLender = () => {
    return useMutation({
        mutationFn: (data: InviteEmployeeRequest) => inviteLender(data),
        mutationKey: ['invite-lender']
    })
}
