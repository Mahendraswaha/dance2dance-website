import React, { Suspense, lazy } from 'react';

// Wrapper robusto para tentar recarregar os chunks dinâmicos caso haja instabilidade de rede ou cache
function lazyWithRetries(componentImport) {
  return lazy(async () => {
    try {
      const component = await componentImport();
      sessionStorage.removeItem('chunk_force_reloaded');
      return component;
    } catch (error) {
      console.warn('Network hiccup detected loading chunk. Retrying in 1.5s...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      try {
        const component = await componentImport();
        sessionStorage.removeItem('chunk_force_reloaded');
        return component;
      } catch (error2) {
        console.warn('Second attempt failed. Retrying in 3s...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        try {
          const component = await componentImport();
          sessionStorage.removeItem('chunk_force_reloaded');
          return component;
        } catch (error3) {
          if (!sessionStorage.getItem('chunk_force_reloaded')) {
            sessionStorage.setItem('chunk_force_reloaded', 'true');
            window.location.reload();
          }
          throw error3;
        }
      }
    }
  });
}
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import CookieBanner from './components/CookieBanner';
import AdminRoute from './components/AdminRoute';
import './i18n';

// A página inicial (Home) é mantida estática para renderização imediata sem flash
import Home from './pages/Home';

// Carregamento dinâmico sob demanda (Code Splitting) para todas as outras páginas
const AgendaPage = lazyWithRetries(() => import('./pages/AgendaPage'));
const ProgramPage = lazyWithRetries(() => import('./pages/ProgramPage'));
const WorkshopPage = lazyWithRetries(() => import('./pages/WorkshopPage'));
const SocialPage = lazyWithRetries(() => import('./pages/ImpactPage'));
const CorporatePage = lazyWithRetries(() => import('./pages/CorporatePage'));
const BtdCorporatePage = lazyWithRetries(() => import('./pages/BtdCorporatePage'));
const IndividualPage = lazyWithRetries(() => import('./pages/IndividualPage'));
const RegularClassesPage = lazyWithRetries(() => import('./pages/RegularClassesPage'));
const CurriculumPage = lazyWithRetries(() => import('./pages/CurriculumPage'));
const LoginPage = lazyWithRetries(() => import('./pages/LoginPage'));
const SignupPage = lazyWithRetries(() => import('./pages/SignupPage'));
const ProfilePage = lazyWithRetries(() => import('./pages/ProfilePage'));
const TermsPage = lazyWithRetries(() => import('./pages/TermsPage'));
const PrivacyPolicyPage = lazyWithRetries(() => import('./pages/PrivacyPolicyPage'));
const ContactPage = lazyWithRetries(() => import('./pages/ContactPage'));
const PricingPage = lazyWithRetries(() => import('./pages/PricingPage'));
const AdminDashboard = lazyWithRetries(() => import('./pages/AdminDashboard'));
const BeTheDanceUngPage = lazyWithRetries(() => import('./pages/BeTheDanceUngPage'));
const NotFoundPage = lazyWithRetries(() => import('./pages/NotFoundPage'));

// Indicador discreto de transição entre páginas
function PageFallback() {
  return (
    <div style={{ backgroundColor: '#0A0A0E', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '32px', height: '32px', border: '2px solid rgba(201, 168, 76, 0.2)', borderTopColor: '#C9A84C', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
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
            <Route path="/valores" element={<PricingPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/priser" element={<PricingPage />} />
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
            <Route path="/projects/be-the-dance-ung" element={<BeTheDanceUngPage />} />
            <Route path="/termos" element={<TermsPage />} />
            <Route path="/privacidade" element={<PrivacyPolicyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
        <CookieBanner />
      </BrowserRouter>
    </AuthProvider>
  );
}



