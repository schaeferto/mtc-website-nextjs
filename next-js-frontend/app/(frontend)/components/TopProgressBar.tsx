"use client";

import { useState, useEffect, useRef } from "react";

interface TopProgressBarProps {
  loading: boolean;
  /** Called once the completion animation has finished. Use this to reveal page content. */
  onDone?: () => void;
}

/**
 * Angular.dev-style top progress bar using MTC brand colors.
 *
 * Fills to ~75% while loading, snaps to 100%, then fades out.
 * Calls onDone when the animation is complete — use that to reveal content.
 *
 * Usage:
 *   const [ready, setReady] = useState(false);
 *   <TopProgressBar loading={loading} onDone={() => setReady(true)} />
 *   {ready && <YourContent />}
 */
export default function TopProgressBar({ loading, onDone }: TopProgressBarProps) {
  const [started, setStarted] = useState(false);
  const [barDone, setBarDone] = useState(false);

  // Keep a ref so the timeout closure always calls the latest onDone
  // without needing it in the effect's dependency array.
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  // Delay the initial width change by one frame so the CSS transition fires
  useEffect(() => {
    const raf = requestAnimationFrame(() => setStarted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // When loading finishes, complete the animation then call onDone
  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => {
        setBarDone(true);
        onDoneRef.current?.();
      }, 750); // matches width (0.35s) + opacity (0.3s + 0.35s delay)
      return () => clearTimeout(t);
    } else {
      setBarDone(false);
    }
  }, [loading]);

  if (barDone) return null;

  const width = loading ? (started ? "75%" : "0%") : "100%";
  const opacity = loading ? 1 : 0;
  const transition = loading
    ? "width 8s cubic-bezier(0.05, 0.05, 0.1, 1)"
    : "width 0.35s ease-out, opacity 0.3s ease 0.35s";

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] z-[9999]">
      <div
        style={{
          height: "100%",
          width,
          opacity,
          transition,
          background: "linear-gradient(to right, #FDE480, #F59E0B)",
          boxShadow: "0 0 8px #FDE480, 0 0 2px #F59E0B",
        }}
      />
    </div>
  );
}
