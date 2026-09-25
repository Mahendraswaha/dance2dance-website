import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Award, Users } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Dance2DanceKvinnePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] } }
  };

  const audienceIcons = [
    { icon: Users, key: 0 },
    { icon: Award, key: 1 },
    { icon: Heart, key: 2 },
  ];

  let programItems = t('btd_kvinne.program_section.items', { returnObjects: true });
  if (typeof programItems === 'string') {
    try { programItems = JSON.parse(programItems); } catch(e) {}
  }
  if (!Array.isArray(programItems)) programItems = [];

  const impactItems = t('btd_kvinne.impact_section.items', { returnObjects: true }) || [];

  return (
    <div className="bg-[#0A0A0E] min-h-screen font-sans text-background selection:bg-accent/30 overflow-x-hidden">
      <SEOHead 
        title={t('btd_kvinne.seoTitle')} 
        description={t('btd_kvinne.seoDesc')} 
      />
      
      <Navbar />

      <div className="pt-32 pb-24 relative">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 relative z-10">
          
          {/* HERO SPLIT */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-24 mt-12">
            <div className="w-full lg:w-1/2">
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="font-heading text-[10px] tracking-[5px] uppercase text-accent mb-6"
              >
                {t('btd_kvinne.kicker')}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-batang text-5xl md:text-6xl lg:text-7xl font-normal mb-8 leading-tight text-[#F0EDE8]"
              >
                {t('btd_kvinne.title')}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                className="font-heading text-lg md:text-xl text-[#CFCFCF] font-light leading-relaxed max-w-lg mb-8"
              >
                {t('btd_kvinne.subtitle')}
              </motion.p>
              
              <motion.div initial={{ width: 0 }} animate={{ width: 64 }} transition={{ delay: 0.3, duration: 0.6 }}
                className="h-[1px] bg-accent/70"
              />
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="w-full lg:w-1/2"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-[2px] relative group">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700 z-10" />
                <img 
                  src="/images/dance2dance-kvinne.jpg" 
                  alt="Dance2Dance Kvinne" 
                  className="w-full h-full object-cover filter grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                />
              </div>
            </motion.div>
          </div>

          <div className="max-w-[900px] mx-auto">
            {/* DRAMATIC HOOK */}
            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45, duration: 0.7 }}
              className="border-l-2 border-accent/50 pl-8 md:pl-10 mb-16"
            >
              <p className="font-drama italic text-2xl md:text-3xl text-[#E8E0D4] leading-[1.45]">
                "{t('btd_kvinne.hook')}"
              </p>
            </motion.div>

            {/* BODY PARAGRAPHS */}
            <div className="space-y-0 mb-24">
              <motion.p
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
                variants={fadeUp}
                className="font-heading font-light text-[#CFCFCF] text-base md:text-lg leading-[1.85] mb-8"
              >
                {t('btd_kvinne.body.p1')}
              </motion.p>
            </div>
          </div>
        </div>

        {/* PROGRAM STRUCTURE SECTION */}
        <section className="bg-gradient-to-b from-[#0c0c0c] to-[#0A0A0E] py-24 mb-16 border-y border-[#181818]">
          <div className="max-w-[1100px] mx-auto px-8 md:px-16 lg:px-20">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp}
              className="mb-16"
            >
              <span className="font-heading text-[10px] tracking-[5px] uppercase text-accent block mb-6">
                {t('btd_kvinne.program_section.kicker')}
              </span>
              <p className="font-heading font-light text-[#CFCFCF] text-base md:text-lg leading-[1.85] max-w-[700px]">
                {t('btd_kvinne.program_section.intro')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
              {programItems.map((itemGroup, index) => (
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
                        {itemGroup.number}
                      </span>
                    </div>

                    <div className="min-h-[3.75rem] md:min-h-[4.75rem] flex flex-col justify-start mb-4">
                      <h3 className="font-batang text-xl md:text-2xl text-[#F0EDE8] tracking-tight leading-snug group-hover:text-accent transition-colors duration-500">
                        {itemGroup.title}
                      </h3>
                    </div>

                    <div className="w-10 h-[1px] bg-accent/40 mb-8 group-hover:w-16 transition-all duration-500" />

                    <div className="space-y-6">
                      {itemGroup.list?.map((subItem, iIndex) => (
                        <div key={iIndex} className="group/item transition-all duration-300">
                          <div className="flex items-start gap-3 mb-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent/60 mt-1.5 shrink-0 group-hover/item:bg-accent group-hover/item:shadow-[0_0_8px_rgba(226,195,102,0.7)] transition-all duration-300" />
                            <h4 className="font-heading text-[12px] uppercase tracking-[1.5px] text-[#E2C366] group-hover/item:text-[#F0EDE8] font-medium leading-snug transition-colors duration-300">
                              {subItem.label}
                            </h4>
                          </div>
                          <p className="font-heading text-[13px] text-[#9A9A9A] group-hover/item:text-[#DCD8D0] font-light leading-relaxed pl-4 transition-colors duration-300">
                            {subItem.desc}
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

        
        {/* POST-PROGRAM TEXT BLOCK */}
        <div className="max-w-[900px] mx-auto px-8 md:px-16 lg:px-20 mb-24">
          <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
                variants={fadeUp}
                className="my-14 text-center py-8 border-y border-[#222222]"
              >
                <h2 className="font-drama text-2xl md:text-3xl text-accent mb-2 italic px-4">
                  "{t('btd_kvinne.body.pullQuote')}"
                </h2>
              </motion.div>

              <motion.p
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
                variants={fadeUp}
                className="font-heading font-light text-[#CFCFCF] text-base md:text-lg leading-[1.85] mb-8"
              >
                {t('btd_kvinne.body.p2')}
              </motion.p>

              <motion.p
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
                variants={fadeUp}
                className="font-heading font-light text-[#CFCFCF] text-base md:text-lg leading-[1.85]"
              >
                {t('btd_kvinne.body.p3')}
              </motion.p>
        </div>

        {/* IMPACT SECTION */}
        <section className="mb-24">
          <div className="max-w-[900px] mx-auto px-8 md:px-16 lg:px-20">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={0}
              className="mb-12"
            >
              <span className="font-heading text-[10px] tracking-[5px] uppercase text-accent block mb-6">
                {t('btd_kvinne.impact_section.kicker')}
              </span>
              <p className="font-heading font-light text-[#CFCFCF] text-base md:text-lg leading-[1.85]">
                {t('btd_kvinne.impact_section.intro')}
              </p>
            </motion.div>
          </div>

          <div className="max-w-[1100px] mx-auto px-8 md:px-16 lg:px-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {audienceIcons.map(({ icon: Icon, key }, index) => (
                <motion.div
                  key={key}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-30px' }}
                  variants={fadeUp}
                  custom={index}
                  className="group relative bg-gradient-to-br from-[#141414] to-[#0f0f0f] border border-[#1f1f1f] rounded-[4px] py-10 px-8 md:py-16 md:px-10 flex flex-col transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:border-accent/25 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(226,195,102,0.08)] overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-[400ms]" />
                  
                  <div className="flex items-center gap-4 mb-8">
                    <Icon size={32} className="text-accent/60 group-hover:text-accent transition-colors duration-500" strokeWidth={1} />
                    <div className="w-[30px] h-[1px] bg-accent opacity-40" />
                    <div className="font-drama text-2xl text-accent font-normal opacity-40">0{index + 1}</div>
                  </div>
                  
                  <h4 className="font-heading text-[14px] tracking-[1px] uppercase text-[#F0EDE8] font-medium leading-[1.6] mb-4">
                    {impactItems[key]?.title}
                  </h4>
                  <p className="font-heading text-[14px] text-[#A1A1A1] group-hover:text-[#CFCFCF] font-light leading-[1.8] transition-colors duration-300">
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
                <Link to="/safia" className="block aspect-[3/4] overflow-hidden rounded-[2px] relative group cursor-pointer">
                    <img src="/images/creator-be-the-dance.jpg" alt="Safia" className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <span className="text-white font-heading text-xs tracking-widest uppercase border border-white/40 px-6 py-2 rounded-[2px] backdrop-blur-sm">Safia CV</span>
                    </div>
                  </Link>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="w-full md:w-3/5 text-left"
              >
                <span className="font-heading text-[10px] tracking-[5px] uppercase text-accent mb-6 block">
                  {t('btd_kvinne.mentorKicker')}
                </span>
                <p className="font-heading font-light text-[#CFCFCF] text-base md:text-lg leading-[1.85]">
                  {t('btd_kvinne.mentorText')}
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
              {t('btd_kvinne.closing')}
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="mt-24 pt-16 border-t border-[#222222] flex flex-col items-center"
          >
            <h3 className="font-batang text-2xl text-[#F0EDE8] mb-4 text-center">{t('btd_kvinne.cta.title')}</h3>
            <p className="font-heading text-[#9A9A9A] font-light text-center mb-8 max-w-lg leading-relaxed">
              {t('btd_kvinne.cta.text')}
            </p>

            <Link
              to="/contato?subject=reuniao-executiva"
              className="group inline-flex items-center gap-3 text-center font-heading text-[12px] tracking-[3px] uppercase bg-accent text-primary px-10 py-4 hover:bg-background hover:text-primary transition-colors duration-300 font-semibold rounded-full mb-12"
            >
              {t('btd_kvinne.cta.button')}
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
