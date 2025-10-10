import { Instance } from "../instance"

export const disableEmployeeService = async (id: string) => {
    const response = await Instance.patch(`/employee/${id}/disable`)
    return response.data
}