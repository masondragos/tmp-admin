import { Instance } from "../instance"
import { UserQuote } from "@/hooks/quotes/use-get-quote"

export const getQuoteDetailsService = async (quoteId: string): Promise<UserQuote> => {
    const response = await Instance.get(`/quotes/${quoteId}/whole`)
    return response.data
}