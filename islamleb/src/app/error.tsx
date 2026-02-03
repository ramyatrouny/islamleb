"use client";

import { useEffect } from "react";
import { Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
      <Moon className="h-16 w-16 text-primary/50" />
      <h2 className="text-2xl font-bold text-foreground">حدث خطأ غير متوقع</h2>
      <p className="text-muted-foreground max-w-md">
        نعتذر عن هذا الخلل. يرجى المحاولة مرة أخرى.
      </p>
      <Button onClick={reset} className="bg-primary text-primary-foreground hover:bg-primary/90">
        إعادة المحاولة
      </Button>
    </div>
  );
}
