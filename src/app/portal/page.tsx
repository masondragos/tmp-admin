"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useStates } from "@/hooks/employee/useState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Users, FileText, Building, TrendingUp } from "lucide-react";

// Loading Skeleton Component
const DashboardLoadingSkeleton = () => (
  <div className="container mx-auto px-6 py-8 pb-24">
    <div id="adminContentArea" className="bg-gray-50 rounded-lg p-6 mb-10">
      <div className="text-center">
        <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
        <Skeleton className="h-6 w-64 mx-auto mb-2" />
        <Skeleton className="h-4 w-80 mx-auto" />
      </div>
    </div>
    <div id="dashboardContent" className="page-content">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="ml-4 flex-1">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

// Empty State Component
const DashboardEmptyState = () => (
  <div className="container mx-auto px-6 py-8 pb-24">
    <div id="adminContentArea" className="bg-gray-50 rounded-lg p-6 mb-10">
      <div className="text-center text-gray-500">
        <div className="text-4xl mb-4">📊</div>
        <h3 className="text-xl font-semibold mb-2">
          No Dashboard Data Available
        </h3>
        <p className="text-gray-600">
          Dashboard statistics are not available at the moment. Please try again later.
        </p>
      </div>
    </div>
    <div id="dashboardContent" className="page-content">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-gray-100 text-gray-400">
                  <Skeleton className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    {index === 0 ? "Total Lenders" : 
                     index === 1 ? "Loan Products" : 
                     index === 2 ? "Total Applications" : "Matches Made"}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">-</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

export default function PortalPage() {
  const { data: stats, isLoading, error, refetch } = useStates();

  // Loading state
  if (isLoading) {
    return <DashboardLoadingSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 mb-6">
            Something went wrong while loading the dashboard data. Please try again.
          </p>
          <Button onClick={() => refetch()} variant="outline">
            <Loader2 className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Empty state - when stats are null or all values are 0
  if (!stats || (stats.totalLenders === 0 && stats.loanProducts === 0 && stats.totalApplicants === 0 && stats.matchesMade === 0)) {
    return <DashboardEmptyState />;
  }

  return (
    <div>
      <div className="container mx-auto px-6 py-8 pb-24">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Overview of your mortgage broker platform statistics
          </p>
        </div>
        <div id="dashboardContent" className="page-content">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    <Building className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Total Lenders
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">{stats?.totalLenders || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Loan Products
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">{stats?.loanProducts || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Total Applications
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">{stats?.totalApplicants || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Matches Made
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">{stats?.matchesMade || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
