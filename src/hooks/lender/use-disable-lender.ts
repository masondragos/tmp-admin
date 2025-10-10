import { useMutation } from "@tanstack/react-query"
import { disableLender } from "@/services/lender/disable-lender.service"

export const useDisableLender = () => {
    return useMutation({
        mutationFn: (id: string) => disableLender(id),
        mutationKey: ['disable-lender']
    })
}
