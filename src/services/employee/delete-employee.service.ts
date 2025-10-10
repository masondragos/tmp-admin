import { Instance } from "../instance"

export const deleteEmployeeService = async (id: string) => {
    const response = await Instance.delete(`/employee/${id}`)
    return response.data
}