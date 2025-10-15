import { useMutation } from "@tanstack/react-query";
import { rejectLoanConnection } from "@/services/loan-connections/reject-loan-connection.service";

export const useRejectLoanConnection = () => {
    return useMutation({
        mutationFn: rejectLoanConnection,
        mutationKey: ['rejectLoanConnection']
    })
}

