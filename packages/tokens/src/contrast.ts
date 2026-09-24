/** WCAG 2.x contrast math used to validate token pairs (DSN-1 acceptance). */

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const value = hex.replace(/^#/, "");
  if (!/^[0-9a-fA-F]{6}$/.test(value)) {
    throw new Error(`Invalid hex color: ${hex}`);
  }
  const int = Number.parseInt(value, 16);
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}

export function luminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const linear = (channel: number) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

export function contrastRatio(fgHex: string, bgHex: string): number {
  const lighter = Math.max(luminance(fgHex), luminance(bgHex));
  const darker = Math.min(luminance(fgHex), luminance(bgHex));
  return (lighter + 0.05) / (darker + 0.05);
}

/** Ratios are compared at two decimals, matching how designers read checkers. */
export function meetsWcag(fgHex: string, bgHex: string, minimum: 3 | 4.5 | 7): boolean {
  return Math.round(contrastRatio(fgHex, bgHex) * 100) / 100 >= minimum;
}
