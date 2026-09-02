import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, Tag, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: 0.1 + i * 0.06, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } })
};

export default function IndividualPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { scrollY } = useScroll();
  const logoOpacity = useTransform(scrollY, [700, 1000], [0.4, 0]);

  const body = t('individual.body', { returnObjects: true });
  const deepening = t('individual.deepening', { returnObjects: true });

  return (
    <div className="bg-primary min-h-screen font-sans text-background">
      <Navbar />

      <div className="pt-40 md:pt-52 pb-24 relative">

        {/* Watermark Logo */}
        <div className="fixed top-24 md:top-36 left-0 w-full px-6 lg:px-12 pointer-events-none z-40">
          <div className="max-w-7xl mx-auto flex">
            <motion.img
              src="/logo-biostretch.png"
              alt="Biostretch"
              className="w-32 md:w-44 object-contain"
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
              {t('individual.kicker')}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-batang text-4xl md:text-6xl font-normal mb-6 leading-tight text-[#F0EDE8]"
            >
              {t('individual.title')}
            </motion.h1>

            <motion.div initial={{ width: 0 }} animate={{ width: 48 }} transition={{ delay: 0.3, duration: 0.6 }}
              className="h-[1px] bg-accent/70 mb-8"
            />

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="font-heading text-xl text-[#CFCFCF] font-light leading-relaxed"
            >
              {t('individual.subtitle')}
            </motion.p>
          </header>

          {/* INFO PILLS */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-3 mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-700/40 bg-[#0C0C0C]">
              <Clock size={14} className="text-accent/70" />
              <span className="font-data text-[12px] tracking-wide text-slate-300">2h</span>
            </div>
            
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-700/40 bg-[#0C0C0C]">
              <Tag size={14} className="text-accent/70" />
              <span className="font-data text-[12px] tracking-wide text-slate-300">1 200kr</span>
            </div>
            
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-700/40 bg-[#0C0C0C]">
              <Users size={14} className="text-accent/70" />
              <span className="font-data text-[12px] tracking-wide text-slate-300">{t('workshop_info.all_levels', 'Todos os níveis')}</span>
            </div>
          </motion.div>


          {/* DRAMATIC HOOK */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45, duration: 0.7 }}
            className="border-l-2 border-accent/50 pl-8 md:pl-10 mb-16"
          >
            <p className="font-drama italic text-2xl md:text-3xl text-[#E8E0D4] leading-[1.45]">
              {t('individual.hook')}
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

          {/* SECTION: Direcionado ao que você precisa */}
          <section className="mt-24 mb-16">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={0}
              className="mb-12"
            >
              <span className="font-heading text-[10px] tracking-[5px] uppercase text-accent block mb-6">
                {t('individual.focused.kicker')}
              </span>
              <p className="font-heading font-light text-[#CFCFCF] text-base md:text-lg leading-[1.85] mb-8">
                {t('individual.focused.p1')}
              </p>
              <p className="font-heading font-light text-[#CFCFCF] text-base md:text-lg leading-[1.85] mb-8">
                {t('individual.focused.p2')}
              </p>
            </motion.div>

            {/* Pull quote */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp} custom={1}
              className="py-10 md:py-14 flex justify-center"
            >
              <div className="max-w-lg text-center">
                <div className="w-8 h-[1px] bg-accent/30 mx-auto mb-6" />
                <p className="font-drama italic text-xl md:text-2xl text-[#E2C366] leading-[1.5]">
                  {t('individual.focused.pullQuote')}
                </p>
                <div className="w-8 h-[1px] bg-accent/30 mx-auto mt-6" />
              </div>
            </motion.div>
          </section>

          {/* SECTION: Para quem quer aprofundar */}
          <section className="mb-16">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={0}
              className="mb-12"
            >
              <span className="font-heading text-[10px] tracking-[5px] uppercase text-accent block mb-6">
                {deepening.kicker}
              </span>
              <p className="font-heading font-light text-[#CFCFCF] text-base md:text-lg leading-[1.85] mb-8">
                {deepening.p1}
              </p>

            </motion.div>
          </section>

          {/* POETIC CLOSING */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-16 mb-8 text-center flex flex-col items-center"
          >
            <p className="font-drama italic text-xl md:text-2xl text-[#E2C366] leading-[1.6] whitespace-pre-line">
              {t('individual.closing')}
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="mt-24 pt-16 border-t border-[#222222] flex flex-col items-center"
          >
            <h3 className="font-batang text-2xl text-[#F0EDE8] mb-4 text-center">{t('individual.cta.title')}</h3>
            <p className="font-heading text-[#9A9A9A] font-light text-center mb-8 max-w-lg leading-relaxed">
              {t('individual.cta.text')}
            </p>

            <Link
              to="/agenda"
              className="group inline-flex items-center gap-3 text-center font-heading text-[12px] tracking-[3px] uppercase bg-accent text-primary px-10 py-4 hover:bg-background hover:text-primary transition-colors duration-300 font-semibold rounded-full mb-12"
            >
              {t('individual.cta.button')}
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
