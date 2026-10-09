import React from 'react';
import Navbar from '../components/Navbar';
import HeroSequenceLab from '../components/HeroSequenceLab';
import Activities from '../components/Activities';
import Philosophy from '../components/Philosophy';
import Protocol from '../components/Protocol';
import Action from '../components/Action';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';

const HomeLab = () => {
  return (
    <div className="bg-primary text-background min-h-[100dvh] overflow-x-hidden">
      <SEOHead url="/lab" />
      <Navbar />
      
      <main>
        <HeroSequenceLab />
        <Activities />
        <Philosophy />
        <Protocol />
        <Action />
      </main>
      
      <Footer />
    </div>
  );
};

export default HomeLab;
