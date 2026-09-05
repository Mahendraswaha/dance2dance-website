import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Zap, Handshake, Compass, Users, Sun, Heart } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: 0.1 + i * 0.06, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } })
};

const audienceIcons = [
  { icon: Zap, key: 'intense_routines' },
  { icon: Handshake, key: 'integration' },
  { icon: Compass, key: 'leadership' },
  { icon: Users, key: 'remote_teams' },
  { icon: Sun, key: 'conventions' },
  { icon: Heart, key: 'culture' },
];

export default function BtdCorporatePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { scrollY } = useScroll();
  const logoOpacity = useTransform(scrollY, [700, 1000], [0.4, 0]);

  const body = t('btd_corporate.body', { returnObjects: true }) || {};
  const pillarsSection = t('btd_corporate.pillars_section', { returnObjects: true }) || {};
  const audience = t('btd_corporate.audience', { returnObjects: true }) || {};
  const workshops = t('btd_corporate.workshops_section', { returnObjects: true }) || {};

  const pillars = pillarsSection.pillars || [];

  return (
    <div className="bg-primary min-h-screen font-sans text-background">
      <Navbar />

      <div className="pt-40 md:pt-52 pb-24 relative">

        {/* Watermark Logo */}
        <div className="fixed top-24 md:top-36 left-0 w-full px-6 lg:px-12 pointer-events-none z-40">
          <div className="max-w-7xl mx-auto flex">
            <motion.img
              src="/logo-bethedance.png"
              alt="Be the Dance"
              className="w-36 md:w-52 object-contain"
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
              {t('btd_corporate.kicker')}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-batang text-4xl md:text-6xl font-normal mb-6 leading-tight text-[#F0EDE8]"
            >
              {t('btd_corporate.title')}
            </motion.h1>

            <motion.div initial={{ width: 0 }} animate={{ width: 48 }} transition={{ delay: 0.3, duration: 0.6 }}
              className="h-[1px] bg-accent/70 mb-8"
            />

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="font-heading text-xl text-[#CFCFCF] font-light leading-relaxed"
            >
              {t('btd_corporate.subtitle')}
            </motion.p>
          </header>

          {/* DRAMATIC HOOK */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45, duration: 0.7 }}
            className="border-l-2 border-accent/50 pl-8 md:pl-10 mb-16"
          >
            <p className="font-drama italic text-2xl md:text-3xl text-[#E8E0D4] leading-[1.45]">
              {t('btd_corporate.hook')}
            </p>
          </motion.div>

          {/* DIVIDER */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="flex items-center gap-4 mb-16"
          >
            <div className="flex-1 h-[1px] bg-slate-700/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-accent/40" />
            <div className="flex-1 h-[1px] bg-slate-700/30" />
          </motion.div>

          {/* BODY CONTENT */}
          <div className="space-y-0">
            <motion.p
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp} custom={0}
              className="font-heading font-light text-[#CFCFCF] text-base md:text-lg leading-[1.85] mb-8"
            >
              {body.p1}
            </motion.p>

            {/* Pull quote */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp} custom={1}
              className="py-10 md:py-14 flex justify-center"
            >
              <div className="max-w-lg text-center">
                <div className="w-8 h-[1px] bg-accent/30 mx-auto mb-6" />
                <p className="font-drama italic text-xl md:text-2xl text-[#E2C366] leading-[1.5]">
                  {body.pullQuote}
                </p>
                <div className="w-8 h-[1px] bg-accent/30 mx-auto mt-6" />
              </div>
            </motion.div>

            <motion.p
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp} custom={2}
              className="font-heading font-light text-[#CFCFCF] text-base md:text-lg leading-[1.85] mb-8"
            >
              {body.p2}
            </motion.p>

            <motion.p
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp} custom={3}
              className="font-heading font-light text-[#CFCFCF] text-base md:text-lg leading-[1.85] mb-8"
            >
              {body.p3}
            </motion.p>
          </div>

        </div>

        {/* 3 PILLARS SECTION */}
        <section className="mt-24 mb-24">
          <div className="max-w-[900px] mx-auto px-8 md:px-16 lg:px-20">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={0}
              className="mb-12"
            >
              <span className="font-heading text-[10px] tracking-[5px] uppercase text-accent block mb-6">
                {pillarsSection.kicker}
              </span>
              <p className="font-heading font-light text-[#CFCFCF] text-base md:text-lg leading-[1.85]">
                {pillarsSection.intro}
              </p>
            </motion.div>
          </div>

          <div className="max-w-[1100px] mx-auto px-8 md:px-16 lg:px-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
              {pillars.map((pillar, pIndex) => (
                <motion.div
                  key={pillar.number || pIndex}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-30px' }}
                  variants={fadeUp}
                  custom={pIndex}
                  className="group relative bg-gradient-to-b from-[#141414] to-[#0c0c0c] border border-[#222222] rounded-[2px] p-8 md:p-10 transition-all duration-500 hover:border-accent/40 flex flex-col justify-between"
                >
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div>
                    <div className="flex items-baseline justify-between mb-4">
                      <span className="font-drama text-3xl md:text-4xl text-accent/40 group-hover:text-accent/80 transition-colors duration-500 font-light">
                        {pillar.number}
                      </span>
                      <span className="font-heading text-[9px] tracking-[3px] uppercase text-[#777777] font-medium">
                        {t('labels.pillar', 'PILAR')}
                      </span>
                    </div>

                    <h3 className="font-batang text-xl md:text-2xl text-[#F0EDE8] mb-4 tracking-tight leading-snug group-hover:text-accent transition-colors duration-500">
                      {pillar.title}
                    </h3>

                    <div className="w-10 h-[1px] bg-accent/40 mb-8 group-hover:w-16 transition-all duration-500" />

                    <div className="space-y-6">
                      {pillar.items?.map((item, iIndex) => (
                        <div key={iIndex} className="group/item">
                          <div className="flex items-start gap-3 mb-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent/60 mt-1.5 shrink-0 group-hover/item:bg-accent transition-colors" />
                            <h4 className="font-heading text-[12px] uppercase tracking-[1.5px] text-[#E2C366] font-medium leading-snug">
                              {item.label}
                            </h4>
                          </div>
                          <p className="font-heading text-[13px] text-[#9A9A9A] font-light leading-relaxed pl-4">
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

        {/* AUDIENCE SECTION */}
        <section className="mb-24">
          <div className="max-w-[900px] mx-auto px-8 md:px-16 lg:px-20">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={0}
              className="mb-12"
            >
              <span className="font-heading text-[10px] tracking-[5px] uppercase text-accent block mb-6">
                {audience.kicker}
              </span>
              <p className="font-heading font-light text-[#CFCFCF] text-base md:text-lg leading-[1.85]">
                {audience.intro}
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
                  
                  <p className="font-heading text-[12px] tracking-[1px] uppercase text-[#d4cfc7] text-center font-medium leading-[1.6]">
                    {audience.items?.[key]}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* WORKSHOPS / IMMERSION SECTION */}
        <div className="max-w-[900px] mx-auto px-8 md:px-16 lg:px-20">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={0}
            className="mb-12"
          >
            <span className="font-heading text-[10px] tracking-[5px] uppercase text-accent block mb-6">
              {workshops.kicker}
            </span>
          </motion.div>

          <div className="space-y-0">
            <motion.p
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp} custom={0}
              className="font-heading font-light text-[#CFCFCF] text-base md:text-lg leading-[1.85] mb-8"
            >
              {workshops.p1}
            </motion.p>
            <motion.p
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp} custom={1}
              className="font-heading font-light text-[#CFCFCF] text-base md:text-lg leading-[1.85] mb-8"
            >
              {workshops.p2}
            </motion.p>
            <motion.p
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp} custom={2}
              className="font-heading font-light text-[#CFCFCF] text-base md:text-lg leading-[1.85] mb-8"
            >
              {workshops.p3}
            </motion.p>
          </div>

          {/* POETIC CLOSING */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-16 mb-8 text-center flex flex-col items-center"
          >
            <p className="font-drama italic text-xl md:text-2xl text-[#E2C366] leading-[1.6] whitespace-pre-line">
              {t('btd_corporate.closing')}
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="mt-24 pt-16 border-t border-[#222222] flex flex-col items-center"
          >
            <h3 className="font-batang text-2xl text-[#F0EDE8] mb-4 text-center">{t('btd_corporate.cta.title')}</h3>
            <p className="font-heading text-[#9A9A9A] font-light text-center mb-8 max-w-lg leading-relaxed">
              {t('btd_corporate.cta.text')}
            </p>

            <Link
              to="/contato?subject=reuniao-executiva"
              className="group inline-flex items-center gap-3 text-center font-heading text-[12px] tracking-[3px] uppercase bg-accent text-primary px-10 py-4 hover:bg-background hover:text-primary transition-colors duration-300 font-semibold rounded-full mb-12"
            >
              {t('btd_corporate.cta.button')}
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
