import { useQuery } from "@tanstack/react-query"
import { getLender } from "@/services/lender/get-lender.service"
import { ApiError } from "@/services/instance"
import { LendereListItem } from "@/services/lender/get-all-lender.service"

export const useGetLender = (id: string) => {
    return useQuery<LendereListItem, ApiError>({
        queryKey: ['getLender', id],
        queryFn: () => getLender(id),
        enabled: !!id
    })
}
