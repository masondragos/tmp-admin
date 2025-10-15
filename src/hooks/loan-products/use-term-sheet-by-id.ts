import { useQuery } from "@tanstack/react-query"
import { getTermSheetById, TermSheetWithLenderTermSheets } from "@/services/loan-connections/get-term-sheet-by-id.service"
import { ApiError } from "@/services/instance"

export const useTermSheetById = (id: string) => {
    return useQuery<TermSheetWithLenderTermSheets, ApiError>({
        queryKey: ['termSheet', id],
        queryFn: () => getTermSheetById(id),
    })
}

