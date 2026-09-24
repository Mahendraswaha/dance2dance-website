import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="bg-primary min-h-screen font-sans text-background">
      <Navbar />

      <div className="pt-40 md:pt-52 pb-24 flex flex-col items-center justify-center min-h-[70vh] px-8">
        <p className="font-heading text-[10px] tracking-[5px] uppercase text-accent/80 mb-6">
          404
        </p>

        <h1 className="font-batang text-4xl md:text-6xl font-normal mb-6 leading-tight text-[#F0EDE8] text-center">
          {t('notFound.title', 'Página não encontrada')}
        </h1>

        <p className="font-heading text-[#9A9A9A] font-light text-center mb-12 max-w-md leading-relaxed">
          {t('notFound.subtitle', 'O endereço que você buscou não existe ou foi movido. Que tal voltar para o início?')}
        </p>

        <Link
          to="/"
          className="group inline-flex items-center gap-3 text-center font-heading text-[12px] tracking-[3px] uppercase bg-accent text-primary px-10 py-4 hover:bg-background hover:text-primary transition-colors duration-300 font-semibold rounded-full"
        >
          {t('notFound.cta', 'Voltar para o início')}
        </Link>
      </div>

      <Footer />
    </div>
  );
}
