"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useScroll } from "@/hooks/smooth-scroll/use-scroll";
import { scrollTo } from "@/utils/scroll-to";
import { useShallow } from "zustand/react/shallow";

export const scrollSpeed = { current: 1 };

function prefersNativeScroll() {
  if (typeof window === "undefined") return false;
  return (
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(hover: none)").matches
  );
}

/** Safari ignores overscroll-behavior for pull-to-refresh; block it in every browser. */
function useBlockPullToRefresh() {
  useEffect(() => {
    let lastY = 0;
    const onStart = (event: TouchEvent) => {
      lastY = event.touches[0]?.clientY ?? 0;
    };
    const onMove = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      const y = event.touches[0].clientY;
      const pullingDown = y > lastY;
      lastY = y;
      const top =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      if (top <= 0 && pullingDown) event.preventDefault();
    };
    document.addEventListener("touchstart", onStart, { passive: true });
    document.addEventListener("touchmove", onMove, { capture: true, passive: false });
    return () => {
      document.removeEventListener("touchstart", onStart);
      document.removeEventListener("touchmove", onMove, { capture: true });
    };
  }, []);
}

export function ScrollLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="scroll-layout">
      <div className="scroll-layout-content">{children}</div>
      <ScrollController />
    </div>
  );
}

function ScrollController() {
  useBlockPullToRefresh();
  const isEnableScroll = useScroll((state) => state.isEnableScroll);
  const [hash, setHash] = useState<string>("");
  const [lenis, setLenis] = useScroll(
    useShallow((state) => [state.lenis, state.setLenis]),
  );
  const pathname = usePathname();
  const savedPathname = useRef("");

  useEffect(() => {
    if (prefersNativeScroll()) return;

    const instance = new Lenis({
      smoothWheel: true,
    });
    (window as typeof window & { lenis: Lenis }).lenis = instance;
    setLenis(instance);

    let rafId = 0;
    const raf = (time: number) => {
      instance.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      instance.destroy();
      setLenis(null);
    };
  }, [setLenis]);

  useEffect(() => {
    if (isEnableScroll) {
      enableNativeScroll(true);
      lenis?.resize();
      lenis?.start();
    } else {
      lenis?.stop();
      enableNativeScroll(false);
    }
  }, [isEnableScroll, lenis]);

  useEffect(() => {
    if (lenis && hash) {
      setTimeout(() => {
        scrollTo(hash, true);
      }, 300);
    }
  }, [lenis, hash]);

  useEffect(() => {
    const fromUrl = window.location.hash.replace(/^#/, "");
    if (fromUrl) setHash(fromUrl);
  }, []);

  useEffect(() => {
    if (savedPathname.current !== pathname) {
      savedPathname.current = pathname;
      const fromPath = pathname.includes("#") ? pathname.split("#").pop() : "";
      const fromUrl = window.location.hash.replace(/^#/, "");
      const next = fromPath || fromUrl;
      if (next) setHash(next);
    }
  }, [pathname]);

  return null;
}

const enableNativeScroll = (value: boolean) => {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  const body = document.body;
  if (!value) {
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
  } else {
    html.style.removeProperty("overflow");
    body.style.removeProperty("overflow");
  }
};
