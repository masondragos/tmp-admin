import { useMutation } from "@tanstack/react-query"
import { deleteLender } from "@/services/lender/delete-lender.service"

export const useDeleteLender = () => {
    return useMutation({
        mutationFn: (id: string) => deleteLender(id),
        mutationKey: ['delete-lender']
    })
}
