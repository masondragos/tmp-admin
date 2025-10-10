import { Suspense } from "react";
import TermSheetsContent from "./term-sheets-content";
import { Loader2 } from "lucide-react";

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading term sheets...</p>
      </div>
    </div>
  );
}

export default function TermSheetsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TermSheetsContent />
    </Suspense>
  );
}
