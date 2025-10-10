import { Instance } from "../instance";

type Request = {
  lender_id: number;
  employee_id: number;
  user_id: number;
  quote_id: number;
  loan_product_id: number;
}

export const createLoanConnection = async (request: Request) => {
  const response = await Instance.post("/loan-connections", request);
  return response.data;
}