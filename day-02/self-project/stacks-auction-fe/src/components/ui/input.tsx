import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-background flex h-10 w-full min-w-0 border-2 border-black bg-transparent px-3 py-2 text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all outline-none file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm font-medium",
        "focus:translate-x-[3px] focus:translate-y-[3px] focus:shadow-none focus:border-primary",
        "aria-invalid:border-destructive aria-invalid:shadow-[4px_4px_0px_0px_rgba(239,68,68,1)]",
        className
      )}
      {...props}
    />
  );
}

export { Input };
