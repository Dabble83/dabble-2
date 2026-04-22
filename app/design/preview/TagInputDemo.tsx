"use client";

import { useState } from "react";
import { TagInput } from "@/app/components/TagInput";

export function TagInputDemo() {
  const [values, setValues] = useState<string[]>(["Sourdough", "Mending"]);
  return (
    <TagInput
      label="Tag input"
      description="Phase 2 — chip entry for offers and wants."
      values={values}
      onChange={setValues}
      placeholder="Type and press Enter"
    />
  );
}
