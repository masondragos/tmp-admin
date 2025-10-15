import { Instance } from "../instance"

export const approveLoanConnection = async (id: string) => {
    const response = await Instance.put(`/loan-connections/approve/${id}`)
    return response.data
}