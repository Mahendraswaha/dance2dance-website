import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import Brand from '../components/Brand';
import programsData from '../data/programs.json';
import { 
  ArrowRight, 
  Clock 
} from 'lucide-react';

export default function PricingPage() {
  const { t } = useTranslation();
  const [selectedProgram, setSelectedProgram] = useState('all'); // 'all', 'be-the-dance', 'biostretch'

  // Montar lista completa de workshops a partir de programs.json
  const btdWorkshops = (programsData['be-the-dance']?.workshops || []).map(w => ({
    ...w,
    programId: 'be-the-dance',
    programName: 'Be The Dance'
  }));

  const bioWorkshops = (programsData['biostretch']?.workshops || []).map(w => ({
    ...w,
    programId: 'biostretch',
    programName: 'Biostretch'
  }));

  const allWorkshops = [...btdWorkshops, ...bioWorkshops];

  const filteredWorkshops = selectedProgram === 'all' 
    ? allWorkshops 
    : allWorkshops.filter(w => w.programId === selectedProgram);

  return (
    <div className="bg-primary min-h-screen flex flex-col font-sans text-background selection:bg-accent/30">
      <SEOHead
        title={t('pricingPage.seoTitle', 'Valores & Acesso')}
        description={t('pricingPage.seoDesc', 'Transparência financeira e acesso comunitário. Conheça nossos valores por workshop e o programa de bolsas integrais para Tøyen e Grønland.')}
        url="/valores"
      />
      <Navbar />

      {/* 1. Main Container com margem superior ampla (pt-48 md:pt-56) para eliminar colisão com Navbar */}
      <main className="relative z-10 flex-grow pt-48 md:pt-56 pb-24 px-6 md:px-12 lg:px-20 max-w-6xl mx-auto w-full">

        {/* HERO SECTION */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20"
        >
          {/* Kicker no padrão do site com respiro generoso */}
          <span className="font-heading text-[10px] tracking-[5px] uppercase text-accent block mb-4 font-semibold">
            {t('pricingPage.hero.kicker', 'Sem Fins Lucrativos')}
          </span>

          <h1 className="font-batang text-4xl sm:text-5xl md:text-6xl text-[#F0EDE8] mb-5 tracking-tight font-normal">
            {t('pricingPage.hero.title', 'Valores & Acesso')}
          </h1>

          <div className="w-12 h-[1px] bg-accent/60 mx-auto mb-6" />

          <p className="font-heading text-[#CFCFCF] font-light text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            <Brand className="text-[#FAF8F5]" /> {t('pricingPage.hero.subtitle')}
          </p>
        </motion.header>

        {/* 2. CARDS COMPARATIVOS (SEM NÚMEROS 1 E 2, SUBTÍTULOS ALINHADOS À ESQUERDA, TEXTOS REVISADOS) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 mb-20 items-stretch">
          
          {/* Card: Participantes Pagantes */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group relative bg-gradient-to-b from-[#141414] to-[#0c0c0c] border border-[#222222] rounded-[2px] p-8 md:p-10 transition-all duration-500 hover:border-accent/40 flex flex-col justify-between"
          >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div>
              {/* Alinhamento na esquerda e sem numeração */}
              <div className="mb-3 text-left">
                <span className="font-heading text-[10px] tracking-[3px] uppercase text-[#777777] font-medium block">
                  {t('pricingPage.payerCard.subtitle', 'Para quem participa investindo')}
                </span>
              </div>

              <h3 className="font-batang text-xl md:text-2xl text-[#F0EDE8] tracking-tight leading-snug group-hover:text-accent transition-colors duration-500 mb-2 font-normal text-left">
                {t('pricingPage.payerCard.title', 'Valores Justos de Mercado')}
              </h3>

              <div className="w-10 h-[1px] bg-accent/40 mb-8 group-hover:w-16 transition-all duration-500" />

              <div className="space-y-6 text-left">
                {/* Item 1 */}
                <div className="group/item transition-all duration-300">
                  <div className="flex items-start gap-3 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/60 mt-1.5 shrink-0 group-hover/item:bg-accent group-hover/item:shadow-[0_0_8px_rgba(226,195,102,0.7)] transition-all duration-300" />
                    <h4 className="font-heading text-[12px] uppercase tracking-[1.5px] text-[#E2C366] group-hover/item:text-[#F0EDE8] font-medium leading-snug transition-colors duration-300">
                      {t('pricingPage.payerCard.item1Title', 'Saúde e Expressão')}
                    </h4>
                  </div>
                  <p className="font-heading text-[13px] text-[#9A9A9A] group-hover/item:text-[#DCD8D0] font-light leading-relaxed pl-4 transition-colors duration-300">
                    {t('pricingPage.payerCard.item1Desc')}
                  </p>
                </div>

                {/* Item 2: Texto revisado */}
                <div className="group/item transition-all duration-300">
                  <div className="flex items-start gap-3 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/60 mt-1.5 shrink-0 group-hover/item:bg-accent group-hover/item:shadow-[0_0_8px_rgba(226,195,102,0.7)] transition-all duration-300" />
                    <h4 className="font-heading text-[12px] uppercase tracking-[1.5px] text-[#E2C366] group-hover/item:text-[#F0EDE8] font-medium leading-snug transition-colors duration-300">
                      {t('pricingPage.payerCard.item2Title', 'Conexões Reais & Presença')}
                    </h4>
                  </div>
                  <p className="font-heading text-[13px] text-[#9A9A9A] group-hover/item:text-[#DCD8D0] font-light leading-relaxed pl-4 transition-colors duration-300">
                    {t('pricingPage.payerCard.item2Desc')}
                  </p>
                </div>

                {/* Item 3 */}
                <div className="group/item transition-all duration-300">
                  <div className="flex items-start gap-3 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/60 mt-1.5 shrink-0 group-hover/item:bg-accent group-hover/item:shadow-[0_0_8px_rgba(226,195,102,0.7)] transition-all duration-300" />
                    <h4 className="font-heading text-[12px] uppercase tracking-[1.5px] text-[#E2C366] group-hover/item:text-[#F0EDE8] font-medium leading-snug transition-colors duration-300">
                      {t('pricingPage.payerCard.item3Title', 'Impacto Social Compartilhado')}
                    </h4>
                  </div>
                  <p className="font-heading text-[13px] text-[#9A9A9A] group-hover/item:text-[#DCD8D0] font-light leading-relaxed pl-4 transition-colors duration-300">
                    {t('pricingPage.payerCard.item3Desc')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card: Bolsas Integrais Comunitárias */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group relative bg-gradient-to-b from-[#141414] to-[#0c0c0c] border border-[#222222] rounded-[2px] p-8 md:p-10 transition-all duration-500 hover:border-accent/40 flex flex-col justify-between"
          >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div>
              {/* Alinhamento na esquerda e sem numeração */}
              <div className="mb-3 text-left">
                <span className="font-heading text-[10px] tracking-[3px] uppercase text-[#777777] font-medium block">
                  {t('pricingPage.communityCard.subtitle', 'Para quem participa por bolsa')}
                </span>
              </div>

              <h3 className="font-batang text-xl md:text-2xl text-[#F0EDE8] tracking-tight leading-snug group-hover:text-accent transition-colors duration-500 mb-2 font-normal text-left">
                {t('pricingPage.communityCard.title', 'Bolsas Integrais de 100%')}
              </h3>

              <div className="w-10 h-[1px] bg-accent/40 mb-8 group-hover:w-16 transition-all duration-500" />

              <div className="space-y-6 text-left">
                {/* Item 1: Texto revisado com 'a possibilidade de acesso gratuito' */}
                <div className="group/item transition-all duration-300">
                  <div className="flex items-start gap-3 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/60 mt-1.5 shrink-0 group-hover/item:bg-accent group-hover/item:shadow-[0_0_8px_rgba(226,195,102,0.7)] transition-all duration-300" />
                    <h4 className="font-heading text-[12px] uppercase tracking-[1.5px] text-[#E2C366] group-hover/item:text-[#F0EDE8] font-medium leading-snug transition-colors duration-300">
                      {t('pricingPage.communityCard.item1Title', 'Gratuidade Total')}
                    </h4>
                  </div>
                  <p className="font-heading text-[13px] text-[#9A9A9A] group-hover/item:text-[#DCD8D0] font-light leading-relaxed pl-4 transition-colors duration-300">
                    {t('pricingPage.communityCard.item1Desc')}
                  </p>
                </div>

                {/* Item 2: Texto revisado com vocação profissional e autodesenvolvimento */}
                <div className="group/item transition-all duration-300">
                  <div className="flex items-start gap-3 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/60 mt-1.5 shrink-0 group-hover/item:bg-accent group-hover/item:shadow-[0_0_8px_rgba(226,195,102,0.7)] transition-all duration-300" />
                    <h4 className="font-heading text-[12px] uppercase tracking-[1.5px] text-[#E2C366] group-hover/item:text-[#F0EDE8] font-medium leading-snug transition-colors duration-300">
                      {t('pricingPage.communityCard.item2Title', 'Vocação e Novos Potenciais')}
                    </h4>
                  </div>
                  <p className="font-heading text-[13px] text-[#9A9A9A] group-hover/item:text-[#DCD8D0] font-light leading-relaxed pl-4 transition-colors duration-300">
                    {t('pricingPage.communityCard.item2Desc')}
                  </p>
                </div>

                {/* Item 3 */}
                <div className="group/item transition-all duration-300">
                  <div className="flex items-start gap-3 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/60 mt-1.5 shrink-0 group-hover/item:bg-accent group-hover/item:shadow-[0_0_8px_rgba(226,195,102,0.7)] transition-all duration-300" />
                    <h4 className="font-heading text-[12px] uppercase tracking-[1.5px] text-[#E2C366] group-hover/item:text-[#F0EDE8] font-medium leading-snug transition-colors duration-300">
                      {t('pricingPage.communityCard.item3Title', 'A Mesma Excelência')}
                    </h4>
                  </div>
                  <p className="font-heading text-[13px] text-[#9A9A9A] group-hover/item:text-[#DCD8D0] font-light leading-relaxed pl-4 transition-colors duration-300">
                    {t('pricingPage.communityCard.item3Desc')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

        </section>

        {/* 3. MANIFESTO DE TRANSPARÊNCIA (PRINT 2: MAIS AREJADO, FONTE MAIOR, TEXTO REVISADO) */}
        <section className="py-16 md:py-24 flex justify-center text-center">
          <div className="max-w-2xl mx-auto px-4">
            <div className="w-8 h-[1px] bg-accent/40 mx-auto mb-8" />
            
            <h3 className="font-drama italic text-3xl md:text-4xl text-[#FAF8F5] mb-6 leading-relaxed">
              {t('pricingPage.manifesto.title', 'Transparência absoluta.')}
            </h3>
            
            <p className="font-heading font-light text-[#CFCFCF] text-base md:text-lg leading-relaxed mb-6">
              {t('pricingPage.manifesto.body')}
            </p>
            
            {/* Texto revisado e tamanho de fonte aumentado */}
            <p className="font-heading text-sm md:text-base text-[#A0A0A0] font-light mb-8 max-w-xl mx-auto leading-relaxed">
              {t('pricingPage.manifesto.subtext', 'A receita de workshops é apenas o primeiro dos quatro pilares de sustentabilidade do Dance2Dance.')}
            </p>
            
            <Link
              to="/social"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-accent hover:text-white text-xs uppercase tracking-[2px] font-heading font-semibold transition-colors group"
            >
              <span>{t('pricingPage.manifesto.linkText', 'Conheça nosso ecossistema financeiro completo no Projeto Social')}</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <div className="w-8 h-[1px] bg-accent/40 mx-auto mt-8" />
          </div>
        </section>

        {/* 4. TABELA OBJETIVA DE VALORES (PRINT 3: TÍTULO AREJADO, SEM VAGAS LIMITADAS, PREÇO EM 'kr', CENTRALIZADOS, SEM SUBTÍTULO) */}
        <section className="pt-12 mb-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 pb-6 border-b border-[#222222]">
            <div>
              <span className="font-heading text-[10px] tracking-[5px] uppercase text-accent block mb-3 font-semibold">
                {t('pricingPage.rates.kicker', 'Transparência Objetiva')}
              </span>
              <h2 className="font-batang text-3xl sm:text-4xl text-[#F0EDE8] font-normal">
                {t('pricingPage.rates.title', 'Workshops & Formações')}
              </h2>
              <p className="font-heading font-light text-xs sm:text-sm text-[#9A9A9A] mt-2">
                {t('pricingPage.rates.subtitle', 'Informações diretas sobre carga horária e valores de participação.')}
              </p>
            </div>

            {/* Filtros rápidos no padrão elegante do site */}
            <div className="flex items-center gap-2 bg-[#141414] p-1 rounded-[2px] border border-[#222222]">
              <button
                onClick={() => setSelectedProgram('all')}
                className={`px-3.5 py-1.5 rounded-[2px] text-xs font-heading uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                  selectedProgram === 'all'
                    ? 'bg-accent text-primary font-bold'
                    : 'text-[#9A9A9A] hover:text-white'
                }`}
              >
                {t('pricingPage.rates.allFilter', 'Todos')}
              </button>
              <button
                onClick={() => setSelectedProgram('be-the-dance')}
                className={`px-3.5 py-1.5 rounded-[2px] text-xs font-heading uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                  selectedProgram === 'be-the-dance'
                    ? 'bg-accent text-primary font-bold'
                    : 'text-[#9A9A9A] hover:text-white'
                }`}
              >
                Be The Dance
              </button>
              <button
                onClick={() => setSelectedProgram('biostretch')}
                className={`px-3.5 py-1.5 rounded-[2px] text-xs font-heading uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                  selectedProgram === 'biostretch'
                    ? 'bg-accent text-primary font-bold'
                    : 'text-[#9A9A9A] hover:text-white'
                }`}
              >
                Biostretch
              </button>
            </div>
          </div>

          {/* Grid de Cards de Workshops no padrão ultra limpo solicitado */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkshops.map(workshop => {
              const workshopTitle = t(
                `programs.${workshop.programId}.workshops.${workshop.id}.title`,
                workshop.name || workshop.id
              );

              return (
                <Link
                  key={`${workshop.programId}-${workshop.id}`}
                  to={`/${workshop.programId}/${workshop.slug}`}
                  className="group block"
                >
                  <div className="relative bg-[#141414] p-8 overflow-hidden transition-all duration-500 border border-[#222222] rounded-[2px] hover:-translate-y-1 hover:border-accent/40 flex flex-col justify-between h-full text-center">
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <div>
                      {/* Header do card: Tag do programa + Carga horária */}
                      <div className="flex items-center justify-between gap-2 mb-6">
                        <span className="font-heading text-[9px] tracking-[2px] uppercase text-accent/80 font-semibold">
                          {workshop.programName}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs font-mono text-[#9A9A9A]">
                          <Clock className="w-3.5 h-3.5 text-accent" />
                          <span>{workshop.duration}</span>
                        </div>
                      </div>

                      {/* Título do Workshop */}
                      <h4 className="font-batang text-xl md:text-2xl text-[#F0EDE8] mb-3 group-hover:text-accent transition-colors font-normal">
                        {workshopTitle}
                      </h4>
                      <div className="w-7 h-[1px] bg-accent/40 group-hover:w-14 transition-all duration-500 mb-6 mx-auto" />
                    </div>

                    {/* Preço e Saiba Mais rigorosamente CENTRALIZADOS, com 'kr' e sem 'vagas limitadas' */}
                    <div className="pt-6 border-t border-[#1F1F1F] mt-auto flex flex-col items-center justify-center text-center">
                      <div className="mb-4 text-center">
                        <span className="font-drama text-2xl md:text-3xl text-[#F0EDE8] font-light">
                          {workshop.price}
                        </span>
                        <span className="text-xs font-mono text-accent ml-1.5 font-bold">
                          kr
                        </span>
                      </div>

                      <div className="inline-flex items-center justify-center gap-2 font-heading text-[11px] font-semibold text-accent uppercase tracking-[2px] transition-all duration-300 group-hover:text-white mx-auto">
                        {t('actions.learn_more', 'Saiba mais')} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 5. FORMATO PARA EMPRESAS (REFORMULADO: SEM DESCRIÇÕES INTERNAS, LINKS EM NOVA ABA) */}
        <section className="pt-16 pb-20 border-t border-[#1C1C1C]">
          <div className="mb-10 text-left">
            <span className="font-heading text-[10px] tracking-[5px] uppercase text-accent block mb-3 font-semibold">
              {t('pricingPage.corporateSection.kicker', 'Parcerias & Organizações')}
            </span>
            <h3 className="font-batang text-2xl md:text-3xl font-normal text-[#F0EDE8] mb-3">
              {t('pricingPage.corporateSection.title', 'Formato para Empresas')}
            </h3>
            <p className="font-heading text-[#9A9A9A] font-light text-sm md:text-base leading-relaxed max-w-2xl">
              {t('pricingPage.corporateSection.subtitle', 'Programas customizados para empresas e equipes.')}
            </p>
          </div>

          <div className="flex flex-col border-t border-[#222222]">
            {/* Be The Dance In Company */}
            <Link
              to="/be-the-dance/empresas"
              target="_blank"
              rel="noopener noreferrer"
              className="group block py-6 md:py-8 border-b border-[#222222] hover:border-accent/60 transition-colors"
            >
              <div className="flex flex-row items-center justify-between gap-6">
                <div>
                  <h4 className="font-batang text-xl md:text-2xl font-normal text-[#F0EDE8] group-hover:text-accent transition-colors">
                    {t('pricingPage.corporateSection.btdTitle', 'Be The Dance in Company')}
                  </h4>
                </div>
                <div className="shrink-0 text-accent opacity-60 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 flex items-center gap-3">
                  <span className="font-heading text-[10px] tracking-[3px] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {t('actions.learn_more', 'Saiba mais')}
                  </span>
                  <ArrowRight size={24} strokeWidth={1} />
                </div>
              </div>
            </Link>

            {/* Biostretch In Company */}
            <Link
              to="/biostretch/empresas"
              target="_blank"
              rel="noopener noreferrer"
              className="group block py-6 md:py-8 border-b border-[#222222] hover:border-accent/60 transition-colors"
            >
              <div className="flex flex-row items-center justify-between gap-6">
                <div>
                  <h4 className="font-batang text-xl md:text-2xl font-normal text-[#F0EDE8] group-hover:text-accent transition-colors">
                    {t('pricingPage.corporateSection.bioTitle', 'Biostretch in Company')}
                  </h4>
                </div>
                <div className="shrink-0 text-accent opacity-60 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 flex items-center gap-3">
                  <span className="font-heading text-[10px] tracking-[3px] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {t('actions.learn_more', 'Saiba mais')}
                  </span>
                  <ArrowRight size={24} strokeWidth={1} />
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* 6. CTA FINAL DA PÁGINA (PRINT 4: SEM BOX, TOTALMENTE AREJADO E INTEGRADO) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center py-20 md:py-28 px-4"
        >
          <span className="font-heading text-[10px] tracking-[5px] uppercase text-accent block mb-5 font-semibold">
            DANCE2DANCE OSLO
          </span>
          <h2 className="font-drama text-3xl sm:text-4xl md:text-5xl text-[#FAF8F5] max-w-3xl mx-auto mb-6 leading-tight">
            <Brand className="text-[#FAF8F5]" /> {t('pricingPage.finalCta.titleLead', 'oferece cursos originais e exclusivos.')}
          </h2>
          <p className="font-heading text-[#9A9A9A] font-light text-base md:text-lg max-w-lg mx-auto mb-10 leading-relaxed">
            {t('pricingPage.finalCta.subtitle', 'Descubra a programação completa dos nossos próximos encontros e garanta o seu lugar.')}
          </p>
          <Link
            to="/agenda"
            className="btn-magnetic inline-flex items-center gap-2 bg-accent hover:bg-[#F0EDE8] text-primary font-heading text-xs md:text-sm uppercase tracking-[2px] font-bold py-4 px-9 rounded-full shadow-lg transition-all"
          >
            <span>{t('pricingPage.finalCta.btn', 'Ver agenda completa')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

      </main>

      <Footer />
    </div>
  );
}
