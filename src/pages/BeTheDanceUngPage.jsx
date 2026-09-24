import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Award, Users } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function BeTheDanceUngPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { scrollY } = useScroll();
  const logoOpacity = useTransform(scrollY, [0, 150], [0.3, 0]);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] } }
  };

  const audienceIcons = [
    { icon: Heart, key: 0 },
    { icon: Award, key: 1 },
    { icon: Users, key: 2 },
  ];

  // Try parsing pillars in case i18next returns string due to backend configuration, though standard is object
  let pillars = t('btd_ung.pillars_section.pillars', { returnObjects: true });
  if (typeof pillars === 'string') {
    try { pillars = JSON.parse(pillars); } catch(e) {}
  }
  if (!Array.isArray(pillars)) pillars = [];

  const impactItems = t('btd_ung.impact_section.items', { returnObjects: true }) || [];

  return (
    <div className="bg-[#0A0A0E] min-h-screen font-sans text-background selection:bg-accent/30 overflow-x-hidden">
      <SEOHead 
        title={t('btd_ung.seoTitle')} 
        description={t('btd_ung.seoDesc')} 
      />
      
      <Navbar />

      <div className="pt-40 md:pt-52 pb-24 relative">
        {/* Watermark Logo */}
        <div className="fixed top-24 md:top-36 left-0 w-full px-6 lg:px-12 pointer-events-none z-40">
          <div className="max-w-7xl mx-auto flex">
            <motion.img
              src="/logo-bethedance.png"
              alt="Be the Dance"
              className="h-12 md:h-24 ml-4 md:ml-10 object-contain"
              style={{ opacity: logoOpacity }}
            />
          </div>
        </div>

        <div className="max-w-[900px] mx-auto px-8 md:px-16 lg:px-20 relative z-10">

          {/* HEADER */}
          <header className="mb-12">
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="font-heading text-[10px] tracking-[5px] uppercase text-accent/80 mb-5"
            >
              {t('btd_ung.kicker')}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-batang text-4xl md:text-6xl font-normal mb-6 leading-tight text-[#F0EDE8]"
            >
              {t('btd_ung.title')}
            </motion.h1>

            <motion.div initial={{ width: 0 }} animate={{ width: 48 }} transition={{ delay: 0.3, duration: 0.6 }}
              className="h-[1px] bg-accent/70 mb-8"
            />

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="font-heading text-xl text-[#CFCFCF] font-light leading-relaxed"
            >
              {t('btd_ung.subtitle')}
            </motion.p>
          </header>

          {/* DRAMATIC HOOK */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45, duration: 0.7 }}
            className="border-l-2 border-accent/50 pl-8 md:pl-10 mb-16"
          >
            <p className="font-drama italic text-2xl md:text-3xl text-[#E8E0D4] leading-[1.45]">
              "{t('btd_ung.hook')}"
            </p>
          </motion.div>

          {/* BODY PARAGRAPHS */}
          <div className="space-y-0 mb-24">
            <motion.p
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp}
              className="font-heading font-light text-[#CFCFCF] text-base md:text-lg leading-[1.85] mb-8"
            >
              {t('btd_ung.body.p1')}
            </motion.p>

            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp}
              className="my-14 text-center py-8 border-y border-[#222222]"
            >
              <h2 className="font-drama text-2xl md:text-3xl text-accent mb-2 italic px-4">
                "{t('btd_ung.body.pullQuote')}"
              </h2>
            </motion.div>

            <motion.p
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp}
              className="font-heading font-light text-[#CFCFCF] text-base md:text-lg leading-[1.85] mb-8"
            >
              {t('btd_ung.body.p2')}
            </motion.p>

            <motion.p
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp}
              className="font-heading font-light text-[#CFCFCF] text-base md:text-lg leading-[1.85]"
            >
              {t('btd_ung.body.p3')}
            </motion.p>
          </div>
        </div>

        {/* PILLARS SECTION */}
        <section className="bg-gradient-to-b from-[#0c0c0c] to-[#0A0A0E] py-24 mb-16 border-y border-[#181818]">
          <div className="max-w-[1100px] mx-auto px-8 md:px-16 lg:px-20">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp}
              className="mb-16"
            >
              <span className="font-heading text-[10px] tracking-[5px] uppercase text-accent block mb-6">
                {t('btd_ung.pillars_section.kicker')}
              </span>
              <p className="font-heading font-light text-[#CFCFCF] text-base md:text-lg leading-[1.85] max-w-[700px]">
                {t('btd_ung.pillars_section.intro')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
              {pillars.map((pillar, index) => (
                <motion.div
                  key={index}
                  initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
                  variants={fadeUp} custom={index}
                  className="group relative"
                >
                  <div className="absolute top-0 left-0 w-[1px] h-0 bg-accent/30 group-hover:h-full transition-all duration-700 ease-in-out hidden lg:block" />
                  
                  <div className="lg:pl-8">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="font-drama text-accent text-xl opacity-60">
                        {pillar.number}
                      </span>
                      <span className="font-heading text-[9px] tracking-[3px] uppercase text-[#777777] font-medium">
                        {t('labels.pillar', 'PILAR')}
                      </span>
                    </div>

                    <div className="min-h-[3.75rem] md:min-h-[4.75rem] flex flex-col justify-start mb-4">
                      <h3 className="font-batang text-xl md:text-2xl text-[#F0EDE8] tracking-tight leading-snug group-hover:text-accent transition-colors duration-500">
                        {pillar.title}
                      </h3>
                    </div>

                    <div className="w-10 h-[1px] bg-accent/40 mb-8 group-hover:w-16 transition-all duration-500" />

                    <div className="space-y-6">
                      {pillar.items?.map((item, iIndex) => (
                        <div key={iIndex} className="group/item transition-all duration-300">
                          <div className="flex items-start gap-3 mb-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent/60 mt-1.5 shrink-0 group-hover/item:bg-accent group-hover/item:shadow-[0_0_8px_rgba(226,195,102,0.7)] transition-all duration-300" />
                            <h4 className="font-heading text-[12px] uppercase tracking-[1.5px] text-[#E2C366] group-hover/item:text-[#F0EDE8] font-medium leading-snug transition-colors duration-300">
                              {item.label}
                            </h4>
                          </div>
                          <p className="font-heading text-[13px] text-[#9A9A9A] group-hover/item:text-[#DCD8D0] font-light leading-relaxed pl-4 transition-colors duration-300">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* IMPACT SECTION */}
        <section className="mb-24">
          <div className="max-w-[900px] mx-auto px-8 md:px-16 lg:px-20">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={0}
              className="mb-12"
            >
              <span className="font-heading text-[10px] tracking-[5px] uppercase text-accent block mb-6">
                {t('btd_ung.impact_section.kicker')}
              </span>
              <p className="font-heading font-light text-[#CFCFCF] text-base md:text-lg leading-[1.85]">
                {t('btd_ung.impact_section.intro')}
              </p>
            </motion.div>
          </div>

          <div className="max-w-[1100px] mx-auto px-8 md:px-16 lg:px-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {audienceIcons.map(({ icon: Icon, key }, index) => (
                <motion.div
                  key={key}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-30px' }}
                  variants={fadeUp}
                  custom={index}
                  className="group relative bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-[#1f1f1f] rounded-[4px] py-10 px-6 md:py-16 md:px-8 flex flex-col items-center justify-center transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-accent/25 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(226,195,102,0.08)] overflow-hidden min-h-[260px] md:min-h-[320px]"
                >
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-[400ms]" />
                  
                  <div className="font-drama text-2xl text-accent mb-2 font-normal opacity-40">0{index + 1}</div>
                  <div className="w-[30px] h-[1px] bg-accent mb-6 opacity-40" />

                  <Icon size={36} className="text-accent/60 group-hover:text-accent transition-colors duration-500 mb-6" strokeWidth={1} />
                  
                  <h4 className="font-heading text-[12px] tracking-[1px] uppercase text-[#d4cfc7] text-center font-medium leading-[1.6] mb-3">
                    {impactItems[key]?.title}
                  </h4>
                  <p className="font-heading text-[12px] text-[#9A9A9A] text-center font-light leading-[1.6]">
                    {impactItems[key]?.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ARTISTIC DIRECTION (SAFIA) */}
        <section className="mb-16">
          <div className="max-w-[900px] mx-auto px-8 md:px-16 lg:px-20">
            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 border-t border-[#222] pt-20">
              <motion.div 
                initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="w-full md:w-2/5 shrink-0"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-[2px]">
                  <img src="/images/creator-be-the-dance.jpg" alt="Safia" className="w-full h-full object-cover filter grayscale hover:grayscale-0 hover:scale-105 transition-all duration-1000" />
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="w-full md:w-3/5 text-left"
              >
                <span className="font-heading text-[10px] tracking-[5px] uppercase text-accent mb-6 block">
                  {t('btd_ung.mentorKicker')}
                </span>
                <p className="font-heading font-light text-[#CFCFCF] text-base md:text-lg leading-[1.85]">
                  {t('btd_ung.mentorText')}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* POETIC CLOSING */}
        <div className="max-w-[900px] mx-auto px-8 md:px-16 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-16 mb-8 text-center flex flex-col items-center"
          >
            <p className="font-drama italic text-xl md:text-2xl text-[#E2C366] leading-[1.6] whitespace-pre-line">
              {t('btd_ung.closing')}
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="mt-24 pt-16 border-t border-[#222222] flex flex-col items-center"
          >
            <h3 className="font-batang text-2xl text-[#F0EDE8] mb-4 text-center">{t('btd_ung.cta.title')}</h3>
            <p className="font-heading text-[#9A9A9A] font-light text-center mb-8 max-w-lg leading-relaxed">
              {t('btd_ung.cta.text')}
            </p>

            <Link
              to="/contato?subject=btd-ung-parceria"
              className="group inline-flex items-center gap-3 text-center font-heading text-[12px] tracking-[3px] uppercase bg-accent text-primary px-10 py-4 hover:bg-background hover:text-primary transition-colors duration-300 font-semibold rounded-full mb-12"
            >
              {t('btd_ung.cta.button')}
            </Link>

            <button
              onClick={() => navigate(-1)}
              className="font-heading text-[10px] tracking-[4px] uppercase text-[#CFCFCF] hover:text-accent flex items-center transition-colors border-b border-transparent hover:border-accent/30 pb-1"
            >
              <span className="mr-2">&larr;</span> {t('actions.back', 'Voltar')}
            </button>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
