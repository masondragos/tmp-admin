import { Suspense } from "react";
import LendersContent from "./lenders-content";
import { Skeleton } from "@/components/ui/skeleton";

function LoadingFallback() {
  return (
    <div className="container mx-auto px-8 py-12">
      <div className="flex items-center justify-between mb-12">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="bg-white rounded-lg border p-8">
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}

export default function LendersPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LendersContent />
    </Suspense>
  );
}
