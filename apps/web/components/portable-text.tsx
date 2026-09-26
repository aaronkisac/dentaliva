import type { ReactNode } from "react";

import type { PortableBlock } from "../src/content/blog";

function renderChildren(block: PortableBlock): ReactNode {
  const markDefs = block.markDefs ?? [];
  return (block.children ?? []).map((child) => {
    let node: ReactNode = child.text ?? "";
    for (const mark of child.marks ?? []) {
      if (mark === "strong") {
        node = <strong key={`s-${child._key}-${mark}`}>{node}</strong>;
      } else if (mark === "em") {
        node = <em key={`e-${child._key}-${mark}`}>{node}</em>;
      } else {
        const def = markDefs.find((def) => def._key === mark);
        if (def?._type === "link" && def.href) {
          node = (
            <a key={`l-${child._key}-${mark}`} href={def.href} className="text-navy underline">
              {node}
            </a>
          );
        }
      }
    }
    return <span key={child._key}>{node}</span>;
  });
}

/** Minimal portable-text renderer for the blog schema (normal/h2/h3 + links). */
export function PortableText({ blocks }: { blocks?: PortableBlock[] }) {
  if (!blocks || blocks.length === 0) return null;
  return (
    <div className="max-w-3xl space-y-5">
      {blocks.map((block) => {
        if (block._type !== "block") return null;
        if (block.style === "h2") {
          return (
            <h2
              key={block._key}
              className="font-serif text-[length:var(--dvn-text-display-md-size)] text-navy"
            >
              {renderChildren(block)}
            </h2>
          );
        }
        if (block.style === "h3") {
          return (
            <h3
              key={block._key}
              className="font-serif text-[length:var(--dvn-text-title-size)] text-navy"
            >
              {renderChildren(block)}
            </h3>
          );
        }
        return (
          <p key={block._key} className="leading-[var(--dvn-text-body-lh)] text-ink">
            {renderChildren(block)}
          </p>
        );
      })}
    </div>
  );
}
