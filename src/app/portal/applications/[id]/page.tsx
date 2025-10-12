"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuoteDetails } from "@/hooks/quotes/use-quote-details";
import { useBestLenderProducts } from "@/hooks/loan-products/use-best-lender-products";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Building,
  Phone,
  DollarSign,
  Home,
  Mail,
  FileText,
  Loader2,
  Star,
  Send,
} from "lucide-react";
import { useState } from "react";
import { useCreateLoanConnection } from "@/hooks/loan-connections/use-create-loan-connection";
import { useUser } from "@/providers/user-provider";
import { toast } from "sonner";

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [invitedLenders, setInvitedLenders] = useState<number[]>([]);
  const [loadingLenders, setLoadingLenders] = useState<number[]>([]);

  // Fetch quote details
  const {
    data: quote,
    isLoading: isLoadingQuote,
    error: quoteError,
  } = useQuoteDetails(id);

  // Fetch best lender products
  const {
    data: bestLenders,
    isLoading: isLoadingLenders,
    error: lendersError,
  } = useBestLenderProducts(parseInt(id));

  // Get current user
  const { user } = useUser();

  // Create loan connection hook
  const createLoanConnection = useCreateLoanConnection();

  const formatCurrency = (value: string | number) => {
    if (!value || value === "0") return "N/A";
    const numValue = typeof value === "string" ? parseInt(value) : value;
    return `$${numValue.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleInviteLender = (lenderId: number, loanProductId: number) => {
    if (!invitedLenders.includes(lenderId) && !loadingLenders.includes(lenderId) && user && quote) {
      setLoadingLenders((prev) => [...prev, lenderId]);

      createLoanConnection.mutate(
        {
          quote_id: parseInt(id),
          lender_id: lenderId,
          loan_product_id: loanProductId,
          employee_id: user.id,
          user_id: quote.user_id,
        },
        {
          onSuccess: () => {
            toast.success("Lender invited successfully!");
            setInvitedLenders((prev) => [...prev, lenderId]);
            setLoadingLenders((prev) => prev.filter((id) => id !== lenderId));
          },
          onError: (error) => {
            toast.error(error.message || "Failed to invite lender");
            setLoadingLenders((prev) => prev.filter((id) => id !== lenderId));
          },
        }
      );
    }
  };

  // Loading state
  if (isLoadingQuote) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          <Skeleton className="h-10 w-40 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  // Error state
  if (quoteError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Application</h3>
          <p className="text-gray-600 mb-6">
            Failed to load application details. Please try again.
          </p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!quote) return null;

  const loanProducts = bestLenders?.loanProducts || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Applications
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Application Details
              </h1>
              <p className="text-gray-600 mt-1">
                Application ID: #{quote.id}
              </p>
            </div>
            <Badge variant="outline" className="text-sm">
              {quote.loan_type?.replace("_", " ").toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Applicant Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-[#F68921]" />
                Applicant Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="text-base font-medium text-gray-900">
                  {quote.quoteApplicantInfo?.full_name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Company Name</p>
                <p className="text-base font-medium text-gray-900">
                  {quote.quoteApplicantInfo?.company_name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <p className="text-base font-medium text-gray-900">
                    {quote.quoteApplicantInfo?.phone_number || "N/A"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Citizenship</p>
                <p className="text-base font-medium text-gray-900">
                  {quote.quoteApplicantInfo?.citizenship || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Credit Score</p>
                <p className="text-base font-medium text-gray-900">
                  {quote.quoteApplicantInfo?.credit_score || "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Property Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-[#F68921]" />
                Property Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <p className="text-base font-medium text-gray-900">
                    {quote.address || "N/A"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Property Type</p>
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-gray-400" />
                  <p className="text-base font-medium text-gray-900">
                    {quote.property_type || "N/A"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Loan Type</p>
                <Badge variant="outline" className="mt-1">
                  {quote.loan_type?.replace("_", " ").toUpperCase() || "N/A"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <p className="text-base font-medium text-gray-900">
                    {formatDate(quote.created_at)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Loan Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-[#F68921]" />
              Loan Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500">Purchase Price</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(quote.quoteLoanDetails?.purchase_price || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Assignment Fees</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(quote.quoteLoanDetails?.assignment_fees || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Requested Loan Amount</p>
                <p className="text-xl font-bold text-[#F68921]">
                  {formatCurrency(quote.quoteLoanDetails?.requested_loan_amount || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Rehab Amount Requested</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(quote.quoteLoanDetails?.rehab_amount_requested || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">After Repair Value</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(quote.quoteLoanDetails?.after_repair_property_value || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">As Is Property Value</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(quote.quoteLoanDetails?.as_is_property_value || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best Lender Products */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-[#F68921]" />
                Best Matched Lender Products
              </CardTitle>
              {isLoadingLenders && (
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingLenders ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ))}
              </div>
            ) : lendersError ? (
              <div className="text-center py-8">
                <p className="text-red-600 mb-4">Failed to load lender products</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
            ) : loanProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Matched Lenders
                </h3>
                <p className="text-gray-600">
                  No lenders are currently matched for this loan application.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {loanProducts.map((product) => (
                  <div
                    key={product.id}
                    className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Building className="h-5 w-5 text-[#F68921]" />
                          <h3 className="text-lg font-semibold text-gray-900">
                            {product.lender.name}
                          </h3>
                        </div>
                        <Badge variant="secondary" className="mb-2">
                          {product.name}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-2">
                          {product.description}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleInviteLender(product.lender_id, product.id)}
                        disabled={
                          invitedLenders.includes(product.lender_id) ||
                          loadingLenders.includes(product.lender_id)
                        }
                        className="bg-[#F68921] hover:bg-[#E67A1A] text-white"
                      >
                        {loadingLenders.includes(product.lender_id) ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Inviting...
                          </>
                        ) : invitedLenders.includes(product.lender_id) ? (
                          "Invited"
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Invite Lender
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Lender Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
                      <div>
                        <p className="text-xs text-gray-500">Contact Email</p>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <p className="text-sm font-medium text-gray-900">
                            {product.lender.contact_email || product.lender.email}
                          </p>
                        </div>
                      </div>
                      {product.lender.phone && (
                        <div>
                          <p className="text-xs text-gray-500">Phone</p>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <p className="text-sm font-medium text-gray-900">
                              {product.lender.phone}
                            </p>
                          </div>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-gray-500">Loan Amount Range</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(product.criteria.min_loan_amount)} -{" "}
                          {formatCurrency(product.criteria.max_loan_amount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Appraisal Required</p>
                        <Badge variant={product.criteria.appraisal_required ? "default" : "secondary"}>
                          {product.criteria.appraisal_required ? "Yes" : "No"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

