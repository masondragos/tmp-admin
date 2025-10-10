import { Instance } from "../instance"

export const getBestLenderProducts = async (quoteId: number)=> {
    const response = await Instance.get(`/loan-products/best/${quoteId}`)
    return response.data

}