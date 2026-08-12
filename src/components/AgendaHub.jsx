import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import programsData from '../data/programs.json';

export default function AgendaHub() {
  const [filter, setFilter] = useState('all');

  // Extract all workshops from all programs to create a unified agenda
  const allEvents = [];
  
  Object.keys(programsData).forEach(programKey => {
    const program = programsData[programKey];
    if (program.workshops) {
      program.workshops.forEach(ws => {
        allEvents.push({
          ...ws,
          programId: program.id,
          programTitle: program.title,
          // Mocking dates since the actual JSON doesn't have dates yet
          dateStr: "15 e 16 de Outubro, 2024",
          location: "Online / Ao Vivo"
        });
      });
    }
  });

  const filteredEvents = filter === 'all' 
    ? allEvents 
    : allEvents.filter(e => e.programId === filter);

  return (
    <div className="pt-24 pb-20 bg-[#FAFAFA] min-h-screen font-sans">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-light mb-6 text-gray-900 tracking-wide">
            Agenda
          </h1>
          <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto">
            Acompanhe nossas próximas turmas, eventos e workshops. Escolha o melhor momento para sua transformação.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button 
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-wider transition-colors ${filter === 'all' ? 'bg-[#A67B5B] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-[#A67B5B] hover:text-[#A67B5B]'}`}
          >
            Todos os Eventos
          </button>
          {Object.keys(programsData).map(key => (
            <button 
              key={key}
              onClick={() => setFilter(key)}
              className={`px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-wider transition-colors ${filter === key ? 'bg-[#A67B5B] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-[#A67B5B] hover:text-[#A67B5B]'}`}
            >
              {programsData[key].title}
            </button>
          ))}
        </div>

        {/* Agenda List */}
        <div className="space-y-6">
          {filteredEvents.map((event, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={`${event.programId}-${event.id}`}
              className="bg-white p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col md:flex-row items-center gap-6"
            >
              <div className="flex-shrink-0 w-full md:w-48 text-center md:text-left border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-6">
                <span className="block text-sm uppercase tracking-widest text-[#A67B5B] font-semibold mb-1">Data</span>
                <span className="block text-lg text-gray-800">{event.dateStr}</span>
              </div>
              
              <div className="flex-grow text-center md:text-left">
                <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2 block">
                  {event.programTitle}
                </span>
                <h3 className="text-2xl font-medium text-gray-900 mb-2">{event.title}</h3>
                <p className="text-gray-500 text-sm flex items-center justify-center md:justify-start">
                  <span className="mr-2">📍</span> {event.location}
                </p>
              </div>
              
              <div className="flex-shrink-0 w-full md:w-auto flex flex-col sm:flex-row gap-3 pt-4 md:pt-0 mt-2 md:mt-0">
                <Link 
                  to={`/${event.programId}/${event.slug}`}
                  className="px-6 py-3 border border-gray-300 text-gray-700 hover:border-gray-900 hover:text-gray-900 rounded-full text-center text-sm font-semibold uppercase tracking-wider transition-colors"
                >
                  Detalhes
                </Link>
                <button className="px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-full text-center text-sm font-semibold uppercase tracking-wider transition-colors">
                  Inscreva-se
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
