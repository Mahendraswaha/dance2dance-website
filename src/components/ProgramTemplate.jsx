import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function ProgramTemplate({ program }) {
  const { t } = useTranslation();
  
  if (!program) return <div>Program not found</div>;

  return (
    <div className="pt-20 pb-16 bg-[#FAFAFA] min-h-screen font-sans text-gray-800">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        {program.heroImage ? (
          <div 
            className="absolute inset-0 bg-cover bg-center z-0" 
            style={{ backgroundImage: `url(${program.heroImage})` }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-[#A67B5B] z-0 opacity-20"></div>
        )}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto text-white drop-shadow-md">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-light mb-6 tracking-wide"
          >
            {program.title}
          </motion.h1>
        </div>
      </section>

      {/* Concept / Philosophy Section */}
      <section className="py-20 px-6 max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-light mb-8 text-[#A67B5B]">A Filosofia</h2>
        <p className="text-lg md:text-xl leading-relaxed text-gray-600">
          {program.description}
        </p>
      </section>

      {/* Workshops Grid */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-light text-center mb-16 text-gray-800 tracking-wide">
          Workshops & Programas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {program.workshops && program.workshops.map((workshop) => (
            <motion.div 
              whileHover={{ y: -5 }}
              key={workshop.id} 
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border border-gray-100"
            >
              <div 
                className="h-56 bg-gray-200 bg-cover bg-center"
                style={{ backgroundImage: `url(${workshop.image})` }}
              ></div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-medium mb-3 text-gray-800">{workshop.title}</h3>
                <p className="text-gray-500 mb-6 flex-grow leading-relaxed">
                  {workshop.shortDescription}
                </p>
                <Link 
                  to={`/${program.id}/${workshop.slug}`}
                  className="inline-block text-center border-2 border-[#A67B5B] text-[#A67B5B] hover:bg-[#A67B5B] hover:text-white px-6 py-3 rounded-full uppercase tracking-wider text-sm font-semibold transition-colors duration-300"
                >
                  Saber Mais
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Additional Sections (e.g. Corporate, Individual Sessions) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
          {program.corporate && (
            <div className="p-10 bg-[#f4f1ec] rounded-3xl">
              <h3 className="text-2xl font-light mb-4 text-[#A67B5B]">{program.corporate.title}</h3>
              <p className="text-gray-600 mb-6">{program.corporate.description}</p>
              <button className="text-sm font-semibold uppercase tracking-wider text-gray-800 border-b border-gray-800 pb-1">
                Fale Conosco
              </button>
            </div>
          )}
          {program.individualSessions && (
            <div className="p-10 bg-[#f4f1ec] rounded-3xl">
              <h3 className="text-2xl font-light mb-4 text-[#A67B5B]">{program.individualSessions.title}</h3>
              <p className="text-gray-600 mb-6">{program.individualSessions.description}</p>
              <button className="text-sm font-semibold uppercase tracking-wider text-gray-800 border-b border-gray-800 pb-1">
                Agendar
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
