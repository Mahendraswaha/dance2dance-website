import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

export default function WorkshopTemplate({ workshop, program }) {
  const navigate = useNavigate();

  if (!workshop) return <div>Workshop not found</div>;

  return (
    <div className="pt-24 pb-16 bg-white min-h-screen font-sans text-gray-800">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="text-sm uppercase tracking-widest text-gray-500 hover:text-[#A67B5B] mb-8 flex items-center transition-colors"
        >
          <span className="mr-2">←</span> Voltar para {program?.title}
        </button>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row gap-12 items-start mb-16">
          <div className="w-full md:w-1/2">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] bg-gray-200 bg-cover bg-center"
              style={{ backgroundImage: `url(${workshop.image})` }}
            ></motion.div>
          </div>
          
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-light mb-6 text-gray-900 leading-tight">
              {workshop.title}
            </h1>
            <p className="text-xl text-gray-500 font-light mb-8 italic">
              {workshop.shortDescription}
            </p>
            
            <div className="bg-[#fcfbf9] p-6 rounded-2xl border border-[#f0ebe1]">
              <h3 className="text-sm uppercase tracking-widest text-[#A67B5B] font-semibold mb-3">
                Próximas Turmas
              </h3>
              <p className="text-gray-600 mb-6">Confira as datas disponíveis e garanta sua vaga.</p>
              <Link 
                to="/agenda" 
                className="block w-full text-center bg-[#A67B5B] hover:bg-[#8A6347] text-white px-8 py-4 rounded-full uppercase tracking-wider text-sm font-semibold transition-colors duration-300 shadow-md hover:shadow-lg"
              >
                Ver Agenda Completa
              </Link>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-light mb-8 text-center text-gray-800">Sobre o Workshop</h2>
          <div className="prose prose-lg prose-stone max-w-none text-gray-600 leading-relaxed">
            {/* Em uma implementação real com HTML rico (ex: vindo de um CMS), usaríamos dangerouslySetInnerHTML ou um Markdown renderer */}
            <p className="whitespace-pre-line">{workshop.fullDescription}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
