import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Monitor, PersonStanding, Zap, Eye, Sprout, Handshake } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: 0.1 + i * 0.06, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } })
};

const benefitCards = [
  'consciousness', 'tension_relief', 'mobility',
  'coordination', 'pause', 'presence',
  'overload', 'selfcare', 'environment'
];

const audienceIcons = [
  { icon: Monitor, key: 'seated' },
  { icon: PersonStanding, key: 'standing' },
  { icon: Zap, key: 'high_demand' },
  { icon: Eye, key: 'attention' },
  { icon: Sprout, key: 'wellbeing_culture' },
  { icon: Handshake, key: 'relationships' },
];

export default function CorporatePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const body = t('corporate.body', { returnObjects: true });
  const benefits = t('corporate.benefits', { returnObjects: true });
  const audience = t('corporate.audience', { returnObjects: true });
  const workshops = t('corporate.workshops_section', { returnObjects: true });

  return (
    <div className="bg-primary min-h-screen font-sans text-background">
      <Navbar />

      <div className="pt-40 md:pt-52 pb-24 relative">

        {/* Watermark Logo */}
        <div className="fixed top-24 md:top-36 left-0 w-full px-6 lg:px-12 pointer-events-none z-40">
          <div className="max-w-7xl mx-auto flex">
            <img
              src="/logo-biostretch.png"
              alt="Biostretch"
              className="h-8 md:h-16 ml-4 md:ml-10 object-contain opacity-40"
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
              {t('corporate.kicker')}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-batang text-4xl md:text-6xl font-normal mb-6 leading-tight text-[#F0EDE8]"
            >
              {t('corporate.title')}
            </motion.h1>

            <motion.div initial={{ width: 0 }} animate={{ width: 48 }} transition={{ delay: 0.3, duration: 0.6 }}
              className="h-[1px] bg-accent/70 mb-8"
            />

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="font-heading text-xl text-[#CFCFCF] font-light leading-relaxed"
            >
              {t('corporate.subtitle')}
            </motion.p>
          </header>

          {/* DRAMATIC HOOK */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45, duration: 0.7 }}
            className="border-l-2 border-accent/50 pl-8 md:pl-10 mb-16"
          >
            <p className="font-drama italic text-2xl md:text-3xl text-[#E8E0D4] leading-[1.45]">
              {t('corporate.hook')}
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

        {/* BENEFITS SECTION */}
        <section className="mt-24 mb-24">
          <div className="max-w-[900px] mx-auto px-8 md:px-16 lg:px-20">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={0}
              className="mb-12"
            >
              <span className="font-heading text-[10px] tracking-[5px] uppercase text-accent block mb-6">
                {benefits.kicker}
              </span>
              <p className="font-heading font-light text-[#CFCFCF] text-base md:text-lg leading-[1.85]">
                {benefits.intro}
              </p>
            </motion.div>
          </div>

          <div className="max-w-[1100px] mx-auto px-8 md:px-16 lg:px-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {benefitCards.map((key, index) => (
                <motion.div
                  key={key}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-30px' }}
                  variants={fadeUp}
                  custom={index}
                  className="group relative bg-[#141414] border border-[#222222] rounded-[2px] p-8 transition-all duration-500 hover:border-accent/25"
                >
                  <div className="w-6 h-[1px] bg-accent/50 mb-5 group-hover:w-10 transition-all duration-500" />
                  <h4 className="font-drama italic text-lg text-[#E2C366] mb-3 leading-tight">
                    {benefits.cards[key]?.title}
                  </h4>
                  <p className="font-heading text-[13px] text-[#9A9A9A] font-light leading-[1.7]">
                    {benefits.cards[key]?.desc}
                  </p>
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
                  className="group flex items-start gap-5 p-6 bg-[#141414] border border-[#222222] rounded-[2px] transition-all duration-500 hover:border-accent/25"
                >
                  <div className="shrink-0 mt-0.5">
                    <Icon size={20} className="text-accent/60 group-hover:text-accent transition-colors duration-500" strokeWidth={1.5} />
                  </div>
                  <p className="font-heading text-[14px] text-[#CFCFCF] font-light leading-[1.7]">
                    {audience.items[key]}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* WORKSHOPS SECTION */}
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
              {t('corporate.closing')}
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="mt-24 pt-16 border-t border-[#222222] flex flex-col items-center"
          >
            <h3 className="font-batang text-2xl text-[#F0EDE8] mb-4 text-center">{t('corporate.cta.title')}</h3>
            <p className="font-heading text-[#9A9A9A] font-light text-center mb-8 max-w-lg leading-relaxed">
              {t('corporate.cta.text')}
            </p>

            <Link
              to="/agenda"
              className="group inline-flex items-center gap-3 text-center font-heading text-[12px] tracking-[3px] uppercase bg-accent text-primary px-10 py-4 hover:bg-background hover:text-primary transition-colors duration-300 font-semibold rounded-full mb-12"
            >
              {t('corporate.cta.button')}
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
