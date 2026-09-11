"use client";

/**
 * Hero — full-screen video, mouse-follow orange glow, decorative circle,
 * service labels, and the scrambling page title (index.html .hero).
 *
 * The glow follows the cursor with inertia + flame-like wobble (main.js). It
 * runs on the shared ticker and mutates `transform` directly — the gradient
 * itself is static (`.bg-glow-radial`), so each frame is compositor-only.
 * Glow + video pause while the hero is scrolled out of view.
 */

import { useEffect, useRef } from "react";

import { useLoop } from "@/hooks/animation/use-render-loop";
import { HeroContent } from "@/data/mocks/home";

import { usePreloader } from "./preloader-store";
import { ScrambleText } from "./scramble-text";

export interface HeroSectionProps {
  content: HeroContent;
}

/** main.js glow constants */
const FOLLOW = 0.08;
const FLARE_GAIN = 0.8;
const FLARE_MAX = 20;
const FLARE_EASE = 0.05;
const TIME_SCALE = 0.0015;
const GLOW_RADIUS_RATIO = 0.65;
const GLOW_FRAME_MS = 15;

export const HeroSection = ({ content }: HeroSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const phase = usePreloader((s) => s.phase);

  const mouse = useRef({ x: 50, y: 50 });
  const pos = useRef({ x: 50, y: 50 });
  const flare = useRef(0);
  const glowSize = useRef(0);
  const visible = useRef(true);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 100;
      mouse.current.y = (e.clientY / window.innerHeight) * 100;
    };
    document.addEventListener("mousemove", onMove);

    const sizeGlow = () => {
      const radius = Math.hypot(window.innerWidth, window.innerHeight) / 2;
      glowSize.current = Math.round(2 * GLOW_RADIUS_RATIO * radius);
      if (glowRef.current) {
        glowRef.current.style.width = `${glowSize.current}px`;
        glowRef.current.style.height = `${glowSize.current}px`;
      }
    };
    sizeGlow();
    window.addEventListener("resize", sizeGlow);

    return () => {
      document.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", sizeGlow);
    };
  }, []);

  // Glow + video are expensive full-screen layers — pause both off-screen.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
      const video = videoRef.current;
      if (!video) return;
      if (entry.isIntersecting) {
        if (video.paused) video.play().catch(() => undefined);
      } else if (!video.paused) {
        video.pause();
      }
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useLoop(
    () => {
      const glow = glowRef.current;
      if (!glow || !visible.current) return;

      const dx = mouse.current.x - pos.current.x;
      const dy = mouse.current.y - pos.current.y;
      pos.current.x += dx * FOLLOW;
      pos.current.y += dy * FOLLOW;

      const speed = Math.sqrt(dx * dx + dy * dy);
      const targetFlare = Math.min(speed * FLARE_GAIN, FLARE_MAX);
      flare.current += (targetFlare - flare.current) * FLARE_EASE;

      const time = Date.now() * TIME_SCALE;
      const breath = Math.sin(time) * 4;
      const wobbleX = Math.cos(time * 1.5) * 1.5;
      const wobbleY = Math.sin(time * 1.8) * 1.5;

      const size = glowSize.current;
      const px = ((pos.current.x + wobbleX) / 100) * window.innerWidth - size / 2;
      const py = ((pos.current.y + wobbleY) / 100) * window.innerHeight - size / 2;
      const pulse = (65 + breath * 1.5 + flare.current) / 65;
      glow.style.transform = `translate3d(${px}px, ${py}px, 0) scale(${pulse})`;
    },
    { framerate: GLOW_FRAME_MS },
  );

  return (
    <section
      ref={sectionRef}
      aria-label="Intro"
      className="relative h-lvh w-full overflow-hidden bg-background"
    >
      <video
        ref={videoRef}
        src={content.videoSrc}
        className="absolute inset-0 z-[1] size-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden
      />

      {/* mouse-follow glow — sized & moved imperatively each frame */}
      <div
        ref={glowRef}
        className="bg-glow-radial pointer-events-none absolute left-0 top-0 z-[2] blur-[1.875rem] mix-blend-screen will-change-transform"
        aria-hidden
      />

      {/* decorative fading circle — sits under the progressive blur */}
      <div className="pointer-events-none absolute left-0 top-1/2 z-[2] flex w-full -translate-y-1/2 items-start justify-center px-10">
        <div className="mask-circle-fade size-150 rounded-full border-2 border-foreground/90 md:size-200" />
      </div>

      {/* progressive blur over the lower 60% */}
      <div className="blur-fade-up pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-[60%]" />

      {/* black gradient hiding the video edge */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-[40vh] bg-linear-to-t from-background to-transparent" />

      {/* service labels */}
      <div className="pointer-events-none absolute left-0 top-1/2 z-[5] w-full -translate-y-1/2 px-10 text-foreground mix-blend-difference">
        <p className="grid w-full grid-cols-1 items-center gap-2 text-center text-lg md:grid-cols-[1fr_auto_1fr] md:gap-0 md:text-2xl">
          <span className="md:text-left">{content.infoLabels[0]}</span>
          <span className="md:text-center">{content.infoLabels[1]}</span>
          <span className="md:text-right">{content.infoLabels[2]}</span>
        </p>
      </div>

      {/* title block */}
      <div className="pointer-events-none absolute inset-0 z-[5] flex flex-col justify-between px-4 pb-30 pt-10 md:px-10 md:pb-47.5">
        <ScrambleText
          tag="h1"
          text={content.title}
          play={phase !== "loading"}
          simultaneous
          className="text-gradient-hero font-display w-full whitespace-nowrap text-center text-[1.8rem] font-[250] uppercase leading-[0.75] sm:text-[3.75rem] lg:text-hero"
        />
        <p className="text-hero-desc mx-auto max-w-162.5 translate-y-10 text-center tracking-[-0.01em] text-foreground md:translate-y-16">
          {content.description.split("\n").map((line, i, lines) => (
            <span key={i}>
              {line}
              {i < lines.length - 1 && <br />}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
};
