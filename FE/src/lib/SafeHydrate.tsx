// components/SafeHydrate.tsx
"use client";

import React from "react";

export default function SafeHydrate({
  children,
}: {
  children: React.ReactNode;
}) {
  if (typeof window === "undefined") return null;
  return <>{children}</>;
}
