import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function KroppsskolePhilosophy() {
  const { t } = useTranslation();

  return (
    <section className="py-24 px-8 max-w-4xl mx-auto relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.02 }}
          transition={{ duration: 2 }}
          className="absolute -right-40 top-20 text-[20vw] font-batang text-white whitespace-nowrap rotate-90 origin-left"
        >
          Kroppsskole
        </motion.div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto space-y-32">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="font-heading text-sm tracking-[4px] uppercase text-accent mb-8">
            {t('programs.kroppsskole.philosophy_data.subtitle', 'Através do corpo e além')}
          </h2>
          <div className="pl-6 border-l-[1px] border-accent/40 text-left">
            <p className="font-drama italic text-3xl md:text-5xl text-[#F0EDE8] leading-tight">
              {t('programs.kroppsskole.philosophy_data.hook', '"Para voar é preciso ter raízes."')}
            </p>
          </div>
        </motion.div>

        {/* Bloco 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <p className="font-heading text-lg md:text-xl text-[#9A9A9A] font-light leading-relaxed">
            {t('programs.kroppsskole.philosophy_data.b1_p1', 'Antes de pensarmos, o corpo já sente. Antes de falarmos, ele já comunica. Antes de entendermos, ele já sabe.')}
          </p>
          <p className="font-heading text-lg md:text-xl text-[#9A9A9A] font-light leading-relaxed">
            {t('programs.kroppsskole.philosophy_data.b1_p2', 'Kroppsskole nasce dessa percepção. Uma escola para aprender com o corpo, sobre o corpo, através do corpo. Aqui, exploramos uma inteligência que mora no gesto, na postura, na respiração. Ela sente, percebe, ajusta e lembra.')}
          </p>
          <div className="pt-12 text-center max-w-2xl mx-auto">
            <p className="font-batang text-2xl md:text-3xl text-accent/90 italic leading-snug">
              {t('programs.kroppsskole.philosophy_data.quote1', '"Existe um saber que o corpo carrega e que a mente ainda não traduziu."')}
            </p>
          </div>
        </motion.div>

        {/* Bloco 2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <p className="font-heading text-lg md:text-xl text-[#9A9A9A] font-light leading-relaxed">
            {t('programs.kroppsskole.philosophy_data.b2_p1', 'Convidamos diferentes facilitadores, práticas e saberes para criar experiências que nos reconectem com essa inteligência. Aulas, cursos, vivências e encontros que exploram o movimento, o toque, a respiração, a expressão e a presença.')}
          </p>
          <p className="font-heading text-lg md:text-xl text-[#9A9A9A] font-light leading-relaxed">
            {t('programs.kroppsskole.philosophy_data.b2_p2', 'Acolhemos corpos, histórias e formas de expressão diversas. Quanto mais diverso o olhar sobre o corpo, mais possibilidades temos de compreendê-lo.')}
          </p>
          <div className="pt-12 text-center max-w-2xl mx-auto">
            <p className="font-batang text-2xl md:text-3xl text-accent/90 italic leading-snug">
              {t('programs.kroppsskole.philosophy_data.quote2', '"O corpo é o alicerce. Dele nascem o equilíbrio, a presença e a transformação."')}
            </p>
          </div>
        </motion.div>

        {/* Bloco 3 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <p className="font-heading text-lg md:text-xl text-[#9A9A9A] font-light leading-relaxed">
            {t('programs.kroppsskole.philosophy_data.b3_p1', 'A saúde emocional e o bem-estar profundo amadurecem quando cuidamos da base. Quando respiramos melhor, caminhamos diferente e sentimos com mais clareza, algo muda na forma como estamos no mundo. A mudança começa no corpo e se irradia para tudo o que somos.')}
          </p>
          <p className="font-heading text-lg md:text-xl text-[#F0EDE8] font-light leading-relaxed">
            {t('programs.kroppsskole.philosophy_data.b3_p2', 'Kroppsskole é espaço para esse processo. Um lugar onde conhecimento e experiência se encontram. Onde podemos experimentar sem precisar acertar. Onde uma pequena mudança no corpo pode transformar a forma como vivemos.')}
          </p>
        </motion.div>

        {/* Fechamento */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="pt-16 pb-12 flex justify-center"
        >
          <p className="font-drama italic text-3xl md:text-4xl text-[#E2C366] leading-relaxed text-center">
            {t('programs.kroppsskole.philosophy_data.closing', '"Através do corpo, nos preparamos para ir além."')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
