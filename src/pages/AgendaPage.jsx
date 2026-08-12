import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AgendaHub from '../components/AgendaHub';

import programsData from '../data/programs.json';

export default function AgendaPage() {
  return (
    <>
      <Navbar />
      <AgendaHub programs={programsData} />
      <Footer />
    </>
  );
}
