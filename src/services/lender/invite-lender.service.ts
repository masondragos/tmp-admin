import { Instance } from "../instance"

export const inviteLender = async (request: Request) => {
    const response = await Instance.post("/lender/invite", request)
    return response.data
}

type Request = {
    name: string,
    email: string,
}