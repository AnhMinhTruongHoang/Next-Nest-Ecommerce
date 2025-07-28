"use client";

import { useEffect } from "react";
import { Button, Result } from "antd";

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
      <Result
        status="error"
        title="Something went wrong"
        subTitle="Sorry, an unexpected error occurred. You can try again."
        extra={
          <Button type="primary" onClick={() => reset()}>
            Try again
          </Button>
        }
      />
      {process.env.NODE_ENV === "development" && (
        <pre className="mt-6 p-4 rounded bg-gray-100 dark:bg-gray-800 text-left text-sm text-red-500 overflow-auto max-w-xl">
          {error?.message}
        </pre>
      )}
    </div>
  );
}
