import { LenderTermSheetsResponse } from "@/@types/term-sheet"
import { ApiError } from "@/services/instance"
import { getTermSheetsOfQuote } from "@/services/loan-connections/get-term-sheets-of-quote.service"
import { useQuery } from "@tanstack/react-query"

export const useQuoteTermSheets = (connectionId: string, quoteId?: string) => {
    return useQuery<LenderTermSheetsResponse, ApiError>({
        queryKey: ['quoteTermSheets', quoteId],
        queryFn: () => getTermSheetsOfQuote(quoteId || "", connectionId),
        enabled: !!quoteId && !!connectionId
    })
}