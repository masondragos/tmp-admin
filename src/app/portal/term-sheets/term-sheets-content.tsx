"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import AppPagination from "@/components/ui/custom-pagination";
import { useTermSheets } from "@/hooks/loan-products/use-term-sheets";
import { TermSheet } from "@/@types/term-sheet";
import { TermSheetDetailsSheet } from "@/components/sheets/term-sheet-details-sheet";
import {
  Eye,
  FileText,
  Building,
  DollarSign,
  Calendar,
  MapPin,
} from "lucide-react";
const TERM_SHEET_STATUSES = [
  {
    value: "awaiting",
    label: "Awaiting",
    color: "bg-yellow-100 text-yellow-800",
  },
  { value: "pending", label: "Pending", color: "bg-blue-100 text-blue-800" },
  { value: "signed", label: "Signed", color: "bg-green-100 text-green-800" },
  { value: "closed", label: "Closed", color: "bg-gray-100 text-gray-800" },
  {
    value: "available",
    label: "Available",
    color: "bg-purple-100 text-purple-800",
  },
];

const formatCurrency = (amount: string | number) => {
  if (!amount) return "N/A";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function TermSheetsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL parameters
  const page = parseInt(searchParams.get("page") || "1");
  const status = searchParams.get("status") || "pending";

  // Local state
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);
  const [selectedTermSheet, setSelectedTermSheet] = useState<TermSheet | null>(null);

  // Fetch term sheets
  const {
    data: termSheetsResponse,
    isLoading,
    error,
  } = useTermSheets(page, 10, undefined, status);

  const termSheets = termSheetsResponse?.data || [];
  const pagination = termSheetsResponse?.meta;



  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", value);
    params.set("page", "1"); // Reset to first page when filter changes
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const handleViewDetails = (termSheet: TermSheet) => {
    setSelectedTermSheet(termSheet);
    setIsDetailsSheetOpen(true);
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Failed to load term sheets</div>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto my-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Term Sheets</h1>
          <p className="text-gray-600 mt-1">
            Manage and track all term sheet submissions
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {TERM_SHEET_STATUSES.map((statusOption) => (
            <Button
              key={statusOption.value}
              variant={status === statusOption.value ? "default" : "outline"}
              size="sm"
              onClick={() => handleStatusChange(statusOption.value)}
              className={`${
                status === statusOption.value
                  ? "bg-[#F68921] text-white hover:bg-[#E67A1A]"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {statusOption.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Term Sheets Grid */}
      {isLoading ? (
        <div className="grid gap-6 grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Skeleton className="h-5 w-5" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <div className="flex items-center gap-1">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Request Details Skeleton */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-2 h-2 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Skeleton className="h-3 w-20 mb-1" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-3 w-40 ml-6" />
                    </div>
                    <div>
                      <Skeleton className="h-3 w-24 mb-1" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-28" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Loan Application Details Skeleton */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-2 h-2 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <div>
                        <Skeleton className="h-3 w-20 mb-1" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <div>
                        <Skeleton className="h-3 w-16 mb-1" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <div>
                        <Skeleton className="h-3 w-20 mb-1" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Button Skeleton */}
                <div className="pt-3">
                  <Skeleton className="w-full h-10 rounded-md" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : termSheets.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No term sheets found
          </h3>
          <p className="text-gray-600">
            {status !== "pending"
              ? "Try adjusting your search or filter criteria."
              : "No pending term sheets found."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-3">
          {termSheets.map((termSheet) => (
            <Card
              key={termSheet.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-[#F68921]" />
                      <Badge className="bg-[#F68921]/10 text-[#F68921] border-[#F68921]/20 px-2 py-1 text-xs font-medium">
                        Term Sheet Request
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      Applicant -{" "}
                      {termSheet.quote.quoteApplicantInfo?.full_name ||
                        "Unknown Applicant"}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {termSheet.quote.address || "No address provided"}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Term Sheet Request Details */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#F68921] rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">
                      Request Details
                    </span>
                  </div>

                  <div className="grid gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Invitation Sent To
                      </p>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">
                          {termSheet.lender.name}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 ml-6">
                        {termSheet.lender.email}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Lender Product
                      </p>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">
                          Product name - {termSheet.loan_product?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Loan Application Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">
                      Loan Application
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Purchase Price</p>
                        <p className="text-gray-900 font-medium">
                          {termSheet.quote.quoteLoanDetails?.purchase_price
                            ? formatCurrency(
                                termSheet.quote.quoteLoanDetails.purchase_price
                              )
                            : "Not available"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Building className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Loan Type</p>
                        <p className="text-gray-900 font-medium">
                          {termSheet.quote.loan_type
                            ?.replace("_", " ")
                            .toUpperCase() || "Not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500">Request Date</p>
                        <p className="text-gray-900 font-medium">
                          {formatDate(termSheet.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-3">
                  <Button
                    onClick={() => handleViewDetails(termSheet)}
                    className="w-full bg-[#F68921] text-white py-2 px-4 rounded-md hover:bg-[#E67A1A] transition-colors text-sm font-medium"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Term Sheet Request Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.total > 10 && (
        <div className="flex justify-center pt-6">
          <AppPagination
            page={page}
            totalPages={pagination.total_pages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Term Sheet Details Sheet */}
      <TermSheetDetailsSheet
        isOpen={isDetailsSheetOpen}
        onClose={() => {
          setIsDetailsSheetOpen(false);
          setSelectedTermSheet(null);
        }}
        termSheet={selectedTermSheet}
      />
    </div>
  );
}

