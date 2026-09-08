"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Two mirrored staircase traces, each spanning the full width of the
// section (viewBox is 0-100 on both axes, stretched to fill — so
// coordinates are just percentages) with rounded 90° turns.
const PATH_A =
  "M0,2 L32,2 Q35,2 35,5 L35,9 Q35,12 38,12 L62,12 Q65,12 65,15 L65,19 Q65,22 68,22 L100,22";
const PATH_B =
  "M100,98 L68,98 Q65,98 65,95 L65,91 Q65,88 62,88 L38,88 Q35,88 35,85 L35,81 Q35,78 32,78 L0,78";

export const MedicalQuote = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const pathA = useRef<SVGPathElement>(null);
  const pathB = useRef<SVGPathElement>(null);

  useGSAP(
    () => {
      const paths = [pathA.current, pathB.current].filter(
        (p): p is SVGPathElement => p !== null,
      );

      paths.forEach((path) => {
        const length = path.getTotalLength();

        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      });

      gsap.to(paths, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "top 20%",
          scrub: 1,
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-background">
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <path
          ref={pathA}
          className="stroke-medical/50"
          d={PATH_A}
          strokeLinecap="round"
          strokeWidth={0.3}
        />
        <path
          ref={pathB}
          className="stroke-medical/50"
          d={PATH_B}
          strokeLinecap="round"
          strokeWidth={0.3}
        />
      </svg>

      <div className="mx-auto max-w-[820px] px-6 py-24 text-center lg:py-32">
        <svg aria-hidden="true" className="mx-auto mb-6 h-10 w-10 text-medical" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7.5 8C5 8 3 10 3 12.5S5 17 7.5 17c.4 0 .8 0 1.1-.1C8 18.5 6.8 20 5 20.8l.7 1.7C9.6 21 11 17.8 11 14.5V12c0-2.2-1.5-4-3.5-4zM17.5 8C15 8 13 10 13 12.5S15 17 17.5 17c.4 0 .8 0 1.1-.1C18 18.5 16.8 20 15 20.8l.7 1.7C19.6 21 21 17.8 21 14.5V12c0-2.2-1.5-4-3.5-4z" />
        </svg>
        <p className="font-display text-2xl font-medium leading-[1.35] tracking-tight text-heading md:text-3xl lg:text-4xl">
          We are dedicated to elevating healthcare delivery, academic
          excellence, and scientific innovation across the nation by
          supplying world-class medical technology, sophisticated
          laboratory instrumentation, high-purity reagents, and premium
          surgical solutions — supporting public and private hospitals,
          diagnostic imaging hubs, medical clinics, and premier national
          research and academic institutions.
        </p>
      </div>
    </section>
  );
};
