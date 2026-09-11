"use client";

import { Open_Sans } from "next/font/google";
import { useEffect, useRef } from "react";

import { LIVE_WORK_CARDS, WORK_CARDS } from "@/data/work-projects";
import { consumeLandingReturn, markLandingReturn } from "../reload-on-back";

import "./mirror-hall.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const MirrorHall = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const totalRef = useRef<HTMLSpanElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    const fromWork = consumeLandingReturn();
    if ((hash === "work" || fromWork) && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "instant", block: "start" });
    }
  }, []);

  useEffect(() => {
    const host = stageRef.current;
    const section = sectionRef.current;
    const focusName = nameRef.current;
    const focusNum = numRef.current;
    const focusTotal = totalRef.current;
    const dotsWrap = dotsRef.current;
    if (!host || !section || !focusName || !focusNum || !focusTotal || !dotsWrap) {
      return;
    }

    const dots = WORK_CARDS.map(() => {
      const i = document.createElement("i");
      dotsWrap.appendChild(i);
      return i;
    });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cancelled = false;
    let unmount: () => void = () => undefined;

    void import("./mount-hall").then(({ mountMirrorHall }) => {
      if (cancelled || !host.isConnected) return;
      unmount = mountMirrorHall(host, {
        cards: WORK_CARDS,
        reducedMotion,
        section,
        focusName,
        focusNum,
        focusTotal,
        dots,
        onNavigate: (href) => {
          markLandingReturn();
          window.location.href = href;
        },
      });
    });

    return () => {
      cancelled = true;
      unmount();
      dotsWrap.replaceChildren();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      aria-label="Work"
      className={`mirror-hall ${openSans.className}`}
    >
      <div ref={stageRef} className="mirror-hall__stage" />
      <div className="hud">
        <div className="vignette" aria-hidden />
        <div className="frame" aria-hidden />
        <div className="mast">
          <p className="kicker">
            Selected <b>work</b>
          </p>
          <h2>Mirror Hall</h2>
          <p className="sub">Drag to orbit · click a live project to enter</p>
        </div>
        <div className="focus">
          <div className="counter">
            <span ref={numRef} className="num">
              01
            </span>
            <i>/</i>
            <span ref={totalRef} className="total">
              08
            </span>
          </div>
          <div ref={nameRef} className="name">
            Egypt
          </div>
          <div ref={dotsRef} className="dots" aria-hidden />
        </div>
        <p className="hint">Drag</p>
      </div>
      <nav className="mirror-hall__sr" aria-label="Project pages">
        {LIVE_WORK_CARDS.map((card) => (
          <a key={card.id} href={card.href}>
            {card.title}
          </a>
        ))}
      </nav>
    </section>
  );
};
