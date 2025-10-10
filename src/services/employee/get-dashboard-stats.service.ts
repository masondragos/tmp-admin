import { Instance } from "../instance"

export const getDashboardStats = async ()=>{
    const response = await Instance.get("/employee/dashboard/stats")
    return response.data
}