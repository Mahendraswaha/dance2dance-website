import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WorkshopTemplate from '../components/WorkshopTemplate';
import programsData from '../data/programs.json';

export default function WorkshopPage() {
  const { programId, workshopId } = useParams();
  const program = programsData[programId];

  if (!program) {
    return <Navigate to="/" replace />;
  }

  const workshop = program.workshops?.find(w => w.slug === workshopId);

  if (!workshop) {
    return <Navigate to={`/${programId}`} replace />;
  }

  return (
    <>
      <Navbar />
      <WorkshopTemplate workshop={workshop} program={program} />
      <Footer />
    </>
  );
}
