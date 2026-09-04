import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function AnimatedFrame({ 
  children, 
  className = '', 
  scrollTarget = null 
}) {
  const localRef = useRef(null);
  const targetRef = scrollTarget || localRef;
  
  // Track scroll progress of the entire section if scrollTarget is provided
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  });

  // Colors: Platinum/Silver
  const colorMain = "bg-[#E5E4E2]/60";
  const colorAccent = "bg-[#E5E4E2]/30";

  // Hardware-accelerated transforms
  const scaleGrow = useTransform(scrollYProgress, [0, 1], [0.8, 1.2]);
  const scaleShrink = useTransform(scrollYProgress, [0, 1], [1.2, 0.8]);
  
  const shiftUp = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const shiftDown = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const shiftLeft = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const shiftRight = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  return (
    <div ref={localRef} className={`relative p-3 md:p-5 ${className}`}>
      
      {/* --- LINHAS HORIZONTAIS --- */}
      {/* Topo Principal */}
      <motion.div 
        style={{ scaleX: scaleGrow, x: shiftRight }} 
        className={`absolute top-2 left-[5%] right-[-25px] h-[1px] ${colorMain} origin-left z-0 pointer-events-none`}
      />
      {/* Topo Secundário */}
      <motion.div 
        style={{ scaleX: scaleShrink, x: shiftLeft }} 
        className={`absolute top-[-4px] left-[-15px] w-[25%] h-[1px] ${colorAccent} origin-right z-0 pointer-events-none`}
      />

      {/* Base Principal */}
      <motion.div 
        style={{ scaleX: scaleGrow, x: shiftLeft }} 
        className={`absolute bottom-2 left-[-25px] right-[5%] h-[1px] ${colorMain} origin-right z-0 pointer-events-none`}
      />
      {/* Base Secundária */}
      <motion.div 
        style={{ scaleX: scaleShrink, x: shiftRight }} 
        className={`absolute bottom-[-4px] right-[-15px] w-[25%] h-[1px] ${colorAccent} origin-left z-0 pointer-events-none`}
      />

      {/* --- LINHAS VERTICAIS --- */}
      {/* Esquerda Principal */}
      <motion.div 
        style={{ scaleY: scaleGrow, y: shiftDown }} 
        className={`absolute left-2 top-[-25px] bottom-[5%] w-[1px] ${colorMain} origin-bottom z-0 pointer-events-none`}
      />
      {/* Esquerda Secundária */}
      <motion.div 
        style={{ scaleY: scaleShrink, y: shiftUp }} 
        className={`absolute left-[-4px] top-[15%] h-[20%] w-[1px] ${colorAccent} origin-top z-0 pointer-events-none`}
      />

      {/* Direita Principal */}
      <motion.div 
        style={{ scaleY: scaleGrow, y: shiftUp }} 
        className={`absolute right-2 top-[5%] bottom-[-25px] w-[1px] ${colorMain} origin-top z-0 pointer-events-none`}
      />
      {/* Direita Secundária */}
      <motion.div 
        style={{ scaleY: scaleShrink, y: shiftDown }} 
        className={`absolute right-[-4px] bottom-[15%] h-[20%] w-[1px] ${colorAccent} origin-bottom z-0 pointer-events-none`}
      />

      {/* INNER CONTENT (The Image) */}
      <div className="relative z-10 w-full h-full rounded-sm overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5">
        {children}
      </div>
      
    </div>
  );
}
