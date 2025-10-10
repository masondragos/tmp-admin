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
import { Plus, User, Loader2, Trash2, Eye } from "lucide-react";
import { useGetAllEmployees } from "@/hooks/employee/use-get-all-employees";
import { useInviteEmployee } from "@/hooks/employee/use-invite-employee";
import { useDeleteEmployee } from "@/hooks/employee/use-delete-employee";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import AppPagination from "@/components/ui/custom-pagination";
import Field from "@/components/ui/field";
import { TeamMemberDetailsSheet } from "@/components/sheets/team-member-details-sheet";

// Zod schema for form validation
const inviteMemberSchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
});

type InviteMemberFormData = z.infer<typeof inviteMemberSchema>;

const getRoleColor = (role: string) => {
  const roleColors: { [key: string]: string } = {
    admin: "bg-purple-100 text-purple-800",
    employee: "bg-blue-100 text-blue-800",
    Employee: "bg-blue-100 text-blue-800",
  };
  return roleColors[role] || "bg-gray-100 text-gray-800";
};

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
const TeamLoadingSkeleton = () => (
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
            Role
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
            <TableCell className="py-6 px-6">
              <Skeleton className="h-6 w-20 rounded-full" />
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
const TeamEmptyState = () => (
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
            Role
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
          <TableCell colSpan={5} className="text-center py-12">
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <User className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Team Members</h3>
              <p className="text-gray-600 mb-6">
                No team members have been added yet. Invite team members to start collaborating.
              </p>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Invite Your First Member
              </Button>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
);

export default function TeamPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<{ id: number; name: string } | null>(null);
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  // Get URL parameters with defaults
  const currentPage = parseInt(searchParams.get("page") || "1");

  // Fetch all employees with pagination
  const { data: employeesData, isLoading, error, refetch } = useGetAllEmployees({
    page: currentPage,
    limit: 10,
  });
  
  // Mutation hook for inviting employees
  const inviteEmployee = useInviteEmployee();

  // Mutation hook for deleting employees
  const deleteEmployee = useDeleteEmployee();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InviteMemberFormData>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

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

    if (needsUpdate) {
      router.replace(`?${params.toString()}`);
    }
  }, [searchParams, router]);

  const handleInviteMember = (data: InviteMemberFormData) => {
    inviteEmployee.mutate(
      { name: data.name, email: data.email },
      {
        onSuccess: () => {
          toast.success("Invitation sent successfully");
          setIsDialogOpen(false);
          reset(); // Reset form
          // Reset to first page in URL
          const params = new URLSearchParams(searchParams.toString());
          params.set("page", "1");
          router.push(`?${params.toString()}`);
          refetch(); // Refresh the list
        },
        onError: (error) => {
          toast.error(error.message || "Failed to send invitation");
        },
      }
    );
  };


  const handleDeleteClick = (memberId: number, memberName: string) => {
    setEmployeeToDelete({ id: memberId, name: memberName });
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!employeeToDelete) return;

    deleteEmployee.mutate(employeeToDelete.id.toString(), {
      onSuccess: () => {
        toast.success("Employee deleted successfully");
        setIsDeleteDialogOpen(false);
        setEmployeeToDelete(null);
        refetch(); // Refresh the list
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete employee");
      },
    });
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  const handleViewMember = (member: any) => {
    setSelectedMember(member);
    setIsDetailsSheetOpen(true);
  };


  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <Skeleton className="h-8 w-40 mb-2" />
            <Skeleton className="h-4 w-56" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <TeamLoadingSkeleton />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Team Members</h3>
          <p className="text-gray-600 mb-6">
            Something went wrong while loading the team members. Please try again.
          </p>
          <Button onClick={() => refetch()} variant="outline">
            <Loader2 className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const employees = employeesData?.data || [];
  const totalPages = employeesData?.meta?.total_pages || 0;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              Team Members
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your team and their roles ({employeesData?.meta?.total || 0} members)
            </p>
          </div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-gray-800 hover:bg-gray-900 text-white cursor-pointer"
            disabled={inviteEmployee.isPending}
          >
            {inviteEmployee.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            {inviteEmployee.isPending ? "Sending..." : "Invite Member"}
          </Button>
        </div>

        {/* Table */}
        {employees.length === 0 ? (
          <TeamEmptyState />
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
                    Role
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
                {employees.map((member, index) => (
                <TableRow
                  key={member.id}
                  className={`border-b ${
                    index % 2 === 0
                      ? "bg-gray-50 hover:bg-gray-50"
                      : "bg-white hover:bg-white"
                  }`}
                >
                  <TableCell className="py-6 px-6">
                    <div className="font-medium text-gray-900">
                      {member.name}
                    </div>
                  </TableCell>
                  <TableCell className="py-6 px-6">
                    <div className="text-gray-600">{member.email}</div>
                  </TableCell>
                  <TableCell className="py-6 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getRoleColor(
                        member.role
                      )}`}
                    >
                      {member.role}
                    </span>
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
                        onClick={() => handleViewMember(member)}
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

        {/* Invite Member Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to a new team member.
              </DialogDescription>
            </DialogHeader>

            <form id="invite-form" onSubmit={handleSubmit(handleInviteMember)} className="space-y-4 py-4">
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
            </form>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                form="invite-form"
                className="bg-gray-800 hover:bg-gray-900 text-white"
                disabled={inviteEmployee.isPending}
              >
                {inviteEmployee.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {inviteEmployee.isPending ? "Sending..." : "Send Invitation"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Team Member</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete <strong>{employeeToDelete?.name}</strong>? 
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button variant="outline" onClick={handleCancelDelete}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDelete}
                disabled={deleteEmployee.isPending}
                variant="destructive"
              >
                {deleteEmployee.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {deleteEmployee.isPending ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Team Member Details Sheet */}
        <TeamMemberDetailsSheet
          isOpen={isDetailsSheetOpen}
          onClose={() => {
            setIsDetailsSheetOpen(false);
            setSelectedMember(null);
          }}
          member={selectedMember}
        />
      </div>
    </div>
  );
}
