"use client";

const SKIP_PRELOADER = "mobz-skip-preloader";
const PRELOADER_DONE = "mobz-preloader-done";

let returnedThisLoad = false;

export function markLandingReturn() {
  sessionStorage.setItem(SKIP_PRELOADER, "1");
  localStorage.setItem(PRELOADER_DONE, "1");
}

export function markPreloaderDone() {
  sessionStorage.setItem(PRELOADER_DONE, "1");
  localStorage.setItem(PRELOADER_DONE, "1");
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
  return (
    consumeLandingReturn() ||
    sessionStorage.getItem(PRELOADER_DONE) === "1" ||
    localStorage.getItem(PRELOADER_DONE) === "1"
  );
}
