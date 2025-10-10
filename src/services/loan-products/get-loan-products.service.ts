import { Instance } from "../instance"

export const getLoanProducts = async (lenderId: number, page: number = 1, limit: number = 10) => {
    const response = await Instance.get(`/loan-products/lender/${lenderId}?page=${page}&limit=${limit}`)
    return response.data
}