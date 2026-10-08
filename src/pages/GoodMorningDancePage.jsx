import React, { useState, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock, Tag, Users, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WorkshopAgendaSection from '../components/WorkshopAgendaSection';
import programsData from '../data/programs.json';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: 0.1 + i * 0.06, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } })
};

export default function GoodMorningDancePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const block1 = t('good_morning_dance.block1', { returnObjects: true }) || {};
  const session = t('good_morning_dance.session', { returnObjects: true }) || {};
  const experience = t('good_morning_dance.experience', { returnObjects: true }) || {};
  const different_way = t('good_morning_dance.different_way', { returnObjects: true }) || {};
  const items = session.items || [];

  const program = programsData['be-the-dance'];
  const workshop = { id: 'good-morning-dance', title: 'Good Morning Dance', slug: 'good-morning-dance' };

  // Estado contextual da agenda do workshop
  const [agendaState, setAgendaState] = useState({ loaded: false, hasDates: false, hasSpots: false });
  const handleEventsLoaded = useCallback((matchingEvents) => {
    if (!matchingEvents || matchingEvents.length === 0) {
      setAgendaState({ loaded: true, hasDates: false, hasSpots: false });
    } else {
      const anySpotAvailable = matchingEvents.some(ev => (ev.enrolledCount || 0) < (ev.totalSpots || 0));
      setAgendaState({ loaded: true, hasDates: true, hasSpots: anySpotAvailable });
    }
  }, []);

  const contextualSubtitle = !agendaState.loaded
    ? t('actions.ready_to_start_sub', 'Inscreva-se em uma das datas abaixo ou entre na lista de interesse para novas turmas.')
    : agendaState.hasDates
      ? (agendaState.hasSpots 
          ? t('actions.ready_to_start_has_spots', 'Inscreva-se agora e garanta sua vaga.')
          : t('actions.ready_to_start_waitlist', 'Inscreva-se na lista de espera.'))
      : t('actions.ready_to_start_wishlist', 'Inscreva-se na lista de interesse para novas turmas.');

  return (
    <div className="bg-primary min-h-screen font-sans text-background">
      <Navbar />

      <div className="pt-32 md:pt-40 pb-24 relative flex flex-col min-h-screen">
        {/* Watermark Logo matching WorkshopTemplate logic */}
        <div className="fixed top-24 md:top-36 left-0 w-full px-6 lg:px-12 pointer-events-none z-40">
          <div className="max-w-7xl mx-auto flex">
            <img
              src="/logo-bethedance.png"
              alt="Be the Dance"
              className="h-12 md:h-24 ml-4 md:ml-10 object-contain opacity-40"
            />
          </div>
        </div>

        <div className="max-w-[900px] mx-auto px-8 md:px-16 lg:px-20 relative z-10 w-full">
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
              className="font-heading text-xl text-[#CFCFCF] font-light leading-relaxed mb-10"
            >
              {t('good_morning_dance.subtitle')}
            </motion.p>

            {/* INFO PILLS */}
            <motion.div 
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-3 mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-700/40 bg-[#0C0C0C]">
                <Clock size={14} className="text-accent/70" />
                <span className="font-data text-[12px] tracking-wide text-slate-300">1h</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-700/40 bg-[#0C0C0C]">
                <Tag size={14} className="text-accent/70" />
                <span className="font-data text-[12px] tracking-wide text-slate-300">200 kr</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-700/40 bg-[#0C0C0C]">
                <Users size={14} className="text-accent/70" />
                <span className="font-data text-[12px] tracking-wide text-slate-300">{t('workshop_info.all_levels', 'Todos os níveis')}</span>
              </div>
            </motion.div>
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
          <section className="mt-16 mb-24">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={0}
              className="mb-10"
            >
              <h2 className="font-heading text-[10px] tracking-[5px] uppercase text-accent/80 block">
                {session.title}
              </h2>
            </motion.div>

            <div className="grid gap-12">
              {items && items.length > 0 && items.map((item, index) => (
                <motion.div 
                  key={index}
                  initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
                  variants={fadeUp} custom={index + 1}
                >
                  <h3 className="font-drama italic text-2xl md:text-3xl text-[#E8E0D4] mb-3">{item.title}.</h3>
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
              className="mb-10"
            >
              <h2 className="font-heading text-[10px] tracking-[5px] uppercase text-accent/80 block">
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
              className="border-l-2 border-accent pl-6 md:pl-8 mb-16 max-w-3xl"
            >
              <h2 className="font-drama italic text-2xl md:text-3xl text-[#E8E0D4] leading-[1.45]">
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

              {/* Simple Blockquote Quote as per Print 5 and Be The Dance UNG */}
              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
                variants={fadeUp} custom={3}
                className="mt-16 mb-16 w-full"
              >
                <blockquote 
                  className="font-drama text-lg md:text-xl text-[#F0EDE8] leading-[1.7] mb-4"
                  dangerouslySetInnerHTML={{ __html: different_way.closingQuote }}
                />
                <p className="font-drama text-lg text-accent italic mb-10">
                  {different_way.signoff}
                </p>
              </motion.div>
                          </div>
            </section>
          </div>

          {/* 🌟 CALL TO ACTION & WORKSHOP AGENDA (SAME WIDTH AS AGENDA PAGE: max-w-[900px]) 🌟 */}
          <div className="max-w-[900px] mx-auto px-4 sm:px-6 md:px-8 relative z-10 mt-24 pt-16 border-t border-[#222222] flex flex-col items-center w-full">
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              className="text-center mb-6 max-w-2xl mx-auto"
            >
              <h3 className="font-batang text-3xl md:text-5xl text-[#F0EDE8] mb-3">
                {t('actions.ready_to_start', 'Pronto para começar?')}
              </h3>
              <p className="font-heading font-light text-[#9A9A9A] text-xs md:text-sm leading-relaxed whitespace-pre-line">
                {contextualSubtitle}
              </p>
            </motion.div>

            <WorkshopAgendaSection 
              program={program} 
              workshop={workshop} 
              onEventsLoaded={handleEventsLoaded}
            />

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 mb-12">
            <Link 
              to="/agenda" 
              className="group inline-flex items-center gap-3 text-center font-heading text-[12px] tracking-[3px] uppercase bg-accent text-primary px-9 py-4 hover:bg-white hover:text-primary transition-colors duration-300 font-bold rounded-full shadow-lg"
            >
              {t('actions.view_full_agenda', 'Ver agenda completa')}
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/be-the-dance#origem"
              className="inline-flex items-center gap-3 font-heading text-[12px] tracking-[3px] uppercase border border-white/70 text-white/80 px-9 py-4 hover:border-white hover:text-white transition-colors duration-300 font-semibold rounded-full"
            >
              {t('actions.discover_origin_btd', 'The origin of Be The Dance')}
            </Link>
          </div>

          <div className="flex justify-center border-t border-slate-800/60 pt-10">
            <button 
              onClick={() => navigate(-1)}
              className="font-heading text-[10px] tracking-[4px] uppercase text-[#CFCFCF] hover:text-accent flex items-center transition-colors border-b border-transparent hover:border-accent/30 pb-1 cursor-pointer"
            >
              <span className="mr-2">&larr;</span> {t('actions.back', 'Voltar')}
            </button>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
