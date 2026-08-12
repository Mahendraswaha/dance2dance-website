import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Wait longer so GSAP ScrollTrigger has time to add the pin-spacer (which drastically changes page height)
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          // Usamos 'auto' em vez de 'smooth' para evitar que o navegador trave
          // tentando desenhar 240 frames da animação do Hero num smooth scroll de 9000px
          element.scrollIntoView({ behavior: 'auto' });
        }
      }, 500);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}
