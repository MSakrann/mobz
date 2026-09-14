import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  prefersLowPowerGpu,
  prefersNativeScroll,
  shouldPreventOverscrollReload,
  shouldStartHeavyMedia,
  type RuntimeEnv,
} from "./landing-runtime.ts";

const MAC_CHROME: RuntimeEnv = {
  maxTouchPoints: 0,
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
  platform: "MacIntel",
  pointerCoarse: false,
  hoverNone: false,
  devicePixelRatio: 2,
};

const MAC_SAFARI: RuntimeEnv = {
  maxTouchPoints: 0,
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Safari/605.1.15",
  platform: "MacIntel",
  pointerCoarse: false,
  hoverNone: false,
  devicePixelRatio: 2,
};

const WIN_FIREFOX: RuntimeEnv = {
  maxTouchPoints: 0,
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0",
  platform: "Win32",
  pointerCoarse: false,
  hoverNone: false,
  devicePixelRatio: 1,
};

const IPHONE: RuntimeEnv = {
  maxTouchPoints: 5,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  platform: "iPhone",
  pointerCoarse: true,
  hoverNone: true,
  devicePixelRatio: 3,
};

describe("prefersNativeScroll", () => {
  it("keeps native scrolling on touch phones", () => {
    assert.equal(prefersNativeScroll(IPHONE), true);
  });

  it("uses native scrolling on MacBook Chrome so Lenis cannot reload the landing", () => {
    assert.equal(prefersNativeScroll(MAC_CHROME), true);
  });

  it("uses native scrolling on MacBook Safari so Lenis cannot reload the landing", () => {
    assert.equal(prefersNativeScroll(MAC_SAFARI), true);
  });

  it("still allows Lenis on desktop Firefox with a mouse", () => {
    assert.equal(prefersNativeScroll(WIN_FIREFOX), false);
  });
});

describe("prefersLowPowerGpu", () => {
  it("uses the low-power hall on touch devices", () => {
    assert.equal(prefersLowPowerGpu(IPHONE), true);
  });

  it("uses the low-power hall on MacBook Chrome to avoid GPU-process reloads", () => {
    assert.equal(prefersLowPowerGpu(MAC_CHROME), true);
  });

  it("uses the low-power hall on MacBook Safari to avoid GPU-process reloads", () => {
    assert.equal(prefersLowPowerGpu(MAC_SAFARI), true);
  });
});

describe("shouldStartHeavyMedia", () => {
  it("does not start video-adjacent WebGL during the preloader count", () => {
    assert.equal(shouldStartHeavyMedia("loading"), false);
  });

  it("waits until the preloader is gone before mounting the hall and lava", () => {
    assert.equal(shouldStartHeavyMedia("revealing"), false);
    assert.equal(shouldStartHeavyMedia("done"), true);
  });
});

describe("shouldPreventOverscrollReload", () => {
  it("blocks a pull-up gesture at the top of the page", () => {
    assert.equal(shouldPreventOverscrollReload(0, -40), true);
  });

  it("does not block scrolling down or scrolling mid-page", () => {
    assert.equal(shouldPreventOverscrollReload(0, 40), false);
    assert.equal(shouldPreventOverscrollReload(120, -40), false);
  });
});
