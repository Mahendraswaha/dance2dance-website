import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProgramTemplate from '../components/ProgramTemplate';
import programsData from '../data/programs.json';
import SEOHead from '../components/SEOHead';

const PROGRAM_SEO = {
  'be-the-dance': {
    title: 'Be The Dance',
    description: 'Be The Dance is a transformative movement program combining dance, somatic awareness and performance. Workshops and corporate sessions in Oslo.',
    image: 'https://poaciadanca.com.br/wp-content/uploads/2021/08/be-the-dance-hero.jpg',
  },
  'biostretch': {
    title: 'Biostretch',
    description: 'Biostretch is a body-mind wellness program focused on posture, flexibility, breathing and relaxation. Workshops, individual and corporate sessions in Oslo.',
    image: 'https://poaciadanca.com.br/wp-content/uploads/2021/08/biostretch-hero.jpg',
  },
  'kroppsskole': {
    title: 'Kroppsskole',
    description: 'Kroppsskole is a movement practice rooted in body intelligence and physical education. Explore rhythm, coordination and embodied awareness in Oslo.',
    image: 'https://poaciadanca.com.br/wp-content/uploads/2021/08/kroppsskole-hero.jpg',
  },
};

export default function ProgramPage() {
  const { programId } = useParams();
  const program = programsData[programId];

  if (!program) {
    return <Navigate to="/" replace />;
  }

  const seo = PROGRAM_SEO[programId] ?? {};

  return (
    <>
      <SEOHead
        title={seo.title}
        description={seo.description}
        image={seo.image}
        url={`/${programId}`}
      />
      <Navbar />
      <ProgramTemplate program={program} />
      <Footer />
    </>
  );
}
