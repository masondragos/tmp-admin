import { Instance } from "../instance"

export const deleteLender = async (id: string) => {
    const response = await Instance.delete(`/lender/${id}`)
    return response.data
}