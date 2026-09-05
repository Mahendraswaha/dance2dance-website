import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AgendaPage from './pages/AgendaPage';
import ProgramPage from './pages/ProgramPage';
import WorkshopPage from './pages/WorkshopPage';
import SocialPage from './pages/SocialPage';
import CorporatePage from './pages/CorporatePage';
import IndividualPage from './pages/IndividualPage';
import RegularClassesPage from './pages/RegularClassesPage';
import ScrollToTop from './components/ScrollToTop';
import CurriculumPage from './pages/CurriculumPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';

// Import i18n
import './i18n';
import TermsPage from './pages/TermsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/agenda" element={<AgendaPage />} />
        <Route path="/social" element={<SocialPage />} />
        <Route path="/biostretch/empresas" element={<CorporatePage />} />
        <Route path="/biostretch/individual" element={<IndividualPage />} />
        <Route path="/biostretch/aulas-regulares" element={<RegularClassesPage />} />
        <Route path="/safia" element={<CurriculumPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<SignupPage />} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/:programId" element={<ProgramPage />} />
        <Route path="/:programId/:workshopId" element={<WorkshopPage />} />
                <Route path="/termos" element={<TermsPage />} />
          <Route path="/privacidade" element={<PrivacyPolicyPage />} />
        </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}
