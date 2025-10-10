import { Instance } from "../instance"

export const disableLender = async (id: string) => {
    const response = await Instance.patch(`/lender/${id}/disable`)
    return response.data
}