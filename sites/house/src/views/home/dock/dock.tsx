"use client";

import { useEffect, useState } from "react";

import { Spring } from "@house/components/animation/springs/spring";
import { CloseIcon, LogoMark, MenuIcon } from "@house/components/ui/icons";
import type { DockContent } from "@house/data/mocks/home";
import { useSceneStore } from "@house/hooks/scene/use-scene-store";
import { DOCK_TOGGLE } from "@house/lib/springs/presets";

export interface DockProps {
  content: DockContent;
}

const MENU_ID = "dock-menu";

/**
 * The floating glass bar held at the bottom of every screen until the footer
 * starts to show. The source's menu button opened nothing; here it opens the
 * page's section links, so the one control in the bar does what it says.
 */
export const Dock = ({ content }: DockProps) => {
  const hidden = useSceneStore((state) => state.dockHidden);
  const [open, setOpen] = useState(false);
  const menuOpen = open && !hidden;

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-10 z-100 flex justify-center max-md:bottom-6">
      <Spring
        tag="nav"
        aria-label={content.navLabel}
        enabled={hidden}
        from={{ opacity: 1, y: 0 }}
        to={{ opacity: 0, y: 40 }}
        config={DOCK_TOGGLE}
        inert={hidden}
        className={`relative ${hidden ? "" : "pointer-events-auto"}`}
      >
        <Spring
          tag="ul"
          id={MENU_ID}
          enabled={menuOpen}
          from={{ opacity: 0, y: 12 }}
          to={{ opacity: 1, y: 0 }}
          config={DOCK_TOGGLE}
          inert={!menuOpen}
          className={`absolute inset-x-0 bottom-full mb-2 flex flex-col gap-3 border border-foreground/10 bg-surface-glass/85 p-5 backdrop-blur-2xl ${menuOpen ? "" : "pointer-events-none"}`}
        >
          {content.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-lead font-medium uppercase tracking-copy transition-opacity duration-[var(--duration-fast)] ease-glide hover:opacity-70 focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
        </Spring>

        <div className="flex h-16 w-90 items-center justify-between border border-foreground/10 bg-surface-glass/85 px-5 backdrop-blur-2xl transition-[background-color,border-color,translate] duration-[var(--duration-normal)] ease-glide hover:-translate-y-0.5 hover:border-foreground/22 hover:bg-surface-glass-raised/95 max-sm:w-70">
          <a
            href={content.links[0]?.href ?? "#top"}
            aria-label={content.homeLabel}
            className="transition-opacity duration-[var(--duration-fast)] ease-glide hover:opacity-80 focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-foreground"
          >
            <LogoMark className="size-6.5" />
          </a>
          <span className="text-caption uppercase leading-display tracking-caps-wide">
            {content.title}
          </span>
          <button
            type="button"
            aria-label={menuOpen ? content.closeLabel : content.openLabel}
            aria-expanded={menuOpen}
            aria-controls={MENU_ID}
            onClick={() => setOpen((current) => !current)}
            className="transition-opacity duration-[var(--duration-fast)] ease-glide hover:opacity-80 focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-foreground"
          >
            {menuOpen ? <CloseIcon className="size-5.5" /> : <MenuIcon className="size-5.5" />}
          </button>
        </div>
      </Spring>
    </div>
  );
};
