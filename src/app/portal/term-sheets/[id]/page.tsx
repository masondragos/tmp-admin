"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useTermSheetById } from "@/hooks/loan-products/use-term-sheet-by-id";
import { useQuoteTermSheets } from "@/hooks/loan-connections/use-quote-term-sheets";
import { useApproveLoanConnection } from "@/hooks/loan-connections/use-approve-loan-connection";
import { useRejectLoanConnection } from "@/hooks/loan-connections/use-reject-loan-connection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
} from "lucide-react";
import TermSheetView from "@/components/ui/term-sheet-view";
import { LenderTermSheet } from "@/@types/term-sheet";
import { toast } from "sonner";

const getStatusConfig = (status: string) => {
  const configs: Record<string, { icon: React.ElementType; color: string; bgColor: string }> = {
    pending: {
      icon: Clock,
      color: "text-yellow-700",
      bgColor: "bg-yellow-100",
    },
    awaiting: {
      icon: Clock,
      color: "text-yellow-700",
      bgColor: "bg-yellow-100",
    },
    available: {
      icon: CheckCircle,
      color: "text-purple-700",
      bgColor: "bg-purple-100",
    },
    signed: {
      icon: CheckCircle,
      color: "text-green-700",
      bgColor: "bg-green-100",
    },
    closed: {
      icon: XCircle,
      color: "text-gray-700",
      bgColor: "bg-gray-100",
    },
  };
  return configs[status] || configs.pending;
};

export default function TermSheetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // State for dialogs
  const [isApproveConnectionDialogOpen, setIsApproveConnectionDialogOpen] = useState(false);
  const [isRejectConnectionDialogOpen, setIsRejectConnectionDialogOpen] = useState(false);

  // Fetch term sheet details
  const {
    data: termSheet,
    isLoading,
    error,
    refetch: refetchTermSheet,
  } = useTermSheetById(id);

  // Fetch term sheets for this quote
  const {
    data: lenderTermSheets,
    isLoading: isLoadingTermSheets,
    error: termSheetsError,
    refetch: refetchTermSheets,
  } = useQuoteTermSheets(id, termSheet?.quote_id.toString());

  // Approve/Reject hooks
  const approveLoanConnection = useApproveLoanConnection();
  const rejectLoanConnection = useRejectLoanConnection();

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

  // Check if at least one term sheet is approved
  const hasApprovedTermSheet = lenderTermSheets?.some(
    (ts) => ts.status.toLowerCase() === "approved"
  );

  const handleApproveConnection = () => {
    // Check if at least one term sheet is approved
    if (!hasApprovedTermSheet) {
      toast.error("Please approve at least one term sheet before approving the term sheets");
      setIsApproveConnectionDialogOpen(false);
      return;
    }

    approveLoanConnection.mutate(id, {
      onSuccess: () => {
        toast.success("Loan request approved successfully!");
        setIsApproveConnectionDialogOpen(false);
        refetchTermSheet();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to approve loan request");
      },
    });
  };

  const handleRejectConnection = () => {
    rejectLoanConnection.mutate(id, {
      onSuccess: () => {
        toast.success("Loan request rejected successfully!");
        setIsRejectConnectionDialogOpen(false);
        refetchTermSheet();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to reject loan request");
      },
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          <Skeleton className="h-10 w-40 mb-6" />
          <div className="grid grid-cols-1 gap-6 mb-8">
            <Skeleton className="h-96" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Term Sheet
          </h3>
          <p className="text-gray-600 mb-6">
            Failed to load term sheet details. Please try again.
          </p>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!termSheet) return null;

  const statusConfig = getStatusConfig(termSheet.term_sheet_status || "pending");
  const StatusIcon = statusConfig.icon;

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
            Back to Term Sheets
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Term Sheet Details
              </h1>
              <p className="text-gray-600 mt-1">
                Term Sheet ID: #{termSheet.id}
              </p>
            </div>
            <Badge
              className={`${statusConfig.bgColor} ${statusConfig.color} flex items-center gap-2 px-4 py-2`}
            >
              <StatusIcon className="h-4 w-4" />
              <span className="capitalize">{termSheet.term_sheet_status || "pending"}</span>
            </Badge>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Lender Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-[#F68921]" />
                Lender Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Lender Name</p>
                <p className="text-base font-medium text-gray-900">
                  {termSheet.lender?.name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <p className="text-base font-medium text-gray-900">
                    {termSheet.lender?.email || "N/A"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Loan Product</p>
                <Badge variant="secondary" className="mt-1">
                  {termSheet.loan_product?.name || "N/A"}
                </Badge>
              </div>
            </CardContent>
          </Card>

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
                  {termSheet.quote?.quoteApplicantInfo?.full_name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Company Name</p>
                <p className="text-base font-medium text-gray-900">
                  {termSheet.quote?.quoteApplicantInfo?.company_name || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <p className="text-base font-medium text-gray-900">
                    {termSheet.quote?.quoteApplicantInfo?.phone_number || "N/A"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Credit Score</p>
                <p className="text-base font-medium text-gray-900">
                  {termSheet.quote?.quoteApplicantInfo?.credit_score || "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Property & Loan Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Property Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-[#F68921]" />
                Property Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <p className="text-base font-medium text-gray-900">
                    {termSheet.quote?.address || "N/A"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Property Type</p>
                <p className="text-base font-medium text-gray-900">
                  {termSheet.quote?.property_type || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Loan Type</p>
                <Badge variant="outline" className="mt-1">
                  {termSheet.quote?.loan_type?.replace("_", " ").toUpperCase() || "N/A"}
                </Badge>
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
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Purchase Price</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(
                    termSheet.quote?.quoteLoanDetails?.purchase_price || 0
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">As Is Property Value</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(
                    termSheet.quote?.quoteLoanDetails?.as_is_property_value || 0
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">After Repair Value</p>
                <p className="text-base font-medium text-gray-900">
                  {formatCurrency(
                    termSheet.quote?.quoteLoanDetails?.after_repair_property_value || 0
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#F68921]" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500">Term Sheet Created</p>
                <p className="text-base font-medium text-gray-900">
                  {formatDate(termSheet.created_at)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-base font-medium text-gray-900">
                  {formatDate(termSheet.updated_at)}
                </p>
              </div>
              {termSheet.quote?.quoteLoanDetails?.required_close_date && (
                <div>
                  <p className="text-sm text-gray-500">Required Close Date</p>
                  <p className="text-base font-medium text-gray-900">
                    {formatDate(termSheet.quote.quoteLoanDetails.required_close_date)}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Term Sheet Documents */}
        {isLoadingTermSheets ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#F68921]" />
                Term Sheet Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#F68921] mx-auto mb-4" />
                <p className="text-gray-600">Loading term sheets...</p>
              </div>
            </CardContent>
          </Card>
        ) : termSheetsError ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#F68921]" />
                Term Sheet Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="py-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Error Loading Term Sheets
                </h3>
                <p className="text-gray-600">
                  Failed to load term sheet documents. Please try again.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : lenderTermSheets && lenderTermSheets.length > 0 ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#F68921]" />
                  Term Sheet Documents ({lenderTermSheets.length})
                </CardTitle>
                
                {/* Connection Level Action Buttons */}
                {(termSheet.term_sheet_status === "pending") && (
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setIsApproveConnectionDialogOpen(true)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      disabled={approveLoanConnection.isPending || rejectLoanConnection.isPending}
                    >
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Approve Selected Term Sheets
                    </Button>
                    <Button
                      onClick={() => setIsRejectConnectionDialogOpen(true)}
                      variant="destructive"
                      disabled={approveLoanConnection.isPending || rejectLoanConnection.isPending}
                    >
                      <ThumbsDown className="h-4 w-4 mr-2" />
                      Reject All Term Sheets
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {lenderTermSheets.map((lenderTermSheet: LenderTermSheet, index: number) => (
                <div key={lenderTermSheet.id} className="mb-6 last:mb-0">
                  <TermSheetView 
                    termSheet={lenderTermSheet} 
                    index={index}
                    onStatusUpdate={() => {
                        refetchTermSheets();
                    }}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Term Sheet Documents Available
                </h3>
                <p className="text-gray-600">
                  The lender has not submitted any term sheet documents yet.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Approve Connection Confirmation Dialog */}
        <Dialog open={isApproveConnectionDialogOpen} onOpenChange={setIsApproveConnectionDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ThumbsUp className="h-5 w-5 text-green-600" />
                Approve Loan Request
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to approve this loan request?
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              {!hasApprovedTermSheet && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-red-900 mb-1">
                      No Approved Term Sheets
                    </p>
                    <p className="text-sm text-red-800">
                      You must approve at least one term sheet before approving the loan request.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-yellow-900 mb-1">
                    This action is not reversible
                  </p>
                  <p className="text-sm text-yellow-800">
                    Once approved, the loan request status will be updated and this action cannot be undone. The lender will be notified of this approval and approved term sheets will be sent to applicant.
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsApproveConnectionDialogOpen(false)}
                disabled={approveLoanConnection.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleApproveConnection}
                disabled={approveLoanConnection.isPending}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {approveLoanConnection.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Approving...
                  </>
                ) : (
                  <>
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Approve Loan Request
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Connection Confirmation Dialog */}
        <Dialog open={isRejectConnectionDialogOpen} onOpenChange={setIsRejectConnectionDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ThumbsDown className="h-5 w-5 text-red-600" />
                Reject Loan Request
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to reject this loan request?
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-red-900 mb-1">
                    This action is not reversible
                  </p>
                  <p className="text-sm text-red-800">
                    Once rejected, the loan request will be closed and this action cannot be undone. The lender will be notified of this rejection.
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsRejectConnectionDialogOpen(false)}
                disabled={rejectLoanConnection.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRejectConnection}
                disabled={rejectLoanConnection.isPending}
                variant="destructive"
              >
                {rejectLoanConnection.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <ThumbsDown className="mr-2 h-4 w-4" />
                    Reject Loan Request
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
