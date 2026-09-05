import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, X } from 'lucide-react';

export default function CookieBanner() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('dance2dance_cookie_consent');
    if (!hasConsented) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('dance2dance_cookie_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-auto md:max-w-md bg-[#1A1A1A] border border-[#2E4036]/30 shadow-2xl rounded-2xl p-6 z-[9999] animate-fade-up">
      <div className="flex items-start gap-4">
        <div className="shrink-0 p-2 bg-[#2E4036]/20 rounded-full text-[#CC5833]">
          <ShieldCheck size={24} />
        </div>
        
        <div className="flex-1">
          <h3 className="text-[#F2F0E9] font-['Outfit'] font-semibold mb-2">
            {t('cookies.title', 'Nós valorizamos sua privacidade')}
          </h3>
          <p className="text-[#F2F0E9]/70 text-sm font-['Plus_Jakarta_Sans'] leading-relaxed mb-4">
            {t('cookies.description', 'Utilizamos cookies essenciais para o funcionamento do site e para melhorar sua segurança (como prevenção de spam). Para saber mais, leia nossa ')}
            <Link to="/privacidade" className="text-[#CC5833] hover:text-[#F2F0E9] transition-colors underline decoration-[#CC5833]/30 underline-offset-4">
              {t('cookies.policyLink', 'Política de Privacidade')}
            </Link>
            .
          </p>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleAccept}
              className="flex-1 bg-[#CC5833] hover:bg-[#b04a29] text-[#F2F0E9] font-['Outfit'] font-medium py-2.5 px-4 rounded-xl transition-colors text-sm text-center"
            >
              {t('cookies.accept', 'Entendi e Aceito')}
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-2.5 text-[#F2F0E9]/50 hover:text-[#F2F0E9] hover:bg-[#F2F0E9]/5 rounded-xl transition-colors"
              aria-label="Fechar"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
