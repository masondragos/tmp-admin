import { useMutation } from "@tanstack/react-query";
import { registerLender } from "@/services/lender/register-lender.service";

export interface RegisterEmployeeRequest {
  password: string;
  token: string;
}

export const useRegisterLender = () => {
  return useMutation({
    mutationFn: (data: RegisterEmployeeRequest) => registerLender(data),
    mutationKey: ["registerLender"],
  });
};
