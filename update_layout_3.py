import codecs

filepath = 'C:/Renas/Antigravity/Website-builder/src/pages/GoodMorningDancePage.jsx'

with codecs.open(filepath, 'r', 'utf-8') as f:
    content = f.read()

content = content.replace(
'''          {/* BLOCK 4: UMA MANEIRA DIFERENTE */}
          <section className="mt-24 mb-16">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={0}
              className="text-center mb-16"
            >
              <h2 className="font-batang text-3xl md:text-4xl text-[#F0EDE8]">
                {different_way.title}
              </h2>
            </motion.div>''',
'''          {/* BLOCK 4: UMA MANEIRA DIFERENTE */}
          <section className="mt-24 mb-16">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={0}
              className="border-l-2 border-accent pl-6 md:pl-8 mb-16 max-w-3xl"
            >
              <h2 className="font-drama italic text-2xl md:text-3xl text-[#E8E0D4] leading-[1.45]">
                {different_way.title}
              </h2>
            </motion.div>'''
)

content = content.replace(
'''                <blockquote 
                  className="font-drama text-2xl md:text-3xl text-[#F0EDE8] leading-[1.5] mb-4"
                  dangerouslySetInnerHTML={{ __html: different_way.closingQuote }}
                />''',
'''                <blockquote 
                  className="font-drama text-xl md:text-2xl text-[#F0EDE8] leading-[1.6] mb-4"
                  dangerouslySetInnerHTML={{ __html: different_way.closingQuote }}
                />'''
)

with codecs.open(filepath, 'w', 'utf-8') as f:
    f.write(content)

print("GoodMorningDancePage.jsx updated.")
