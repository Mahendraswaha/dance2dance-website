import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Monitor, PersonStanding, Zap, Eye, Sprout, Handshake, Activity, Wind, Move, Compass, Coffee, Sun, Shield, Heart, Users } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: 0.1 + i * 0.06, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } })
};

const benefitCards = [
  { key: 'consciousness', icon: Activity },
  { key: 'tension_relief', icon: Wind },
  { key: 'mobility', icon: Move },
  { key: 'coordination', icon: Compass },
  { key: 'pause', icon: Coffee },
  { key: 'presence', icon: Sun },
  { key: 'overload', icon: Shield },
  { key: 'selfcare', icon: Heart },
  { key: 'environment', icon: Users }
];

const audienceIcons = [
  { icon: Monitor, key: 'seated' },
  { icon: PersonStanding, key: 'standing' },
  { icon: Zap, key: 'high_demand' },
  { icon: Eye, key: 'attention' },
  { icon: Sprout, key: 'wellbeing_culture' },
  { icon: Handshake, key: 'relationships' },
];


const Emblem = ({ children }) => (
  <div className="relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 mt-4">
    <div className="absolute inset-0 rounded-full border border-accent/30" />
    <div className="absolute inset-1 rounded-full border border-accent/10" />
    <div className="absolute inset-2 rounded-full border border-accent/40 border-dashed" />
    <div className="absolute inset-0 rounded-full bg-accent/5 blur-sm" />
    <div className="relative text-accent">
      {children}
    </div>
  </div>
);

export default function CorporatePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { scrollY } = useScroll();
  const logoOpacity = useTransform(scrollY, [200, 500], [0.4, 0]);


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
              {benefitCards.map(({ key, icon: Icon }, index) => (
                <motion.div
                  key={key}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-30px' }}
                  variants={fadeUp}
                  custom={index}
                  className="group relative bg-gradient-to-br from-[#141414] to-[#0a0a0a] border border-[#222222] rounded-[2px] p-8 md:p-10 transition-all duration-500 hover:border-accent/40 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(226,195,102,0.05)] overflow-hidden flex flex-col items-center justify-center text-center"
                >
                  <div className="absolute inset-2 border border-accent/10 rounded-[1px] pointer-events-none group-hover:border-accent/20 transition-colors duration-500" />
                  
                  <div className="absolute top-4 left-5 md:top-5 md:left-6 font-drama text-3xl md:text-4xl text-accent/30 font-light group-hover:text-accent/60 transition-colors duration-500">
                    {index + 1}
                  </div>

                  <Emblem>
                    <Icon size={32} strokeWidth={1} />
                  </Emblem>

                  <h4 className="font-heading text-[11px] md:text-[12px] tracking-[2px] uppercase text-[#E2C366] font-medium leading-[1.4] w-full mt-2 group-hover:text-[#F0EDE8] transition-colors duration-500">
                    {benefits.cards[key]?.title}
                  </h4>
                  <p className="font-heading text-[12px] text-[#9A9A9A] font-light leading-[1.6] mt-3 max-w-[85%]">
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
                  className="group relative bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-[#1f1f1f] rounded-[4px] py-10 px-6 md:py-16 md:px-8 flex flex-col items-center justify-center transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-accent/25 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(226,195,102,0.08)] overflow-hidden min-h-[260px] md:min-h-[320px]"
                >
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-[400ms]" />
                  
                  <div className="font-drama text-2xl text-accent mb-2 font-normal opacity-40">0{index + 1}</div>
                  <div className="w-[30px] h-[1px] bg-accent mb-6 opacity-40" />

                  <Icon size={36} className="text-accent/60 group-hover:text-accent transition-colors duration-500 mb-6" strokeWidth={1} />
                  
                  <p className="font-heading text-[12px] tracking-[1px] uppercase text-[#d4cfc7] text-center font-medium leading-[1.6]">
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
