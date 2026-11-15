"use client";

import * as React from "react";
import { toast } from "sonner";

/**
 * Copies a request reference to the clipboard and confirms with a toast, so
 * the buyer can paste it into an email or message without retyping it.
 */
export const CopyReference = ({ reference }: { reference: string }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reference);
      toast.success("Reference copied", { id: "copy-reference", description: reference });
    } catch {
      // Clipboard blocked (permissions, insecure context): say so, the number is on screen.
      toast.error("Couldn't copy automatically", { id: "copy-reference", description: "Select the reference and copy it." });
    }
  };

  return (
    <button
      className="inline-flex min-h-11 items-center rounded-lg border border-separator px-3 text-xs font-semibold uppercase tracking-wider text-foreground transition-colors hover:border-accent hover:text-accent"
      type="button"
      onClick={handleCopy}
    >
      Copy reference
    </button>
  );
};
