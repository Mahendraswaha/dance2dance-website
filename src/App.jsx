import React, { Suspense, lazy } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import CookieBanner from './components/CookieBanner';
import AdminRoute from './components/AdminRoute';
import './i18n';

// A página inicial (Home) é mantida estática para renderização imediata sem flash
import Home from './pages/Home';

// Carregamento dinâmico sob demanda (Code Splitting) para todas as outras páginas
const AgendaPage = lazy(() => import('./pages/AgendaPage'));
const ProgramPage = lazy(() => import('./pages/ProgramPage'));
const WorkshopPage = lazy(() => import('./pages/WorkshopPage'));
const SocialPage = lazy(() => import('./pages/SocialPage'));
const CorporatePage = lazy(() => import('./pages/CorporatePage'));
const BtdCorporatePage = lazy(() => import('./pages/BtdCorporatePage'));
const IndividualPage = lazy(() => import('./pages/IndividualPage'));
const RegularClassesPage = lazy(() => import('./pages/RegularClassesPage'));
const CurriculumPage = lazy(() => import('./pages/CurriculumPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Indicador discreto de transição entre páginas
function PageFallback() {
  return (
    <div className="min-h-screen bg-[#0A0A0E] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/agenda" element={<AgendaPage />} />
            <Route path="/social" element={<SocialPage />} />
            <Route path="/contato" element={<ContactPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/biostretch/empresas" element={<CorporatePage />} />
            <Route path="/be-the-dance/empresas" element={<BtdCorporatePage />} />
            <Route path="/biostretch/individual" element={<IndividualPage />} />
            <Route path="/biostretch/aulas-regulares" element={<RegularClassesPage />} />
            <Route path="/safia" element={<CurriculumPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cadastro" element={<SignupPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/:programId" element={<ProgramPage />} />
            <Route path="/:programId/:workshopId" element={<WorkshopPage />} />
            <Route path="/termos" element={<TermsPage />} />
            <Route path="/privacidade" element={<PrivacyPolicyPage />} />
          </Routes>
        </Suspense>
        <CookieBanner />
      </BrowserRouter>
    </AuthProvider>
  );
}

