import { Instance } from "../instance"

export const registerLender = async (request: Request) => {
    const response = await Instance.post("/lender/register", request)
    return response.data
}

type Request = {
    password: string,
    token: string,
}