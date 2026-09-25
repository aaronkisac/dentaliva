import type { ReactNode } from "react";

import { cn } from "./cn";

/** Shared control chrome: ivory surface, gold focus ring, error state. */
export const controlClassName =
  "w-full border border-[var(--dvn-line-soft)] bg-white px-4 py-3 font-sans text-[length:var(--dvn-text-body-size)] text-ink placeholder:text-muted focus:border-gold focus:outline-2 focus:outline-offset-0 focus:outline-gold aria-[invalid=true]:border-red-600";

export interface FieldRenderProps {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  required?: boolean;
}

export type FieldProps = {
  /** Control id — also anchors label/describedby wiring. */
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  /** Renders the control, receiving its computed aria attributes. */
  children: (aria: FieldRenderProps) => ReactNode;
  className?: string;
};

/**
 * Label + control + hint/error with full aria wiring: the control receives
 * id, aria-describedby (hint + error, when present) and aria-invalid.
 */
export function Field({
  id,
  label,
  error,
  hint,
  required = false,
  children,
  className,
}: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("font-sans", className)}>
      <label
        htmlFor={id}
        className="mb-1 block text-[length:var(--dvn-text-small-size)] font-semibold text-navy"
      >
        {label}
        {required ? (
          <span aria-hidden="true" className="text-gold-deep">
            {" "}
            *
          </span>
        ) : null}
      </label>
      {hint ? (
        <p id={hintId} className="mb-1 text-[length:var(--dvn-text-micro-size)] text-muted">
          {hint}
        </p>
      ) : null}
      {children({
        id,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
        required,
      })}
      {error ? <FieldError id={errorId ?? ""} message={error} /> : null}
    </div>
  );
}

export type FieldErrorProps = { id: string; message: string };

/** Inline validation message, announced via role=alert. */
export function FieldError({ id, message }: FieldErrorProps) {
  return (
    <p
      id={id}
      role="alert"
      className="mt-1 text-[length:var(--dvn-text-small-size)] font-medium text-red-600"
    >
      {message}
    </p>
  );
}
