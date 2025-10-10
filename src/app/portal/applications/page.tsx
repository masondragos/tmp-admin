"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetQuote, type UserQuote } from "@/hooks/quotes/use-get-quote";
import { Search, FileText, CheckCircle2, Loader2, MapPin, DollarSign, Calendar, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LoanDetailsSheet } from "@/components/sheets/loan-details-sheet";
import { Skeleton } from "@/components/ui/skeleton";
import AppPagination from "@/components/ui/custom-pagination";



// Loading Skeleton Component
const ApplicationsLoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 col-span-full">
    {Array.from({ length: 6 }).map((_, index) => (
      <Card key={index} className="hover:shadow-lg transition-shadow rounded-[12px] relative flex flex-col">
        <CardHeader className="pb-3">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4 flex-1 pb-16">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>
        </CardContent>
        
        {/* Button Skeleton - Absolutely positioned at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </Card>
    ))}
  </div>
);

// Empty State Component
const ApplicationsEmptyState = () => (
  <div className="col-span-full text-center py-12">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <FileText className="h-8 w-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applications</h3>
    <p className="text-gray-600 mb-6">
      No loan applications have been submitted yet. Applications will appear here once they are created.
    </p>
    <Button variant="outline">
      <FileText className="h-4 w-4 mr-2" />
      Learn More About Applications
    </Button>
  </div>
);

// Loan type enum mapping
const LOAN_TYPES = [
  { value: "bridge_fix_and_flip", label: "Fix & Flip" },
  { value: "dscr_rental", label: "DSCR Rental" },
];


export default function ApplicationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<UserQuote | null>(null);

  // Get URL parameters with defaults
  const currentPage = parseInt(searchParams.get("page") || "1");
  const itemsPerPage = parseInt(searchParams.get("itemsPerPage") || "6");
  const address = searchParams.get("address") || "";
  const loanType = searchParams.get("loan-type") || "";

  // Local state for search input with debouncing
  const [searchInput, setSearchInput] = useState(address);
  const debouncedSearchInput = useDebounce(searchInput, 500);

  const { data: quotes, isLoading, error, refetch } = useGetQuote({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearchInput, // Send debounced address as search parameter
    loanType: loanType || undefined,
  });

  const handleViewDetails = (application: UserQuote) => {
    setSelectedLoan(application);
    setIsSheetOpen(true);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  // Simple search input handler
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };


  const handleLoanTypeChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set("loan-type", value);
    } else {
      params.delete("loan-type");
    }
    params.set("page", "1"); // Reset to first page
    router.push(`?${params.toString()}`);
  };

  // Initialize URL parameters if they don't exist
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    let needsUpdate = false;

    if (!params.has("page")) {
      params.set("page", "1");
      needsUpdate = true;
    }

    if (!params.has("itemsPerPage")) {
      params.set("itemsPerPage", "6");
      needsUpdate = true;
    }

    if (needsUpdate) {
      router.replace(`?${params.toString()}`);
    }
  }, [searchParams, router]);

  // Sync search input with URL parameter on initial load
  useEffect(() => {
    setSearchInput(address);
  }, [address]);

  // Update URL when debounced search input changes
  useEffect(() => {
    // Only update URL if the search input actually changed from the URL parameter
    if (debouncedSearchInput !== address) {
      const params = new URLSearchParams(searchParams.toString());
      if (debouncedSearchInput) {
        params.set("address", debouncedSearchInput);
      } else {
        params.delete("address");
      }
      params.set("page", "1"); // Reset to first page when search changes
      router.push(`?${params.toString()}`);
    }
  }, [debouncedSearchInput, address, searchParams, router]);


  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Applications</h3>
          <p className="text-gray-600 mb-6">
            Something went wrong while loading the applications. Please try again.
          </p>
          <Button onClick={() => refetch()} variant="outline">
            <Loader2 className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const applications = quotes?.data || [];
  const totalPages = quotes?.meta?.total_pages || 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 pb-24">
        <div id="applicationsContent" className="page-content mb-10">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Loan Applications
                </h2>
                <p className="text-muted-foreground">
                  Manage and track all loan applications {isLoading ? "" : `(${quotes?.meta?.total || 0} total)`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="gap-1">
                  <FileText className="h-3 w-3" />
                  All Applications
                </Badge>
                <Badge variant="default" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  {isLoading ? "Loading..." : `${quotes?.meta?.total || 0} Total`}
                </Badge>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by address..."
                  className="pl-9 w-full"
                  value={searchInput}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
              
              {/* Loan Type Filter Badges */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={loanType === "" || loanType === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleLoanTypeChange("all")}
                  className={`${
                    loanType === "" || loanType === "all"
                      ? "bg-[#F68921] text-white hover:bg-[#E67A1A]"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  All
                </Button>
                {LOAN_TYPES.map((type) => (
                  <Button
                    key={type.value}
                    variant={loanType === type.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleLoanTypeChange(type.value)}
                    className={`${
                      loanType === type.value
                        ? "bg-[#F68921] text-white hover:bg-[#E67A1A]"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {type.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {isLoading ? (
              <ApplicationsLoadingSkeleton />
            ) : applications.length === 0 ? (
              <ApplicationsEmptyState />
            ) : (
              applications.map((application) => (
                <Card key={application.id} className="hover:shadow-lg transition-shadow rounded-[12px] relative flex flex-col">
                  <CardHeader className="pb-3">
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {application.quoteApplicantInfo.full_name}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {application.address}
                      </p>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4 flex-1 pb-16">
                    {/* Property Details */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">
                          {application.property_type}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">
                          ${application.quoteLoanDetails?.purchase_price || 'N/A'} - 
                          ${application.quoteLoanDetails?.requested_loan_amount || 'N/A'} loan
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">
                          {new Date(application.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">
                          {application.quoteApplicantInfo.phone_number}
                        </span>
                      </div>
                    </div>
                  </CardContent>

                  {/* Action Button - Absolutely positioned at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <Button
                      onClick={() => handleViewDetails(application)}
                      className="w-full bg-[#F68921] text-white py-2 px-4 rounded-md hover:bg-[#E67A1A] transition-colors text-sm font-medium"
                    >
                      View Details
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <AppPagination
                page={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>

      </div>

      {selectedLoan && (
        <LoanDetailsSheet
          isOpen={isSheetOpen}
          onClose={() => {
            setIsSheetOpen(false);
            setSelectedLoan(null);
          }}
          loan={selectedLoan}
        />
      )}
    </div>
  );
}
