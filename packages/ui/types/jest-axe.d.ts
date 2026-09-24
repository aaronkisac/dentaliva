// jest-axe v11 ships no type declarations; minimal surface we use.
// (Ambient module declaration — this file must stay import-free.)
declare module "jest-axe" {
  export interface AxeResults {
    violations: Array<{ id: string; impact: string | null; nodes: unknown[] }>;
    passes: unknown[];
    incomplete: unknown[];
  }
  export function axe(html: HTMLElement, options?: Record<string, unknown>): Promise<AxeResults>;
  export const toHaveNoViolations: object;
}
