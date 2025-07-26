"use client";

import { useEffect } from "react";
import { Alert, Button } from "@mui/material";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Caught error in error boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 px-4 text-center">
      <Alert className="text-red-500 mb-4 w-12 h-12" />
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
        Something went wrong
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Sorry, an unexpected error occurred. You can try again.
      </p>

      <Button
        onClick={() => reset()}
        className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700"
      >
        Try again
      </Button>

      {/* Optional: Show detailed error in development */}
      {process.env.NODE_ENV === "development" && (
        <pre className="mt-6 p-4 rounded bg-gray-100 dark:bg-gray-800 text-left text-sm text-red-500 overflow-auto max-w-xl">
          {error?.message}
        </pre>
      )}
    </div>
  );
}
