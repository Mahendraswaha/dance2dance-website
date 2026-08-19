import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AgendaPage from './pages/AgendaPage';
import ProgramPage from './pages/ProgramPage';
import WorkshopPage from './pages/WorkshopPage';
import SocialPage from './pages/SocialPage';
import ScrollToTop from './components/ScrollToTop';

// Import i18n
import './i18n';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/agenda" element={<AgendaPage />} />
        <Route path="/social" element={<SocialPage />} />
        <Route path="/:programId" element={<ProgramPage />} />
        <Route path="/:programId/:workshopId" element={<WorkshopPage />} />
      </Routes>
    </BrowserRouter>
  );
}
