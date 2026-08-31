import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Clock, Tag, Users } from 'lucide-react';

export default function WorkshopTemplate({ workshop, program }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!workshop) return <div className="min-h-screen bg-primary text-background flex items-center justify-center">Workshop not found</div>;

  // Parse fullDescription into paragraphs
  const rawText = t(`programs.${program.id}.workshops.${workshop.id}.fullDescription`, workshop.fullDescription || '');
  const paragraphs = rawText.split(/\n+/).filter(p => p.trim().length > 0);

  // First paragraph = dramatic hook
  const hook = paragraphs[0] || '';
  // Last paragraph = poetic closing (if short)
  const lastParagraph = paragraphs[paragraphs.length - 1] || '';
  const hasPoetClosing = paragraphs.length > 3 && lastParagraph.length < 100;
  
  // Middle paragraphs (between hook and closing)
  const bodyParagraphs = paragraphs.slice(1, hasPoetClosing ? -1 : undefined);
  
  // Identify pull quotes: short paragraphs (< 120 chars) that feel poetic
  const isPullQuote = (text) => text.length < 120 && text.length > 15;

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: 0.1 + i * 0.06, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } })
  };

  const levelKey = workshop.level === 'advanced_pro' ? 'workshop_info.advanced_pro' : 'workshop_info.all_levels';

  return (
    <div className="pt-40 md:pt-52 pb-24 bg-primary min-h-screen font-sans text-background relative">
      
      {/* Watermark Logo */}
      {program.logo && (
        <div className="fixed top-24 md:top-36 left-0 w-full px-6 lg:px-12 pointer-events-none z-40">
          <div className="max-w-7xl mx-auto flex">
            <img 
              src={program.logo} 
              alt="Program Watermark" 
              className={`${program.logoClassName || 'h-12 md:h-24 ml-4 md:ml-10'} object-contain opacity-40`}
            />
          </div>
        </div>
      )}

      <div className="max-w-[900px] mx-auto px-8 md:px-16 lg:px-20 relative z-10">
        
        {/* ─── HEADER ─────────────────────────────── */}
        <header className="mb-12">
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="font-heading text-[10px] tracking-[5px] uppercase text-accent/80 mb-5"
          >
            {t('labels.workshop', 'Workshop')}
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-batang text-4xl md:text-6xl font-normal mb-6 leading-tight text-[#F0EDE8]"
          >
            {t(`programs.${program.id}.workshops.${workshop.id}.title`, workshop.title)}
          </motion.h1>
          
          <motion.div initial={{ width: 0 }} animate={{ width: 48 }} transition={{ delay: 0.3, duration: 0.6 }}
            className="h-[1px] bg-accent/70 mb-8"
          />
          
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="font-heading text-xl text-[#9A9A9A] font-light leading-relaxed"
          >
            {t(`programs.${program.id}.workshops.${workshop.id}.shortDescription`, workshop.shortDescription)}
          </motion.p>
        </header>

        {/* ─── INFO PILLS ─────────────────────────── */}
        {(workshop.duration || workshop.price) && (
          <motion.div 
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-3 mb-16"
          >
            {workshop.duration && (
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-700/40 bg-[#0C0C0C]">
                <Clock size={14} className="text-accent/70" />
                <span className="font-data text-[12px] tracking-wide text-slate-300">{workshop.duration}</span>
              </div>
            )}
            {workshop.price && (
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-700/40 bg-[#0C0C0C]">
                <Tag size={14} className="text-accent/70" />
                <span className="font-data text-[12px] tracking-wide text-slate-300">{workshop.price} {t('workshop_info.currency', 'kr')}</span>
              </div>
            )}
            {workshop.level && (
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-700/40 bg-[#0C0C0C]">
                <Users size={14} className="text-accent/70" />
                <span className="font-data text-[12px] tracking-wide text-slate-300">{t(levelKey)}</span>
              </div>
            )}
          </motion.div>
        )}

        {/* ─── FEATURED IMAGE ─────────────────────── */}
        {workshop.image && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="w-full h-[280px] md:h-[420px] mb-16 bg-cover bg-center relative overflow-hidden"
            style={{ backgroundImage: `url(${workshop.image})` }}
          >
            {/* Edge fade using linear gradients matching the background color */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  linear-gradient(to right, #0D0D12 -5%, transparent 20%, transparent 80%, #0D0D12 105%),
                  linear-gradient(to bottom, #0D0D12 -5%, transparent 20%, transparent 80%, #0D0D12 105%)
                `
              }}
            />
          </motion.div>
        )}

        {/* ─── DRAMATIC HOOK ───────────────────────── */}
        {hook && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45, duration: 0.7 }}
            className="border-l-2 border-accent/50 pl-8 md:pl-10 mb-16"
          >
            <p className="font-drama italic text-2xl md:text-3xl text-[#E8E0D4] leading-[1.45]">
              {hook}
            </p>
          </motion.div>
        )}

        {/* ─── DIVIDER ────────────────────────────── */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="flex items-center gap-4 mb-16"
        >
          <div className="flex-1 h-[1px] bg-slate-700/30" />
          <div className="w-1.5 h-1.5 rounded-full bg-accent/40" />
          <div className="flex-1 h-[1px] bg-slate-700/30" />
        </motion.div>

        {/* ─── BODY CONTENT ───────────────────────── */}
        <div className="space-y-0">
          {bodyParagraphs.map((paragraph, index) => {
            const isQuote = isPullQuote(paragraph);
            
            if (isQuote) {
              return (
                <motion.div
                  key={index}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  variants={fadeUp}
                  className="py-10 md:py-14 flex justify-center"
                >
                  <div className="max-w-lg text-center">
                    <div className="w-8 h-[1px] bg-accent/30 mx-auto mb-6" />
                    <p className="font-drama italic text-xl md:text-2xl text-accent/60 leading-[1.5]">
                      {paragraph}
                    </p>
                    <div className="w-8 h-[1px] bg-accent/30 mx-auto mt-6" />
                  </div>
                </motion.div>
              );
            }
            
            return (
              <motion.p
                key={index}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={fadeUp}
                className="font-heading font-light text-[#9A9A9A] text-base md:text-lg leading-[1.85] mb-8"
              >
                {paragraph}
              </motion.p>
            );
          })}
        </div>

        {/* ─── POETIC CLOSING ─────────────────────── */}
        {hasPoetClosing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-16 mb-8 text-center"
          >
            <p className="font-drama italic text-xl md:text-2xl text-accent/50 leading-[1.5]">
              {lastParagraph}
            </p>
          </motion.div>
        )}

        {/* ─── CALL TO ACTION ─────────────────────── */}
        <motion.div 
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="mt-24 pt-16 border-t border-[#222222] flex flex-col items-center"
        >
          <h3 className="font-batang text-2xl text-[#F0EDE8] mb-8">{t('actions.ready_to_start', 'Pronto para começar?')}</h3>
          
          <Link 
            to="/agenda" 
            className="group inline-flex items-center gap-3 text-center font-heading text-[12px] tracking-[3px] uppercase bg-accent text-primary px-10 py-4 hover:bg-background hover:text-primary transition-colors duration-300 font-semibold rounded-full mb-12"
          >
            {t('actions.view_dates', 'Ver datas disponíveis')}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <button 
            onClick={() => navigate(-1)}
            className="font-heading text-[10px] tracking-[4px] uppercase text-[#9A9A9A] hover:text-accent flex items-center transition-colors border-b border-transparent hover:border-accent/30 pb-1"
          >
            <span className="mr-2">&larr;</span> {t('actions.back', 'Voltar')}
          </button>
        </motion.div>

      </div>
    </div>
  );
}
