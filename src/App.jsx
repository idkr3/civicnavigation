import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  Utensils, 
  Stethoscope, 
  Home as HomeIcon, 
  Zap, 
  GraduationCap, 
  Scale, 
  Briefcase, 
  Bus, 
  BookOpen, 
  Users,
  AlertTriangle,
  Search,
  MessageSquare,
  Baby,
  Activity,
  Heart,
  ChevronRight,
  ChevronDown,
  Info,
  Calendar,
  DollarSign,
  Clock,
  MapPin,
  Phone,
  Globe,
  Mail,
  User,
  Check,
  Send,
  AlertCircle
} from 'lucide-react';
import { 
  languages, 
  translations, 
  categories, 
  resources, 
  stepByStepGuides, 
  emergencyResources, 
  communityPartners, 
  impactMetrics, 
  chatbotAnswers 
} from './data';

const iconMap = {
  Utensils: Utensils,
  Stethoscope: Stethoscope,
  HomeIcon: HomeIcon,
  Zap: Zap,
  GraduationCap: GraduationCap,
  Scale: Scale,
  Briefcase: Briefcase,
  Bus: Bus,
  BookOpen: BookOpen,
  Users: Users,
  Baby: Baby,
  AlertTriangle: AlertTriangle,
  Activity: Activity,
  Heart: Heart,
  Info: Info,
  Calendar: Calendar,
  DollarSign: DollarSign,
  Clock: Clock,
  MapPin: MapPin,
  Phone: Phone,
  Globe: Globe,
  Mail: Mail,
  User: User
};

function Icon({ name, className = "w-5 h-5", ...props }) {
  const Comp = iconMap[name];
  if (!Comp) return null;
  return <Comp className={className} {...props} />;
}

// 3D Scroll transform animation component
function Scroll3D({ children }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Smooth 3D tilt as elements enter and exit the viewport
  const rotateX = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [12, 0, 0, -12]);
  const y = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [40, 0, 0, -40]);
  const scale = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0.96, 1, 1, 0.96]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  // Spring physics for smooth organic transitions
  const springRotateX = useSpring(rotateX, { stiffness: 90, damping: 25 });
  const springY = useSpring(y, { stiffness: 90, damping: 25 });
  const springScale = useSpring(scale, { stiffness: 90, damping: 25 });

  return (
    <motion.div
      ref={ref}
      style={{
        perspective: 1000,
        rotateX: springRotateX,
        y: springY,
        scale: springScale,
        opacity,
      }}
      className="w-full h-full transform-gpu"
    >
      {children}
    </motion.div>
  );
}

// Ambient coloured orbs for section backgrounds
function AmbientOrbs({ variant = 'default' }) {
  const configs = {
    default: [
      { color: 'rgba(80,80,160,0.18)', size: '500px', top: '10%', left: '-10%', delay: '0s' },
      { color: 'rgba(40,80,120,0.14)', size: '400px', top: '60%', right: '-5%', delay: '4s' },
    ],
    blue: [
      { color: 'rgba(60,100,200,0.15)', size: '600px', top: '-20%', left: '20%', delay: '0s' },
      { color: 'rgba(100,50,180,0.12)', size: '350px', bottom: '0%', right: '10%', delay: '7s' },
    ],
    red: [
      { color: 'rgba(180,40,40,0.12)', size: '500px', top: '0%', right: '-10%', delay: '0s' },
      { color: 'rgba(120,20,20,0.1)', size: '300px', bottom: '10%', left: '5%', delay: '5s' },
    ],
    green: [
      { color: 'rgba(30,120,80,0.13)', size: '500px', top: '20%', left: '-5%', delay: '2s' },
      { color: 'rgba(20,80,100,0.1)', size: '350px', bottom: '5%', right: '0%', delay: '8s' },
    ],
  };
  const orbs = configs[variant] || configs.default;
  return (
    <>
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="ambient-orb"
          style={{
            background: orb.color,
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: orb.left,
            right: orb.right,
            bottom: orb.bottom,
            animationDelay: orb.delay,
            zIndex: 0,
          }}
        />
      ))}
    </>
  );
}

// Animated number counter on scroll
function AnimatedCounter({ value, duration = 1800 }) {
  const ref = useRef(null);
  const [displayed, setDisplayed] = useState('0');
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const hasStarted = useRef(false);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      if (v > 0.3 && !hasStarted.current) {
        hasStarted.current = true;
        const numeric = parseInt(String(value).replace(/[^0-9]/g, ''), 10);
        const suffix = String(value).replace(/[0-9,]/g, '');
        const start = Date.now();
        const tick = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(numeric * eased);
          setDisplayed(current.toLocaleString() + suffix);
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    });
    return unsubscribe;
  }, [scrollYProgress, value, duration]);

  return <span ref={ref} className="stat-number">{displayed}</span>;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppContent() {
  const location = useLocation();
  const [lang, setLang] = useState('en');
  
  // Real-time Chatbot and Portal Data Tracking State
  const [tracker, setTracker] = useState({
    conversations: 42,
    searches: {
      'Food Assistance': 18,
      'Healthcare': 12,
      'School Enrollment': 8,
      'Housing Help': 6,
      'Utility Assistance': 5,
      'Legal Aid': 3
    },
    languages: {
      'English': 32,
      'Español': 15,
      'Tiếng Việt': 6,
      'العربية': 4
    },
    referrals: 24,
    clicks: 67
  });

  const trackReferral = (topic) => {
    setTracker(prev => ({
      ...prev,
      referrals: prev.referrals + 1,
      clicks: prev.clicks + 1,
      searches: {
        ...prev.searches,
        [topic]: (prev.searches[topic] || 0) + 1
      }
    }));
  };

  return (
    <div className="font-sans antialiased bg-black text-white selection:bg-white selection:text-black min-h-screen overflow-x-hidden flex flex-col relative">
      <Navbar lang={lang} setLang={setLang} />
      <main className="flex-1">
        <AnimatePresence mode="wait">
           <Routes location={location} key={location.pathname}>
             <Route path="/" element={<Home lang={lang} setLang={setLang} trackReferral={trackReferral} />} />
             <Route path="/directory" element={<DirectoryPage lang={lang} trackReferral={trackReferral} />} />
             <Route path="/guides" element={<GuidesPage lang={lang} />} />
             <Route path="/partners" element={<PartnersPage lang={lang} />} />
             <Route path="/volunteer" element={<VolunteerPage lang={lang} />} />
             <Route path="/feedback" element={<FeedbackPage lang={lang} tracker={tracker} setTracker={setTracker} />} />
             <Route path="/about" element={<AboutPage lang={lang} />} />
             <Route path="/emergency" element={<EmergencyPage lang={lang} />} />
           </Routes>
        </AnimatePresence>
      </main>
      <Footer lang={lang} />
      <Chatbot lang={lang} tracker={tracker} setTracker={setTracker} />
    </div>
  );
}

/* ========================================================================== */
/*                                COMPONENTS                                  */
/* ========================================================================== */

function Navbar({ lang, setLang }) {
  const location = useLocation();
  const path = location.pathname;
  const t = translations[lang] || translations.en;
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const links = [
    { name: t.directoryTitle, path: '/directory' },
    { name: t.guidesTitle, path: '/guides' },
    { name: t.partnersTitle, path: '/partners' },
    { name: t.volunteerTitle.split(' ')[0], path: '/volunteer' },
    { name: t.feedbackTitle.split(' ')[0], path: '/feedback' },
    { name: t.aboutTitle.split(' ')[0], path: '/about' }
  ];

  return (
    <nav className="absolute top-0 w-full z-50 px-4 md:px-8 lg:px-16 pt-4 md:pt-6">
      <div className="liquid-glass rounded-xl px-4 py-2.5 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-semibold tracking-tight text-white flex items-center gap-2">
          <span>VEX</span>
          <span className="text-xs font-normal border border-white/20 px-2 py-0.5 rounded text-gray-400">CIVIC</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex gap-6 text-sm">
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`transition-colors ${path === link.path ? 'text-white font-medium' : 'text-gray-400 hover:text-white'}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right side: emergency + lang + hamburger */}
        <div className="flex items-center gap-2 md:gap-4">
          <Link to="/emergency" className="hidden sm:flex bg-red-600/30 border border-red-500/50 hover:bg-red-600 text-red-100 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium items-center gap-1.5 transition-colors">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden md:inline">{t.emergencyHelpBtn}</span>
            <span className="md:hidden">SOS</span>
          </Link>

          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="bg-black/60 border border-white/20 text-white text-xs rounded-lg px-2 py-1 focus:outline-none cursor-pointer hidden sm:block"
          >
            {languages.map(l => (
              <option key={l.code} value={l.code} className="bg-black text-white">{l.name}</option>
            ))}
          </select>

          {/* Hamburger (mobile only) */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="lg:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-lg border border-white/10 hover:border-white/30 transition-colors"
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden mt-2 liquid-glass rounded-xl overflow-hidden border border-white/10"
          >
            <div className="p-4 flex flex-col gap-1">
              {links.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-3 rounded-lg text-sm transition-colors ${
                    path === link.path ? 'bg-white text-black font-medium' : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="section-divider my-2" />
              <Link to="/emergency" className="px-4 py-3 rounded-lg text-sm text-red-300 hover:bg-red-900/20 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                {t.emergencyHelpBtn}
              </Link>
              {/* Mobile lang select */}
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="mt-2 w-full bg-black/60 border border-white/20 text-white text-xs rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
              >
                {languages.map(l => (
                  <option key={l.code} value={l.code} className="bg-black text-white">{l.name}</option>
                ))}
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function FadeIn({ children, delay = 0, duration = 1000 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className="transition-opacity ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transitionDuration: `${duration}ms`
      }}
    >
      {children}
    </div>
  );
}

function AnimatedHeading({ text }) {
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartAnimation(true);
    }, 200);
    return () => clearTimeout(timer);
  }, [text]);

  const lines = text.split('\n');
  const charDelay = 15;

  return (
    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal mb-4 text-white leading-tight" style={{ letterSpacing: '-0.04em' }}>
      {lines.map((line, lineIndex) => {
        const previousCharsCount = lines.slice(0, lineIndex).reduce((sum, prevLine) => sum + prevLine.length, 0);
        return (
          <div key={lineIndex} className="block">
            {line.split('').map((char, charIndex) => {
              const delay = (previousCharsCount + charIndex) * charDelay;
              return (
                <span
                  key={charIndex}
                  className="inline-block transition-all ease-out"
                  style={{
                    opacity: startAnimation ? 1 : 0,
                    transform: startAnimation ? 'translateX(0)' : 'translateX(-18px)',
                    transitionDuration: '500ms',
                    transitionDelay: `${delay}ms`
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              );
            })}
          </div>
        );
      })}
    </h1>
  );
}

function PageHeader({ title, subtitle, variant = 'default' }) {
  return (
    <div className="relative pt-36 pb-16 px-6 md:px-12 lg:px-16 max-w-[1600px] mx-auto w-full overflow-hidden">
      <AmbientOrbs variant={variant} />
      <div className="relative z-10">
        <AnimatedHeading text={title} />
        {subtitle && (
          <FadeIn delay={300} duration={800}>
            <p className="text-lg text-gray-400 max-w-3xl mt-4 font-light leading-relaxed">{subtitle}</p>
          </FadeIn>
        )}
        <div className="section-divider mt-12" />
      </div>
    </div>
  );
}

/* ========================================================================== */
/*                               PAGES & VIEWS                                */
/* ========================================================================== */

// HOMEPAGE
function Home({ lang, setLang, trackReferral }) {
  const navigate = useNavigate();
  const t = translations[lang] || translations.en;
  const [searchVal, setSearchVal] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/directory?search=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  const scrollToCategories = () => {
    document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      {/* Hero Section */}
      <div className="relative h-screen min-h-[800px] flex flex-col">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-black">
          <div className="hero-bg-zoom opacity-75" />
          
          {/* Animated Overlaying SVG Flight Paths */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-10" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            <path
              d="M 150,300 Q 500,50 850,300"
              fill="none"
              stroke="url(#arcGrad)"
              strokeWidth="2.5"
              filter="url(#glow)"
            />
            <path
              d="M 150,300 Q 500,50 850,300"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="4"
              strokeDasharray="15, 150"
              className="flight-pulse-1"
            />

            <path
              d="M 250,450 Q 500,200 750,450"
              fill="none"
              stroke="url(#arcGrad)"
              strokeWidth="2"
              filter="url(#glow)"
            />
            <path
              d="M 250,450 Q 500,200 750,450"
              fill="none"
              stroke="#93c5fd"
              strokeWidth="3.5"
              strokeDasharray="12, 120"
              className="flight-pulse-2"
            />

            <path
              d="M 100,200 Q 400,-50 700,250"
              fill="none"
              stroke="url(#arcGrad)"
              strokeWidth="2"
              filter="url(#glow)"
            />
            <path
              d="M 100,200 Q 400,-50 700,250"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="3.5"
              strokeDasharray="10, 100"
              className="flight-pulse-3"
            />

            <path
              d="M 300,100 Q 600,350 900,150"
              fill="none"
              stroke="url(#arcGrad)"
              strokeWidth="2"
              filter="url(#glow)"
            />
            <path
              d="M 300,100 Q 600,350 900,150"
              fill="none"
              stroke="#93c5fd"
              strokeWidth="3"
              strokeDasharray="8, 90"
              className="flight-pulse-4"
            />
          </svg>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/70 z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-radial-gradient z-10 pointer-events-none" />
        </div>

        <div className="relative z-10 px-4 md:px-12 lg:px-16 flex-1 flex flex-col justify-end pb-8 md:pb-12 lg:pb-16 w-full">
          <div className="lg:grid lg:grid-cols-2 lg:items-end w-full">
            {/* Left Column */}
            <div className="mb-6 lg:mb-0">
              <AnimatedHeading text={t.heroTitle} />

              <FadeIn delay={500} duration={800}>
                <p className="text-sm md:text-base lg:text-lg text-gray-300 mb-5 max-w-2xl font-light leading-relaxed border-l border-white/20 pl-4">
                  {t.aboutDesc}
                </p>
              </FadeIn>

              {/* Search Bar */}
              <FadeIn delay={700} duration={800}>
                <form onSubmit={handleSearchSubmit} className="mb-5 max-w-sm md:max-w-md flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder={t.searchPlaceholder}
                      value={searchVal}
                      onChange={(e) => setSearchVal(e.target.value)}
                      className="w-full bg-black/60 backdrop-blur border border-white/20 rounded-lg pl-10 pr-4 py-2.5 md:py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
                    />
                    <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                  </div>
                  <button type="submit" className="bg-white text-black px-4 md:px-6 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center">
                    <Search className="w-4 h-4" />
                  </button>
                </form>
              </FadeIn>

              {/* Buttons Row */}
              <FadeIn delay={900} duration={800}>
                <div className="flex flex-wrap gap-3 items-center">
                  <button
                    onClick={scrollToCategories}
                    className="bg-white text-black px-5 md:px-8 py-2.5 md:py-3 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                  >
                    {t.needHelpBtn}
                  </button>
                  <Link
                    to="/emergency"
                    className="liquid-glass border border-white/20 text-white px-5 md:px-8 py-2.5 md:py-3 rounded-lg text-sm font-medium hover:bg-white hover:text-black transition-colors flex items-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="hidden sm:inline">{t.emergencyHelpBtn}</span>
                    <span className="sm:hidden">Emergency</span>
                  </Link>
                  <button
                    onClick={() => { document.getElementById('chat-toggle-btn')?.click(); }}
                    className="liquid-glass border border-white/20 text-gray-300 hover:text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="hidden sm:inline">{t.chatBtn}</span>
                  </button>
                </div>
              </FadeIn>
            </div>

            {/* Right Column - Language Tag Card (hidden on small screens) */}
            <div className="hidden md:flex items-end justify-start lg:justify-end mt-6 lg:mt-0">
              <FadeIn delay={1100} duration={800}>
                <div className="liquid-glass border border-white/20 px-6 py-4 rounded-xl max-w-xs">
                  <p className="text-lg md:text-xl font-light text-white tracking-wide">Access. Support. Community.</p>
                  <div className="w-full h-[1px] bg-white/10 my-3" />
                  <div className="flex flex-wrap gap-2">
                    {languages.map(l => (
                      <button
                        key={l.code}
                        onClick={() => setLang(l.code)}
                        className={`text-2xs uppercase tracking-wider px-2 py-0.5 rounded border transition-colors ${lang === l.code ? 'border-white bg-white text-black' : 'border-white/10 text-gray-400 hover:border-white/30'}`}
                      >
                        {l.code}
                      </button>
                    ))}
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee ticker */}
      <div className="py-6 border-t border-white/5 bg-black overflow-hidden">
        <div className="marquee-track">
          {[...categories, ...categories].map((cat, idx) => (
            <span key={idx} className="flex items-center gap-3 text-xs uppercase tracking-widest text-gray-500 whitespace-nowrap">
              <Icon name={cat.icon} className="w-3.5 h-3.5 text-gray-600" />
              {cat.name}
              <span className="ml-4 text-gray-700">—</span>
            </span>
          ))}
        </div>
      </div>

      {/* Quick Access Categories */}
      <div id="categories" className="relative py-32 px-6 md:px-12 lg:px-16 overflow-hidden bg-black">
        <AmbientOrbs variant="blue" />
        <div className="section-divider mb-20" />
        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="mb-16">
            <p className="text-3xs uppercase tracking-widest text-gray-500 mb-3">Civic Resource Hub</p>
            <h2 className="text-3xl md:text-5xl font-light gradient-text tracking-tight mb-4" style={{letterSpacing:'-0.03em'}}>{t.needHelpBtn}</h2>
            <p className="text-gray-500 max-w-2xl font-light text-base">Explore verified local organizations with full service details, documentation requirements, and eligibility information.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {categories.map((cat, idx) => (
              <Scroll3D key={cat.id}>
                <Link
                  to={`/directory?category=${cat.id}`}
                  className="group glow-card shimmer relative flex flex-col justify-between h-60 p-6 border border-white/8 rounded-2xl liquid-glass cursor-pointer"
                >
                  {/* top-right index number */}
                  <span className="absolute top-4 right-5 text-3xs text-gray-700 font-mono tabular-nums">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 border border-white/8"
                      style={{ background: 'rgba(255,255,255,0.04)' }}
                    >
                      <Icon name={cat.icon} className="w-6 h-6 stroke-[1.3] text-white/70 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-2 tracking-wide">{cat.name}</h3>
                    <p className="text-2xs text-gray-500 font-light leading-relaxed">{cat.desc}</p>
                  </div>
                  <div className="flex items-center gap-2 text-2xs font-semibold text-gray-500 tracking-widest uppercase group-hover:text-white transition-all mt-2">
                    <span>{t.explore}</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                  {/* Bottom accent glow line on hover */}
                  <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </Scroll3D>
            ))}
          </div>
        </div>
      </div>


    </motion.div>
  );
}

// Mobile collapsible filter bar (shown only on small screens in Directory)
function MobileFilterBar({ searchQuery, onSearchChange, selectedCategory, onCategorySelect }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden mb-6">
      {/* Search + toggle */}
      <div className="flex gap-2 mb-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search resources..."
            className="w-full bg-black/60 border border-white/20 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
          />
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
        </div>
        <button
          onClick={() => setOpen(o => !o)}
          className={`liquid-glass border px-4 rounded-xl text-xs font-medium transition-colors flex items-center gap-2 ${open ? 'border-white text-white bg-white/10' : 'border-white/20 text-gray-400'}`}
        >
          <BookOpen className="w-4 h-4" />
          Filter
          <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Expandable category chips */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 py-2">
              <button
                onClick={() => { onCategorySelect('all'); setOpen(false); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-all ${selectedCategory === 'all' ? 'bg-white text-black border-white font-medium' : 'border-white/20 text-gray-400 hover:border-white/40'}`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { onCategorySelect(cat.id); setOpen(false); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-all ${selectedCategory === cat.id ? 'bg-white text-black border-white font-medium' : 'border-white/20 text-gray-400 hover:border-white/40'}`}
                >
                  <Icon name={cat.icon} className="w-3 h-3" />
                  {cat.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// RESOURCE DIRECTORY PAGE
function DirectoryPage({ lang, trackReferral }) {
  const t = translations[lang] || translations.en;
  const location = useLocation();
  const navigate = useNavigate();
  
  const queryParams = new URLSearchParams(location.search);
  const activeCategory = queryParams.get('category') || 'all';
  const initialSearch = queryParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(activeCategory);

  useEffect(() => {
    setSelectedCategory(activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    setSearchQuery(initialSearch);
  }, [initialSearch]);

  const filteredResources = resources.filter(res => {
    const matchesCategory = selectedCategory === 'all' || res.categoryId === selectedCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.servicesOffered.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    navigate(`/directory?category=${catId}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`);
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    navigate(`/directory?category=${selectedCategory}${val ? `&search=${encodeURIComponent(val)}` : ''}`);
  };

  const categoryBulletPoints = {
    food: "Includes: Food banks, SNAP enrollment assistance, school meal programs, community pantries, meal delivery programs, faith-based food support.",
    health: "Includes: Free clinics, low-cost clinics, dental care, vision care, mental health services, women’s health services, children’s healthcare.",
    housing: "Includes: Rental assistance, eviction prevention, housing counseling, emergency shelters, affordable housing resources.",
    utilities: "Includes: Electricity assistance, water assistance, internet assistance, energy bill relief programs.",
    education: "Includes: School enrollment information, ESL classes, GED programs, adult education, tutoring programs, after-school programs.",
    legal: "Includes: Immigration legal aid, family law assistance, consumer protection, tenant rights help.",
    employment: "Includes: Workforce centers, job placement services, resume workshops, skills training programs.",
    transport: "Includes: Public transportation information, reduced fare programs, driver licensing resources.",
    english: "Includes: Adult English classes, conversational ESL groups, citizenship exam prep, and materials.",
    family: "Includes: Childcare assistance, parenting support programs, youth activities, family counseling."
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <PageHeader title={t.directoryTitle} subtitle={t.directoryDesc} />

      <div className="px-4 md:px-8 lg:px-16 max-w-[1600px] mx-auto pb-20 md:pb-32">

        {/* Mobile filter bar */}
        <MobileFilterBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">

          {/* Left Sidebar — desktop only */}
          <div className="hidden lg:flex lg:col-span-3 flex-col gap-6">
            <div className="liquid-glass border border-white/10 p-6 rounded-2xl">
              <h3 className="text-sm font-semibold tracking-wider text-gray-400 uppercase mb-4">Search Within Directory</h3>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search by keywords..."
                  className="w-full bg-black/60 border border-white/20 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
                />
                <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-3.5" />
              </div>
            </div>

            <div className="liquid-glass border border-white/10 p-6 rounded-2xl">
              <h3 className="text-sm font-semibold tracking-wider text-gray-400 uppercase mb-4">Filter By Category</h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleCategorySelect('all')}
                  className={`text-left text-xs px-3 py-2 rounded-lg transition-all flex items-center gap-2 ${selectedCategory === 'all' ? 'bg-white text-black font-medium' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  All Resources
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`text-left text-xs px-3 py-2 rounded-lg transition-all flex items-center gap-2 ${selectedCategory === cat.id ? 'bg-white text-black font-medium' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                  >
                    <Icon name={cat.icon} className="w-3.5 h-3.5" />
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* /desktop sidebar */}

          {/* Right Directory Listings Column */}

          <div className="lg:col-span-9 flex flex-col gap-6">

          {selectedCategory !== 'all' && categoryBulletPoints[selectedCategory] && (
            <div className="liquid-glass border border-white/20 p-6 rounded-2xl bg-white/5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-1.5 mb-2">
                <Activity className="w-4 h-4 text-white" />
                Category Checklist Scope
              </h4>
              <p className="text-sm text-gray-300 font-light leading-relaxed">{categoryBulletPoints[selectedCategory]}</p>
              <div className="flex gap-4 mt-4">
                <Link to="/guides" className="text-xs text-white underline hover:text-gray-300">
                  Read related plain-language Step-by-Step guides →
                </Link>
              </div>
            </div>
          )}

          {/* Listings count */}
          <div className="flex justify-between items-center text-xs text-gray-400 uppercase tracking-widest px-2">
            <span>Verified Local Results</span>
            <span>{filteredResources.length} items found</span>
          </div>

          {/* Directory List */}
          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {filteredResources.map(res => (
                <Scroll3D key={res.id}>
                  <div className="liquid-glass border border-white/10 p-8 rounded-2xl flex flex-col gap-6 relative group hover:border-white/20 transition-all">
                    
                    {/* Category Pill Tag */}
                    <div className="absolute top-6 right-6 text-3xs font-semibold tracking-widest uppercase border border-white/10 px-2 py-0.5 rounded text-gray-500">
                      {categories.find(c => c.id === res.categoryId)?.name || res.categoryId}
                    </div>

                    <div>
                      <h3 className="text-2xl font-normal text-white mb-2">{res.name}</h3>
                      <p className="text-sm text-gray-300 font-light leading-relaxed mb-4">{res.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 border-t border-white/5 pt-6 text-xs text-gray-400">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-gray-500" /> <span><strong className="text-white uppercase tracking-widest text-3xs">{t.hoursText}:</strong> {res.hours}</span></div>
                        <div className="flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-gray-500" /> <span><strong className="text-white uppercase tracking-widest text-3xs">{t.languagesText}:</strong> {res.languages.join(', ')}</span></div>
                        <div className="flex items-center gap-2"><DollarSign className="w-3.5 h-3.5 text-gray-500" /> <span><strong className="text-white uppercase tracking-widest text-3xs">{t.costText}:</strong> {res.cost}</span></div>
                        <div className="flex items-center gap-2"><Bus className="w-3.5 h-3.5 text-gray-500" /> <span><strong className="text-white uppercase tracking-widest text-3xs">{t.transportText}:</strong> {res.transit}</span></div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-gray-500" /> <span><strong className="text-white uppercase tracking-widest text-3xs">{t.eligibilityText}:</strong> {res.eligibility}</span></div>
                        <div className="flex items-center gap-2"><Info className="w-3.5 h-3.5 text-gray-500" /> <span><strong className="text-white uppercase tracking-widest text-3xs">{t.documentsText}:</strong> {res.documentsRequired}</span></div>
                        <div className="flex items-center gap-2"><User className="w-3.5 h-3.5 text-gray-500" /> <span><strong className="text-white uppercase tracking-widest text-3xs">{t.contactText}:</strong> {res.contactPerson}</span></div>
                        <div className="flex items-center gap-2"><Activity className="w-3.5 h-3.5 text-gray-500" /> <span><strong className="text-white uppercase tracking-widest text-3xs">Services:</strong> {res.servicesOffered}</span></div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 border-t border-white/5 pt-6 items-center justify-between">
                      <div className="text-3xs text-gray-600 uppercase tracking-widest">Verified by Key Club outreach • Last Checked April 2026</div>
                      <div className="flex gap-4">
                        {res.website && (
                          <a 
                            href={res.website} 
                            target="_blank" 
                            rel="noreferrer"
                            onClick={() => trackReferral(res.category)}
                            className="bg-white text-black text-xs px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center gap-1.5"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            Visit Website
                          </a>
                        )}
                        {res.phone && (
                          <a 
                            href={`tel:${res.phone}`}
                            onClick={() => trackReferral(res.category)}
                            className="border border-white/20 text-white text-xs px-4 py-2 rounded-lg hover:bg-white/5 transition-all flex items-center gap-1.5"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            Call {res.phone}
                          </a>
                        )}
                      </div>
                    </div>

                  </div>
                </Scroll3D>
              ))}
            </div>
          ) : (
            <div className="liquid-glass border border-white/10 p-12 rounded-2xl text-center text-gray-500">
              No matching verified local organizations found. Try expanding your search queries.
            </div>
          )}

          </div>{/* /right col */}
          </div>{/* /grid */}

      </div>{/* /outer container */}
    </motion.div>
  );
}

// STEP-BY-STEP GUIDES PAGE
function GuidesPage({ lang }) {
  const t = translations[lang] || translations.en;
  const [activeGuide, setActiveGuide] = useState(null);
  const [guideSearch, setGuideSearch] = useState('');

  const filteredGuides = stepByStepGuides.filter(g => 
    g.title.toLowerCase().includes(guideSearch.toLowerCase()) ||
    g.summary.toLowerCase().includes(guideSearch.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <PageHeader title={t.guidesTitle} subtitle={t.guidesDesc} />

      <div className="px-4 md:px-8 lg:px-16 max-w-[1600px] mx-auto pb-20 md:pb-32">
        
        {/* Search Input */}
        <div className="mb-10 max-w-md relative">
          <input
            type="text"
            placeholder="Search guides (e.g. SNAP, enroll, transport)..."
            value={guideSearch}
            onChange={(e) => setGuideSearch(e.target.value)}
            className="w-full bg-black/60 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
          />
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
        </div>

        {/* Guides layout — stacks on mobile, side-by-side on lg+ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Guides list */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {filteredGuides.map(guide => (
              <Scroll3D key={guide.id}>
                <button
                  onClick={() => setActiveGuide(guide.id === activeGuide ? null : guide.id)}
                  className={`w-full p-5 text-left border rounded-xl flex items-center justify-between transition-all ${activeGuide === guide.id ? 'bg-white text-black border-white' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}`}
                >
                  <div className="flex items-center gap-4">
                    <span className="p-2 bg-white/5 rounded-lg">
                      <Icon name={guide.icon} className={`w-6 h-6 ${activeGuide === guide.id ? 'text-black' : 'text-white'}`} />
                    </span>
                    <div>
                      <h4 className="font-medium text-sm">{guide.title}</h4>
                      <p className={`text-2xs font-light mt-1 ${activeGuide === guide.id ? 'text-black/80' : 'text-gray-400'}`}>{guide.summary.slice(0, 75)}...</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${activeGuide === guide.id ? 'rotate-90' : ''}`} />
                </button>
              </Scroll3D>
            ))}
          </div>

          {/* Active Guide detailed panel */}
          <div className="lg:col-span-7">
            {activeGuide ? (
              (() => {
                const guide = stepByStepGuides.find(g => g.id === activeGuide);
                return (
                  <div className="liquid-glass border border-white/20 p-8 rounded-2xl flex flex-col gap-6">
                    <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                      <Icon name={guide.icon} className="w-10 h-10 text-white stroke-[1.2]" />
                      <div>
                        <h3 className="text-2xl font-normal text-white">{guide.title}</h3>
                        <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{categories.find(c => c.id === guide.target)?.name || guide.target}</p>
                      </div>
                    </div>

                    <p className="text-sm text-gray-300 font-light leading-relaxed">{guide.summary}</p>

                    {/* Step-by-step numbers */}
                    <div className="flex flex-col gap-4">
                      {guide.steps.map(step => (
                        <div key={step.num} className="flex gap-4 items-start">
                          <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-xs font-semibold bg-white/5 text-white shrink-0 mt-0.5">
                            {step.num}
                          </div>
                          <div>
                            <h5 className="text-sm font-semibold text-white mb-1">{step.title}</h5>
                            <p className="text-xs text-gray-400 leading-relaxed font-light">{step.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/10 pt-6 text-xs font-light text-gray-400">
                      <div>
                        <strong className="text-white block uppercase tracking-widest text-3xs mb-2">Required Paperwork</strong>
                        <p className="leading-relaxed">{guide.documentsNeeded}</p>
                      </div>
                      <div>
                        <strong className="text-white block uppercase tracking-widest text-3xs mb-2">General Eligibility</strong>
                        <p className="leading-relaxed">{guide.eligibility}</p>
                      </div>
                    </div>

                    {guide.safetyNote && (
                      <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-xs text-red-200 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <strong>Safety Advisory:</strong> {guide.safetyNote}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()
            ) : (
              <div className="liquid-glass border border-white/10 p-12 rounded-2xl text-center text-gray-500 h-full flex flex-col justify-center items-center">
                <Info className="w-10 h-10 text-gray-500 mb-4" />
                <p>Select a plain-language guide from the list to view step-by-step instructions, documentation requirements, and safety policies.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </motion.div>
  );
}

// COMMUNITY PARTNERS PAGE
function PartnersPage({ lang }) {
  const t = translations[lang] || translations.en;
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <PageHeader title={t.partnersTitle} subtitle={t.partnersDesc} />

      <div className="px-6 md:px-12 lg:px-16 max-w-[1600px] mx-auto pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {communityPartners.map((partner, idx) => (
            <Scroll3D key={idx}>
              <div className="liquid-glass border border-white/10 p-6 rounded-2xl flex flex-col justify-between hover:border-white/20 transition-all h-full">
                <div>
                  <span className="text-3xs font-semibold tracking-widest uppercase border border-white/10 px-2 py-0.5 rounded text-gray-500 inline-block mb-4">
                    {partner.type}
                  </span>
                  <h3 className="text-lg font-medium text-white mb-2">{partner.name}</h3>
                  <p className="text-xs text-gray-400 font-light leading-relaxed">{partner.services}</p>
                </div>
                <div className="mt-8 pt-4 border-t border-white/5 text-3xs text-gray-600 uppercase tracking-widest">
                  Resource Kit Distribution Partner
                </div>
              </div>
            </Scroll3D>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// VOLUNTEER PAGE
function VolunteerPage({ lang }) {
  const t = translations[lang] || translations.en;
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    year: '2027',
    school: 'Fulshear High School',
    interests: []
  });

  const handleInterestChange = (interest) => {
    setFormData(prev => {
      const current = prev.interests.includes(interest) 
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests: current };
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
    }, 800);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <PageHeader title={t.volunteerTitle} subtitle={t.volunteerDesc} />

      <div className="px-6 md:px-12 lg:px-16 max-w-[1600px] mx-auto pb-32 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Volunteer Form */}
        <div className="lg:col-span-7">
          <div className="liquid-glass border border-white/10 p-8 rounded-2xl">
            <h3 className="text-xl font-normal text-white mb-6">Key Club Member Sign-Up</h3>
            
            {success ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-xl text-center">
                <Check className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-white mt-2">Registration Submitted!</h4>
                <p className="text-xs text-gray-400 mt-1">Thank you for volunteering. We will connect you to outreach coordinators soon.</p>
                <button 
                  onClick={() => { setSuccess(false); setFormData({name:'', email:'', year:'2027', school:'Fulshear High School', interests:[]}); }} 
                  className="mt-4 text-xs text-white underline hover:text-gray-300"
                >
                  Submit another entry
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-3xs uppercase tracking-widest text-gray-400 block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full bg-black/60 border border-white/20 rounded-lg px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-3xs uppercase tracking-widest text-gray-400 block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="sjenkins@school.org"
                      className="w-full bg-black/60 border border-white/20 rounded-lg px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-3xs uppercase tracking-widest text-gray-400 block mb-1">Graduation Year</label>
                    <select
                      value={formData.year}
                      onChange={(e) => setFormData({...formData, year: e.target.value})}
                      className="w-full bg-black/60 border border-white/20 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white transition-colors"
                    >
                      <option value="2026">2026 (Senior)</option>
                      <option value="2027">2027 (Junior)</option>
                      <option value="2028">2028 (Sophomore)</option>
                      <option value="2029">2029 (Freshman)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-3xs uppercase tracking-widest text-gray-400 block mb-1">School</label>
                    <input
                      type="text"
                      value={formData.school}
                      onChange={(e) => setFormData({...formData, school: e.target.value})}
                      className="w-full bg-black/60 border border-white/20 rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-3xs uppercase tracking-widest text-gray-400 block mb-3">Volunteer Interests</label>
                  <div className="flex flex-col gap-2">
                    {[
                      { id: 'translate', label: 'Translation Opportunities (Spanish, Arabic, Vietnamese, Mandarin, Urdu, Hindi)' },
                      { id: 'distribute', label: 'Distribution Events (Placing kits at library & clinics)' },
                      { id: 'outreach', label: 'Community Outreach & Partner Coordination' },
                      { id: 'tech', label: 'Tech updates & portal resource maintenance' }
                    ].map(item => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleInterestChange(item.id)}
                        className={`text-left text-xs px-4 py-3 rounded-lg border transition-all flex items-center justify-between ${formData.interests.includes(item.id) ? 'bg-white text-black border-white font-medium' : 'border-white/10 text-gray-400 hover:border-white/20 hover:bg-white/5'}`}
                      >
                        <span>{item.label}</span>
                        <span>{formData.interests.includes(item.id) ? '✓' : '+'}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-white text-black px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors w-full mt-4"
                >
                  {submitting ? 'Registering...' : 'Register as Volunteer'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Opportunity descriptions */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {[
            { title: "Translation Opportunities", text: "Are you fluent in Spanish, Arabic, Vietnamese, Mandarin, Urdu, or Hindi? Help us translate resource descriptions, emergency guides, and update database fields to better serve local non-English speakers." },
            { title: "Distribution Events", text: "We regularly print plain-language resource cards and distribute physical kits directly to schools, county library branches, and community health centers. Sign up to help pack and place kits." },
            { title: "Community Outreach", text: "Coordinate with local organizations to check that their hours, phone numbers, and eligibility rules remain accurate. You will act as the direct liaison between providers and our Key Club tech division." }
          ].map((op, idx) => (
            <Scroll3D key={idx}>
              <div className="liquid-glass border border-white/10 p-6 rounded-2xl">
                <h4 className="text-sm font-semibold text-white flex items-center gap-1.5 mb-2">
                  <Activity className="w-4 h-4 text-white" />
                  {op.title}
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed font-light">{op.text}</p>
              </div>
            </Scroll3D>
          ))}
        </div>

      </div>
    </motion.div>
  );
}

// COMMUNITY FEEDBACK PAGE (WITH DATA TRACKING DISPLAY)
function FeedbackPage({ lang, tracker, setTracker }) {
  const t = translations[lang] || translations.en;
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedbackType, setFeedbackType] = useState('outdated');
  const [inputs, setInputs] = useState({
    message: '',
    email: '',
    resourceName: ''
  });

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!inputs.message) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTracker(prev => ({
        ...prev,
        conversations: prev.conversations + 1
      }));
    }, 800);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <PageHeader title={t.feedbackTitle} subtitle={t.feedbackDesc} />

      <div className="px-6 md:px-12 lg:px-16 max-w-[1600px] mx-auto pb-32 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Feedback Forms */}
        <div className="lg:col-span-7">
          <div className="liquid-glass border border-white/10 p-8 rounded-2xl">
            <h3 className="text-xl font-normal text-white mb-6">Submit Feedback Form</h3>
            
            {/* Feedback category switches */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { id: 'outdated', label: 'Report Outdated Info' },
                { id: 'suggest', label: 'Suggest New Resource' },
                { id: 'translation', label: 'Request Translations' },
                { id: 'story', label: 'Share Success Story' },
                { id: 'question', label: 'Submit General Question' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFeedbackType(opt.id)}
                  className={`text-2xs uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-colors ${feedbackType === opt.id ? 'border-white bg-white text-black' : 'border-white/10 text-gray-400 hover:border-white/30'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {success ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-xl text-center">
                <Check className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-white mt-2">Feedback Received</h4>
                <p className="text-xs text-gray-400 mt-1">Thank you. The Key Club review committee will verify the details within 48 hours.</p>
                <button 
                  onClick={() => { setSuccess(false); setInputs({message:'', email:'', resourceName:''}); }} 
                  className="mt-4 text-xs text-white underline hover:text-gray-300"
                >
                  Submit new form
                </button>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="flex flex-col gap-4">
                {feedbackType === 'outdated' && (
                  <div>
                    <label className="text-3xs uppercase tracking-widest text-gray-400 block mb-1">Organization Name</label>
                    <input
                      type="text"
                      required
                      value={inputs.resourceName}
                      onChange={(e) => setInputs({...inputs, resourceName: e.target.value})}
                      placeholder="e.g. Katy Clinic or Food Bank Site..."
                      className="w-full bg-black/60 border border-white/20 rounded-lg px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                )}
                
                <div>
                  <label className="text-3xs uppercase tracking-widest text-gray-400 block mb-1">
                    {feedbackType === 'outdated' && 'Describe what is outdated (hours, address, phone...)'}
                    {feedbackType === 'suggest' && 'Details of the recommended organization (name, eligibility, services...)'}
                    {feedbackType === 'translation' && 'Which language or resource needs translating?'}
                    {feedbackType === 'story' && 'Share how this portal or physical kits helped you or your family'}
                    {feedbackType === 'question' && 'Your question or inquiry'}
                  </label>
                  <textarea
                    required
                    rows="4"
                    value={inputs.message}
                    onChange={(e) => setInputs({...inputs, message: e.target.value})}
                    placeholder="Provide details here..."
                    className="w-full bg-black/60 border border-white/20 rounded-lg px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors"
                  ></textarea>
                </div>

                <div>
                  <label className="text-3xs uppercase tracking-widest text-gray-400 block mb-1">Your Email (Optional)</label>
                  <input
                    type="email"
                    value={inputs.email}
                    onChange={(e) => setInputs({...inputs, email: e.target.value})}
                    placeholder="name@example.com"
                    className="w-full bg-black/60 border border-white/20 rounded-lg px-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-white text-black px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors w-full mt-4"
                >
                  {loading ? 'Sending...' : 'Submit Entry'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Live Admin Data Tracker Display (Real-time tracking of portal stats) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Scroll3D>
            <div className="liquid-glass border border-white/20 p-8 rounded-2xl h-full">
              <h3 className="text-lg font-normal text-white mb-4">📈 System Operations Tracker</h3>
              <p className="text-xs text-gray-400 font-light leading-relaxed mb-6">
                Our backend tracks search query topics and translation selections to dynamically prioritize which physical guides we print and translate next.
              </p>
              
              <div className="flex flex-col gap-4 text-xs">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Total Portal Consultations</span>
                  <span className="text-white font-mono">{tracker.conversations}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Database Outward Referrals</span>
                  <span className="text-white font-mono">{tracker.referrals}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">Total Live Clicks</span>
                  <span className="text-white font-mono">{tracker.clicks}</span>
                </div>

                <div className="mt-4">
                  <span className="text-3xs uppercase tracking-widest text-gray-500 block mb-2">Most Consulted Categories</span>
                  {Object.entries(tracker.searches).slice(0, 3).map(([key, val]) => (
                    <div key={key} className="flex justify-between py-1 font-mono">
                      <span className="text-gray-400 font-sans">{key}</span>
                      <span className="text-white">{val} searches</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <span className="text-3xs uppercase tracking-widest text-gray-500 block mb-2">Top Client Languages Used</span>
                  {Object.entries(tracker.languages).map(([key, val]) => (
                    <div key={key} className="flex justify-between py-1 font-mono">
                      <span className="text-gray-400 font-sans">{key}</span>
                      <span className="text-white">{val} requests</span>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </Scroll3D>
        </div>

      </div>
    </motion.div>
  );
}

// ABOUT PAGE
function AboutPage({ lang }) {
  const t = translations[lang] || translations.en;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <PageHeader title={t.aboutTitle} subtitle={t.aboutDesc} />

      <div className="px-6 md:px-12 lg:px-16 max-w-[1600px] mx-auto pb-32">
        
        {/* Mission grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <Scroll3D>
              <div className="liquid-glass border border-white/10 p-8 rounded-2xl mb-6">
                <h3 className="text-2xl font-normal text-white mb-4">Why VEX Civic Was Created</h3>
                <p className="text-sm text-gray-400 leading-relaxed font-light mb-4">
                  Government documents are often technical, written in dense jargon, and rarely translated into the languages spoken by immigrant households. This information bottleneck leaves thousands eligible for local food, medicine, and utilities assistance, but unable to access them due to fear or confusion.
                </p>
                <p className="text-sm text-gray-400 leading-relaxed font-light">
                  Developed in coordination with the Fulshear Key Club, VEX Civic translates government databases into plain-language step-by-step guides, ensuring zero barriers to essential resources.
                </p>
              </div>
            </Scroll3D>
            
            <Scroll3D>
              <div className="liquid-glass border border-white/10 p-8 rounded-2xl">
                <h3 className="text-2xl font-normal text-white mb-4">Fulshear Key Club Network</h3>
                <p className="text-sm text-gray-400 leading-relaxed font-light mb-4">
                  The leadership structure comprises student volunteers who conduct regular field inspections of local charities and food banks. They print physical resource cards and host multilingual clinics in county libraries.
                </p>
                <ul className="list-disc list-inside text-sm text-gray-400 font-light flex flex-col gap-2">
                  <li>Annual Impact Reviews published every May.</li>
                  <li>DOJ-accredited partner lawyer supervision.</li>
                  <li>Direct community outreach network covering 45 local institutions.</li>
                </ul>
              </div>
            </Scroll3D>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">Verified Research Base</h3>
            
            {[
              { title: "Pew Research", year: "2025", text: "14 Million undocumented residents live in the US. 8.4 million reside in mixed-status households. Fear of public charge rules causes citizens in these households to avoid food and health services they qualify for." },
              { title: "Urban Institute Survey", year: "2023", text: "1 in 4 adults in mixed-status families avoided safety-net programs like SNAP or Medicaid solely because of confusion regarding rules, leading to elevated health challenges." },
              { title: "Migration Policy Institute", year: "2023", text: "27.7 Million US residents experience limited English proficiency. Without targeted multilingual access portals, they face immediate exclusion from local services." }
            ].map((res, idx) => (
              <Scroll3D key={idx}>
                <div className="liquid-glass border border-white/10 p-6 rounded-xl text-xs h-full">
                  <div className="flex justify-between items-center mb-2">
                    <strong className="text-white font-medium text-sm">{res.title}</strong>
                    <span className="text-gray-500">{res.year}</span>
                  </div>
                  <p className="text-gray-400 leading-relaxed font-light">{res.text}</p>
                </div>
              </Scroll3D>
            ))}

          </div>
        </div>

      </div>
    </motion.div>
  );
}

// EMERGENCY HELP PAGE
function EmergencyPage({ lang }) {
  const t = translations[lang] || translations.en;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <PageHeader title={t.emergencyHelpTitle} subtitle={t.emergencyHelpDesc} />

      <div className="px-6 md:px-12 lg:px-16 max-w-[1600px] mx-auto pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {emergencyResources.map((er, idx) => (
            <Scroll3D key={idx}>
              <div className="border border-red-500/30 bg-red-950/15 p-8 rounded-2xl flex flex-col justify-between hover:border-red-500/50 transition-all h-full">
                <div>
                  <span className="text-3xs font-semibold tracking-widest uppercase border border-red-500/30 px-2 py-0.5 rounded text-red-400 inline-block mb-4 flex items-center gap-1 w-fit">
                    <AlertTriangle className="w-3 h-3" />
                    {er.category}
                  </span>
                  <h3 className="text-xl font-normal text-white mb-2">{er.name}</h3>
                  <p className="text-xs text-gray-400 font-light leading-relaxed mb-6">{er.details}</p>
                  {er.address && <p className="text-3xs text-gray-500 font-mono mb-6">📍 {er.address}</p>}
                </div>

                <div className="flex gap-4">
                  <a 
                    href={`tel:${er.phone.split(' ')[0]}`}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg text-center w-full transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call Hotline ({er.phone.split(' ')[0]})
                  </a>
                </div>
              </div>
            </Scroll3D>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// FOOTER
function Footer({ lang }) {
  const t = translations[lang] || translations.en;
  
  return (
    <footer className="py-12 px-6 md:px-12 lg:px-16 border-t border-white/10 mt-auto w-full bg-black">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <span className="font-semibold tracking-tight text-xl text-white">VEX CIVIC</span>
          <p className="text-xs text-gray-500 mt-1">Fulshear Key Club Student Collaboration Network.</p>
        </div>
        
        <div className="flex flex-wrap gap-x-8 gap-y-4 text-xs text-gray-400">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/directory" className="hover:text-white transition-colors">{t.directoryTitle}</Link>
          <Link to="/guides" className="hover:text-white transition-colors">{t.guidesTitle}</Link>
          <Link to="/partners" className="hover:text-white transition-colors">{t.partnersTitle}</Link>
          <Link to="/volunteer" className="hover:text-white transition-colors">Volunteer</Link>
          <Link to="/feedback" className="hover:text-white transition-colors">Feedback</Link>
          <Link to="/about" className="hover:text-white transition-colors">About Project</Link>
        </div>
      </div>
    </footer>
  );
}

// INTERACTIVE CHATBOT WITH METRICS DATA TRACKING
function Chatbot({ lang, tracker, setTracker }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Welcome to VEX Civic Help Chat.\nChoose a question below, or type your needs directly.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const chatbotQuestions = [
    { label: "I need food", query: "I need food" },
    { label: "I need housing help", query: "I need housing help" },
    { label: "I need a doctor", query: "I need a doctor" },
    { label: "I need legal aid", query: "I need legal aid" },
    { label: "How to enroll in school?", query: "How do I enroll my child in school?" },
    { label: "Utility assistance?", query: "How do I get utility assistance?" },
    { label: "Where to learn English?", query: "Where can I learn English?" },
    { label: "What documents do I need?", query: "What documents do I need?" }
  ];

  const processChatQuery = (queryText) => {
    setTracker(prev => ({
      ...prev,
      conversations: prev.conversations + 1
    }));

    const lowerQuery = queryText.toLowerCase();
    let matchedAnswer = chatbotAnswers.find(ans => 
      ans.keywords.some(kw => lowerQuery.includes(kw))
    );

    let replyText = matchedAnswer 
      ? matchedAnswer.reply 
      : "I couldn't find a direct match. Try selecting one of the standard questions above or search in the Resource Directory page.";

    const topic = matchedAnswer ? matchedAnswer.topic : "Unknown Topic";

    if (matchedAnswer) {
      setTracker(prev => ({
        ...prev,
        searches: {
          ...prev.searches,
          [topic]: (prev.searches[topic] || 0) + 1
        }
      }));
    }

    setMessages(prev => [
      ...prev,
      { type: 'user', text: queryText },
      { type: 'bot', text: replyText }
    ]);
  };

  const handleSendSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    processChatQuery(inputValue.trim());
    setInputValue('');
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 flex flex-col items-end">
       <AnimatePresence>
         {isOpen && (
           <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: 10 }}
             transition={{ duration: 0.2 }}
             className="bg-black/95 border border-white/20 mb-4 shadow-2xl flex flex-col rounded-2xl overflow-hidden backdrop-blur-xl"
             style={{
               width: 'min(360px, calc(100vw - 2rem))',
               height: 'min(520px, calc(100dvh - 120px))'
             }}
           >
             {/* Header */}
             <div className="bg-white/5 p-5 flex justify-between items-center border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                  <div>
                    <p className="font-semibold text-xs uppercase tracking-widest text-white">VEX Civic Assistant</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Key Club Outreach</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white text-xs">✕</button>
             </div>
             
             {/* Messages Area */}
             <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3.5 text-xs whitespace-pre-wrap leading-relaxed rounded-xl border ${m.type === 'user' ? 'bg-white border-white text-black font-medium' : 'bg-white/5 border-white/10 text-gray-200'}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
                
                <div ref={chatBottomRef} />
             </div>
             
             {/* Quick Questions Grid */}
             <div className="p-4 bg-white/5 border-t border-white/10 grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
               {chatbotQuestions.map((q, idx) => (
                 <button
                   key={idx}
                   onClick={() => processChatQuery(q.query)}
                   className="text-left text-[10px] bg-white/5 hover:bg-white hover:text-black border border-white/10 text-gray-300 p-2 rounded-lg transition-all truncate flex items-center gap-1"
                 >
                   <MessageSquare className="w-3 h-3" />
                   {q.label}
                 </button>
               ))}
             </div>

             {/* Stdin Input Area */}
             <form onSubmit={handleSendSubmit} className="p-4 border-t border-white/10 flex gap-2 bg-black">
               <input
                 type="text"
                 placeholder="Type your question..."
                 value={inputValue}
                 onChange={(e) => setInputValue(e.target.value)}
                 className="w-full bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
               />
               <button 
                 type="submit" 
                 className="bg-white text-black px-4 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center"
               >
                 <Send className="w-3 h-3" />
               </button>
             </form>
             
             {/* Footer Privacy Note */}
             <div className="px-4 py-2 bg-white/5 text-[9px] text-gray-600 uppercase tracking-widest text-center border-t border-white/5">
               <strong>Safety note:</strong> Ems stabilize ERs without status checks. Do not submit SSNs.
             </div>
           </motion.div>
         )}
       </AnimatePresence>

       {/* Floating Toggle Button */}
       <button 
         id="chat-toggle-btn"
         onClick={() => setIsOpen(!isOpen)} 
         className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-2xl hover:bg-gray-200 transition-all border border-white/20 group"
       >
         {isOpen ? (
           <span className="text-lg font-bold">✕</span>
         ) : (
           <MessageSquare className="w-5 h-5 text-black" />
         )}
       </button>
    </div>
  );
}
