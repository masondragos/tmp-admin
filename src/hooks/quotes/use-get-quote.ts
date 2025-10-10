import { PaginatedResponse } from "@/@types/paginated-response";
import { getQuotes, GetQuotesParams } from "@/services/quotes/get-quotes.service"
import { useQuery } from "@tanstack/react-query"

export interface QuoteApplicantInfo {
    id: number;
    created_at: string;
    updated_at: string;
    quote_id: number;
    full_name: string;
    citizenship: string;
    company_name: string;
    company_ein: string;
    liquid_funds_available: string;
    properties_owned: number;
    total_equity_value: string | null;
    total_debt_value: string | null;
    credit_score: number;
    phone_number: string;
    whats_most_important: string | null;
    company_state: string;
  }
  
  export interface QuoteLoanDetails {
    id: number;
    created_at: string;
    updated_at: string;
    quote_id: number;
    purpose_of_loan: string;
    purchase_price: string;
    contract_close_date: string;
    required_close_date: string;
    has_rehab_funds_requested: boolean;
    after_repair_property_value: string;
    exit_plan: string;
    completed_fix_and_flips_2_years: string;
    as_is_property_value: string;
    seller_concessions: number;
    assignment_fees: number;
    has_tenant: boolean | null;
    funding_reason: string;
    properties_owned: string | null;
    property_purchase_date: string | null;
    mortgage_remaining: string | null;
    current_property_value: string | null;
    requested_loan_amount: string | null;
    has_paid_rent_last_3_months: boolean | null;
    has_signed_lease: boolean | null;
    how_much_are_they_paying: string | null;
    market_rent: string | null;
    what_needs_to_be_done: string | null;
    how_will_you_fund_this: string | null;
    rehab_amount_requested: string | null;
  }
  
  export interface QuoteRentalInfo {
    id: number;
    created_at: string;
    updated_at: string;
    quote_id: number;
    loan_amount: string;
    monthly_rental_income: string;
    annual_property_insurance: string;
    annual_property_taxes: string;
    monthly_hoa_fee: string;
  }
  
  export interface QuotePriorities {
    id: number;
    created_at: string;
    updated_at: string;
    quote_id: number;
    speed_of_closing: boolean;
    low_fees: boolean;
    high_leverage: boolean;
  }
  
  export interface UserQuote {
    id: number;
    created_at: string;
    updated_at: string;
    user_id: number;
    address: string;
    loan_type: 'bridge_fix_and_flip' | 'dscr_rental';
    is_living_in_property: boolean;
    quoteApplicantInfo: QuoteApplicantInfo;
    quoteLoanDetails: QuoteLoanDetails;
    quoteRentalInfo: QuoteRentalInfo | null;
    quotePriorities: QuotePriorities;
    status: string;
    property_type: string
  }
export const useGetQuote = (params?: GetQuotesParams) => {
    return useQuery<PaginatedResponse<UserQuote>>({
        queryKey: ['quotes', params],
        queryFn: () => getQuotes(params),
    })
}