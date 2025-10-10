import { Suspense } from "react";
import LenderJoinForm from "./lender-join-form";
import { Loader2 } from "lucide-react";

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

export default function LenderJoinPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LenderJoinForm />
    </Suspense>
  );
}