import { Instance } from "../instance"

export const getTermSheets = async (page: number = 1, limit: number = 10, search?: string, status?: string) => {
    const params: { page: number, limit: number, search?: string, status?: string } = { page, limit };
    
    if (search) params.search = search;
    if (status) params.status = status;
    
    const response = await Instance.get('/loan-connections/employee', {
        params
    })
    return response.data
}