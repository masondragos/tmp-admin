"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Building, 
  Mail, 
  Calendar, 
  Shield,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  FileText,
  Percent
} from "lucide-react";
import { LendereListItem } from "@/services/lender/get-all-lender.service";
import { useGetLoanProducts } from "@/hooks/loan-products/get-loan-products";
import { useState } from "react";
import AppPagination from "../ui/custom-pagination";

interface LenderDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  lender: LendereListItem | null;
}

const getStatusColor = (status: string) => {
  const statusColors: { [key: string]: string } = {
    pending: "bg-yellow-100 text-yellow-800",
    active: "bg-green-100 text-green-800",
    expired: "bg-red-100 text-red-800",
    cancelled: "bg-gray-100 text-gray-800",
  };
  return statusColors[status] || "bg-gray-100 text-gray-800";
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return <CheckCircle className="h-4 w-4" />;
    case "pending":
      return <Clock className="h-4 w-4" />;
    case "expired":
    case "cancelled":
      return <XCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

export const LenderDetailsSheet: React.FC<LenderDetailsSheetProps> = ({
  isOpen,
  onClose,
  lender,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Show 5 loan products per page
  
  // Fetch loan products for this lender (must be called before any early returns)
  const { 
    data: loanProductsResponse, 
    isLoading: isLoadingProducts, 
    error: productsError 
  } = useGetLoanProducts(lender?.id || 0, currentPage, itemsPerPage);
  
  // Extract data from paginated response
  const loanProducts = loanProductsResponse?.data || [];
  const pagination = loanProductsResponse?.meta;

  if (!lender) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-gray-900">
            Lender Details
          </SheetTitle>
          <SheetDescription>
            Complete information for {lender.name}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          {/* Status Badge */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <Badge 
              className={`${getStatusColor(lender.invite_status)} px-3 py-1 text-sm font-semibold flex items-center gap-2`}
            >
              {getStatusIcon(lender.invite_status)}
              {lender.invite_status.charAt(0).toUpperCase() + lender.invite_status.slice(1)}
            </Badge>
          </div>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Details
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Loan Products
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6 mt-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-[#F68921]" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Lender Name</p>
                        <p className="text-sm text-gray-600">{lender.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Email Address</p>
                        <p className="text-sm text-gray-600">{lender.email}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Status Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-[#F68921]" />
                    Status Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(lender.invite_status)}
                      <div>
                        <p className="text-sm font-medium text-gray-900">Invite Status</p>
                        <p className="text-sm text-gray-600 capitalize">{lender.invite_status}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${lender.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Account Status</p>
                        <p className="text-sm text-gray-600">
                          {lender.is_active ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[#F68921]" />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Created Date</p>
                      <p className="text-sm text-gray-600">{formatDate(lender.created_at)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Last Updated</p>
                      <p className="text-sm text-gray-600">{formatDate(lender.updated_at)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products" className="space-y-6 mt-6">
              {isLoadingProducts ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-5 w-5" />
                          <Skeleton className="h-6 w-48" />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </div>
                        <div className="pt-3 border-t border-gray-100">
                          <Skeleton className="h-4 w-40 mb-2" />
                          <div className="flex gap-2">
                            <Skeleton className="h-6 w-16" />
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-14" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : productsError ? (
                <div className="text-center py-8">
                  <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600">Failed to load loan products</p>
                  <p className="text-sm text-gray-500 mt-1">Please try again later</p>
                </div>
              ) : !loanProducts || loanProducts.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No loan products available</p>
                  <p className="text-sm text-gray-500 mt-1">This lender hasn&apos;t added any loan products yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {loanProducts.map((product) => (
                    <Card key={product.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-[#F68921]" />
                          {product.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {product.description && (
                          <p className="text-sm text-gray-600">{product.description}</p>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Min Loan Amount</p>
                              <p className="text-sm text-gray-600">
                                ${product.criteria?.min_loan_amount?.toLocaleString() || 'N/A'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Max Loan Amount</p>
                              <p className="text-sm text-gray-600">
                                ${product.criteria?.max_loan_amount?.toLocaleString() || 'N/A'}
                              </p>
                            </div>
                          </div>
                          
                          {/* <div className="flex items-center gap-2">
                            <Percent className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">Interest Rate</p>
                              <p className="text-sm text-gray-600">
                                {product.criteria?.interest_rate ? `${product.criteria.interest_rate}%` : 'N/A'}
                              </p>
                            </div>
                          </div> */}
                        </div>

                        {product.criteria?.states_funded && product.criteria.states_funded.length > 0 && (
                          <div className="pt-3 border-t border-gray-100">
                            <p className="text-sm font-medium text-gray-900 mb-2">Supported States:</p>
                            <div className="flex flex-wrap gap-2">
                              {JSON.parse(product.criteria.states_funded)?.map((type: string, index: number) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {type}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              {/* Pagination */}
              {pagination && pagination.total > itemsPerPage && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <AppPagination
                    page={currentPage}
                    totalPages={pagination.total_pages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
};
