import { Instance } from "../instance";

export const rejectLoanConnection = async (id: string) => {
  const response = await Instance.put(`/loan-connections/reject/${id}`, {
    by: "admin",
  });
  return response.data;
};
