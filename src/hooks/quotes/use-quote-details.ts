import { getQuoteDetailsService } from "@/services/quotes/get-quote-details.service"
import { useQuery } from "@tanstack/react-query"
import { UserQuote } from "./use-get-quote"
import { ApiError } from "@/services/instance"

export const useQuoteDetails = (quoteId: string) => {
    return useQuery<UserQuote, ApiError>({
        queryKey: ['quoteDetails', quoteId],
        queryFn: () => getQuoteDetailsService(quoteId),
    })
}