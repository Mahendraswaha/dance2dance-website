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

  // Platinum Palette
  const linePrimary = "bg-[#E5E4E2]/75";
  const lineSecondary = "bg-[#E5E4E2]/40";

  // Individual, non-mirrored motion values for genuine asymmetry
  // Top-left movements
  const scaleVTL1 = useTransform(scrollYProgress, [0, 1], [0.85, 1.2]);
  const shiftHTL1 = useTransform(scrollYProgress, [0, 1], [-18, 12]);
  const driftVTL2 = useTransform(scrollYProgress, [0, 1], [-25, 20]);

  // Top-right movements
  const scaleHTR1 = useTransform(scrollYProgress, [0, 1], [0.8, 1.25]);
  const shiftHTR2 = useTransform(scrollYProgress, [0, 1], [15, -20]);
  const shiftVTR1 = useTransform(scrollYProgress, [0, 1], [-14, 18]);

  // Bottom-left movements
  const scaleVBL1 = useTransform(scrollYProgress, [0, 1], [0.85, 1.15]);
  const shiftHBL1 = useTransform(scrollYProgress, [0, 1], [14, -16]);

  // Right side / Bottom-right movements
  const scaleVBR1 = useTransform(scrollYProgress, [0, 1], [0.85, 1.25]);
  const driftVBR2 = useTransform(scrollYProgress, [0, 1], [22, -18]);
  const shiftHBR1 = useTransform(scrollYProgress, [0, 1], [-16, 22]);
  const scaleHBR2 = useTransform(scrollYProgress, [0, 1], [0.75, 1.35]);

  return (
    <div ref={localRef} className={`relative p-5 md:p-7 ${className}`}>
      
      {/* =========================================================
          ASSIMETRIA ARQUITETÔNICA (REPRODUÇÃO FIEL DA REFERÊNCIA)
          ========================================================= */}

      {/* --- CLUSTER SUPERIOR ESQUERDO --- */}
      {/* Vertical 1: Sobe muito além da foto (-36px), vai até 60% da altura */}
      <motion.div 
        style={{ scaleY: scaleVTL1 }}
        className={`absolute left-3 top-[-36px] h-[65%] w-[1px] ${linePrimary} origin-top z-0 pointer-events-none`}
      />
      {/* Horizontal 1: Avança além da borda esquerda (-26px) e para antes do centro (46%) */}
      <motion.div 
        style={{ x: shiftHTL1 }}
        className={`absolute top-3 left-[-26px] w-[48%] h-[1px] ${linePrimary} z-0 pointer-events-none`}
      />
      {/* Vertical Companheira (exclusiva superior esquerda): curta e paralela mais à esquerda */}
      <motion.div 
        style={{ y: driftVTL2 }}
        className={`absolute left-[-2px] top-[14%] h-[24%] w-[1px] ${lineSecondary} z-0 pointer-events-none`}
      />


      {/* --- CLUSTER SUPERIOR DIREITO --- */}
      {/* Horizontal 1: Começa aos 62% e avança além da borda direita (+28px) */}
      <motion.div 
        style={{ scaleX: scaleHTR1 }}
        className={`absolute top-3 left-[62%] right-[-28px] h-[1px] ${linePrimary} origin-right z-0 pointer-events-none`}
      />
      {/* Horizontal Companheira (exclusiva superior direita): paralela acima da principal */}
      <motion.div 
        style={{ x: shiftHTR2 }}
        className={`absolute top-[-2px] left-[70%] right-[-14px] h-[1px] ${lineSecondary} z-0 pointer-events-none`}
      />
      {/* Vertical 1: Sobe além do topo (-34px) e desce até cerca de 45% */}
      <motion.div 
        style={{ y: shiftVTR1 }}
        className={`absolute right-3 top-[-34px] h-[50%] w-[1px] ${linePrimary} z-0 pointer-events-none`}
      />


      {/* --- CLUSTER LATERAL DIREITO & INFERIOR DIREITO --- */}
      {/* Vertical 2: Desce do meio da lateral e ultrapassa o fundo da foto (+34px) */}
      <motion.div 
        style={{ scaleY: scaleVBR1 }}
        className={`absolute right-3 top-[38%] bottom-[-34px] w-[1px] ${linePrimary} origin-bottom z-0 pointer-events-none`}
      />
      {/* Vertical Companheira (exclusiva inferior direita): paralela mais à direita na metade de baixo */}
      <motion.div 
        style={{ y: driftVBR2 }}
        className={`absolute right-[-2px] top-[48%] h-[28%] w-[1px] ${lineSecondary} z-0 pointer-events-none`}
      />
      {/* Horizontal 1: Corta da lateral direita em direção ao centro */}
      <motion.div 
        style={{ x: shiftHBR1 }}
        className={`absolute bottom-3 left-[24%] right-[-32px] h-[1px] ${linePrimary} z-0 pointer-events-none`}
      />
      {/* Horizontal Companheira (exclusiva inferior direita): paralela logo abaixo */}
      <motion.div 
        style={{ scaleX: scaleHBR2 }}
        className={`absolute bottom-[-2px] left-[66%] right-[-18px] h-[1px] ${lineSecondary} origin-right z-0 pointer-events-none`}
      />


      {/* --- CLUSTER INFERIOR ESQUERDO --- */}
      {/* Vertical: Desce ultrapassando o fundo (-32px) e sobe até 40% */}
      <motion.div 
        style={{ scaleY: scaleVBL1 }}
        className={`absolute left-3 bottom-[-32px] h-[45%] w-[1px] ${linePrimary} origin-bottom z-0 pointer-events-none`}
      />
      {/* Horizontal: Sai da esquerda (-24px) e avança até 36% da base */}
      <motion.div 
        style={{ x: shiftHBL1 }}
        className={`absolute bottom-3 left-[-24px] w-[38%] h-[1px] ${linePrimary} z-0 pointer-events-none`}
      />


      {/* CONTEÚDO INTERNO (A Foto da Criadora com moldura sutil em volta) */}
      <div className="relative z-10 w-full h-full rounded-sm overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.6)] border border-white/10">
        {children}
      </div>
      
    </div>
  );
}
