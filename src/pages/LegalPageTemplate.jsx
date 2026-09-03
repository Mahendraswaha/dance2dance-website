import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function LegalPageTemplate({ title, lastUpdated, sections }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="bg-primary min-h-screen font-sans text-background">
      <Navbar />

      <div className="pt-40 pb-24 px-6 md:px-12 max-w-[800px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-batang text-4xl md:text-5xl text-[#F0EDE8] mb-4 text-center">
            {title}
          </h1>
          {lastUpdated && (
            <p className="text-center font-heading text-[12px] tracking-[2px] text-accent uppercase mb-16">
              {lastUpdated}
            </p>
          )}

          <div className="space-y-12">
            {sections.map((section, idx) => (
              <motion.section
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
              >
                {section.title && (
                  <h2 className="font-heading text-lg tracking-[2px] uppercase text-accent mb-4">
                    {section.title}
                  </h2>
                )}
                <div 
                  className="font-light text-[#CFCFCF] leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </motion.section>
            ))}
          </div>

          <div className="mt-20 pt-10 border-t border-[#222222] flex justify-center">
            <button
              onClick={() => navigate(-1)}
              className="font-heading text-[10px] tracking-[4px] uppercase text-[#CFCFCF] hover:text-accent flex items-center transition-colors border-b border-transparent hover:border-accent/30 pb-1"
            >
              <span className="mr-2">&larr;</span> {t('actions.back', 'Voltar')}
            </button>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
