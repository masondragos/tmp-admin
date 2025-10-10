import { useQuery } from "@tanstack/react-query"
import { getBestLenderProducts } from "@/services/loan-products/get-best-lenders-products.service"
import { ApiError } from "@/services/instance"

export interface Lender {
  id: number;
  name: string;
  email: string;
  contact_email: string | null;
  phone: string | null;
  website: string | null;
  status: string;
}

export interface LoanProductCriteria {
  id: number;
  created_at: string;
  updated_at: string;
  loan_product_id: number;
  max_loan_amount: string;
  min_loan_amount: string;
  citizenship_requirement: string;
  seasoning_period_months: number;
  appraisal_required: boolean;
  appraisal_type: string | null;
  states_funded: string;
}

export interface LoanProduct {
  id: number;
  created_at: string;
  updated_at: string;
  lender_id: number;
  name: string;
  description: string;
  lender: Lender;
  
  criteria: LoanProductCriteria;
}

export interface Quote {
  id: number;
  loan_type: string;
  property_type: string;
  address: string;
  requested_loan_amount: string;
}

export interface BestLenderProductsResponse {
  quote: Quote;
  loanProducts: LoanProduct[];
}

export const useBestLenderProducts = (quoteId: number) => {
    return useQuery<BestLenderProductsResponse, ApiError>({
        queryKey: ['bestLenders', quoteId],
        queryFn: () => getBestLenderProducts(quoteId),
    })
}