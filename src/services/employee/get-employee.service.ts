import { Instance } from "../instance"

export const getEmployeeService = async (id: string) => {
    const response = await Instance.get(`/employee/${id}`)
    return response.data
}