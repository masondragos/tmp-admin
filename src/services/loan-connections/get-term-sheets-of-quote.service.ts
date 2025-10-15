import { Instance } from "../instance";

export const getTermSheetsOfQuote = async (quoteId: string, connectionId: string) => {
    const response = await Instance.get(`/term-sheets/quote/${quoteId}/connection/${connectionId}`);
    return response.data;
}