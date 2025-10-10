import { Instance } from "../instance"

export interface GetQuotesParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    loanType?: string;
}

export const getQuotes = async (params?: GetQuotesParams) => {
    const response = await Instance.get('/quotes/admin', {
        params: {
            page: params?.page || 1,
            limit: params?.limit || 10,
            search: params?.search || "",
            status: params?.status || "",
            'loan-type': params?.loanType || "",
        },
    });
    return response.data;
}