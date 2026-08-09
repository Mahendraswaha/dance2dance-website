import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X, ArrowRight, Play, HeartPulse, Check, MousePointer2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const navRef = useRef(null);
  const logoRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 'top -100',
        onUpdate: (self) => {
          if (self.direction === 1) {
            gsap.to(navRef.current, { backgroundColor: 'rgba(13, 13, 18, 0.8)', borderColor: '#2A2A35', duration: 0.3, backdropFilter: 'blur(16px)' });
            gsap.to(logoRef.current, { height: '2rem', duration: 0.3, ease: 'power2.out' });
          } else if (self.progress === 0) {
            gsap.to(navRef.current, { backgroundColor: 'transparent', borderColor: 'transparent', duration: 0.3, backdropFilter: 'blur(0px)' });
            gsap.to(logoRef.current, { height: '5rem', duration: 0.3, ease: 'power2.out' });
          }
        }
      });
    }, navRef);
    return () => ctx.revert();
  }, []);

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl">
      <div ref={navRef} className="px-6 py-4 rounded-full border border-transparent transition-colors flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img ref={logoRef} src="/logo-dance2dance.png" alt="Dance2Dance Logo" className="h-20 object-contain" />
        </div>
        <div className="hidden md:flex gap-8 text-sm font-heading font-semibold text-background/80">
          <a href="#workshops" className="hover:text-accent transition-colors hover:-translate-y-[1px]">Workshops</a>
          <a href="#social" className="hover:text-accent transition-colors hover:-translate-y-[1px]">Projeto Social</a>
          <a href="#agenda" className="hover:text-accent transition-colors hover:-translate-y-[1px]">Agenda</a>
        </div>
        <button className="btn-magnetic bg-accent text-primary px-6 py-2 rounded-full font-heading font-bold text-sm">
          <span className="relative z-10">Inscreva-se</span>
        </button>
      </div>
    </nav>
  );
};

const HeroSequence = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const heroContentRef = useRef(null);
  const videoRef = useRef(null);
  const imagesRef = useRef([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const frameCount = 240;

  useEffect(() => {
    const loadedImages = [];
    let loadedCount = 0;
    
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const frameNumber = i.toString().padStart(3, '0');
      img.src = `/gallery/sequence/frame-${frameNumber}.jpg`;
      img.onload = () => {
        loadedCount++;
        loadedImages.push(img);
        if (loadedCount === frameCount) {
          // Ordena as imagens para garantir a sequência correta
          loadedImages.sort((a, b) => a.src.localeCompare(b.src));
          imagesRef.current = loadedImages;
          setIsLoaded(true);
        }
      };
    }
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const render = (index) => {
      const imgs = imagesRef.current;
      if (imgs && imgs.length > 0 && imgs[Math.floor(index)]) {
        const img = imgs[Math.floor(index)];
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.max(hRatio, vRatio);
        const centerShift_x = (canvas.width - img.width * ratio) / 2;
        const centerShift_y = (canvas.height - img.height * ratio) / 2;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, img.width, img.height,
          centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
      }
    };

    render(0);

    const animationData = { frame: 0 };
    
    const gsapCtx = gsap.context(() => {
      
      // Animação inicial de entrada
      gsap.from('.hero-elem', {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.08,
        ease: 'power3.out',
        delay: 0.2
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=800%', 
          pin: true,
          scrub: true,
          pinSpacing: true, // Força a criação do espaço para não sobrepor
        }
      });
      
      // Quando começa a rolar, o video some suavemente
      tl.to(videoRef.current, { opacity: 0, duration: 0.05 }, 0);
      
      // O texto principal do hero sobe e some
      tl.to(heroContentRef.current, { y: -200, opacity: 0, duration: 0.1 }, 0);

      // Reprodução do canvas frame a frame
      tl.to(animationData, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        duration: 1, // timeline normalizada
        onUpdate: () => {
          requestAnimationFrame(() => render(animationData.frame));
        }
      }, 0);
      
      // 1. A primeira frase original aparece no centro
      tl.fromTo('.seq-text-1', 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.05 }, 
        0.1
      );
      tl.to('.seq-text-1', { opacity: 0, y: -50, duration: 0.05 }, 0.25);
      
      // 2. O bloco de texto inteiro sobe vindo de baixo da tela
      // Começa um pouco antes da primeira frase sumir (0.22), partindo de mais perto (y: 300) com fade-in
      tl.fromTo('.seq-block-rest', 
        { y: 300, opacity: 0 },
        { y: 0, opacity: 1, ease: 'power3.out', duration: 0.78 }, 
        0.22
      );
      
      // Teste: Clareia o filtro escuro no momento em que a última frase entra (0.8) até o fim da timeline
      tl.to('.dark-overlay', { opacity: 0, duration: 0.2 }, 0.8);

    }, containerRef);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render(animationData.frame);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      gsapCtx.revert();
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Dependência vazia: roda IMEDIATAMENTE no mount para travar a tela

  // Re-render inicial frame once images are loaded
  useEffect(() => {
    if (isLoaded && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = imagesRef.current[0];
      if (img) {
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.max(hRatio, vRatio);
        const centerShift_x = (canvas.width - img.width * ratio) / 2;
        const centerShift_y = (canvas.height - img.height * ratio) / 2;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, img.width, img.height, centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
      }
    }
  }, [isLoaded]);

  return (
    <section ref={containerRef} className="relative h-screen w-full bg-primary overflow-hidden">
      
      {/* Fallback de carregamento */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-primary z-20">
          <div className="w-12 h-12 rounded-full border-4 border-accent border-t-transparent animate-spin" />
        </div>
      )}
      
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Vídeo do Hero em loop (frame 1 da animação essencialmente) */}
        <video 
          ref={videoRef}
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent" />
      </div>
      
      {/* Texto do Hero */}
      <div ref={heroContentRef} className="absolute inset-0 z-10 w-full max-w-7xl mx-auto flex flex-col md:w-2/3 lg:w-1/2 items-start justify-end pb-24 md:pb-32 px-6 lg:px-12 pointer-events-none">
        <h1 className="flex flex-col gap-2">
          <span className="hero-elem font-heading font-bold text-4xl md:text-5xl text-background/90 tracking-tight">O movimento encontra a</span>
          <span className="hero-elem font-drama italic text-6xl md:text-8xl text-accent leading-none">Transformação.</span>
        </h1>
        <p className="hero-elem mt-8 text-lg md:text-xl text-background/70 font-heading max-w-md">
          A dança e o movimento como ferramentas de expressão, bem-estar e transformação social.
        </p>
        <div className="hero-elem mt-10 pointer-events-auto">
          <button className="btn-magnetic bg-accent text-primary px-8 py-4 rounded-full font-heading font-bold text-lg flex items-center gap-2">
            <span className="relative z-10 flex items-center gap-2">Explorar Workshops <ArrowRight size={20}/></span>
          </button>
        </div>
      </div>

      <div className="dark-overlay absolute inset-0 bg-black/40 pointer-events-none" />

      {/* Textos da Sequência (Surgem depois) */}
      
      {/* 1. Primeira frase (Centralizada como o original) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 md:px-12 z-10 pointer-events-none">
        <h2 className="seq-text-1 absolute font-heading font-bold text-3xl md:text-5xl text-background/90 opacity-0 max-w-4xl leading-tight">
          Há lugares que não existem no mapa. <br/><span className="text-accent italic font-drama">Só no corpo.</span>
        </h2>
      </div>

      {/* 2. Restante do texto (Alinhado à esquerda como o Hero) */}
      <div className="seq-block-rest absolute inset-0 z-10 w-full max-w-7xl mx-auto flex flex-col md:w-2/3 lg:w-1/2 items-start justify-center px-6 lg:px-12 pointer-events-none gap-6 opacity-0">
          <p className="font-heading text-lg md:text-xl text-background/90 leading-relaxed">
            <strong className="text-background">Dance2Dance</strong> é uma organização social que nasceu para construir esses lugares. Espaços onde a dança não é performance, é presença. Onde o movimento não é exercício ou alongamento, é escuta e encontro.
          </p>

          <p className="font-heading text-lg md:text-xl text-background/90 leading-relaxed">
            O encontro consigo mesmo e o encontro que acontece quando pessoas respiram e se movem no mesmo ritmo.
          </p>

          <p className="font-heading text-lg md:text-xl text-background/90 leading-relaxed">
            A mudança começa na pele, quando uma pessoa redescobre sua própria força, sua própria voz. E, quando isso acontece em grupo, abre-se um caminho para a <strong className="text-accent">transformação social</strong>.
          </p>

          <p className="font-heading text-lg md:text-xl text-background/90 leading-relaxed">
            Dance2Dance cria as condições para que as pessoas se encontrem.
          </p>

          <h2 className="font-drama italic text-3xl md:text-4xl text-background leading-tight mt-2">
            A dança e o movimento fazem o resto.
          </h2>
      </div>
    </section>
  );
};

// Shuffler Card - Be The Dance
const CardShuffler = () => {
  const [cards, setCards] = useState([
    { id: 1, title: 'Expressão Coreográfica', color: 'bg-textDark' },
    { id: 2, title: 'Ritmo e Musicalidade', color: 'bg-primary' },
    { id: 3, title: 'Dança Contemporânea', color: 'bg-[#1a1a24]' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCards(prev => {
        const newCards = [...prev];
        const last = newCards.pop();
        newCards.unshift(last);
        return newCards;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-48 w-full perspective-1000">
      {cards.map((c, i) => (
        <div 
          key={c.id} 
          className={`absolute inset-0 rounded-2xl ${c.color} p-6 border border-accent/20 flex flex-col justify-between shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]`}
          style={{
            transform: `translateY(${i * 12}px) scale(${1 - i * 0.05})`,
            opacity: 1 - i * 0.2,
            zIndex: 10 - i
          }}
        >
          <div className="flex justify-between items-start">
            <Play size={24} className="text-accent" />
            <span className="font-data text-xs text-background/50">MOD {c.id}</span>
          </div>
          <h4 className="font-heading font-bold text-lg text-background">{c.title}</h4>
        </div>
      ))}
    </div>
  );
};

// Typewriter Card - Biostretch
const CardTypewriter = () => {
  const [text, setText] = useState('');
  const fullText = ">> Inicializando módulo de Body-Awareness...\n>> Calibrando flexibilidade...\n>> Ativando consciência corporal.";
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.substring(0, i));
      i++;
      if (i > fullText.length) {
        setTimeout(() => { i = 0; }, 2000);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-48 w-full bg-primary rounded-2xl p-6 border border-accent/20 flex flex-col relative overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        <span className="font-data text-xs text-accent">Live Feed</span>
      </div>
      <div className="font-data text-sm text-background/80 whitespace-pre-line leading-relaxed">
        {text}
        <span className="inline-block w-2 h-4 bg-accent ml-1 animate-pulse" />
      </div>
    </div>
  );
};

// Scheduler Card - Projeto Social
const CardScheduler = () => {
  const cursorRef = useRef(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
      tl.to(cursorRef.current, { x: 80, y: 30, duration: 1, ease: 'power2.inOut' })
        .to(cursorRef.current, { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 })
        .to('.day-cell', { backgroundColor: '#C9A84C', color: '#0D0D12', duration: 0.2 }, '-=0.1')
        .to(cursorRef.current, { x: 180, y: 90, duration: 1, ease: 'power2.inOut' }, '+=0.5')
        .to(cursorRef.current, { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 })
        .to('.save-btn', { backgroundColor: '#C9A84C', color: '#0D0D12', duration: 0.2 }, '-=0.1')
        .to(cursorRef.current, { opacity: 0, duration: 0.2 }, '+=0.5')
        .set('.day-cell, .save-btn', { clearProps: 'all' })
        .set(cursorRef.current, { x: 0, y: 0, opacity: 1 });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="h-48 w-full bg-textDark rounded-2xl p-6 border border-background/10 relative overflow-hidden">
      <MousePointer2 ref={cursorRef} className="absolute z-10 text-background drop-shadow-md" size={24} style={{ top: 20, left: 20 }}/>
      
      <div className="grid grid-cols-7 gap-2 mb-6">
        {['D','S','T','Q','Q','S','S'].map((d,i) => (
          <div key={i} className={`h-8 rounded flex items-center justify-center font-data text-xs bg-primary text-background/50 ${i===3 ? 'day-cell' : ''}`}>
            {d}
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-center mt-8">
        <div className="font-heading font-semibold text-sm text-background">Relatório de Impacto</div>
        <div className="save-btn px-4 py-1 bg-primary text-background/50 rounded-full font-data text-xs">Baixar</div>
      </div>
    </div>
  );
};

const Features = () => {
  const featRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.feat-card', {
        scrollTrigger: {
          trigger: featRef.current,
          start: 'top 75%'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out'
      });
    }, featRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="workshops" ref={featRef} className="py-32 px-6 lg:px-12 bg-primary">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-heading font-bold text-3xl md:text-5xl text-background mb-16">Artefatos Funcionais</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="feat-card flex flex-col gap-6">
            <CardShuffler />
            <div>
              <img src="/logo-bethedance.png" alt="Be The Dance" className="h-12 mb-3 object-contain object-left" />
              <p className="font-heading text-background/60 text-sm leading-relaxed">Workshops imersivos de dança explorando ritmo, expressão e coreografia em um ambiente focado no movimento livre.</p>
            </div>
          </div>
          
          <div className="feat-card flex flex-col gap-6">
            <CardTypewriter />
            <div>
              <img src="/logo-biostretch.png" alt="Biostretch" className="h-10 mb-3 object-contain object-left" />
              <p className="font-heading text-background/60 text-sm leading-relaxed">Sessões de body-awareness para expansão da consciência corporal, flexibilidade e conexão mente-corpo.</p>
            </div>
          </div>
          
          <div className="feat-card flex flex-col gap-6">
            <CardScheduler />
            <div>
              <h3 className="font-heading font-bold text-xl text-background mb-2">Transparência Social</h3>
              <p className="font-heading text-background/60 text-sm leading-relaxed">Espaço reservado para financiadores acompanharem métricas de impacto e o funcionamento do projeto social em tempo real.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

const Philosophy = () => {
  const philRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.phil-line', {
        scrollTrigger: {
          trigger: philRef.current,
          start: 'top 60%'
        },
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
      });
    }, philRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={philRef} className="relative py-48 px-6 lg:px-12 bg-[#08080C] overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 z-0 opacity-20">
        <img src="https://images.unsplash.com/photo-1507342602737-0ce331b2fbc4?q=80&w=2000&auto=format&fit=crop" alt="" className="w-full h-full object-cover grayscale" />
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col gap-8">
        <p className="phil-line font-heading font-semibold text-background/50 text-xl md:text-2xl tracking-tight">
          A maioria dos projetos foca em: <span className="text-background/80">técnica isolada</span>.
        </p>
        <h2 className="phil-line font-drama italic text-5xl md:text-7xl leading-tight text-background">
          Nós focamos na <br/>
          <span className="text-accent">transformação social.</span>
        </h2>
      </div>
    </section>
  );
};

const Protocol = () => {
  const protocolRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.proto-card');
      
      cards.forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: 'top top',
          pin: true,
          pinSpacing: false,
          end: 'bottom+=100% top',
          animation: gsap.to(card, {
            scale: 0.9,
            opacity: 0.3,
            filter: 'blur(10px)',
            ease: 'none'
          }),
          scrub: true
        });
      });
    }, protocolRef);
    return () => ctx.revert();
  }, []);

  const protocols = [
    { num: '01', title: 'Expressão', desc: 'Desbloqueio do corpo através de movimentos coreografados e ritmados.' },
    { num: '02', title: 'Bem-estar', desc: 'Conexão profunda com a bio-mecânica, alongamento e relaxamento guiado.' },
    { num: '03', title: 'Transformação', desc: 'Impacto direto na comunidade transformando a arte em ferramenta social.' }
  ];

  return (
    <section id="social" ref={protocolRef} className="relative bg-primary text-background">
      {protocols.map((p, i) => (
        <div key={p.num} className="proto-card h-[100dvh] w-full flex items-center justify-center sticky top-0 bg-primary border-b border-textDark/30">
          <div className="max-w-5xl mx-auto px-6 lg:px-12 w-full flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="w-full md:w-1/2 flex justify-center">
              {/* Unique SVG Canvas Animation per card */}
              <div className="w-64 h-64 relative border border-accent/20 rounded-full flex items-center justify-center">
                {i === 0 && <div className="w-32 h-32 border border-accent animate-[spin_10s_linear_infinite]" />}
                {i === 1 && <div className="w-full h-[1px] bg-accent/50 animate-[pulse_2s_ease-in-out_infinite]" />}
                {i === 2 && <div className="w-32 h-32 rounded-full bg-accent/20 animate-ping" />}
              </div>
            </div>
            
            <div className="w-full md:w-1/2 flex flex-col gap-6">
              <span className="font-data text-accent text-xl">Fase {p.num}</span>
              <h2 className="font-heading font-black text-5xl md:text-7xl tracking-tighter">{p.title}</h2>
              <p className="font-heading text-background/60 text-lg md:text-xl max-w-md">{p.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

const Action = () => {
  return (
    <section id="agenda" className="py-32 px-6 lg:px-12 bg-background text-primary">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <h2 className="font-drama italic text-5xl md:text-7xl mb-24 text-center">Inicie sua Jornada</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {/* Tier 1 */}
          <div className="p-10 rounded-[3rem] bg-white border border-primary/10 flex flex-col gap-8 shadow-sm">
            <div>
              <h3 className="font-heading font-bold text-2xl mb-2">Conheça</h3>
              <p className="font-heading text-primary/60 text-sm">Explore nossos projetos de dança e alongamento.</p>
            </div>
            <ul className="flex flex-col gap-4 font-heading text-sm font-medium">
              <li className="flex gap-3 items-center"><Check size={16} className="text-accent"/> Workshops Be The Dance</li>
              <li className="flex gap-3 items-center"><Check size={16} className="text-accent"/> Aulas Biostretch</li>
            </ul>
            <button className="btn-magnetic mt-auto w-full py-4 rounded-full border border-primary text-primary font-bold text-sm">
              <span className="relative z-10">Ver Detalhes</span>
            </button>
          </div>
          
          {/* Tier 2 - Pop */}
          <div className="p-10 rounded-[3rem] bg-primary text-background flex flex-col gap-8 shadow-2xl scale-105 ring-4 ring-accent/20 z-10 relative">
            <div>
              <h3 className="font-heading font-bold text-2xl mb-2 text-accent">Participe</h3>
              <p className="font-heading text-background/60 text-sm">Inscreva-se nos próximos workshops agendados.</p>
            </div>
            <ul className="flex flex-col gap-4 font-heading text-sm font-medium">
              <li className="flex gap-3 items-center"><Check size={16} className="text-accent"/> Acesso Prioritário</li>
              <li className="flex gap-3 items-center"><Check size={16} className="text-accent"/> Material de Apoio</li>
              <li className="flex gap-3 items-center"><Check size={16} className="text-accent"/> Mentoria Coletiva</li>
            </ul>
            <button className="btn-magnetic mt-auto w-full py-4 rounded-full bg-accent text-primary font-bold text-sm">
              <span className="relative z-10">Ver Agenda</span>
            </button>
          </div>
          
          {/* Tier 3 */}
          <div className="p-10 rounded-[3rem] bg-white border border-primary/10 flex flex-col gap-8 shadow-sm">
            <div>
              <h3 className="font-heading font-bold text-2xl mb-2">Apoie</h3>
              <p className="font-heading text-primary/60 text-sm">Torne-se um financiador do nosso projeto social.</p>
            </div>
            <ul className="flex flex-col gap-4 font-heading text-sm font-medium">
              <li className="flex gap-3 items-center"><Check size={16} className="text-accent"/> Relatórios de Impacto</li>
              <li className="flex gap-3 items-center"><Check size={16} className="text-accent"/> Visitas ao Projeto</li>
            </ul>
            <button className="btn-magnetic mt-auto w-full py-4 rounded-full border border-primary text-primary font-bold text-sm">
              <span className="relative z-10">Seja um Parceiro</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-primary text-background rounded-t-[4rem] px-6 lg:px-12 pt-24 pb-12 mt-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-24">
        
        <div className="flex flex-col md:flex-row justify-between gap-12">
          <div className="max-w-sm">
            <div className="flex items-center gap-4 mb-6">
              <img src="/logo-dance2dance.png" alt="Dance2Dance Logo" className="h-12 object-contain" />
            </div>
            <p className="font-heading text-background/60 text-sm">Transformando vidas através do movimento e da dança. Um projeto focado em expressão e bem-estar social.</p>
          </div>
          
          <div className="flex gap-16 font-heading text-sm font-medium">
            <div className="flex flex-col gap-4">
              <a href="#" className="hover:text-accent transition-colors">Be The Dance</a>
              <a href="#" className="hover:text-accent transition-colors">Biostretch</a>
              <a href="#" className="hover:text-accent transition-colors">Impacto Social</a>
            </div>
            <div className="flex flex-col gap-4">
              <a href="#" className="hover:text-accent transition-colors">Instagram</a>
              <a href="#" className="hover:text-accent transition-colors">Contato</a>
              <a href="#" className="hover:text-accent transition-colors">Termos</a>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-textDark/50 text-xs font-data text-background/40">
          <p>© {new Date().getFullYear()} Dance2Dance. Todos os direitos reservados.</p>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Mahendra</span>
          </div>
        </div>
        
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <div className="bg-primary text-background min-h-screen">
      <Navbar />
      <HeroSequence />
      <Features />
      <Philosophy />
      <Protocol />
      <Action />
      <Footer />
    </div>
  );
}
