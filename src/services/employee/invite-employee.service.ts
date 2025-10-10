import { Instance } from "../instance"

export const inviteEmployeeService = async (request: Request) => {
    const response = await Instance.post("/employee/invite", request)
    return response.data
}

type Request = {
    name: string,
    email: string,
}