import React from 'react';
import Navbar from '../components/Navbar';
import HeroSequence from '../components/HeroSequence';
import Activities from '../components/Activities';
import Philosophy from '../components/Philosophy';
import Protocol from '../components/Protocol';
import Action from '../components/Action';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="bg-primary text-background min-h-[100dvh] overflow-x-hidden">
      <Navbar />
      <HeroSequence />
      <Activities />
      <Philosophy />
      <Protocol />
      <Action />
      <Footer />
    </div>
  );
};

export default Home;
