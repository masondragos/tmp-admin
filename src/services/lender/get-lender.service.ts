import { Instance } from "../instance"

export const getLender = async (id: string) => {
    const response = await Instance.get(`/lender/${id}`)
    return response.data
}