import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Award, Users } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function BeTheDanceUngPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] } }
  };

  const audienceIcons = [
    { icon: Heart, key: 0 },
    { icon: Award, key: 1 },
    { icon: Users, key: 2 },
  ];

  return (
    <div className="bg-[#0a0a0e] min-h-screen font-sans text-background selection:bg-accent/30 overflow-x-hidden">
      <SEOHead 
        title={t('btd_ung.seoTitle')} 
        description={t('btd_ung.seoDesc')} 
      />
      
      <Navbar />

      <main className="pt-24 pb-0 relative">
        {/* HERO SECTION */}
        <section className="relative pt-24 md:pt-32 pb-24 px-6 lg:px-12 bg-gradient-to-br from-[#0c0c0c] to-[#121212] border-b border-[#222222] overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, #C9A84C 0%, transparent 40%)' }} />
          
          <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-12 lg:gap-20">
            <motion.div 
              initial="hidden" animate="visible" variants={fadeUp} 
              className="flex-1 text-center md:text-left"
            >
              <span className="font-heading text-[10px] md:text-[11px] tracking-[5px] uppercase text-accent mb-6 block">
                {t('btd_ung.kicker')}
              </span>
              <h1 className="font-drama text-5xl md:text-7xl lg:text-8xl text-background mb-6 leading-[0.9] tracking-tight">
                Be the<br/><span className="italic text-accent">Dance Ung.</span>
              </h1>
              <p className="font-heading font-light text-[#9A9A9A] text-lg md:text-xl max-w-xl mx-auto md:mx-0 leading-[1.8] mb-10">
                {t('btd_ung.subtitle')}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="flex-1 w-full"
            >
              <div className="aspect-[4/5] md:aspect-square relative rounded-[4px] overflow-hidden group">
                <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/0 transition-colors duration-1000"></div>
                <img src="/gallery/sequence/frame-240.jpg" alt="Be the Dance Ung" className="w-full h-full object-cover filter grayscale opacity-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1500ms]" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* INTRO TEXT */}
        <section className="py-24 md:py-32 px-6 lg:px-12 bg-[#0a0a0e]">
          <div className="max-w-4xl mx-auto text-center">
            <motion.p 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp}
              className="font-heading font-light text-[#CFCFCF] text-xl md:text-3xl leading-[1.7] md:leading-[1.8]"
            >
              {t('btd_ung.intro')}
            </motion.p>
          </div>
        </section>

        {/* PILLARS / UMBRELLA */}
        <section className="py-24 bg-[#0d0d12] border-y border-[#222222]">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="mb-20 text-center">
              <span className="font-heading text-[10px] tracking-[5px] uppercase text-accent mb-6 block">
                {t('btd_ung.pillarsKicker')}
              </span>
              <h2 className="font-drama italic text-4xl md:text-5xl text-background">
                {t('btd_ung.pillarsTitle')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[0, 1, 2].map((i) => (
                <motion.div 
                  key={i}
                  initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} custom={i}
                  className="group bg-[#141414] border border-[#1f1f1f] rounded-[2px] p-8 md:p-10 hover:border-accent/30 transition-all duration-500 hover:-translate-y-2 flex flex-col"
                >
                  <div className="font-heading text-[10px] tracking-[3px] uppercase text-accent mb-4">
                    0{i + 1}
                  </div>
                  <h3 className="font-batang text-2xl text-background mb-4 group-hover:text-accent transition-colors">
                    {t(`btd_ung.pillars.${i}.title`)}
                  </h3>
                  <div className="inline-block px-3 py-1 bg-accent/10 border border-accent/20 text-accent text-[9px] uppercase tracking-[2px] rounded-full mb-6 w-fit">
                    {t(`btd_ung.pillars.${i}.label`)}
                  </div>
                  <p className="font-heading font-light text-[#9A9A9A] leading-[1.8] flex-grow">
                    {t(`btd_ung.pillars.${i}.desc`)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* AUDIENCE / GOALS */}
        <section className="py-24 md:py-32 bg-[#0a0a0e]">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="mb-16 text-center">
              <span className="font-heading text-[10px] tracking-[5px] uppercase text-accent mb-6 block">
                {t('btd_ung.audienceKicker')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {audienceIcons.map(({ icon: Icon, key }, index) => (
                <motion.div
                  key={key}
                  initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-30px' }} variants={fadeUp} custom={index}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="w-16 h-16 rounded-full border border-[#222222] bg-[#111] flex items-center justify-center mb-6 group-hover:border-accent/50 group-hover:bg-accent/5 transition-all duration-500">
                    <Icon size={24} className="text-accent/60 group-hover:text-accent transition-colors" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-drama text-2xl text-background mb-4">
                    {t(`btd_ung.audience.${key}.title`)}
                  </h3>
                  <p className="font-heading font-light text-[#9A9A9A] leading-[1.8]">
                    {t(`btd_ung.audience.${key}.desc`)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* MENTORSHIP SECTION */}
        <section className="py-24 bg-gradient-to-b from-[#0a0a0e] to-[#0c0c0c] border-t border-[#111]">
          <div className="max-w-5xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="flex-1"
            >
              <img src="/images/creator-be-the-dance.jpg" alt="Safia" className="w-full max-w-sm mx-auto rounded-[2px] filter grayscale opacity-80" />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="flex-1 text-center md:text-left"
            >
              <span className="font-heading text-[10px] tracking-[5px] uppercase text-accent mb-6 block">
                {t('btd_ung.mentorKicker')}
              </span>
              <p className="font-heading font-light text-[#CFCFCF] text-lg leading-[1.8]">
                {t('btd_ung.mentorText')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* CLOSING */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="py-24 text-center px-6"
        >
          <p className="font-drama italic text-3xl md:text-4xl text-[#E2C366] leading-[1.4] whitespace-pre-line">
            {t('btd_ung.closing')}
          </p>
        </motion.div>

        {/* CTA */}
        <section className="py-24 border-t border-[#222222] bg-[#0a0a0e] text-center px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h3 className="font-batang text-3xl text-[#F0EDE8] mb-4">{t('btd_ung.cta.title')}</h3>
            <p className="font-heading text-[#9A9A9A] font-light mb-10 max-w-md mx-auto leading-relaxed">
              {t('btd_ung.cta.text')}
            </p>
            <Link
              to="/contato?subject=btd-ung-parceria"
              className="inline-block font-heading text-[12px] tracking-[3px] uppercase bg-accent text-primary px-10 py-4 hover:bg-background hover:text-primary transition-colors duration-300 font-semibold rounded-full mb-12"
            >
              {t('btd_ung.cta.button')}
            </Link>
            <div className="block">
              <button
                onClick={() => navigate(-1)}
                className="font-heading text-[10px] tracking-[4px] uppercase text-[#CFCFCF] hover:text-accent flex items-center justify-center transition-colors pb-1 mx-auto"
              >
                <span className="mr-2">&larr;</span> {t('actions.back', 'Voltar')}
              </button>
            </div>
          </motion.div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
