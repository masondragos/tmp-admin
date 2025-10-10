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
import { 
  Building, 
  Mail, 
  Calendar, 
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  FileText,
  User,
  MapPin,
  Phone,
  CreditCard,
  Home,
} from "lucide-react";
import { TermSheet } from "@/@types/term-sheet";

interface TermSheetDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  termSheet: TermSheet | null;
}

const getStatusColor = (status: string) => {
  const statusColors: { [key: string]: string } = {
    awaiting: "bg-yellow-100 text-yellow-800",
    pending: "bg-blue-100 text-blue-800",
    signed: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800",
    available: "bg-purple-100 text-purple-800",
  };
  return statusColors[status] || "bg-gray-100 text-gray-800";
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "signed":
    case "available":
      return <CheckCircle className="h-4 w-4" />;
    case "pending":
      return <Clock className="h-4 w-4" />;
    case "awaiting":
      return <Clock className="h-4 w-4" />;
    case "closed":
      return <XCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

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
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const TermSheetDetailsSheet: React.FC<TermSheetDetailsSheetProps> = ({
  isOpen,
  onClose,
  termSheet,
}) => {
  if (!termSheet) return null;

  const { quote, lender, employee, user } = termSheet;
  const applicantInfo = quote?.quoteApplicantInfo;
  const loanDetails = quote?.quoteLoanDetails;
  const rentalInfo = quote?.quoteRentalInfo;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-gray-900">
            Term Sheet Request Details
          </SheetTitle>
          <SheetDescription>
            Complete information for {applicantInfo?.full_name || 'Unknown Applicant'}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          {/* Status Badge */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <Badge 
              className={`${getStatusColor(termSheet.term_sheet_status || "awaiting")} px-3 py-1 text-sm font-semibold flex items-center gap-2`}
            >
              {getStatusIcon(termSheet.term_sheet_status || "awaiting")}
              {(termSheet.term_sheet_status || "awaiting").charAt(0).toUpperCase() + (termSheet.term_sheet_status || "awaiting").slice(1)}
            </Badge>
          </div>

          <Tabs defaultValue="request" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="request" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Request Details
              </TabsTrigger>
              <TabsTrigger value="application" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Loan Application
              </TabsTrigger>
            </TabsList>

            <TabsContent value="request" className="space-y-6 mt-6">
              {/* Request Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#F68921]" />
                    Term Sheet Request
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Invitation Sent To</p>
                        <p className="text-sm text-gray-600">{lender.name}</p>
                        <p className="text-xs text-gray-500">{lender.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Sent By Admin</p>
                        <p className="text-sm text-gray-600">{employee.name}</p>
                        <p className="text-xs text-gray-500">{employee.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Lender Product</p>
                        <p className="text-sm text-gray-600">
                          {termSheet.loan_product?.name || `Product #${termSheet.loan_product_id}` || "Not specified"}
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
                      <p className="text-sm font-medium text-gray-900">Request Created</p>
                      <p className="text-sm text-gray-600">{formatDate(termSheet.created_at)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Last Updated</p>
                      <p className="text-sm text-gray-600">{formatDate(termSheet.updated_at)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="application" className="space-y-6 mt-6">
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
                        <p className="text-sm text-gray-600">{applicantInfo?.full_name || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Phone</p>
                        <p className="text-sm text-gray-600">{applicantInfo?.phone_number || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Email</p>
                        <p className="text-sm text-gray-600">{user?.email || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Credit Score</p>
                        <p className="text-sm text-gray-600">{applicantInfo?.credit_score || 'N/A'}</p>
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
                        <p className="text-sm text-gray-600">{quote?.address || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Property Type</p>
                        <p className="text-sm text-gray-600">{quote?.property_type || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Loan Type</p>
                        <p className="text-sm text-gray-600">{quote?.loan_type || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Living in Property</p>
                        <p className="text-sm text-gray-600">
                          {quote?.is_living_in_property ? 'Yes' : 'No'}
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
                          {formatCurrency(loanDetails?.purchase_price || 0)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">After Repair Value</p>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(loanDetails?.after_repair_property_value || 0)}
                        </p>
                      </div>
                    </div>
                    {/* <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Rehab Amount</p>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(loanDetails?.rehab_amount_requested || 0)}
                        </p>
                      </div>
                    </div> */}
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Exit Plan</p>
                        <p className="text-sm text-gray-600">{loanDetails?.exit_plan || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Rental Information */}
              {rentalInfo && (
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
                            {formatCurrency(rentalInfo?.monthly_rental_income || 0)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Annual Insurance</p>
                          <p className="text-sm text-gray-600">
                            {formatCurrency(rentalInfo?.annual_property_insurance || 0)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Annual Taxes</p>
                          <p className="text-sm text-gray-600">
                            {formatCurrency(rentalInfo?.annual_property_taxes || 0)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Monthly HOA Fee</p>
                          <p className="text-sm text-gray-600">
                            {formatCurrency(rentalInfo?.monthly_hoa_fee || 0)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
};
