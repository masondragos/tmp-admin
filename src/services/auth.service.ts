import { Instance } from "./instance";

export const login = async ({email, password}: {email: string, password: string})=>{
    const response = await Instance.post("/employee/login", {email, password});
    return response.data;
}

export const logout = async ()=>{
  const response = await Instance.get('/auth/logout')
  return response.data
}