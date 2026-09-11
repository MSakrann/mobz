import { create } from "zustand";

/**
 * Preloader lifecycle shared between the Preloader and the Hero (the hero h1
 * scramble starts the moment the preloader hole begins expanding — main.js
 * preloader sequence).
 *
 * `loading` → counting 0–100 · `revealing` → hole expanding, hero scramble
 * runs · `done` → preloader unmounted, scroll restored.
 */
export type PreloaderPhase = "loading" | "revealing" | "done";

interface PreloaderState {
  phase: PreloaderPhase;
  setPhase: (phase: PreloaderPhase) => void;
}

export const usePreloader = create<PreloaderState>((set) => ({
  phase: "loading",
  setPhase: (phase) => set({ phase }),
}));
