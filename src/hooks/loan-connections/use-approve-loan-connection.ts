import { useMutation } from "@tanstack/react-query";
import { approveLoanConnection } from "@/services/loan-connections/approve-loan-connection.service";

export const useApproveLoanConnection = () => {
    return useMutation({
        mutationFn: approveLoanConnection,
        mutationKey: ['approveLoanConnection']
    })
}

