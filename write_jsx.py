import json
import codecs

jsx = """import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: 0.1 + i * 0.06, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } })
};

export default function GoodMorningDancePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { scrollY } = useScroll();
  const logoOpacity = useTransform(scrollY, [700, 1000], [0.4, 0]);

  const block1 = t('good_morning_dance.block1', { returnObjects: true }) || {};
  const session = t('good_morning_dance.session', { returnObjects: true }) || {};
  const experience = t('good_morning_dance.experience', { returnObjects: true }) || {};
  const different_way = t('good_morning_dance.different_way', { returnObjects: true }) || {};
  const items = session.items || [];

  return (
    <div className="bg-primary min-h-screen font-sans text-background">
      <Navbar />

      <div className="pt-32 md:pt-40 pb-24 relative flex flex-col min-h-screen">
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

        <div className="max-w-[900px] mx-auto px-8 md:px-16 lg:px-20 relative z-10 my-auto w-full">
          {/* HEADER */}
          <header className="mb-12">
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="font-heading text-[10px] tracking-[5px] uppercase text-accent/80 mb-5"
            >
              {t('good_morning_dance.kicker', 'BE THE DANCE')}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-batang text-4xl md:text-6xl font-normal mb-6 leading-tight text-[#F0EDE8]"
            >
              {t('good_morning_dance.title', 'Good Morning Dance')}
            </motion.h1>

            <motion.div initial={{ width: 0 }} animate={{ width: 48 }} transition={{ delay: 0.3, duration: 0.6 }}
              className="h-[1px] bg-accent/70 mb-8"
            />

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="font-heading text-xl text-[#CFCFCF] font-light leading-relaxed"
            >
              {t('good_morning_dance.subtitle')}
            </motion.p>
          </header>

          {/* DRAMATIC HOOK */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45, duration: 0.7 }}
            className="border-l-2 border-accent/50 pl-8 md:pl-10 mb-16"
          >
            <p className="font-drama italic text-2xl md:text-3xl text-[#E8E0D4] leading-[1.45]">
              {t('good_morning_dance.hook')}
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

          {/* BLOCK 1 */}
          <div className="space-y-0">
            <motion.p
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp} custom={0}
              className="font-heading font-light text-[#CFCFCF] text-base md:text-lg leading-[1.85] mb-8"
            >
              {block1.p1}
            </motion.p>

            <motion.p
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp} custom={1}
              className="font-heading font-light text-[#CFCFCF] text-base md:text-lg leading-[1.85] mb-8"
            >
              {block1.p2}
            </motion.p>

            <motion.p
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp} custom={2}
              className="font-heading font-light text-[#CFCFCF] text-base md:text-lg leading-[1.85] mb-8"
            >
              {block1.p3}
            </motion.p>

            {/* Pull quote 1 */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp} custom={3}
              className="py-10 md:py-14 flex justify-center"
            >
              <div className="max-w-lg text-center">
                <div className="w-8 h-[1px] bg-accent/30 mx-auto mb-6" />
                <p className="font-drama italic text-xl md:text-2xl text-[#E2C366] leading-[1.5]">
                  {block1.pullQuote}
                </p>
                <div className="w-8 h-[1px] bg-accent/30 mx-auto mt-6" />
              </div>
            </motion.div>
          </div>

          {/* BLOCK 2: A SESSAO */}
          <section className="mt-16 mb-16">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={0}
            >
              <h2 className="font-batang text-3xl md:text-4xl text-[#F0EDE8] mb-10">
                {session.title}
              </h2>
            </motion.div>

            <div className="grid gap-8">
              {items && items.length > 0 && items.map((item, index) => (
                <motion.div 
                  key={index}
                  initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
                  variants={fadeUp} custom={index + 1}
                  className="bg-[#0C0C0C] p-8 md:p-10 border border-slate-800/60"
                >
                  <h3 className="font-heading uppercase tracking-widest text-sm text-accent mb-4">{item.title}</h3>
                  <p className="font-heading font-light text-[#CFCFCF] text-base md:text-lg leading-[1.7]">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* BLOCK 3: A EXPERIENCIA */}
          <section className="mt-24 mb-16">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={0}
            >
              <h2 className="font-batang text-3xl md:text-4xl text-[#F0EDE8] mb-10">
                {experience.title}
              </h2>
            </motion.div>

            <div className="space-y-0">
              <motion.p
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
                variants={fadeUp} custom={1}
                className="font-heading font-light text-[#CFCFCF] text-base md:text-lg leading-[1.85] mb-8"
              >
                {experience.p1}
              </motion.p>
              
              <motion.p
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
                variants={fadeUp} custom={2}
                className="font-heading font-light text-[#CFCFCF] text-base md:text-lg leading-[1.85] mb-8"
              >
                {experience.p2}
              </motion.p>
              
              <motion.p
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
                variants={fadeUp} custom={3}
                className="font-heading font-light text-[#CFCFCF] text-base md:text-lg leading-[1.85] mb-8"
              >
                {experience.p3}
              </motion.p>
              
              <motion.p
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
                variants={fadeUp} custom={4}
                className="font-heading font-light text-[#CFCFCF] text-base md:text-lg leading-[1.85] mb-8"
              >
                {experience.p4}
              </motion.p>
            </div>
          </section>

          {/* BLOCK 4: UMA MANEIRA DIFERENTE */}
          <section className="mt-24 mb-16">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={0}
            >
              <h2 className="font-batang text-3xl md:text-4xl text-[#F0EDE8] mb-10">
                {different_way.title}
              </h2>
            </motion.div>

            <div className="space-y-0">
              <motion.p
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
                variants={fadeUp} custom={1}
                className="font-heading font-light text-[#CFCFCF] text-base md:text-lg leading-[1.85] mb-8"
              >
                {different_way.p1}
              </motion.p>

              {/* Pull quote 2 */}
              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
                variants={fadeUp} custom={2}
                className="py-10 md:py-14 flex justify-center"
              >
                <div className="max-w-lg text-center">
                  <div className="w-8 h-[1px] bg-accent/30 mx-auto mb-6" />
                  <p className="font-drama italic text-xl md:text-2xl text-[#E2C366] leading-[1.5]">
                    {different_way.pullQuote}
                  </p>
                  <div className="w-8 h-[1px] bg-accent/30 mx-auto mt-6" />
                </div>
              </motion.div>

              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
                variants={fadeUp} custom={3}
                className="mt-12 mb-8 bg-[#0C0C0C] p-8 md:p-12 border border-accent/20"
              >
                <p className="font-heading font-light text-[#E8E0D4] text-lg md:text-xl leading-[1.85] mb-6 italic">
                  "{different_way.closingQuote}"
                </p>
                <p className="font-heading text-accent/80 uppercase tracking-[3px] text-sm">
                  {different_way.signoff}
                </p>
              </motion.div>

            </div>
          </section>

          {/* FOOTER CTA */}
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="mt-24 pt-16 border-t border-slate-800/60 flex flex-col items-center text-center"
          >
            <h3 className="font-batang text-2xl md:text-3xl text-[#F0EDE8] mb-6">
              {t('actions.interested', 'Quer fazer parte?')}
            </h3>
            <Link to="/contato" className="group relative inline-flex items-center justify-center px-8 py-4 bg-[#F0EDE8] text-[#0A0A0E] overflow-hidden transition-transform hover:scale-[1.02]">
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative font-heading uppercase tracking-[2px] text-[11px] font-semibold">
                {t('actions.contact_us', 'Entre em contato')}
              </span>
            </Link>
          </motion.div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
"""

with codecs.open('C:/Renas/Antigravity/Website-builder/src/pages/GoodMorningDancePage.jsx', 'w', 'utf-8') as f:
    f.write(jsx)
print("JSX written successfully")
