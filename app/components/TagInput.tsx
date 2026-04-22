"use client";

import { type KeyboardEvent, useCallback, useState } from "react";

type TagInputProps = {
  label: string;
  description?: string;
  values: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
};

function normalizeToken(raw: string) {
  return raw.trim().replace(/^,+|,+$/g, "");
}

export function TagInput({ label, description, values, onChange, placeholder }: TagInputProps) {
  const [draft, setDraft] = useState("");

  const commitDraft = useCallback(() => {
    const token = normalizeToken(draft);
    if (!token) {
      setDraft("");
      return;
    }
    if (!values.includes(token)) {
      onChange([...values, token]);
    }
    setDraft("");
  }, [draft, onChange, values]);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commitDraft();
    } else if (e.key === "Backspace" && draft === "" && values.length > 0) {
      onChange(values.slice(0, -1));
    }
  };

  return (
    <div className="space-y-2">
      <div>
        <span className="ui-label">{label}</span>
        {description ? (
          <p className="mt-1 font-sans text-xs text-[var(--text-tertiary)]">{description}</p>
        ) : null}
      </div>
      <div className="min-h-[52px] rounded-xl border-2 border-[color-mix(in_srgb,var(--border)_85%,var(--brand)_15%)] bg-white px-3 py-2 focus-within:border-[var(--brand)] focus-within:ring-2 focus-within:ring-[color:rgba(122,143,106,0.18)]">
        <div className="mb-2 flex flex-wrap gap-2">
          {values.map((tag) => (
            <button
              key={tag}
              type="button"
              className="group inline-flex items-center gap-1 rounded-full border border-transparent bg-[color-mix(in_srgb,var(--brand)_12%,white)] px-3 py-1 font-sans text-xs font-medium text-[var(--text-primary)] outline-none ring-[var(--brand)] transition hover:border-[var(--brand-border)] focus-visible:ring-2"
              onClick={() => onChange(values.filter((v) => v !== tag))}
              aria-label={`Remove ${tag}`}
            >
              {tag}
              <span className="text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]">
                ×
              </span>
            </button>
          ))}
        </div>
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={commitDraft}
          placeholder={placeholder}
          className="w-full border-0 bg-transparent font-sans text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)]"
        />
      </div>
    </div>
  );
}
