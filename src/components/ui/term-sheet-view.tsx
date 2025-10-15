"use client";

import { useState } from "react";
import { LenderTermSheet } from "@/@types/term-sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { FileText, Download, ThumbsUp, ThumbsDown, Loader2, AlertTriangle } from "lucide-react";
import Image from "next/image";
import { useUpdateLenderTermSheetStatus } from "@/hooks/loan-connections/use-update-lender-term-sheet-status";
import { toast } from "sonner";

interface TermSheetViewProps {
  termSheet: LenderTermSheet;
  index: number;
  onStatusUpdate?: () => void;
}

export default function TermSheetView({ termSheet, index, onStatusUpdate }: TermSheetViewProps) {
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const updateStatus = useUpdateLenderTermSheetStatus();

  const handleApprove = () => {
    updateStatus.mutate(
      {
        termSheetId: termSheet.id,
        status: "approved",
      },
      {
        onSuccess: () => {
          toast.success("Term sheet approved successfully!");
          setIsApproveDialogOpen(false);
          onStatusUpdate?.();
        },
        onError: (error) => {
          toast.error(error.message || "Failed to approve term sheet");
        },
      }
    );
  };

  const handleReject = () => {
    updateStatus.mutate(
      {
        termSheetId: termSheet.id,
        status: "rejected",
      },
      {
        onSuccess: () => {
          toast.success("Term sheet rejected successfully!");
          setIsRejectDialogOpen(false);
          onStatusUpdate?.();
        },
        onError: (error) => {
          toast.error(error.message || "Failed to reject term sheet");
        },
      }
    );
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  const showActionButtons = termSheet.status.toLowerCase() === 'pending' || termSheet.status.toLowerCase() === 'awaiting';

  return (
    <>
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* PDF-like Header with Logo */}
      <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <Image
            src="/logo.png"
            alt="Mortgage Platform"
            width={120}
            height={40}
            className="h-10 w-auto"
          />
          <div className="flex items-center gap-2">
            <Badge className={`${getStatusBadgeColor(termSheet.status)} capitalize`}>
              {termSheet.status}
            </Badge>
            
            {/* Action Buttons for Pending/Awaiting Status */}
            {showActionButtons && (
              <>
                <Button
                  onClick={() => setIsApproveDialogOpen(true)}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={updateStatus.isPending}
                >
                  <ThumbsUp className="h-3 w-3 mr-1" />
                  Approve
                </Button>
                <Button
                  onClick={() => setIsRejectDialogOpen(true)}
                  size="sm"
                  variant="destructive"
                  disabled={updateStatus.isPending}
                >
                  <ThumbsDown className="h-3 w-3 mr-1" />
                  Reject
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">
            Term Sheet {index + 1}
          </h3>
          <div className="text-xs text-gray-500">
            Submitted: {new Date(termSheet.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>

      {/* PDF-like Content */}
      <div className="p-6 bg-white">
        {termSheet.term_sheet_data && (
          <div className="space-y-6">
            {/* Parse and structure the term sheet data */}
            {(() => {
              const lines = termSheet.term_sheet_data.split('\n');
              const sections = {
                propertyDetails: [] as string[],
                loanTerms: [] as string[],
                fees: [] as string[],
                liquidity: [] as string[]
              };
              
              let currentSection = '';
              let pricingId = '';
              
              lines.forEach(line => {
                const trimmedLine = line.trim();
                if (!trimmedLine) return;
                
                // Skip company contact info
                if (trimmedLine.includes('@') || 
                    trimmedLine.match(/\(\d{3}\)\s*\d{3}-\d{4}/) ||
                    trimmedLine.includes('Lending LLC') ||
                    trimmedLine.includes('Produced on')) return;
                
                // Extract pricing ID
                if (trimmedLine.includes('Pricing ID:')) {
                  pricingId = trimmedLine.replace('Pricing ID:', '').trim();
                  return;
                }
                
                // Categorize content
                if (trimmedLine.includes('Property Details') || 
                    trimmedLine.includes('Base program') ||
                    trimmedLine.includes('Loan Term') ||
                    trimmedLine.includes('Property Type') ||
                    trimmedLine.includes('As Is Value') ||
                    trimmedLine.includes('Monthly Rental Income')) {
                  currentSection = 'propertyDetails';
                } else if (trimmedLine.includes('Suggested Loan Terms') ||
                          trimmedLine.includes('Loan Amount') ||
                          trimmedLine.includes('Rate:') ||
                          trimmedLine.includes('DSCR:')) {
                  currentSection = 'loanTerms';
                } else if (trimmedLine.includes('Estimated Lender/Loan Fees') ||
                          trimmedLine.includes('Origination Fees') ||
                          trimmedLine.includes('Closing Fee')) {
                  currentSection = 'fees';
                } else if (trimmedLine.includes('Estimated Liquidity Requirements') ||
                          trimmedLine.includes('Liquidity Buffer')) {
                  currentSection = 'liquidity';
                }
                
                if (currentSection && trimmedLine) {
                  sections[currentSection as keyof typeof sections].push(trimmedLine);
                }
              });
              
              // Check if we have any meaningful data to display
              const hasData = sections.propertyDetails.length > 0 || 
                            sections.loanTerms.length > 0 || 
                            sections.fees.length > 0 || 
                            sections.liquidity.length > 0;
              
              if (!hasData) {
                return (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Relevant Data to Show</h3>
                    <p className="text-gray-600 text-sm">
                      This term sheet doesn&apos;t contain structured loan information that can be displayed.
                    </p>
                  </div>
                );
              }
              
              return (
                <div className="space-y-6">
                  {/* Property Details Section */}
                  {sections.propertyDetails.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-gray-100 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-white bg-gray-600 px-3 py-2 rounded-t-lg -mx-4 -mt-4 mb-3">
                          Property Details
                        </h4>
                        <div className="space-y-2">
                          {sections.propertyDetails.slice(0, 8).map((item, idx) => (
                            <div key={idx} className="flex justify-between text-xs">
                              <span className="text-gray-700 font-medium">
                                {item.split(':')[0] || item.split('\t')[0]}
                              </span>
                              <span className="text-gray-900 font-semibold">
                                {item.split(':')[1] || item.split('\t')[1] || ''}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Suggested Loan Terms */}
                      {sections.loanTerms.length > 0 && (
                        <div className="bg-gray-100 rounded-lg p-4">
                          <h4 className="text-sm font-bold text-white bg-gray-600 px-3 py-2 rounded-t-lg -mx-4 -mt-4 mb-3">
                            Suggested Loan Terms
                          </h4>
                          <div className="space-y-2">
                            {sections.loanTerms.slice(0, 6).map((item, idx) => (
                              <div key={idx} className="flex justify-between text-xs">
                                <span className="text-gray-700 font-medium">
                                  {item.split(':')[0] || item.split('\t')[0]}
                                </span>
                                <span className="text-gray-900 font-semibold">
                                  {item.split(':')[1] || item.split('\t')[1] || ''}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Fees and Liquidity Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {sections.fees.length > 0 && (
                      <div className="bg-gray-100 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-white bg-gray-600 px-3 py-2 rounded-t-lg -mx-4 -mt-4 mb-3">
                          Estimated Lender/Loan Fees & Escrows
                        </h4>
                        <div className="space-y-2">
                          {sections.fees.slice(0, 5).map((item, idx) => (
                            <div key={idx} className="flex justify-between text-xs">
                              <span className="text-gray-700 font-medium">
                                {item.split(':')[0] || item.split('\t')[0]}
                              </span>
                              <span className="text-gray-900 font-semibold">
                                {item.split(':')[1] || item.split('\t')[1] || ''}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {sections.liquidity.length > 0 && (
                      <div className="bg-gray-100 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-white bg-gray-600 px-3 py-2 rounded-t-lg -mx-4 -mt-4 mb-3">
                          Estimated Liquidity Requirements
                        </h4>
                        <div className="space-y-2">
                          {sections.liquidity.slice(0, 4).map((item, idx) => (
                            <div key={idx} className="flex justify-between text-xs">
                              <span className="text-gray-700 font-medium">
                                {item.split(':')[0] || item.split('\t')[0]}
                              </span>
                              <span className="text-gray-900 font-semibold">
                                {item.split(':')[1] || item.split('\t')[1] || ''}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Footer with Pricing ID */}
                  {pricingId && (
                    <div className="text-right text-xs text-gray-500 pt-4 border-t border-gray-200">
                      Pricing ID: {pricingId}
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                <span className="font-medium">Reference IDs:</span> Quote #{termSheet.quote_id} | Product #{termSheet.loan_product_id}
              </div>
              <button
                onClick={() => {
                  console.log('Full Term Sheet Data:', {
                    id: termSheet.id,
                    data: termSheet.term_sheet_data,
                    status: termSheet.status,
                    created_at: termSheet.created_at
                  });
                }}
                className="text-xs text-[#F68921] hover:text-[#E67A1A] flex items-center gap-1"
              >
                <Download className="h-3 w-3" />
                View raw data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Approve Confirmation Dialog */}
    <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ThumbsUp className="h-5 w-5 text-green-600" />
            Approve Term Sheet
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to approve this term sheet?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-yellow-900 mb-1">
                This action is not reversible
              </p>
              <p className="text-sm text-yellow-800">
                Once approved, this term sheet will be marked as approved and this action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsApproveDialogOpen(false)}
            disabled={updateStatus.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleApprove}
            disabled={updateStatus.isPending}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {updateStatus.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Approving...
              </>
            ) : (
              <>
                <ThumbsUp className="mr-2 h-4 w-4" />
                Approve Term Sheet
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Reject Confirmation Dialog */}
    <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ThumbsDown className="h-5 w-5 text-red-600" />
            Reject Term Sheet
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to reject this term sheet?
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
                Once rejected, this term sheet will be marked as rejected and this action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsRejectDialogOpen(false)}
            disabled={updateStatus.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReject}
            disabled={updateStatus.isPending}
            variant="destructive"
          >
            {updateStatus.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Rejecting...
              </>
            ) : (
              <>
                <ThumbsDown className="mr-2 h-4 w-4" />
                Reject Term Sheet
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
