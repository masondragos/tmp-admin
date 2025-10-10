import { useMutation } from "@tanstack/react-query";
import { createLoanConnection } from "@/services/loan-connections/create-loan-connection.service";

export const useCreateLoanConnection = () => {
    return useMutation({
        mutationFn: createLoanConnection,
        mutationKey: ['createLoanConnection']
    })
}