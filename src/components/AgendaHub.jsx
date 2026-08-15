import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Clock } from 'lucide-react';

export default function AgendaHub({ programs }) {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');

  // Para demonstração, vamos extrair todos os workshops e adicionar datas fictícias.
  // Idealmente, a 'Agenda' seria um array separado de 'eventos' em programs.json.
  const allEvents = Object.values(programs).flatMap(p => 
    p.workshops ? p.workshops.map(w => ({
      ...w,
      programId: p.id,
      programTitle: p.title,
      date: "Em breve",
      time: "A definir",
      location: "Porto Alegre / RS"
    })) : []
  );

  const filteredEvents = activeFilter === 'all' 
    ? allEvents 
    : allEvents.filter(e => e.programId === activeFilter);

  return (
    <div className="bg-primary text-background min-h-[100dvh] pt-24 px-6 lg:px-12 flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex-grow">
        
        {/* Header */}
        <header className="mb-16 text-center">
          <p className="font-heading text-[10px] tracking-[5px] uppercase text-accent mb-5">Calendário</p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-batang text-4xl md:text-6xl font-normal mb-6 text-[#F0EDE8]"
          >
            Agenda Completa
          </motion.h1>
          <div className="w-12 h-[1px] bg-accent/70 mx-auto mb-8"></div>
          <p className="font-heading text-[#9A9A9A] font-light max-w-2xl mx-auto">
            Acompanhe nossas próximas datas para os workshops, sessões regulares e vivências do Be The Dance e Biostretch.
          </p>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <button 
            onClick={() => setActiveFilter('all')}
            className={`font-heading text-[11px] tracking-[3px] uppercase px-6 py-2 rounded-full border transition-all ${
              activeFilter === 'all' 
                ? 'bg-accent border-accent text-primary font-semibold' 
                : 'border-[#333] text-[#9A9A9A] hover:border-accent/50 hover:text-accent'
            }`}
          >
            Todos
          </button>
          <button 
            onClick={() => setActiveFilter('be-the-dance')}
            className={`font-heading text-[11px] tracking-[3px] uppercase px-6 py-2 rounded-full border transition-all ${
              activeFilter === 'be-the-dance' 
                ? 'bg-accent border-accent text-primary font-semibold' 
                : 'border-[#333] text-[#9A9A9A] hover:border-accent/50 hover:text-accent'
            }`}
          >
            Be The Dance
          </button>
          <button 
            onClick={() => setActiveFilter('biostretch')}
            className={`font-heading text-[11px] tracking-[3px] uppercase px-6 py-2 rounded-full border transition-all ${
              activeFilter === 'biostretch' 
                ? 'bg-accent border-accent text-primary font-semibold' 
                : 'border-[#333] text-[#9A9A9A] hover:border-accent/50 hover:text-accent'
            }`}
          >
            Biostretch
          </button>
        </div>

        {/* Events List */}
        <div className="space-y-6">
          {filteredEvents.map((event, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={`${event.id}-${index}`} 
              className="bg-[#141414] border border-[#222222] p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start md:items-center hover:border-accent/30 transition-colors rounded-[2px]"
            >
              
              {/* Date Box */}
              <div className="md:w-48 shrink-0 flex flex-col">
                <span className="font-heading text-sm text-accent uppercase tracking-widest mb-1">{event.date}</span>
                <span className="font-heading text-xs text-[#666] flex items-center gap-2">
                  <Clock size={12} /> {event.time}
                </span>
              </div>
              
              {/* Event Info */}
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-heading text-[9px] tracking-[2px] uppercase bg-[#222] px-3 py-1 text-[#AAA] rounded-[2px]">
                    {event.programTitle}
                  </span>
                </div>
                <h3 className="font-batang text-2xl text-[#F0EDE8] mb-2">{event.title}</h3>
                <p className="font-heading text-sm text-[#9A9A9A] font-light flex items-center gap-2">
                  <MapPin size={14} className="text-accent/70" /> {event.location}
                </p>
              </div>
              
              {/* Action */}
              <div className="shrink-0 w-full md:w-auto mt-4 md:mt-0">
                <a 
                  href={`/${event.programId}/${event.slug}`} 
                  className="font-heading text-[10px] tracking-[3px] uppercase text-accent border-b border-accent/30 pb-1 hover:text-[#F0EDE8] hover:border-accent/80 transition-all inline-block"
                >
                  Detalhes
                </a>
              </div>
            </motion.div>
          ))}
          
          {filteredEvents.length === 0 && (
            <div className="text-center py-20 text-[#666] font-heading font-light">
              Nenhum evento encontrado para este filtro no momento.
            </div>
          )}
        </div>
      </div>
      <div className="w-full h-16 bg-gradient-to-b from-primary to-[#0C0C0C] relative z-0"></div>
    </div>
  );
}
