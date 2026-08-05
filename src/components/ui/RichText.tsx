import { Fragment, type ReactNode } from "react";

/**
 * Renders `[label](href)` spans inside otherwise plain text.
 *
 * Deliberately this small: the CMS edits raw strings in a textarea and inline
 * on the page, so the markup has to survive a round trip through a plain
 * `textContent`. A markdown parser would be heavier and would let block-level
 * syntax leak into a paragraph.
 */
const LINK = /\[([^\]\n]+)\]\(([^)\s]+)\)/g;

function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}

export function renderRichText(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let cursor = 0;

  // `matchAll` needs the /g flag, which carries lastIndex — build a fresh
  // regex per call so concurrent renders can't interfere.
  for (const match of text.matchAll(new RegExp(LINK.source, "g"))) {
    const [full, label, href] = match;
    const start = match.index ?? 0;

    if (start > cursor) nodes.push(text.slice(cursor, start));

    nodes.push(
      <a
        key={`${start}-${href}`}
        href={href}
        target={isExternal(href) ? "_blank" : undefined}
        rel={isExternal(href) ? "noopener noreferrer" : undefined}
        className="prose-link"
      >
        {label}
      </a>,
    );

    cursor = start + full.length;
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

export interface RichTextProps {
  value: string;
  className?: string;
  as?: "p" | "span" | "div";
}

export function RichText({ value, className, as: Tag = "p" }: RichTextProps) {
  return (
    <Tag className={className}>
      {renderRichText(value).map((node, index) => (
        <Fragment key={index}>{node}</Fragment>
      ))}
    </Tag>
  );
}
