// 📖 Docs: obsidian/frontend/components/ui.md

export interface GridLinesProps {
  className?: string;
}

const COLUMNS = [0, 1, 2, 3] as const;

/**
 * The five hairlines that rule the scene and the footer. Drawn as the borders
 * of a four-column grid rather than five free-floating lines, so anything laid
 * out on the same `grid-cols-4` inset lands on a line by construction — the
 * footer's CTA and links sit "20px right of line one / line four" this way.
 */
export const GridLines = ({ className = "" }: GridLinesProps) => (
  <div
    aria-hidden
    className={`pointer-events-none absolute inset-x-8 inset-y-0 grid grid-cols-4 ${className}`}
  >
    {COLUMNS.map((column) => (
      <span
        key={column}
        className="border-l border-foreground/30 last:border-r"
      />
    ))}
  </div>
);
