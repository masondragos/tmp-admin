import { PaginatedResponse } from "@/@types/paginated-response"
import { TermSheet } from "@/@types/term-sheet"
import { ApiError } from "@/services/instance"
import { getTermSheets } from "@/services/loan-connections/get-term-sheets.service"
import { useQuery } from "@tanstack/react-query"

export const useTermSheets = (page: number = 1, limit: number = 10, search?: string, status?: string) => {
    return useQuery<PaginatedResponse<TermSheet>, ApiError>({
        queryKey: ['term-sheets', page, limit, search, status],
        queryFn: () => getTermSheets(page, limit, search, status)
    })
}