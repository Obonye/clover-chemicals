"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Reads ?division=medical (set on links into /contact from Clover Medical
// pages) and, if present, drops the same zero-footprint marker used by
// app/medical/layout.tsx — flipping --accent/--heading/font to the medical
// palette for this page load via the `body:has()` rule in globals.css.
const Marker = () => {
  const searchParams = useSearchParams();

  if (searchParams.get("division") !== "medical") return null;

  return <div className="contents" data-division="medical" />;
};

export const ContactDivisionMarker = () => (
  <Suspense fallback={null}>
    <Marker />
  </Suspense>
);
