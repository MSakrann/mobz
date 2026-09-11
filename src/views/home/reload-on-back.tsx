"use client";

import { useEffect } from "react";

const SKIP_PRELOADER = "mobz-skip-preloader";
const PRELOADER_DONE = "mobz-preloader-done";
export const RESTORE_HALL_EVENT = "mobz-restore-hall";

let returnedThisLoad = false;

export function markLandingReturn() {
  sessionStorage.setItem(SKIP_PRELOADER, "1");
}

export function markPreloaderDone() {
  sessionStorage.setItem(PRELOADER_DONE, "1");
}

export function consumeLandingReturn() {
  if (typeof window === "undefined") return false;
  if (returnedThisLoad) return true;
  if (sessionStorage.getItem(SKIP_PRELOADER) !== "1") return false;
  sessionStorage.removeItem(SKIP_PRELOADER);
  returnedThisLoad = true;
  return true;
}

export function shouldSkipPreloader() {
  if (typeof window === "undefined") return false;
  return consumeLandingReturn() || sessionStorage.getItem(PRELOADER_DONE) === "1";
}

/**
 * Back-forward cache can restore a dead WebGL context. Remount the hall in
 * place — never navigate or reload, or the preloader will play again.
 */
export const ReloadOnBack = () => {
  useEffect(() => {
    const restoreHall = () => {
      window.dispatchEvent(new Event(RESTORE_HALL_EVENT));
    };
    const onPageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      restoreHall();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return null;
};
