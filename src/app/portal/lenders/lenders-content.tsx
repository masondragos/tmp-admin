/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Building, Loader2, Eye } from "lucide-react";
import { useGetAllLenders } from "@/hooks/lender/use-get-all-lenders";
import { useInviteLender } from "@/hooks/lender/use-invite-lender";
import { toast } from "sonner";
import { useDeleteLender } from "@/hooks/lender/use-delete-lender";
import { Skeleton } from "@/components/ui/skeleton";
import AppPagination from "@/components/ui/custom-pagination";
import Field from "@/components/ui/field";
import { LenderDetailsSheet } from "@/components/sheets/lender-details-sheet";

// Zod schema for form validation
const inviteLenderSchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
});

type InviteLenderFormData = z.infer<typeof inviteLenderSchema>;

const getStatusColor = (status: string) => {
  const statusColors: { [key: string]: string } = {
    pending: "bg-yellow-100 text-yellow-800",
    active: "bg-green-100 text-green-800",
    expired: "bg-red-100 text-red-800",
    cancelled: "bg-gray-100 text-gray-800",
  };
  return statusColors[status] || "bg-gray-100 text-gray-800";
};

// Loading Skeleton Component
const LendersLoadingSkeleton = () => (
  <div className="bg-white rounded-lg border">
    <Table>
      <TableHeader>
        <TableRow className="border-b hover:bg-transparent">
          <TableHead className="font-medium text-gray-900 py-6 px-6">
            Name
          </TableHead>
          <TableHead className="font-medium text-gray-900 py-6 px-6">
            Email
          </TableHead>
          <TableHead className="font-medium text-gray-900 py-6 px-6">
            Status
          </TableHead>
          <TableHead className="font-medium text-gray-900 py-6 px-6 text-right">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRow
            key={index}
            className={`border-b ${
              index % 2 === 0
                ? "bg-gray-50 hover:bg-gray-50"
                : "bg-white hover:bg-white"
            }`}
          >
            <TableCell className="py-6 px-6">
              <Skeleton className="h-4 w-32" />
            </TableCell>
            <TableCell className="py-6 px-6">
              <Skeleton className="h-4 w-48" />
            </TableCell>
            <TableCell className="py-6 px-6">
              <Skeleton className="h-6 w-16 rounded-full" />
            </TableCell>
            <TableCell className="py-6 px-6 text-right">
              <Skeleton className="h-8 w-8 rounded ml-auto" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

// Empty State Component
const LendersEmptyState = () => (
  <div className="bg-white rounded-lg border">
    <Table>
      <TableHeader>
        <TableRow className="border-b hover:bg-transparent">
          <TableHead className="font-medium text-gray-900 py-6 px-6">
            Name
          </TableHead>
          <TableHead className="font-medium text-gray-900 py-6 px-6">
            Email
          </TableHead>
          <TableHead className="font-medium text-gray-900 py-6 px-6">
            Status
          </TableHead>
          <TableHead className="font-medium text-gray-900 py-6 px-6 text-right">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell colSpan={4} className="text-center py-12">
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Building className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Lenders</h3>
              <p className="text-gray-600 mb-6">
                No lenders have been added yet. Invite lenders to start collaborating.
              </p>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Invite Your First Lender
              </Button>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
);

export default function LendersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [lenderToDelete, setLenderToDelete] = useState<{ id: number; name: string } | null>(null);
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);
  const [selectedLender, setSelectedLender] = useState<any>(null);

  // Get URL parameters with defaults
  const currentPage = parseInt(searchParams.get("page") || "1");
  const itemsPerPage = parseInt(searchParams.get("itemsPerPage") || "10");

  // Fetch all lenders
  const { data: lendersData, isLoading, error, refetch } = useGetAllLenders({
    page: currentPage,
    limit: itemsPerPage,
  });
  
  // Mutation hook for inviting lenders
  const inviteLender = useInviteLender();
  
  // Mutation hook for deleting lenders
  const deleteLender = useDeleteLender();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InviteLenderFormData>({
    resolver: zodResolver(inviteLenderSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });


  const handleDeleteClick = (memberId: number, memberName: string) => {
    setLenderToDelete({ id: memberId, name: memberName });
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!lenderToDelete) return;
    
    deleteLender.mutate(lenderToDelete.id.toString(), {
      onSuccess: () => {
        toast.success("Lender deleted successfully");
        setIsDeleteDialogOpen(false);
        setLenderToDelete(null);
        refetch(); // Refresh the list
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete lender");
      },
    });
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setLenderToDelete(null);
  };

  const handleViewLender = (lender: any) => {
    setSelectedLender(lender);
    setIsDetailsSheetOpen(true);
  };

  const handleInviteLender = (data: InviteLenderFormData) => {
    inviteLender.mutate(
      { name: data.name, email: data.email },
      {
        onSuccess: () => {
          toast.success("Invitation sent successfully");
          setIsDialogOpen(false);
          reset(); // Reset form
          refetch(); // Refresh the list
        },
        onError: (error) => {
          toast.error(error.message || "Failed to send invitation");
        },
      }
    );
  };


  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
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
      params.set("itemsPerPage", "10");
      needsUpdate = true;
    }

    if (needsUpdate) {
      router.replace(`?${params.toString()}`);
    }
  }, [searchParams, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <LendersLoadingSkeleton />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Lenders</h3>
          <p className="text-gray-600 mb-6">
            Something went wrong while loading the lenders. Please try again.
          </p>
          <Button onClick={() => refetch()} variant="outline">
            <Loader2 className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const lenders = lendersData?.data || [];
  const totalPages = lendersData?.meta?.total_pages || 0;

  return (
    <div className="container mx-auto px-8 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Lenders</h1>
          <p className="text-gray-600 mt-2">
            Manage your lenders and their roles ({lendersData?.meta?.total || 0} lenders)
          </p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-gray-800 hover:bg-gray-900 text-white cursor-pointer"
          disabled={inviteLender.isPending}
        >
          {inviteLender.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          {inviteLender.isPending ? "Sending..." : "Invite Lender"}
        </Button>
      </div>

      {/* Table */}
      {lenders.length === 0 ? (
        <LendersEmptyState />
      ) : (
        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="border-b hover:bg-transparent">
                <TableHead className="font-medium text-gray-900 py-6 px-6">
                  Name
                </TableHead>
                <TableHead className="font-medium text-gray-900 py-6 px-6">
                  Email
                </TableHead>
                <TableHead className="font-medium text-gray-900 py-6 px-6">
                  Status
                </TableHead>
                <TableHead className="font-medium text-gray-900 py-6 px-6 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lenders.map((member, index) => (
              <TableRow
                key={member.id}
                className={`border-b ${
                  index % 2 === 0
                    ? "bg-gray-50 hover:bg-gray-50"
                    : "bg-white hover:bg-white"
                }`}
              >
                <TableCell className="py-6 px-6">
                  <div className="font-medium text-gray-900">{member.name}</div>
                </TableCell>
                <TableCell className="py-6 px-6">
                  <div className="text-gray-600">{member.email}</div>
                </TableCell>
               
                <TableCell className="py-6 px-6">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      member.invite_status
                    )}`}
                  >
                    {member.invite_status}
                  </span>
                </TableCell>
                <TableCell className="py-6 px-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-blue-50 text-blue-600 hover:text-blue-700"
                      onClick={() => handleViewLender(member)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-red-50 text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteClick(member.id, member.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <AppPagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Add Lender Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Lender</DialogTitle>
            <DialogDescription>
              Send an invitation to a new lender.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(handleInviteLender)} className="space-y-4 py-4">
            <Field
              label="Name"
              error={errors.name?.message}
              isRequired={true}
            >
              <Input
                {...register("name")}
                placeholder="Enter full name"
                className="w-full"
              />
            </Field>

            <Field
              label="Email"
              error={errors.email?.message}
              isRequired={true}
            >
              <Input
                {...register("email")}
                type="email"
                placeholder="Enter email address"
                className="w-full"
              />
            </Field>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gray-800 hover:bg-gray-900 text-white"
                disabled={inviteLender.isPending}
              >
                {inviteLender.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {inviteLender.isPending ? "Sending..." : "Send Invitation"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Lender</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{lenderToDelete?.name}</strong>? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              disabled={deleteLender.isPending}
              variant='default'
            >
              {deleteLender.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {deleteLender.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lender Details Sheet */}
      <LenderDetailsSheet
        isOpen={isDetailsSheetOpen}
        onClose={() => {
          setIsDetailsSheetOpen(false);
          setSelectedLender(null);
        }}
        lender={selectedLender}
      />
    </div>
  );
}

