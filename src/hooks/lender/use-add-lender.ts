import { useMutation } from "@tanstack/react-query"
import { registerLender } from "@/services/lender/register-lender.service"

export const useRegisterLender = () => {
    return useMutation({
        mutationFn: registerLender,
        mutationKey: ['add-employee']
    })
}