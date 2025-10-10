"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback } from "react";
import { useUser } from "@/providers/user-provider";
import { useLogout } from "@/hooks/auth/useLogout";
import { User, Settings, LogOut, ChevronDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";


export default function PortalHeader() {
  const pathname = usePathname();
  const isActive = useCallback((path: string) => pathname === path, [pathname]);
  const { user, isLoading: isUserLoading } = useUser();
  const logout = useLogout();
  
  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully");
        localStorage.clear();
        window.location.href = '/';
      },
      onError: (error) => {
        toast.error(error.message || "Logout failed");
      },
    });
  };
  
  return (
    <>
      <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-12">
            <div className="flex items-center">
              <Image
                src="/logo.png"
                alt="Logo"
                width={70}
                height={70}
              />
            </div>
            <div className="flex items-center gap-2">
              <Link href="/portal">
                <Button
                  variant="ghost"
                  className={cn(
                    "text-gray-600 hover:text-white hover:bg-[#F68921]  transition-colors cursor-pointer",
                    isActive("/portal") && "bg-[#F68921] text-white"
                  )}
                >
                  Dashboard
                </Button>
              </Link>
              <Link href="/portal/lenders">
                <Button
                  variant="ghost"
                  className={cn(
                    "text-gray-600 hover:text-white hover:bg-[#F68921] transition-colors cursor-pointer",
                    isActive("/portal/lenders") && "bg-[#F68921] text-white"
                  )}
                >
                  Lenders
                </Button>
              </Link>
              
              {/* <Link href="/portal/products">
                <Button
                  variant="ghost"
                  className={cn(
                    "text-gray-600 hover:text-white hover:bg-[#F68921] transition-colors cursor-pointer",
                    isActive("/portal/products") && "bg-[#F68921] text-white"
                  )}
                >
                  Products
                </Button>
              </Link> */}
              
              <Link href="/portal/applications">
                <Button
                  variant="ghost"
                  className={cn(
                    "text-gray-600 hover:text-white hover:bg-[#F68921] transition-colors cursor-pointer",
                    isActive("/portal/applications") && "bg-[#F68921] text-white"
                  )}
                >
                  Applications
                </Button>
              </Link>
              <Link href="/portal/term-sheets">
                <Button
                  variant="ghost"
                  className={cn(
                    "text-gray-600 hover:text-white hover:bg-[#F68921] transition-colors cursor-pointer",
                    isActive("/portal/term-sheets") && "bg-[#F68921] text-white"
                  )}
                >
                  Term Sheets
                </Button>
              </Link>
              {
                user?.role === 'admin' && <Link href="/portal/team">
                <Button
                  variant="ghost"
                  className={cn(
                    "text-gray-600 hover:text-white hover:bg-[#F68921] transition-colors cursor-pointer",
                    isActive("/portal/team") && "bg-[#F68921] text-white"
                  )}
                >
                  Team
                </Button>
              </Link>
              }
              
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isUserLoading ? (
              <div className="flex items-center gap-2 px-3 py-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-2 px-3 py-2 h-auto"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user?.avatar || "/placeholder-avatar.jpg"} alt="User" />
                      <AvatarFallback className="bg-[#F68921] text-white text-xs">
                        {user?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-600">{user?.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 border-b">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-gray-500">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuItem className="cursor-pointer mt-1">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={handleLogout}
                    disabled={logout.isPending}
                  >
                    {logout.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="mr-2 h-4 w-4" />
                    )}
                    {logout.isPending ? "Signing Out..." : "Sign Out"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>

    {/* Logout Loading Modal */}
    <Dialog open={logout.isPending} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin" />
            Logging Out
          </DialogTitle>
          <DialogDescription>
            Please wait while we log you out securely...
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center py-6">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-gray-600" />
            <p className="text-sm text-gray-600">
              Signing you out of your account
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
