import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors";
  const styles =
    variant === "primary"
      ? "bg-[var(--brand)] text-white border-[var(--brand-border)] hover:bg-[var(--brand-hover)]"
      : "bg-white text-[var(--text-secondary)] border-[var(--border)] hover:bg-zinc-50";
  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Card({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <section className="ui-card p-6">
      {title ? <h3 className="ui-heading mb-4 text-2xl">{title}</h3> : null}
      {children}
    </section>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return (
    <input
      {...rest}
      className={`w-full rounded-lg border-2 border-zinc-300 bg-white px-4 py-3 font-sans text-base text-[var(--text-primary)] outline-none transition-colors placeholder:text-zinc-400 focus:border-[var(--brand)] focus:ring-2 focus:ring-[color:rgba(122,143,106,0.2)] ${className}`}
    />
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = "", ...rest } = props;
  return (
    <textarea
      {...rest}
      className={`w-full rounded-lg border-2 border-zinc-300 bg-white px-4 py-3 font-sans text-base text-[var(--text-primary)] outline-none transition-colors placeholder:text-zinc-400 focus:border-[var(--brand)] focus:ring-2 focus:ring-[color:rgba(122,143,106,0.2)] ${className}`}
    />
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex rounded-full bg-zinc-200 px-3 py-1 font-sans text-sm text-zinc-700">
      {children}
    </span>
  );
}
