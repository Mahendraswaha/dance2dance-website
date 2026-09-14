import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import programsData from '../data/programs.json';
import { 
  Sparkles, 
  CheckCircle2, 
  HeartHandshake, 
  ArrowRight, 
  Clock, 
  Coins, 
  ShieldCheck, 
  Building2, 
  Users, 
  Award,
  ArrowUpRight,
  Info
} from 'lucide-react';

export default function PricingPage() {
  const { t, i18n } = useTranslation();
  const [selectedProgram, setSelectedProgram] = useState('all'); // 'all', 'be-the-dance', 'biostretch'

  // Montar lista completa de workshops a partir de programs.json
  const btdWorkshops = (programsData['be-the-dance']?.workshops || []).map(w => ({
    ...w,
    programId: 'be-the-dance',
    programName: 'Be The Dance',
    tagColor: 'border-accent/30 text-accent bg-accent/10'
  }));

  const bioWorkshops = (programsData['biostretch']?.workshops || []).map(w => ({
    ...w,
    programId: 'biostretch',
    programName: 'Biostretch',
    tagColor: 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10'
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

      <main className="flex-grow pt-40 md:pt-48 pb-24 px-4 sm:px-6 max-w-6xl mx-auto w-full relative z-10">

        {/* 1. HERO SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20"
        >
          <span className="font-heading text-[10px] md:text-xs uppercase tracking-[3px] text-accent font-semibold block mb-3">
            {t('pricingPage.hero.kicker', 'Organização Social Sem Fins Lucrativos')}
          </span>
          <h1 className="font-drama text-4xl sm:text-5xl md:text-6xl text-[#FAF8F5] mb-5 tracking-tight">
            {t('pricingPage.hero.title', 'Valores & Acesso')}
          </h1>
          <p className="font-heading text-zinc-300 text-sm md:text-base leading-relaxed">
            {t('pricingPage.hero.subtitle', 'O Dance2Dance é uma organização social sem fins lucrativos sediada em Oslo. Nossos valores são estruturados em um modelo de solidariedade: a receita gerada por quem pode investir viabiliza o acesso integral e gratuito para a comunidade local.')}
          </p>
        </motion.div>

        {/* 2. OS DOIS LADOS DA MESMA EXCELÊNCIA (DUAL CARDS) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-16 md:mb-20">
          
          {/* Card 1: Participantes Pagantes */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-[#121217] border border-[#262633] hover:border-zinc-500/50 rounded-[4px] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[2px] bg-white/5 border border-white/10 text-zinc-300 font-heading text-[10px] font-semibold uppercase tracking-[1.5px] mb-4">
                <Coins className="w-3 h-3 text-accent" />
                <span>{t('pricingPage.payerCard.kicker', 'Desenvolvimento Pessoal & Solidariedade')}</span>
              </div>
              <h2 className="font-drama text-2xl sm:text-3xl text-[#FAF8F5] mb-1">
                {t('pricingPage.payerCard.title', 'Valores Justos de Mercado')}
              </h2>
              <span className="text-xs font-heading text-accent/80 uppercase tracking-wider block mb-6">
                {t('pricingPage.payerCard.subtitle', 'Para quem participa investindo')}
              </span>

              <div className="space-y-4 text-xs sm:text-sm font-heading text-zinc-300 leading-relaxed">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-accent shrink-0 mt-1" />
                  <div>
                    <strong className="text-white font-semibold block mb-0.5">
                      {t('pricingPage.payerCard.item1Title', 'Saúde e Expressão')}
                    </strong>
                    <span className="text-zinc-400">
                      {t('pricingPage.payerCard.item1Desc', 'Investimento direto em bem-estar físico e mental, criatividade e desenvolvimento artístico com orientação profissional de excelência.')}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-4 h-4 text-accent shrink-0 mt-1" />
                  <div>
                    <strong className="text-white font-semibold block mb-0.5">
                      {t('pricingPage.payerCard.item2Title', 'Conexões Reais')}
                    </strong>
                    <span className="text-zinc-400">
                      {t('pricingPage.payerCard.item2Desc', 'Encontros humanos autênticos em um espaço acolhedor, com a oportunidade de explorar novas vocações e potenciais.')}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <HeartHandshake className="w-4 h-4 text-accent shrink-0 mt-1" />
                  <div>
                    <strong className="text-white font-semibold block mb-0.5">
                      {t('pricingPage.payerCard.item3Title', 'Impacto Social Coletivo')}
                    </strong>
                    <span className="text-zinc-400">
                      {t('pricingPage.payerCard.item3Desc', 'Para quem tem condições financeiras, a taxa de inscrição reflete um valor justo de mercado. Esse valor cobre a infraestrutura de alto nível e co-financia diretamente as bolsas comunitárias.')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Bolsas Integrais Comunitárias */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-[#13131B] border border-accent/40 hover:border-accent rounded-[4px] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 shadow-[0_10px_35px_rgba(201,168,76,0.08)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[2px] bg-accent/15 border border-accent/30 text-accent font-heading text-[10px] font-semibold uppercase tracking-[1.5px] mb-4">
                <ShieldCheck className="w-3 h-3 text-accent" />
                <span>{t('pricingPage.communityCard.kicker', 'Impacto Local & Equidade')}</span>
              </div>
              <h2 className="font-drama text-2xl sm:text-3xl text-[#FAF8F5] mb-1">
                {t('pricingPage.communityCard.title', 'Bolsas Integrais de 100%')}
              </h2>
              <span className="text-xs font-heading text-accent/80 uppercase tracking-wider block mb-6">
                {t('pricingPage.communityCard.subtitle', 'Para quem participa por bolsa')}
              </span>

              <div className="space-y-4 text-xs sm:text-sm font-heading text-zinc-300 leading-relaxed">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-1" />
                  <div>
                    <strong className="text-white font-semibold block mb-0.5">
                      {t('pricingPage.communityCard.item1Title', 'Gratuidade Total')}
                    </strong>
                    <span className="text-zinc-400">
                      {t('pricingPage.communityCard.item1Desc', 'Moradores de Tøyen e Grønland têm acesso gratuito a qualquer uma de nossas atividades abertas por meio de bolsas integrais.')}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Award className="w-4 h-4 text-accent shrink-0 mt-1" />
                  <div>
                    <strong className="text-white font-semibold block mb-0.5">
                      {t('pricingPage.communityCard.item2Title', 'A Mesma Excelência')}
                    </strong>
                    <span className="text-zinc-400">
                      {t('pricingPage.communityCard.item2Desc', 'O mesmo estúdio, os mesmos instrutores e o mesmo rigor técnico. Sem distinções, rótulos ou concessões.')}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-accent shrink-0 mt-1" />
                  <div>
                    <strong className="text-white font-semibold block mb-0.5">
                      {t('pricingPage.communityCard.item3Title', 'Direito à Cultura')}
                    </strong>
                    <span className="text-zinc-400">
                      {t('pricingPage.communityCard.item3Desc', 'Uma porta aberta para a prática corporal e o desenvolvimento artístico no coração do próprio bairro.')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* 3. MANIFESTO DE TRANSPARÊNCIA (PILAR 1) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#14141B] via-[#1A1A24] to-[#14141B] border border-[#272738] rounded-[4px] p-6 sm:p-10 mb-16 md:mb-20 text-center relative"
        >
          <p className="font-drama text-lg sm:text-xl md:text-2xl text-[#FAF8F5] leading-relaxed max-w-3xl mx-auto mb-4">
            "{t('pricingPage.manifesto.quote', 'Acreditamos na transparência absoluta. Quem investe financeiramente sabe com clareza o valor do que recebe e o impacto social do seu recurso. E quem ingressa por bolsa integral tem assegurado um ambiente de respeito mútuo e dignidade.')}"
          </p>
          <p className="text-xs sm:text-sm font-heading text-zinc-400 mb-4">
            {t('pricingPage.manifesto.subtext', 'A receita própria de workshops é apenas o primeiro dos quatro pilares de sustentabilidade do Dance2Dance.')}
          </p>
          <Link
            to="/social"
            className="inline-flex items-center gap-2 text-accent hover:text-[#FAF8F5] text-xs uppercase tracking-[2px] font-heading font-semibold transition-colors group"
          >
            <span>{t('pricingPage.manifesto.linkText', 'Conheça nosso ecossistema financeiro completo no Projeto Social')}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* 4. TABELA OBJETIVA DE VALORES */}
        <section className="mb-16 md:mb-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-[#242432]">
            <div>
              <span className="font-heading text-[10px] uppercase tracking-[2.5px] text-accent font-semibold block mb-1">
                {t('pricingPage.rates.kicker', 'Transparência Objetiva')}
              </span>
              <h2 className="font-drama text-3xl sm:text-4xl text-[#FAF8F5]">
                {t('pricingPage.rates.title', 'Workshops & Formações')}
              </h2>
              <p className="font-heading text-xs sm:text-sm text-zinc-400 mt-1">
                {t('pricingPage.rates.subtitle', 'Informações diretas sobre carga horária e valores de participação.')}
              </p>
            </div>

            {/* Filtros rápidos */}
            <div className="flex items-center gap-2 bg-[#121218] p-1 rounded-[2px] border border-[#272736]">
              <button
                onClick={() => setSelectedProgram('all')}
                className={`px-3 py-1.5 rounded-[2px] text-xs font-heading uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                  selectedProgram === 'all'
                    ? 'bg-accent text-primary font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {t('pricingPage.rates.allFilter', 'Todos')}
              </button>
              <button
                onClick={() => setSelectedProgram('be-the-dance')}
                className={`px-3 py-1.5 rounded-[2px] text-xs font-heading uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                  selectedProgram === 'be-the-dance'
                    ? 'bg-accent text-primary font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Be The Dance
              </button>
              <button
                onClick={() => setSelectedProgram('biostretch')}
                className={`px-3 py-1.5 rounded-[2px] text-xs font-heading uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                  selectedProgram === 'biostretch'
                    ? 'bg-accent text-primary font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Biostretch
              </button>
            </div>
          </div>

          {/* Grid de Cards de Preços */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredWorkshops.map(workshop => {
              const workshopTitle = t(
                `programs.${workshop.programId}.workshops.${workshop.id}.title`,
                workshop.name || workshop.id
              );
              const workshopDesc = t(
                `programs.${workshop.programId}.workshops.${workshop.id}.shortDescription`,
                ''
              );

              return (
                <div
                  key={`${workshop.programId}-${workshop.id}`}
                  className="bg-[#121217] border border-[#242432] hover:border-accent/40 rounded-[3px] p-5 flex flex-col justify-between transition-all duration-200 hover:bg-[#16161F]"
                >
                  <div>
                    {/* Header do card: Tag do programa + Carga horária */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`text-[9px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-[2px] border ${workshop.tagColor}`}>
                        {workshop.programName}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
                        <Clock className="w-3 h-3 text-accent" />
                        <span>{workshop.duration}</span>
                      </div>
                    </div>

                    {/* Título do Workshop */}
                    <h3 className="font-drama text-xl text-[#FAF8F5] mb-2 leading-tight">
                      {workshopTitle}
                    </h3>

                    {/* Descrição resumida */}
                    {workshopDesc && (
                      <p className="text-xs font-heading text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                        {workshopDesc}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[#1C1C26] mt-4">
                    {/* Preço em Destaque */}
                    <div className="flex items-baseline justify-between mb-4">
                      <span className="text-[10px] font-heading uppercase tracking-wider text-zinc-400">
                        {t('pricingPage.rates.spotsInfo', 'Vagas limitadas por turma')}
                      </span>
                      <div className="text-right">
                        <span className="font-drama text-2xl text-[#FAF8F5] font-semibold">
                          {workshop.price}
                        </span>
                        <span className="text-xs font-mono text-accent ml-1.5 font-bold">
                          NOK
                        </span>
                      </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/agenda?filter=${workshop.programId}`}
                        className="flex-1 py-2 px-3 rounded-[2px] bg-accent hover:bg-[#F0EDE8] text-primary font-heading text-[10px] uppercase tracking-wider font-bold text-center transition-colors shadow-sm"
                      >
                        {t('pricingPage.rates.viewScheduleBtn', 'Ver Datas na Agenda')}
                      </Link>
                      <Link
                        to={`/workshop/${workshop.slug}`}
                        className="p-2 rounded-[2px] bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-accent border border-white/5 transition-colors"
                        title={t('pricingPage.rates.viewDetailsBtn', 'Ver Detalhes')}
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. DESTAQUE DE BOLSAS DE ESTUDO (TØYEN & GRØNLAND) */}
        <section className="bg-[#14141D] border border-accent/30 rounded-[4px] p-6 sm:p-10 mb-16 md:mb-20 relative overflow-hidden">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[2px] bg-accent/15 border border-accent/30 text-accent font-heading text-[10px] font-semibold uppercase tracking-[1.5px] mb-4">
              <Sparkles className="w-3 h-3 text-accent" />
              <span>{t('pricingPage.scholarshipCallout.badge', 'Acesso Comunitário')}</span>
            </div>
            <h2 className="font-drama text-3xl sm:text-4xl text-[#FAF8F5] mb-3">
              {t('pricingPage.scholarshipCallout.title', 'Mora em Tøyen ou Grønland?')}
            </h2>
            <p className="text-xs sm:text-sm font-heading text-zinc-300 leading-relaxed mb-6">
              {t('pricingPage.scholarshipCallout.description', 'Se você reside na nossa área de impacto prioritário, solicite sua bolsa de estudos integral de 100% sem custos no momento da inscrição.')}
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                to="/agenda"
                className="px-6 py-3 rounded-[3px] bg-accent hover:bg-[#F0EDE8] text-primary font-heading text-xs uppercase tracking-wider font-bold transition-all text-center shadow-sm"
              >
                {t('pricingPage.scholarshipCallout.btn', 'Ver Próximos Workshops na Agenda')}
              </Link>
              <Link
                to="/contato"
                className="px-6 py-3 rounded-[3px] border border-zinc-700 hover:border-accent text-zinc-300 hover:text-white font-heading text-xs uppercase tracking-wider font-semibold transition-all text-center"
              >
                {t('pricingPage.scholarshipCallout.contactBtn', 'Falar Conosco Sobre Bolsas')}
              </Link>
            </div>
          </div>
        </section>

        {/* 6. IN COMPANY & PROGRAMAS CORPORATIVOS */}
        <section className="bg-[#111116] border border-[#22222E] rounded-[4px] p-6 sm:p-8 mb-16 md:mb-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="font-heading text-[10px] uppercase tracking-[2px] text-zinc-400 font-semibold block mb-1">
              {t('pricingPage.corporateCard.kicker', 'Parcerias & Organizações')}
            </span>
            <h3 className="font-drama text-2xl text-[#FAF8F5] mb-2">
              {t('pricingPage.corporateCard.title', 'In Company e Programas Corporativos')}
            </h3>
            <p className="text-xs font-heading text-zinc-400 leading-relaxed">
              {t('pricingPage.corporateCard.description', 'Desenvolvemos workshops customizados de ergonomia, consciência corporal e saúde mental para empresas e equipes. Valores sob medida de acordo com o escopo.')}
            </p>
          </div>
          <Link
            to="/contato"
            className="px-5 py-3 rounded-[2px] bg-white/5 hover:bg-white/10 text-[#FAF8F5] border border-white/10 hover:border-accent/40 font-heading text-xs uppercase tracking-wider font-semibold transition-all whitespace-nowrap shrink-0"
          >
            {t('pricingPage.corporateCard.btn', 'Solicitar Proposta Corporativa')}
          </Link>
        </section>

        {/* 7. CTA FINAL DA PÁGINA (Solicitado expressamente pelo usuário) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center py-12 px-6 rounded-[4px] bg-gradient-to-b from-[#161622] to-[#0E0E14] border border-[#2A2A3C] shadow-[0_15px_40px_rgba(0,0,0,0.6)]"
        >
          <span className="font-heading text-[10px] md:text-xs uppercase tracking-[3px] text-accent font-semibold block mb-3">
            DANCE2DANCE OSLO
          </span>
          <h2 className="font-drama text-3xl sm:text-4xl md:text-5xl text-[#FAF8F5] max-w-2xl mx-auto mb-4 leading-tight">
            {t('pricingPage.finalCta.title', 'Dance2Dance oferece cursos originais e exclusivos.')}
          </h2>
          <p className="text-xs sm:text-sm font-heading text-zinc-400 max-w-md mx-auto mb-8 leading-relaxed">
            {t('pricingPage.finalCta.subtitle', 'Descubra a programação completa dos nossos próximos encontros e garanta o seu lugar.')}
          </p>
          <Link
            to="/agenda"
            className="btn-magnetic inline-flex items-center gap-2 bg-accent hover:bg-[#F0EDE8] text-primary font-heading text-xs md:text-sm uppercase tracking-[2px] font-bold py-3.5 px-8 rounded-full shadow-lg transition-all"
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
