import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function AnimatedFrame({ children, className = '' }) {
  const ref = useRef(null);
  
  // Track the scroll progress of this specific image container
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Hardware-accelerated transforms for 0 performance impact
  // scaleX/scaleY stretches the lines
  // x/y offsets shift them slightly for a parallax feel
  const scaleGrow = useTransform(scrollYProgress, [0, 1], [0.85, 1.15]);
  const scaleShrink = useTransform(scrollYProgress, [0, 1], [1.15, 0.85]);
  
  const shiftUp = useTransform(scrollYProgress, [0, 1], [15, -15]);
  const shiftDown = useTransform(scrollYProgress, [0, 1], [-15, 15]);
  const shiftLeft = useTransform(scrollYProgress, [0, 1], [15, -15]);
  const shiftRight = useTransform(scrollYProgress, [0, 1], [-15, 15]);

  return (
    <div ref={ref} className={`relative p-3 md:p-5 ${className}`}>
      
      {/* 
        FRAME LINES 
        We use hardware-accelerated transforms (scale, x, y) 
        so it doesn't trigger layout repaints. 
      */}

      {/* --- TOP BORDER LINES --- */}
      {/* Main Top Horizontal (Extends left to right, moves right) */}
      <motion.div 
        style={{ scaleX: scaleGrow, x: shiftRight }} 
        className="absolute top-2 left-[-10px] right-[-10px] h-[1px] bg-accent/40 origin-left z-0" 
      />
      {/* Secondary Top Accent (Short, moves left) */}
      <motion.div 
        style={{ scaleX: scaleShrink, x: shiftLeft }} 
        className="absolute top-0 right-4 w-[40%] h-[1px] bg-accent/30 origin-right z-0" 
      />

      {/* --- BOTTOM BORDER LINES --- */}
      {/* Main Bottom Horizontal (Extends left to right, moves left) */}
      <motion.div 
        style={{ scaleX: scaleGrow, x: shiftLeft }} 
        className="absolute bottom-2 left-[-10px] right-[-10px] h-[1px] bg-accent/40 origin-right z-0" 
      />
      {/* Secondary Bottom Accent (Short, moves right) */}
      <motion.div 
        style={{ scaleX: scaleShrink, x: shiftRight }} 
        className="absolute bottom-0 left-4 w-[40%] h-[1px] bg-accent/30 origin-left z-0" 
      />

      {/* --- LEFT BORDER LINES --- */}
      {/* Main Left Vertical (Extends top to bottom, moves down) */}
      <motion.div 
        style={{ scaleY: scaleGrow, y: shiftDown }} 
        className="absolute left-2 top-[-10px] bottom-[-10px] w-[1px] bg-accent/40 origin-top z-0" 
      />
      {/* Secondary Left Accent (Short, moves up) */}
      <motion.div 
        style={{ scaleY: scaleShrink, y: shiftUp }} 
        className="absolute left-0 bottom-4 h-[40%] w-[1px] bg-accent/30 origin-bottom z-0" 
      />

      {/* --- RIGHT BORDER LINES --- */}
      {/* Main Right Vertical (Extends top to bottom, moves up) */}
      <motion.div 
        style={{ scaleY: scaleGrow, y: shiftUp }} 
        className="absolute right-2 top-[-10px] bottom-[-10px] w-[1px] bg-accent/40 origin-bottom z-0" 
      />
      {/* Secondary Right Accent (Short, moves down) */}
      <motion.div 
        style={{ scaleY: scaleShrink, y: shiftDown }} 
        className="absolute right-0 top-4 h-[40%] w-[1px] bg-accent/30 origin-top z-0" 
      />

      {/* INNER CONTENT (The Image) */}
      <div className="relative z-10 w-full h-full rounded-sm overflow-hidden shadow-2xl border border-white/5">
        {children}
      </div>
      
    </div>
  );
}
