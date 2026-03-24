"use client";
import { useEffect, useState } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

export default function InteractiveBackground() {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Create radial gradient using motion templates
  const background = useMotionTemplate`radial-gradient(
    800px circle at ${mouseX}px ${mouseY}px,
    rgba(16, 185, 129, 0.15),
    transparent 80%
  )`;

  return (
    <div className="fixed inset-0 -z-10 bg-slate-950 overflow-hidden">
      {/* Fallback color/gradient if video doesn't load immediately */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#0a0f1c] to-slate-950" />

      {/* 4K Background Video */}
      {/* Assuming the user will place "legado_comet_bg.mp4" in public/assets/ */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        src="/assets/legado_comet_bg.mp4"
      />

      {/* Depth Overlay (Glassmorphism frost on the video itself) */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[3px]" />

      {/* Mouse Tracking Radial Glow (Emerald + subtle Amber mix) */}
      {mounted && (
        <motion.div
          className="absolute inset-0 pointer-events-none mix-blend-screen"
          style={{ background }}
        />
      )}

      {/* Static ambient glow to ensure it doesn't look totally dark without mouse */}
      <div className="absolute top-1/2 left-1/4 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2 opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
}
