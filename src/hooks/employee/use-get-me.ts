import { getMeService, Employee } from "@/services/employee/get-me.service"
import { useQuery } from "@tanstack/react-query"

export const useGetMe = () => {
    return useQuery<Employee>({
        queryKey: ['getMe'],
        queryFn: getMeService,
    })
}