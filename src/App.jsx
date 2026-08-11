import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X, ArrowRight, Play, HeartPulse, Check, MousePointer2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Brand = ({ className = '' }) => (
  <span className={`font-batang font-normal text-[1.15em] ${className}`}>
    Dance<span className="text-accent">2</span>Dance
  </span>
);

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
      <div ref={navRef} className="px-4 md:px-6 py-3 md:py-4 rounded-full border border-transparent transition-colors flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img ref={logoRef} src="/logo-dance2dance.png" alt="Dance2Dance Logo" className="h-10 md:h-20 object-contain" />
        </div>
        <div className="hidden md:flex gap-8 text-sm font-heading font-semibold text-background/80">
          <a href="#workshops" className="hover:text-accent transition-colors hover:-translate-y-[1px]">Workshops</a>
          <a href="#social" className="hover:text-accent transition-colors hover:-translate-y-[1px]">Projeto Social</a>
          <a href="#agenda" className="hover:text-accent transition-colors hover:-translate-y-[1px]">Agenda</a>
        </div>
        <button className="btn-magnetic bg-accent text-primary px-4 md:px-6 py-2 rounded-full font-heading font-bold text-xs md:text-sm whitespace-nowrap">
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
      
      // 2. O bloco de texto rola continuamente (como créditos de filme)
      // Ele começa fisicamente abaixo da tela (top-full) e rola até sair completamente pelo topo
      tl.to('.seq-block-rest', 
        { 
          yPercent: -100,
          y: () => -window.innerHeight,
          ease: 'none', 
          duration: 0.5 
        }, 
        0.25
      );

      // O bloco começa a desaparecer em fade mais cedo (0.55) para evitar encostar no Nav
      tl.to('.seq-block-rest', { opacity: 0, duration: 0.15, ease: 'power2.inOut' }, 0.55);

      // 3. A última frase aparece no centro em cross-fade acompanhando a saída do bloco
      tl.fromTo('.seq-text-last', 
        { opacity: 0, scale: 0.95 }, 
        { opacity: 1, scale: 1, ease: 'power2.out', duration: 0.1 }, 
        0.60
      );
      
      // Teste: Clareia o filtro escuro no momento em que a última frase entra (0.8) até o fim da timeline
      tl.to('.dark-overlay', { opacity: 0, duration: 0.2 }, 0.8);

    }, containerRef);

    let lastWidth = window.innerWidth;
    const handleResize = () => {
      // No mobile, ignorar mudanças de altura (causadas pela barra de endereço)
      if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        render(animationData.frame);
      }
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
    <section ref={containerRef} className="relative h-[100dvh] w-full bg-primary overflow-hidden">
      
      {/* Fallback de carregamento */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-primary z-0">
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
          <span className="hero-elem font-heading font-bold text-3xl md:text-5xl text-background/90 tracking-tight">O movimento encontra a</span>
          <span className="hero-elem font-drama italic text-4xl sm:text-5xl md:text-8xl text-accent leading-none">Transformação.</span>
        </h1>
        <p className="hero-elem mt-8 text-lg md:text-xl text-background/70 font-heading max-w-md">
          A dança e o movimento como ferramentas de expressão e bem-estar. A arte como caminho para a transformação social.
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
        <h2 className="seq-text-1 font-heading font-bold text-3xl md:text-5xl text-background/90 opacity-0 max-w-4xl leading-tight">
          Há lugares que não existem no mapa. <br/><span className="text-accent italic font-drama">Só no corpo.</span>
        </h2>
      </div>

      {/* 2. Restante do texto (Rola continuamente) */}
      <div className="seq-block-rest absolute top-full left-0 right-0 z-10 w-full max-w-7xl mx-auto flex flex-col md:w-2/3 lg:w-1/2 items-start px-6 lg:px-12 pointer-events-none gap-6">
          <p className="font-heading text-lg md:text-xl text-background/90 leading-relaxed">
            <Brand className="text-background text-2xl md:text-3xl" /> é uma organização social que nasceu para construir esses lugares. Espaços onde a dança não é somente performance, mas sobretudo é presença. Onde o movimento é mais que exercício ou alongamento, é escuta e expressão. Onde a arte não é um fim, mas o início de um encontro.
          </p>

          <p className="font-heading text-lg md:text-xl text-background/90 leading-relaxed">
            O encontro consigo mesmo e o encontro que acontece quando pessoas respiram e se movem no mesmo ritmo.
          </p>

          <p className="font-heading text-lg md:text-xl text-background/90 leading-relaxed">
            A mudança começa na pele, quando uma pessoa redescobre sua própria força, sua criatividade, sua própria voz. E, quando isso acontece em grupo, abre-se um caminho para a <strong className="text-accent">transformação social</strong>.
          </p>

          <p className="font-heading text-lg md:text-xl text-background/90 leading-relaxed">
            <Brand className="text-background text-2xl md:text-3xl" /> cria as condições para que as pessoas se encontrem.
          </p>
      </div>

      {/* 3. Última frase (Centralizada com destaque dourado) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 md:px-12 z-10 pointer-events-none">
        <h2 className="seq-text-last font-drama italic text-4xl md:text-6xl text-background opacity-0 max-w-4xl leading-tight">
          A <span className="text-accent">dança e o movimento</span> fazem o resto.
        </h2>
      </div>
    </section>
  );
};

const Activities = () => {
  return (
    <section id="workshops" className="py-24 px-8 bg-[#0C0C0C] min-h-screen flex items-center">
      <div className="max-w-[1200px] w-full mx-auto text-center">
        
        <p className="font-heading text-[10px] tracking-[5px] uppercase text-[#8A8A8A] mb-5">O que fazemos</p>
        
        <h2 className="font-batang text-[38px] font-normal text-[#F0EDE8] mb-4 leading-tight tracking-tight">Nossas Atividades</h2>
        
        <div className="w-12 h-[1px] bg-[#C4B49A]/70 mx-auto mb-16"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 items-stretch">
          
          {/* Card 1 - Be The Dance */}
          <a href="/be-the-dance" className="group relative bg-[#141414] px-9 pt-12 pb-12 text-center overflow-hidden cursor-pointer transition-all duration-[600ms] border border-[#222222] rounded-[2px] hover:-translate-y-[10px] hover:border-[#8BBCD8]/35 hover:shadow-[0_24px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(139,188,216,0.15)] flex flex-col items-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle,rgba(139,188,216,0.4)_0%,transparent_70%)]"></div>
            
            <div className="h-[110px] flex items-center justify-center mb-8 relative z-10 w-full">
              <img src="/logo-bethedance.png" alt="Be the Dance" className="max-h-full max-w-[150px] object-contain" />
            </div>
            
            <h3 className="text-[22px] font-normal text-[#F0EDE8] mb-3.5 tracking-wide relative z-10 font-batang">Be the Dance</h3>
            
            <div className="w-7 h-[1px] bg-[#C4B49A]/40 group-hover:bg-[#8BBCD8]/60 mx-auto mb-5 transition-all duration-500 group-hover:w-14 relative z-10"></div>
            
            <p className="font-heading text-[14px] leading-[1.75] text-[#9A9A9A] font-light relative z-10">
              Workshops de dança onde o movimento vira encontro. Ritmos que se cruzam, corpos que se escutam, uma coreografia que nasce do coletivo.
            </p>
          </a>
          
          {/* Card 2 - BioStretch */}
          <a href="/biostretch" className="group relative bg-[#141414] px-9 pt-12 pb-12 text-center overflow-hidden cursor-pointer transition-all duration-[600ms] border border-[#222222] rounded-[2px] hover:-translate-y-[10px] hover:border-[#5AA87A]/35 hover:shadow-[0_24px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(90,168,122,0.15)] flex flex-col items-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle,rgba(90,168,122,0.4)_0%,transparent_70%)]"></div>
            
            <div className="h-[110px] flex items-center justify-center mb-8 relative z-10 w-full">
              <img src="/logo-biostretch.png" alt="BioStretch" className="max-h-full max-w-[180px] scale-110 object-contain" />
            </div>
            
            <h3 className="text-[22px] font-normal text-[#F0EDE8] mb-3.5 tracking-wide relative z-10 font-batang">BioStretch</h3>
            
            <div className="w-7 h-[1px] bg-[#C4B49A]/40 group-hover:bg-[#5AA87A]/60 mx-auto mb-5 transition-all duration-500 group-hover:w-14 relative z-10"></div>
            
            <p className="font-heading text-[14px] leading-[1.75] text-[#9A9A9A] font-light relative z-10">
              Práticas de movimento consciente que ampliam a percepção, estimulam a reorganização corporal e transformam a maneira como habitamos o corpo.
            </p>
          </a>
          
          {/* Card 3 - Kroppsskole */}
          <a href="/kroppsskole" className="group relative bg-[#141414] px-9 pt-12 pb-12 text-center overflow-hidden cursor-pointer transition-all duration-[600ms] border border-[#222222] rounded-[2px] hover:-translate-y-[10px] hover:border-[#4A9B8E]/35 hover:shadow-[0_24px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(74,155,142,0.15)] flex flex-col items-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(circle,rgba(74,155,142,0.4)_0%,transparent_70%)]"></div>
            
            <div className="h-[110px] flex items-center justify-center mb-8 relative z-10 w-full">
              <img src="/logo-kroppsskole.png" alt="Kroppsskole" className="max-h-full max-w-[150px] object-contain" />
            </div>
            
            <h3 className="text-[22px] font-normal text-[#F0EDE8] mb-3.5 tracking-wide relative z-10 font-batang">Kroppsskole</h3>
            
            <div className="w-7 h-[1px] bg-[#C4B49A]/40 group-hover:bg-[#4A9B8E]/60 mx-auto mb-5 transition-all duration-500 group-hover:w-14 relative z-10"></div>
            
            <p className="font-heading text-[14px] leading-[1.75] text-[#9A9A9A] font-light relative z-10">
              Projetos comunitários que atravessam ruas e bairros, tecendo laços, criando vínculos e Transformando.
            </p>
          </a>

        </div>
        
        <div className="mt-16">
          <a href="/programacao" className="inline-block font-heading text-[10px] tracking-[4px] uppercase text-[#C4B49A] decoration-transparent border-b border-[#C4B49A]/30 pb-2 transition-all duration-400 hover:border-[#C4B49A]/80 hover:text-[#F0EDE8] hover:pb-2.5">
            CONHEÇA NOSSA PROGRAMAÇÃO
          </a>
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
      
      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col gap-8">
        <p className="phil-line font-heading font-normal text-background/50 text-2xl md:text-3xl tracking-tight">
          Movemos o corpo para <span className="text-background/80">aproximar pessoas</span>.
        </p>
        <h2 className="phil-line font-drama italic text-3xl md:text-6xl lg:text-7xl leading-tight text-background">
          Aproximamos pessoas para <br/>
          <span className="text-accent">transformar comunidades.</span>
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
    {
      num: '01',
      label: 'O ponto de partida',
      title: 'Expressão',
      desc: 'O corpo guarda o que a palavra não alcança. Nos workshops, o movimento torna-se linguagem — um espaço onde ritmo, presença e improvisação libertam o que estava contido.',
      visual: (
        <div className="relative w-64 h-64 flex items-center justify-center">
          <div className="absolute w-64 h-64 rounded-full border border-accent/10 animate-[spin_20s_linear_infinite]" />
          <div className="absolute w-44 h-44 rounded-full border border-accent/20 animate-[spin_14s_linear_infinite_reverse]" />
          <div className="absolute w-24 h-24 rounded-full border border-accent/40 animate-[spin_8s_linear_infinite]" />
          <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
        </div>
      )
    },
    {
      num: '02',
      label: 'O que o movimento cura',
      title: 'Bem-estar',
      desc: 'Escutar o corpo é um ato político. As práticas de movimento consciente ampliam a percepção, reorganizam padrões físicos e devolvem às pessoas a autoria sobre si mesmas.',
      visual: (
        <div className="relative w-64 h-64 flex items-center justify-center overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-[1px] bg-accent/30"
              style={{
                top: `${20 + i * 15}%`,
                animation: `pulse ${2 + i * 0.4}s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
                transform: `scaleX(${0.4 + i * 0.15})`
              }}
            />
          ))}
          <div className="w-12 h-12 rounded-full border-2 border-accent/60 animate-[ping_3s_ease-in-out_infinite]" />
        </div>
      )
    },
    {
      num: '03',
      label: 'O que o corpo inventa',
      title: 'Criação',
      desc: 'O movimento é matéria-prima. Da dança nasce a coreografia, do silêncio nasce o gesto, do encontro nasce a obra. A arte é o que acontece quando o corpo tem liberdade para se expressar.',
      visual: (
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Triângulo que se forma */}
          <svg viewBox="0 0 200 200" className="absolute w-full h-full">
            <polygon
              points="100,20 180,160 20,160"
              fill="none"
              stroke="rgba(201,168,76,0.15)"
              strokeWidth="1"
              className="animate-[spin_30s_linear_infinite]"
              style={{ transformOrigin: '100px 100px' }}
            />
            <polygon
              points="100,40 160,150 40,150"
              fill="none"
              stroke="rgba(201,168,76,0.25)"
              strokeWidth="1"
              className="animate-[spin_20s_linear_infinite_reverse]"
              style={{ transformOrigin: '100px 100px' }}
            />
            <polygon
              points="100,60 140,140 60,140"
              fill="none"
              stroke="rgba(201,168,76,0.5)"
              strokeWidth="1"
              className="animate-[spin_12s_linear_infinite]"
              style={{ transformOrigin: '100px 100px' }}
            />
          </svg>
          <div className="w-2 h-2 rounded-full bg-accent animate-[ping_2s_ease-in-out_infinite]" />
        </div>
      )
    },
    {
      num: '04',
      label: 'O que fica na comunidade',
      title: 'Transformação',
      desc: 'Quando pessoas se movem juntas, algo muda. A dança atravessa muros, cria vínculos e abre espaço para uma transformação que começa no corpo e reverbera no bairro, na rua, na cidade.',
      visual: (
        <div className="relative w-64 h-64 flex items-center justify-center">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-accent/10 border border-accent/20"
              style={{
                width: `${80 + i * 64}px`,
                height: `${80 + i * 64}px`,
                animation: `ping ${2.5 + i * 0.8}s ease-out infinite`,
                animationDelay: `${i * 0.6}s`
              }}
            />
          ))}
          <div className="w-8 h-8 rounded-full bg-accent/60" />
        </div>
      )
    }
  ];

  return (
    <section id="social" ref={protocolRef} className="relative bg-primary text-background">
      {protocols.map((p, i) => (
        <div key={p.num} className="proto-card h-[100dvh] w-full flex items-center justify-center sticky top-0 bg-primary border-b border-textDark/30">
          <div className="max-w-5xl mx-auto px-6 lg:px-12 w-full flex flex-col md:flex-row items-center justify-between gap-16">
            <div className="w-full md:w-1/2 flex justify-center">
              {p.visual}
            </div>
            
            <div className="w-full md:w-1/2 flex flex-col gap-5">
              <span className="font-heading text-xs tracking-[4px] uppercase text-accent/70">{p.label}</span>
              <h2 className="font-drama italic text-6xl md:text-8xl leading-none text-background">{p.title}</h2>
              <div className="w-8 h-[1px] bg-accent/40" />
              <p className="font-heading text-background/60 text-base md:text-lg max-w-md leading-relaxed">{p.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

const Action = () => {
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const imagesRef = useRef([]);
  const frameRef = useRef(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const frameCount = 240;

  // Carrega as imagens (virão do cache do browser, pois o Hero já as carregou)
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
          loadedImages.sort((a, b) => a.src.localeCompare(b.src));
          imagesRef.current = loadedImages;
          setIsLoaded(true);
        }
      };
      // Se a imagem já estava em cache, onload pode não disparar
      if (img.complete) {
        loadedCount++;
        loadedImages.push(img);
        if (loadedCount === frameCount) {
          loadedImages.sort((a, b) => a.src.localeCompare(b.src));
          imagesRef.current = loadedImages;
          setIsLoaded(true);
        }
      }
    }
  }, []);

  // Animação automática em loop com transição suave
  useEffect(() => {
    if (!isLoaded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = (index) => {
      const img = imagesRef.current[index];
      if (!img || !canvas.width) return;
      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.max(hRatio, vRatio);
      const cx = (canvas.width - img.width * ratio) / 2;
      const cy = (canvas.height - img.height * ratio) / 2;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, img.width, img.height, cx, cy, img.width * ratio, img.height * ratio);
    };

    const fadingRef = { current: false };
    const FADE_STEPS = 45; // ~3s

    const setOverlayOpacity = (val) => {
      if (overlayRef.current) overlayRef.current.style.opacity = val;
    };

    const startFadeOut = () => {
      let step = 0;
      const timer = setInterval(() => {
        step++;
        setOverlayOpacity(step / FADE_STEPS);
        if (step >= FADE_STEPS) {
          clearInterval(timer);
          frameRef.current = 0;
          render(0);
          startFadeIn();
        }
      }, 1000 / 15);
    };

    const startFadeIn = () => {
      let step = FADE_STEPS;
      const timer = setInterval(() => {
        step--;
        setOverlayOpacity(step / FADE_STEPS);
        if (step <= 0) {
          clearInterval(timer);
          fadingRef.current = false;
        }
      }, 1000 / 15);
    };

    // Loop fixo a 15fps — suave e consistente
    const interval = setInterval(() => {
      if (fadingRef.current) return;

      const current = frameRef.current;
      render(current);

      if (current >= frameCount - 1) {
        fadingRef.current = true;
        startFadeOut();
      } else {
        frameRef.current = current + 1;
      }
    }, 1000 / 15);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, [isLoaded]);

  return (
    <section id="agenda" className="relative z-20 bg-[#0C0C0C] py-48 px-6 lg:px-12 overflow-hidden flex items-center justify-center min-h-[80vh]">

      {/* Canvas com a sequência de frames em loop */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ filter: 'brightness(0.7)' }}
      />

      {/* Overlay de transição fade-to-black no loop */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-primary pointer-events-none"
        style={{ opacity: 0 }}
      />

      {/* Gradiente para legibilidade e transição suave */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/10 to-primary/60 pointer-events-none" />

      {/* Desfoque suave invisível estendido na marca d'água usando máscara radial alargada */}
      <div 
        className="hidden md:block absolute bottom-0 right-0 w-[45rem] h-12 pointer-events-none" 
        style={{ 
          backdropFilter: 'blur(10px)', 
          WebkitBackdropFilter: 'blur(10px)', 
          WebkitMaskImage: 'radial-gradient(ellipse at bottom right, black 60%, transparent 90%)',
          maskImage: 'radial-gradient(ellipse at bottom right, black 60%, transparent 90%)'
        }} 
      />

      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center gap-10">

        <p className="font-heading text-[11px] tracking-[5px] uppercase text-accent font-semibold">
          O próximo passo é simples
        </p>

        <h2 className="font-drama italic text-5xl md:text-7xl lg:text-8xl text-background leading-tight">
          Venha se{' '}
          <span className="text-accent">mover.</span>
        </h2>

        <p className="font-heading text-background/90 text-lg md:text-xl max-w-lg leading-relaxed font-medium">
          Encontre um workshop, uma aula, o seu lugar. <br className="hidden sm:block" />O corpo sabe o caminho, basta começar.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <a
            href="/programacao"
            className="btn-magnetic bg-accent text-primary px-10 py-4 rounded-full font-heading font-bold text-sm flex items-center gap-2 justify-center"
          >
            <span className="relative z-10 flex items-center gap-2">Ver Programação <ArrowRight size={16}/></span>
          </a>
          <a
            href="/apoie"
            className="px-10 py-4 rounded-full font-heading font-normal text-sm border border-background/20 text-background/60 hover:border-background/50 hover:text-background/90 transition-all duration-300 flex items-center justify-center"
          >
            Quero apoiar o projeto
          </a>
        </div>

      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <div className="bg-[#0C0C0C] relative z-20 pt-10">
      <footer className="bg-primary text-background rounded-t-[4rem] px-6 lg:px-12 pt-24 pb-12">
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
              <a href="#" className="hover:text-accent transition-colors">Kroppsskole</a>
              <a href="#" className="hover:text-accent transition-colors">Impacto Social</a>
            </div>
            <div className="flex flex-col gap-4">
              <a href="#" className="hover:text-accent transition-colors">Instagram</a>
              <a href="#" className="hover:text-accent transition-colors">Facebook</a>
              <a href="#" className="hover:text-accent transition-colors">YouTube</a>
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
    </div>
  );
};

export default function App() {
  return (
    <div className="bg-primary text-background min-h-[100dvh] overflow-x-hidden">
      <Navbar />
      <HeroSequence />
      <Activities />
      <Philosophy />
      <Protocol />
      <Action />
      <Footer />
    </div>
  );
}
