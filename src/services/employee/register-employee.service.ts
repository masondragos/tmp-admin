import { Instance } from "../instance"

export const registerEmployeeService = async (request: Request) => {
    const response = await Instance.post("/employee/register", request)
    return response.data
}

type Request = {
    password: string,
    token: string,
}