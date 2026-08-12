import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProgramTemplate from '../components/ProgramTemplate';
import programsData from '../data/programs.json';

export default function ProgramPage() {
  const { programId } = useParams();
  const program = programsData[programId];

  if (!program) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Navbar />
      <ProgramTemplate program={program} />
      <Footer />
    </>
  );
}
