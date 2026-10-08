import codecs

filepath = 'C:/Renas/Antigravity/Website-builder/src/pages/GoodMorningDancePage.jsx'

with codecs.open(filepath, 'r', 'utf-8') as f:
    content = f.read()

# Replace Block 2 title
content = content.replace(
'''          {/* BLOCK 2: A SESSAO */}
          <section className="mt-16 mb-24">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={0}
              className="text-center mb-16"
            >
              <h2 className="font-batang text-3xl md:text-4xl text-[#F0EDE8]">
                {session.title}
              </h2>
            </motion.div>''',
'''          {/* BLOCK 2: A SESSAO */}
          <section className="mt-16 mb-24">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={0}
              className="mb-10"
            >
              <h2 className="font-heading text-[10px] tracking-[5px] uppercase text-accent/80 block">
                {session.title}
              </h2>
            </motion.div>'''
)

# Replace Block 3 title
content = content.replace(
'''          {/* BLOCK 3: A EXPERIENCIA */}
          <section className="mt-24 mb-16">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={0}
              className="text-center mb-16"
            >
              <h2 className="font-batang text-3xl md:text-4xl text-[#F0EDE8]">
                {experience.title}
              </h2>
            </motion.div>''',
'''          {/* BLOCK 3: A EXPERIENCIA */}
          <section className="mt-24 mb-16">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={0}
              className="mb-10"
            >
              <h2 className="font-heading text-[10px] tracking-[5px] uppercase text-accent/80 block">
                {experience.title}
              </h2>
            </motion.div>'''
)

# Replace Blockquote
content = content.replace(
'''              {/* Simple Blockquote Quote as per Print 5 */}
              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
                variants={fadeUp} custom={3}
                className="mt-16 mb-16 max-w-2xl"
              >
                <p className="font-batang text-[#F0EDE8] text-3xl md:text-[40px] leading-[1.35] mb-6 tracking-wide">
                  "{different_way.closingQuote}"
                </p>
                <p className="font-drama italic text-accent text-2xl">
                  {different_way.signoff}
                </p>
              </motion.div>''',
'''              {/* Simple Blockquote Quote as per Print 5 and Be The Dance UNG */}
              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
                variants={fadeUp} custom={3}
                className="mt-16 mb-16 max-w-2xl"
              >
                <blockquote 
                  className="font-drama text-2xl md:text-3xl text-[#F0EDE8] leading-[1.5] mb-4"
                  dangerouslySetInnerHTML={{ __html: different_way.closingQuote }}
                />
                <p className="font-drama text-xl text-accent italic mb-10">
                  {different_way.signoff}
                </p>
              </motion.div>'''
)

with codecs.open(filepath, 'w', 'utf-8') as f:
    f.write(content)

print("Page layout updated.")
