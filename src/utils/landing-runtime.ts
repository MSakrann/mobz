/**
 * Runtime checks that decide whether the studio landing may use Lenis / full
 * WebGL. Touch browsers already take the native-scroll, low-power path because
 * Lenis + overscroll and two high-performance canvases remount the document
 * (see 5c83ac5, 1cf144f, d12f980). Chrome and Safari on a laptop still hit
 * the same loop: trackpad overscroll fights Lenis, and a retina
 * high-performance hall can crash the GPU process and reload the tab.
 */

export type PreloaderPhase = "loading" | "revealing" | "done";

export interface RuntimeEnv {
  maxTouchPoints: number;
  userAgent: string;
  platform?: string;
  pointerCoarse: boolean;
  hoverNone: boolean;
  devicePixelRatio?: number;
}

export function readRuntimeEnv(
  win: Pick<Window, "navigator" | "matchMedia" | "devicePixelRatio">,
): RuntimeEnv {
  return {
    maxTouchPoints: win.navigator.maxTouchPoints,
    userAgent: win.navigator.userAgent,
    platform: win.navigator.platform,
    pointerCoarse: win.matchMedia("(pointer: coarse)").matches,
    hoverNone: win.matchMedia("(hover: none)").matches,
    devicePixelRatio: win.devicePixelRatio,
  };
}

export function readRuntimeEnvFromWindow(): RuntimeEnv | null {
  if (typeof window === "undefined") return null;
  return readRuntimeEnv(window);
}

function isMac(env: RuntimeEnv): boolean {
  return /Mac/.test(env.platform ?? "") || /Mac OS X/.test(env.userAgent);
}

function isSafari(userAgent: string): boolean {
  return (
    /Safari/.test(userAgent) &&
    !/Chrome|Chromium|CriOS|Edg|OPR|Firefox|FxiOS/.test(userAgent)
  );
}

function isChromeFamily(userAgent: string): boolean {
  return /Chrome|CriOS|Edg|OPR/.test(userAgent);
}

export function prefersNativeScroll(env: RuntimeEnv): boolean {
  if (env.maxTouchPoints > 0 || env.pointerCoarse || env.hoverNone) return true;
  if (isMac(env)) return true;
  return isSafari(env.userAgent) || isChromeFamily(env.userAgent);
}

export function prefersLowPowerGpu(env: RuntimeEnv): boolean {
  if (env.pointerCoarse) return true;
  if (isMac(env)) return true;
  return isSafari(env.userAgent) || isChromeFamily(env.userAgent);
}

export function shouldStartHeavyMedia(phase: PreloaderPhase): boolean {
  return phase === "done";
}

export function shouldPreventOverscrollReload(
  scrollTop: number,
  deltaY: number,
): boolean {
  return scrollTop <= 0 && deltaY < 0;
}
