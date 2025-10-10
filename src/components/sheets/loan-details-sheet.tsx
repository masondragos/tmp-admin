"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  MapPin,
  User,
  Building,
  Phone,
  DollarSign,
  CreditCard,
  Home,
  Star,
  Send,
  Loader2,
  Mail,
  FileText,
  Clock,
} from "lucide-react";
import { UserQuote } from "@/hooks/quotes/use-get-quote";
import { useCreateLoanConnection } from "@/hooks/loan-connections/use-create-loan-connection";
import { useUser } from "@/providers/user-provider";
import { toast } from "sonner";
import { useBestLenderProducts } from "@/hooks/loan-products/use-best-lender-products";
// import { loanTypeFormatter } from "@/utils/loan-type-formatter";

// Empty State Component for Matched Lenders
const MatchedLendersEmptyState = ({
  onViewDetails,
}: {
  onViewDetails: () => void;
}) => (
  <div className="text-center py-12">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <Star className="h-8 w-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      No Matched Lenders
    </h3>
    <p className="text-gray-600 mb-6">
      No lenders are currently matched for this loan application. Check back
      later or contact support for assistance.
    </p>
    <Button variant="outline" onClick={onViewDetails}>
      View Application Details
    </Button>
  </div>
);

interface LoanDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  loan: UserQuote;
}

export const LoanDetailsSheet: React.FC<LoanDetailsSheetProps> = ({
  isOpen,
  onClose,
  loan,
}) => {
  const [activeTab, setActiveTab] = useState("details");
  const [invitedLenders, setInvitedLenders] = useState<number[]>([]);
  const [loadingLenders, setLoadingLenders] = useState<number[]>([]);

  // Fetch best matched lenders
  const {
    data: bestLenders,
    isLoading: isLoadingLenders,
    error: lendersError,
    refetch: refetchBestLenders,
  } = useBestLenderProducts(loan.id);

  // Get current user information
  const { user } = useUser();

  // Create loan connection hook
  const createLoanConnection = useCreateLoanConnection();

  if (!loan) return null;

  const formatCurrency = (value: string | number) => {
    if (!value || value === "0") return "N/A";
    const numValue = typeof value === "string" ? parseInt(value) : value;
    return `$${numValue.toLocaleString()}`;
  };

  const handleInviteLender = (lenderId: number, loanProductId: number) => {
    if (!invitedLenders.includes(lenderId) && !loadingLenders.includes(lenderId) && user) {
      // Add to loading state
      setLoadingLenders([...loadingLenders, lenderId]);
      
      createLoanConnection.mutate(
        {
          lender_id: lenderId,
          employee_id: user.id,
          user_id: loan.user_id,
          quote_id: loan.id,
          loan_product_id: loanProductId,
        },
        {
          onSuccess: () => {
            toast.success("Invitation sent successfully!");
            
            // Remove from loading state
            setLoadingLenders(loadingLenders.filter(id => id !== lenderId));
            refetchBestLenders();
          },
          onError: (error) => {
            toast.error(
              error.message || "Failed to send invitation. Please try again."
            );
            // Remove from loading state
            setLoadingLenders(loadingLenders.filter(id => id !== lenderId));
          },
        }
      );
    }
  };

  const isLenderInvited = (lenderId: number) => {
    return invitedLenders.includes(lenderId);
  };

  const isLenderLoading = (lenderId: number) => {
    return loadingLenders.includes(lenderId);
  };
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-gray-900">
            Loan Application Details
          </SheetTitle>
          <SheetDescription>
            Complete information for {loan?.quoteApplicantInfo?.full_name || 'Unknown Applicant'}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="matched">Best Matched</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <Badge 
                  className={`${
                    loan?.status === 'awaiting' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {loan?.status || 'Unknown'}
                </Badge>
              </div>

              {/* Applicant Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-[#F68921]" />
                    Applicant Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Full Name</p>
                        <p className="text-sm text-gray-600">{loan?.quoteApplicantInfo?.full_name || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Phone</p>
                        <p className="text-sm text-gray-600">{loan?.quoteApplicantInfo?.phone_number || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Email</p>
                        <p className="text-sm text-gray-600">{loan?.user_id || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Credit Score</p>
                        <p className="text-sm text-gray-600">{loan?.quoteApplicantInfo?.credit_score || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Property Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-[#F68921]" />
                    Property Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Address</p>
                        <p className="text-sm text-gray-600">{loan?.address || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Property Type</p>
                        <p className="text-sm text-gray-600">{loan?.property_type || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Loan Type</p>
                        <p className="text-sm text-gray-600">{loan?.loan_type || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Living in Property</p>
                        <p className="text-sm text-gray-600">
                          {loan?.quoteLoanDetails?.has_tenant ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Loan Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-[#F68921]" />
                    Loan Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Purchase Price</p>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(loan?.quoteLoanDetails?.purchase_price || 'N/A')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Requested Loan Amount</p>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(loan?.quoteLoanDetails?.requested_loan_amount || 'N/A')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">After Repair Value</p>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(loan?.quoteLoanDetails?.after_repair_property_value || 'N/A')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Rehab Amount</p>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(loan?.quoteLoanDetails?.rehab_amount_requested || 'N/A')}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Rental Information */}
              {loan?.quoteRentalInfo && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-[#F68921]" />
                      Rental Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Monthly Rental Income</p>
                          <p className="text-sm text-gray-600">
                            {formatCurrency(loan?.quoteRentalInfo?.monthly_rental_income || 'N/A')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Annual Insurance</p>
                          <p className="text-sm text-gray-600">
                            {formatCurrency(loan?.quoteRentalInfo?.annual_property_insurance || 'N/A')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Annual Taxes</p>
                          <p className="text-sm text-gray-600">
                            {formatCurrency(loan?.quoteRentalInfo?.annual_property_taxes || 'N/A')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Monthly HOA Fee</p>
                          <p className="text-sm text-gray-600">
                            {formatCurrency(loan?.quoteRentalInfo?.monthly_hoa_fee || 'N/A')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Application Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-[#F68921]" />
                    Application Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Created</p>
                      <p className="text-sm text-gray-600">
                        {loan?.created_at 
                          ? new Date(loan.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'N/A'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Last Updated</p>
                      <p className="text-sm text-gray-600">
                        {loan?.updated_at 
                          ? new Date(loan.updated_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'N/A'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Current Step</p>
                      <p className="text-sm text-gray-600">{loan?.status || 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </TabsContent>

            <TabsContent value="matched" className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                    <Star className="h-4 w-4 text-green-600" />
                  </div>
                  Best Matched Lenders
                </h3>
                <p className="text-gray-600 text-sm">
                  These lenders have been matched based on your loan
                  requirements and preferences.
                </p>
              </div>

              {/* Loading State */}
              {isLoadingLenders && (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="bg-white border-2 border-gray-100 rounded-xl p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                          <div>
                            <div className="h-5 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                          </div>
                        </div>
                        <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="bg-gray-50 rounded-lg p-3">
                            <div className="h-3 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Error State */}
              {lendersError && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Error Loading Lenders
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Something went wrong while loading the matched lenders.
                    Please try again.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => window.location.reload()}
                  >
                    <Loader2 className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              )}

              {/* Success State */}
              {!isLoadingLenders && !lendersError && (
                <div className="space-y-4">
                  {!bestLenders || bestLenders?.loanProducts?.length === 0 ? (
                    <MatchedLendersEmptyState
                      onViewDetails={() => setActiveTab("details")}
                    />
                  ) : (
                    bestLenders.loanProducts.map((loanProduct) => (
                      <div
                        key={loanProduct.id}
                        className="bg-white border-2 border-gray-100 rounded-xl p-4 shadow-sm"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#F68921]/10 text-[#F68921] rounded-lg flex items-center justify-center font-semibold text-lg">
                              {loanProduct.lender.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-gray-900">
                                {loanProduct.lender.name}
                              </h4>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">
                                  {loanProduct.lender.email}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleInviteLender(loanProduct.lender.id,loanProduct.id)}
                            disabled={
                              isLenderInvited(loanProduct.id) ||
                              isLenderLoading(loanProduct.id)
                            }
                            className={`${
                              isLenderInvited(loanProduct.id)
                                ? "bg-green-100 text-green-800 border-green-200"
                                : "bg-[#F68921] hover:bg-[#F68921]/90 text-white"
                            }`}
                            size="sm"
                          >
                            {isLenderLoading(loanProduct.id) ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Send className="h-4 w-4 mr-2" />
                            )}
                            {isLenderInvited(loanProduct.id)
                              ? "Term Sheet Sent"
                              : isLenderLoading(loanProduct.id)
                              ? "Sending..."
                              : "Request for Term Sheet"}
                          </Button>
                        </div>

                        {/* Loan Product Information */}
                        <div className="bg-[#F68921]/5 rounded-lg p-3 mb-3">
                          <label className="text-xs font-semibold text-[#F68921] uppercase tracking-wide">Loan Product</label>
                          <div className="mt-2">
                            <h5 className="text-sm font-semibold text-gray-900">{loanProduct.name}</h5>
                            <p className="text-sm text-gray-600 mt-1">{loanProduct.description}</p>
                          </div>
                        </div>

                        {/* Loan Criteria */}
                        <div className="bg-gray-50 rounded-lg p-3">
                          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Loan Criteria</label>
                          <div className="mt-2 grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs text-gray-500">Min Loan Amount</p>
                              <p className="text-sm font-medium text-gray-900">
                                {formatCurrency(loanProduct.criteria.min_loan_amount)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Max Loan Amount</p>
                              <p className="text-sm font-medium text-gray-900">
                                {formatCurrency(loanProduct.criteria.max_loan_amount)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Citizenship</p>
                              <p className="text-sm font-medium text-gray-900">
                                {loanProduct.criteria.citizenship_requirement.replace('_', ' ')}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Seasoning Period</p>
                              <p className="text-sm font-medium text-gray-900">
                                {loanProduct.criteria.seasoning_period_months} months
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Appraisal Required</p>
                              <p className="text-sm font-medium text-gray-900">
                                {loanProduct.criteria.appraisal_required ? 'Yes' : 'No'}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">States Funded</p>
                              <p className="text-sm font-medium text-gray-900">
                                {loanProduct.criteria.states_funded ? 
                                  JSON.parse(loanProduct.criteria.states_funded).join(', ') : 
                                  'All States'
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="h-4 w-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-yellow-800">Invitation Process</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      When you invite a lender, they will receive a notification to review this loan application and submit their term sheet. 
                      You can track their response in the application timeline.
                    </p>
                  </div>
                </div>
              </div> */}
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
};
