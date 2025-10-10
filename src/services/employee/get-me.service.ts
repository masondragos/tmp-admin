import { Instance } from "../instance";

export interface Employee {
    id: number;
    created_at: string;
    updated_at: string;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
    invite_status: string;
    avatar: string | null;
}

export const getMeService = async (): Promise<Employee> => {
    const response = await Instance.get('/employee/me')
    return response.data
}