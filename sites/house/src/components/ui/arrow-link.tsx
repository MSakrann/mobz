// 📖 Docs: obsidian/frontend/components/ui.md

import { CornerArrowIcon } from "@house/components/ui/icons";

export interface ArrowLinkProps {
  href: string;
  label: string;
  /** `plain` floats on the scene; `glass` is the frosted button in the footer. */
  variant?: "plain" | "glass";
  className?: string;
}

const VARIANT = {
  plain: "hover:opacity-80 hover:translate-y-0.5",
  glass:
    "rounded-sm border border-foreground/8 bg-surface-glass/75 px-7 py-3.5 backdrop-blur-xl hover:-translate-y-0.5 hover:border-foreground/22 hover:bg-surface-glass-raised/95",
} as const;

const isExternal = (href: string) => /^https?:\/\//.test(href);

/**
 * The tracked-caps link with the corner arrow ("Get a quote", "Contact"). A few
 * px of nudge and a colour change on hover — the narrow CSS-transition case
 * (ADR-0014), token-timed.
 */
export const ArrowLink = ({
  href,
  label,
  variant = "plain",
  className = "",
}: ArrowLinkProps) => (
  <a
    href={href}
    {...(isExternal(href) ? { target: "_blank", rel: "noopener" } : {})}
    className={`group inline-flex w-fit items-center gap-3 text-foreground transition-[opacity,translate,background-color,border-color] duration-[var(--duration-normal)] ease-glide focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-foreground ${VARIANT[variant]} ${className}`}
  >
    <CornerArrowIcon className="size-4.5 transition-transform duration-[var(--duration-normal)] ease-glide group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
    <span className="text-caption leading-display tracking-caps uppercase">
      {label}
    </span>
  </a>
);
