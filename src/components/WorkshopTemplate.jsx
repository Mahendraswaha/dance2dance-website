import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function WorkshopTemplate({ workshop, program }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!workshop) return <div className="min-h-screen bg-primary text-background flex items-center justify-center">Workshop not found</div>;

  return (
    <div className="pt-32 pb-24 bg-primary min-h-screen font-sans text-background relative">
      
      {/* Watermark Logo */}
      {program.logo && (
        <div className={`fixed top-24 md:top-36 left-0 w-full px-6 lg:px-12 pointer-events-none z-40 transition-opacity duration-700 ease-in-out opacity-100`}>
          <div className="max-w-7xl mx-auto flex">
            <img 
              src={program.logo} 
              alt="Program Watermark" 
              className={`${program.logoClassName || 'h-12 md:h-24 ml-4 md:ml-10'} object-contain opacity-40`}
            />
          </div>
        </div>
      )}

      <div className="max-w-[900px] mx-auto px-8 relative z-10">
        


        {/* Header */}
        <header className="mb-16">
          <p className="font-heading text-[10px] tracking-[5px] uppercase text-accent/80 mb-5">{t('labels.workshop', 'Workshop')}</p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-batang text-4xl md:text-6xl font-normal mb-6 leading-tight text-[#F0EDE8]"
          >
            {t(`programs.${program.id}.workshops.${workshop.id}.title`, workshop.title)}
          </motion.h1>
          <div className="w-12 h-[1px] bg-accent/70 mb-8"></div>
          <p className="font-heading text-xl text-[#9A9A9A] font-light leading-relaxed">
            {t(`programs.${program.id}.workshops.${workshop.id}.shortDescription`, workshop.shortDescription)}
          </p>
        </header>

        {/* Featured Image */}
        {workshop.image && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full h-[400px] md:h-[500px] bg-[#141414] rounded-[2px] mb-16 bg-cover bg-center border border-[#222222]"
            style={{ backgroundImage: `url(${workshop.image})` }}
          />
        )}

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="prose prose-invert prose-lg max-w-none font-heading font-light text-[#9A9A9A] leading-relaxed whitespace-pre-wrap"
        >
          {t(`programs.${program.id}.workshops.${workshop.id}.fullDescription`, workshop.fullDescription)}
        </motion.div>

        {/* Call to Action */}
        <div className="mt-20 pt-16 border-t border-[#222222] flex flex-col items-center">
          <h3 className="font-batang text-2xl text-[#F0EDE8] mb-6">{t('actions.ready_to_start', 'Pronto para começar?')}</h3>
          <Link 
            to="/agenda" 
            className="inline-block font-heading text-[12px] tracking-[3px] uppercase bg-accent text-primary px-8 py-4 hover:bg-background hover:text-primary transition-colors duration-300 font-semibold rounded-full mb-12"
          >
            {t('actions.view_dates', 'Ver datas disponíveis')}
          </Link>
          
          <button 
            onClick={() => navigate(-1)}
            className="font-heading text-[10px] tracking-[4px] uppercase text-[#9A9A9A] hover:text-accent flex items-center transition-colors border-b border-transparent hover:border-accent/30 pb-1"
          >
            <span className="mr-2">&larr;</span> {t('actions.back', 'Voltar')}
          </button>
        </div>

      </div>
    </div>
  );
}
