import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";

import { cn } from "./cn";
import { controlClassName } from "./field";

export type InputProps = ComponentPropsWithoutRef<"input">;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...rest },
  ref,
) {
  return <input ref={ref} className={cn(controlClassName, className)} {...rest} />;
});

export type TextareaProps = ComponentPropsWithoutRef<"textarea">;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, rows = 4, ...rest },
  ref,
) {
  return <textarea ref={ref} rows={rows} className={cn(controlClassName, className)} {...rest} />;
});

export type SelectProps = ComponentPropsWithoutRef<"select">;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, children, ...rest },
  ref,
) {
  return (
    <select ref={ref} className={cn(controlClassName, className)} {...rest}>
      {children}
    </select>
  );
});

export type CheckboxProps = Omit<ComponentPropsWithoutRef<"input">, "type"> & {
  /** Visible label — the input is nested for native label association. */
  label: ReactNode;
};

/** Checkbox with nested-label association (no id plumbing needed). */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { className, label, ...rest },
  ref,
) {
  return (
    <label
      className={cn(
        "flex items-start gap-3 font-sans text-[length:var(--dvn-text-small-size)] text-ink",
        className,
      )}
    >
      <input
        ref={ref}
        type="checkbox"
        className="mt-0.5 size-4 accent-[var(--dvn-gold)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        {...rest}
      />
      <span>{label}</span>
    </label>
  );
});
