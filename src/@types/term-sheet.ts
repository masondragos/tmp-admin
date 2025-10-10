// Base types for each related entity
export interface LenderInfo {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
}

export interface EmployeeInfo {
  id: number;
  name: string;
  email: string;
  role: "admin" | "employee";
  is_active: boolean;
}

export interface UserInfo {
  id: number;
  name: string;
  email: string;
}

// Quote-related nested types
export interface QuoteApplicantInfo {
  id: number;
  created_at: string; // ISO string for React compatibility
  updated_at: string;
  quote_id: number;
  full_name?: string;
  citizenship?: string;
  company_name?: string;
  company_ein?: string;
  liquid_funds_available?: string;
  properties_owned?: number;
  total_equity_value?: string;
  total_debt_value?: string;
  credit_score?: number;
  phone_number?: string;
  whats_most_important?: string;
  company_state?: string;
  property_state?: string;
}

export interface QuoteLoanDetails {
  id: number;
  created_at: string;
  updated_at: string;
  quote_id: number;
  purpose_of_loan?: string;
  purchase_price?: string;
  contract_close_date?: string;
  required_close_date?: string;
  has_rehab_funds_requested?: boolean;
  after_repair_property_value?: string;
  exit_plan?: "refinance" | "sell";
  completed_fix_and_flips_2_years?: string;
  as_is_property_value?: string;
  seller_concessions?: number;
  assignment_fees?: number;
  has_tenant?: boolean;
  funding_reason?: string;
  properties_owned?: string;
  property_purchase_date?: string;
  mortgage_remaining?: string;
}

export interface QuoteRentalInfo {
  id: number;
  created_at: string;
  updated_at: string;
  loan_amount?: string;
  monthly_rental_income?: string;
  annual_property_insurance?: string;
  annual_property_taxes?: string;
  monthly_hoa_fee?: string;
  quote_id: number;
}

export interface QuotePriorities {
  id: number;
  created_at: string;
  updated_at: string;
  quote_id: number;
  speed_of_closing?: boolean;
  low_fees?: boolean;
  high_leverage?: boolean;
  comments?: string;
}

// Complete Quote with all relations
export interface QuoteWithRelations {
  id: number;
  created_at: string;
  updated_at: string;
  user_id: number;
  address?: string;
  loan_type?: "bridge_fix_and_flip" | "dscr_rental";
  property_type?: string;
  is_living_in_property: boolean;
  status?: "draft" | "submitted" | "under_review" | "approved" | "rejected";
  is_term_sheets_available?: boolean;
  is_draft?: boolean;
  active_step?:
    | "property_address"
    | "applicant_info"
    | "loan_details"
    | "priorities"
    | "rental_info";
  quoteApplicantInfo?: QuoteApplicantInfo;
  quoteLoanDetails?: QuoteLoanDetails;
  quoteRentalInfo?: QuoteRentalInfo;
  quotePriorities?: QuotePriorities;
  user: UserInfo;
}

// Main Loan Connection type with all relations
export interface TermSheet {
  id: number;
  created_at: string;
  updated_at: string;
  lender_id: number;
  employee_id: number;
  loan_product_id?: number;
  user_id: number;
  quote_id: number;
  term_sheet_status?:
    | "awaiting"
    | "pending"
    | "signed"
    | "closed"
    | "available";
  lender: LenderInfo;
  employee: EmployeeInfo;
  user: UserInfo;
  quote: QuoteWithRelations;
  loan_product: LoanProduct;
}
export interface LoanProduct {
  id: number;
  created_at: string;
  updated_at: string;
  lender_id: number;
  name: string;
  description: string;
}
// Pagination metadata
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

// Final API response type for React
export interface GetLoanConnectionsResponse {
  data: TermSheet[];
  meta: PaginationMeta;
}

// Type for search parameters (useful for React forms)
export interface LoanConnectionSearchParams {
  page?: string;
  limit?: string;
  search?: string;
}
