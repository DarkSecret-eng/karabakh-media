'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share2,
  MessageCircle,
  Send,
  MapPin,
  Phone,
  Search,
  Plus,
  X,
  Mail,
  Lock,
  User,
} from 'lucide-react';

// Staggered text reveal component
const RevealText = ({ children, className = '' }: { children: string; className?: string }) => {
  const words = children.split(' ');
  const container = {
    hidden: { opacity: 0 },
    visible: (custom: number) => ({
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: custom * 0.1,
      },
    }),
  };

  const child = {
    hidden: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 200,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={0}
    >
      {words.map((word, idx) => (
        <motion.span key={idx} variants={child} className="inline-block mr-3">
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

// Magnetic Button Component
const MagneticButton = ({ 
  children, 
  className = '', 
  onClick,
  as = 'button',
  href,
  target,
  rel,
}: { 
  children: React.ReactNode; 
  className?: string;
  onClick?: () => void;
  as?: 'button' | 'a';
  href?: string;
  target?: string;
  rel?: string;
}) => {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    
    const button = ref.current.getBoundingClientRect();
    const centerX = button.left + button.width / 2;
    const centerY = button.top + button.height / 2;
    
    const distX = (e.clientX - centerX) * 0.2;
    const distY = (e.clientY - centerY) * 0.2;
    
    setPosition({ x: distX, y: distY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const commonProps = {
    ref: ref as any,
    className: `relative transition-all duration-300 ${className}`,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  };

  const content = (
    <>
      <motion.span
        animate={{ x: position.x, y: position.y }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="block"
      >
        {children}
      </motion.span>
      <motion.div
        animate={{ 
          boxShadow: `0 0 30px rgba(168, 85, 247, ${Math.abs(position.x) * 0.02})`,
        }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 rounded-lg pointer-events-none"
      />
    </>
  );

  if (as === 'a') {
    return (
      <motion.a
        {...commonProps}
        href={href}
        target={target}
        rel={rel}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      {...commonProps}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {content}
    </motion.button>
  );
};

// Epic Hero Heading Component with Awwwards-level animations
const EpicHeroHeading = ({ text }: { text: string }) => {
  const words = text.split(' ');
  
  const wordVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
        delay: i * 0.12,
      },
    }),
  };

  return (
    <div className="relative">
      {/* Main text with gradient animation and shine effect */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative text-6xl md:text-8xl font-black tracking-tight leading-none mb-8"
      >
        {/* Animated liquid gradient background */}
        <div
          className="bg-gradient-to-r from-purple-400 via-pink-500 to-amber-300 bg-clip-text text-transparent"
          style={{
            backgroundSize: '200% auto',
            animation: 'gradient-x 6s ease infinite',
          } as React.CSSProperties}
        >
          {/* Breathing glow layer behind text */}
          <motion.div
            className="absolute -inset-4 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-400 rounded-lg blur-3xl opacity-40 -z-10"
            animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Main text with staggered word reveal */}
          <div className="flex flex-wrap justify-center gap-3">
            {words.map((word, idx) => (
              <motion.span
                key={idx}
                variants={wordVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={idx}
                className="inline-block overflow-hidden"
              >
                {word}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Shine sweep overlay effect */}
        <motion.div
          className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
          style={{
            pointerEvents: 'none',
            animation: 'shine-sweep 4s ease-in-out infinite',
            mixBlendMode: 'overlay',
          } as React.CSSProperties}
        />
      </motion.div>
    </div>
  );
};

// Premium Auth Modal Component
const AuthModal = ({
  isOpen,
  onClose,
  authMode,
  setAuthMode,
}: {
  isOpen: boolean;
  onClose: () => void;
  authMode: 'login' | 'register';
  setAuthMode: (mode: 'login' | 'register') => void;
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[v0] Auth submitted:', { authMode, ...formData });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[101] flex items-center justify-center px-4"
          >
            <motion.div
              className="relative w-full max-w-md bg-[#0A040F] border border-purple-500/30 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.15)] overflow-hidden"
              layoutId="auth-modal"
            >
              {/* Close Button */}
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                className="absolute top-6 right-6 z-10 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-white/60 hover:text-white"
              >
                <X size={20} />
              </motion.button>

              {/* Modal Content */}
              <div className="p-8 pt-12">
                {/* Header */}
                <motion.div
                  key={authMode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-8"
                >
                  <h2 className="text-3xl font-black mb-2 bg-gradient-to-r from-[#A855F7] to-[#D4AF37] bg-clip-text text-transparent">
                    {authMode === 'login' ? 'Giriş' : 'Qeydiyyat'}
                  </h2>
                  <p className="text-white/60 text-sm">
                    {authMode === 'login'
                      ? 'Hesabınıza daxil olun'
                      : 'Yeni hesab yaradın'}
                  </p>
                </motion.div>

                {/* Form */}
                <motion.form
                  key={authMode}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  {/* Full Name - Register Only */}
                  {authMode === 'register' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label className="block text-sm font-semibold text-white/80 mb-2">
                        Ad və Soyad
                      </label>
                      <div className="relative">
                        <User
                          size={18}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40"
                        />
                        <input
                          type="text"
                          name="fullName"
                          placeholder="Adınız"
                          value={formData.fullName}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 focus:border-[#A855F7]/50 focus:ring-2 focus:ring-[#A855F7]/30 focus:outline-none text-white placeholder-white/30 rounded-xl transition-all"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-white/80 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40"
                      />
                      <input
                        type="email"
                        name="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 focus:border-[#A855F7]/50 focus:ring-2 focus:ring-[#A855F7]/30 focus:outline-none text-white placeholder-white/30 rounded-xl transition-all"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-semibold text-white/80 mb-2">
                      Şifrə
                    </label>
                    <div className="relative">
                      <Lock
                        size={18}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40"
                      />
                      <input
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 focus:border-[#A855F7]/50 focus:ring-2 focus:ring-[#A855F7]/30 focus:outline-none text-white placeholder-white/30 rounded-xl transition-all"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#4F46E5] font-bold text-white mt-6 hover:shadow-lg hover:shadow-[#A855F7]/50 transition-all"
                  >
                    {authMode === 'login' ? 'Daxil Ol' : 'Qeydiyyatdan Keç'}
                  </motion.button>

                  {/* Divider */}
                  <div className="flex items-center gap-3 my-6">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <span className="text-white/40 text-xs font-semibold">VƏ YA</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  </div>

                  {/* Google Sign In Button */}
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 font-semibold text-white transition-all"
                  >
                    Google ilə daxil ol
                  </motion.button>
                </motion.form>

                {/* Toggle Auth Mode */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="mt-6 text-center text-sm text-white/60"
                >
                  {authMode === 'login' ? (
                    <>
                      Hesabınız yoxdur?{' '}
                      <motion.button
                        onClick={() => setAuthMode('register')}
                        whileHover={{ color: '#D4AF37' }}
                        className="text-[#A855F7] hover:text-[#D4AF37] font-semibold transition-colors"
                      >
                        Qeydiyyatdan keçin
                      </motion.button>
                    </>
                  ) : (
                    <>
                      Artıq hesabınız var?{' '}
                      <motion.button
                        onClick={() => setAuthMode('login')}
                        whileHover={{ color: '#D4AF37' }}
                        className="text-[#A855F7] hover:text-[#D4AF37] font-semibold transition-colors"
                      >
                        Daxil olun
                      </motion.button>
                    </>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Social icons configuration
const socialLinks = [
  {
    icon: Share2,
    href: 'https://instagram.com',
    label: 'Instagram',
  },
  {
    icon: MessageCircle,
    href: 'https://tiktok.com/@karabakh.media',
    label: 'TikTok',
  },
  {
    icon: Send,
    href: 'https://t.me/karabakh_media',
    label: 'Telegram',
  },
];

// Mock marketplace data
const marketplaceItems = [
  {
    id: 1,
    title: 'Modern Apartment in Xankəndi Center',
    category: 'Kirayə Ev',
    price: '500 AZN',
    location: 'Xankəndi',
    image: 'bg-gradient-to-br from-blue-500 to-blue-700',
  },
  {
    id: 2,
    title: 'Senior Developer Position',
    category: 'İş Elanları',
    price: 'Competitive Salary',
    location: 'Xankəndi',
    image: 'bg-gradient-to-br from-purple-500 to-purple-700',
  },
  {
    id: 3,
    title: 'iPhone 15 Pro - Like New',
    category: 'Texnika',
    price: '1200 AZN',
    location: 'Xankəndi',
    image: 'bg-gradient-to-br from-green-500 to-green-700',
  },
  {
    id: 4,
    title: 'Web Design Services',
    category: 'Xidmətlər',
    price: 'From 300 AZN',
    location: 'Xankəndi',
    image: 'bg-gradient-to-br from-pink-500 to-pink-700',
  },
  {
    id: 5,
    title: 'Studio Apartment Rental',
    category: 'Kirayə Ev',
    price: '350 AZN',
    location: 'Xankəndi',
    image: 'bg-gradient-to-br from-orange-500 to-orange-700',
  },
  {
    id: 6,
    title: 'Graphic Design Freelance',
    category: 'Xidmətlər',
    price: 'Hourly Rates',
    location: 'Xankəndi',
    image: 'bg-gradient-to-br from-cyan-500 to-cyan-700',
  },
];

const categories = [
  'Hamısı',
  'Kirayə Ev',
  'İş Elanları',
  'Texnika',
  'Xidmətlər',
];

export default function KarabakhMedia() {
  const [activePage, setActivePage] = useState<'home' | 'marketplace'>(
    'home'
  );
  const [selectedCategory, setSelectedCategory] = useState('Hamısı');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0410] via-[#16092B] to-[#0A0014] text-white overflow-hidden">
      {/* GLOBAL NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-white/5 backdrop-blur-2xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold tracking-widest"
          >
            <span className="bg-gradient-to-r from-[#A855F7] to-[#D4AF37] bg-clip-text text-transparent hover:drop-shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all">
              KARABAKH MEDIA
            </span>
          </motion.div>

          {/* Center Nav */}
          <div className="flex gap-8 items-center">
            <motion.button
              onClick={() => setActivePage('home')}
              className={`text-sm font-semibold transition-all pb-2 ${
                activePage === 'home'
                  ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]'
                  : 'text-white/70 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
            >
              Ana Səhifə
            </motion.button>
            <motion.button
              onClick={() => setActivePage('marketplace')}
              className={`text-sm font-semibold transition-all pb-2 ${
                activePage === 'marketplace'
                  ? 'border-b-2 border-[#D4AF37] text-[#D4AF37]'
                  : 'text-white/70 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
            >
              Alqı-Satqı
            </motion.button>
          </div>

          {/* Right Social Icons */}
          <div className="flex gap-4 items-center">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, color: '#A855F7' }}
                className="text-white/70 hover:text-[#A855F7] transition-colors"
              >
                <social.icon size={20} />
              </motion.a>
            ))}
            <motion.button
              onClick={() => {
                setIsAuthOpen(true);
                setAuthMode('login');
              }}
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 rounded-lg bg-white/5 border border-[#D4AF37]/40 hover:border-[#D4AF37]/80 text-[#D4AF37] font-semibold text-sm transition-all"
            >
              Giriş
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="ml-4 px-4 py-2 rounded-lg bg-gradient-to-r from-[#A855F7] to-[#D4AF37] text-black font-semibold text-sm hover:shadow-lg hover:shadow-[#A855F7]/50 transition-all"
            >
              + İcmaya Qoşul
            </motion.button>
          </div>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <AnimatePresence mode="wait">
        {activePage === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="pt-20"
          >
            {/* HERO SECTION */}
            <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
              {/* Volumetric Lighting - Mesh Gradients */}
              <motion.div
                className="absolute -top-40 -left-40 w-96 h-96 bg-[#A855F7] rounded-full blur-[150px] opacity-20"
                animate={{
                  y: [0, 50, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.div
                className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#D4AF37] rounded-full blur-[150px] opacity-15"
                animate={{
                  y: [0, -50, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.div
                className="absolute top-1/2 -right-20 w-80 h-80 bg-[#4F46E5] rounded-full blur-[120px] opacity-10"
                animate={{
                  x: [0, 30, 0],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-br from-[#A855F7]/5 via-transparent to-[#4F46E5]/5" />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center z-10 px-6"
              >
                <EpicHeroHeading text="QARABAĞIN RƏQƏMSAL SƏSİ" />

                <motion.p
                  className="text-lg text-white/70 mb-12 max-w-2xl mx-auto"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Xankəndinin tələbə icmasının rəqəmsal platforması. Biznəs,
                  təhsil və cəmiyyəti bir araya gətiririk.
                </motion.p>

                <motion.div
                  className="flex gap-6 justify-center flex-wrap"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <MagneticButton
                    onClick={() => setActivePage('marketplace')}
                    className="px-8 py-4 rounded-lg bg-gradient-to-r from-[#A855F7] to-[#4F46E5] font-bold text-white"
                  >
                    Elanları İzlə
                  </MagneticButton>
                  <MagneticButton
                    as="a"
                    href="https://t.me/karabakh_media"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 rounded-lg border-2 border-[#D4AF37] text-[#D4AF37] font-bold hover:bg-[#D4AF37]/10"
                  >
                    Telegram İcması
                  </MagneticButton>
                </motion.div>
              </motion.div>
            </section>

            {/* INFINITE TEXT MARQUEE - BRUTALIST STYLE */}
            <section className="overflow-hidden bg-gradient-to-r from-purple-900/20 via-transparent to-purple-900/20 border-y border-purple-500/20 py-12">
              <motion.div
                initial={{ x: 0 }}
                animate={{ x: -2000 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                className="flex gap-12 whitespace-nowrap"
              >
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="text-4xl md:text-6xl font-black tracking-widest"
                    style={{
                      WebkitTextStroke: '1px rgba(212, 175, 55, 0.6)',
                      color: 'transparent',
                      fontWeight: 900,
                    } as React.CSSProperties}
                  >
                    KARABAKH MEDIA ✦ XANKƏNDİ ✦ INNOVATION ✦ DIGITAL FUTURE
                  </div>
                ))}
              </motion.div>
            </section>

            {/* HAQQIMIZDA SECTION */}
            <section className="py-32 px-6">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Left Column - Text */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <motion.div className="inline-block mb-6 px-4 py-2 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50">
                    <span className="text-[#D4AF37] font-bold text-sm">
                      Biz Kimik?
                    </span>
                  </motion.div>

                  <h2 className="text-5xl font-black mb-8 leading-tight">
                    <span className="bg-gradient-to-r from-[#A855F7] to-[#D4AF37] bg-clip-text text-transparent">
                      Gələcəyi Xankəndidən
                    </span>
                    <br />
                    Qururuq.
                  </h2>

                  <div className="space-y-6 text-white/70 leading-relaxed">
                    <p>
                      Karabakh Media sadəcə bir platforma deyil, Qarabağ
                      Universitetinin tələbələri və yerli sakinlər üçün
                      yaradılmış rəqəmsal ekosistemdir. Biz təhsili, biznəsi
                      və cəmiyyəti bir araya gətiririk.
                    </p>
                    <p>
                      İcma dəyərlərinə əsaslanan layihələrimizlə Xankəndidə
                      rəqəmsal transformasiyanın mərkəzində dayanırıq.
                    </p>
                  </div>
                </motion.div>

                {/* Right Column - Stats Grid */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="grid grid-cols-2 gap-6"
                >
                  {[
                    { label: '7/24 Aktivlik', value: '∞' },
                    { label: 'Minlərlə Tələbə', value: '5K+' },
                    { label: 'Günlük Yeniliklər', value: '100+' },
                    { label: '100% Güvən', value: '✓' },
                  ].map((stat, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.05, y: -8 }}
                      className="relative p-[1px] rounded-2xl bg-gradient-to-br from-[#A855F7]/40 to-transparent"
                    >
                      <div className="relative p-8 rounded-2xl bg-[#0B0410]/80 backdrop-blur-2xl">
                        <div className="text-3xl font-black mb-3 bg-gradient-to-r from-[#D4AF37] to-[#A855F7] bg-clip-text text-transparent">
                          {stat.value}
                        </div>
                        <div className="text-sm text-white/60">{stat.label}</div>
                        <motion.div
                          animate={{ opacity: [0.3, 0.6, 0.3] }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#A855F7]/10 to-transparent pointer-events-none"
                        />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </section>

            {/* QURUPLARIMIZ & LAYİHƏLƏR */}
            <section className="py-32 px-6">
              <div className="max-w-7xl mx-auto">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="text-5xl font-black mb-16 text-center bg-gradient-to-r from-[#A855F7] to-[#D4AF37] bg-clip-text text-transparent"
                >
                  <RevealText>Quruplarimiz & Layihələr</RevealText>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      title: 'Karabakh Media | Əsas İcma',
                      description:
                        'Tələbə diskussiya hub\'u. Birnəticədə yerli cəmiyyət.',
                      buttonText: 'Qoşul',
                      gradient: 'from-purple-500 to-indigo-500',
                    },
                    {
                      title: 'Karabakh Media | Elanlar',
                      description:
                        'Lokal klassifikasiyalar və iş bazarı. Həqiqi elanlar.',
                      buttonText: 'Elanlara Bax',
                      gradient: 'from-pink-500 to-rose-500',
                    },
                    {
                      title: 'Karabakh GO & KarFlow',
                      description:
                        'Tələbə dəstəyi və yerli infrastruktur layihələri.',
                      buttonText: 'Kəşf et',
                      gradient: 'from-cyan-500 to-blue-500',
                    },
                  ].map((hub, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -12 }}
                      className="relative p-[1.5px] rounded-2xl bg-gradient-to-br from-white/20 to-transparent"
                    >
                      <div className={`relative p-8 rounded-2xl bg-gradient-to-br ${hub.gradient} bg-opacity-5 backdrop-blur-2xl group`}>
                        <h3 className="text-xl font-bold mb-4">{hub.title}</h3>
                        <p className="text-white/70 mb-6 text-sm leading-relaxed">
                          {hub.description}
                        </p>
                        <MagneticButton
                          className={`px-6 py-2 rounded-lg bg-gradient-to-r ${hub.gradient} font-bold text-sm text-white hover:text-white transition-all`}
                        >
                          {hub.buttonText}
                        </MagneticButton>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* SOCIAL NETWORKS SECTION */}
            <section className="py-32 px-6">
              <div className="max-w-7xl mx-auto">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="text-5xl font-black mb-16 text-center bg-gradient-to-r from-[#A855F7] to-[#D4AF37] bg-clip-text text-transparent"
                >
                  <RevealText>Bizi İzləyin</RevealText>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      name: 'Telegram',
                      color: 'from-blue-400/30 to-blue-600/30',
                      borderColor: 'from-blue-400/50 to-transparent',
                      href: 'https://t.me/karabakh_media',
                      description: 'Ana diskussiya kanalı',
                    },
                    {
                      name: 'TikTok',
                      color: 'from-slate-600/30 to-red-600/30',
                      borderColor: 'from-red-500/50 to-transparent',
                      href: 'https://tiktok.com/@karabakh.media',
                      description: 'Qısa video məzmun',
                    },
                    {
                      name: 'Instagram',
                      color: 'from-pink-500/30 to-purple-600/30',
                      borderColor: 'from-pink-500/50 to-transparent',
                      href: 'https://instagram.com',
                      description: 'Gündəlik güncəllər',
                    },
                  ].map((social, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.05, y: -10 }}
                      className="relative p-[1.5px] rounded-2xl bg-gradient-to-br from-white/20 to-transparent cursor-pointer group"
                    >
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`block p-12 rounded-2xl bg-gradient-to-br ${social.color} backdrop-blur-2xl flex flex-col items-center justify-center text-center transition-all`}
                      >
                        <div className="text-5xl font-black mb-4 text-white drop-shadow-lg">
                          {social.name === 'Telegram' && '✈️'}
                          {social.name === 'TikTok' && '♪'}
                          {social.name === 'Instagram' && '📸'}
                        </div>
                        <h3 className="text-2xl font-bold mb-2 text-white">
                          {social.name}
                        </h3>
                        <p className="text-sm text-white/80">
                          {social.description}
                        </p>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="mt-6 px-6 py-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 font-bold text-white hover:bg-white/30 transition-all text-sm cursor-pointer"
                        >
                          Profilə Keç
                        </motion.div>
                      </a>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {activePage === 'marketplace' && (
          <motion.div
            key="marketplace"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="pt-32 pb-20 px-6"
          >
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-12"
              >
                <h1 className="text-5xl font-black mb-2 bg-gradient-to-r from-[#A855F7] to-[#D4AF37] bg-clip-text text-transparent">
                  Lokal Elanlar və Vakansiyalar
                </h1>
                <p className="text-white/60 mb-8">
                  Xankəndidə ən yeni elanları və imkanları kəşf edin
                </p>

                {/* Search and Post */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                  <div className="flex-1 relative">
                    <Search
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Axtarış..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-[#A855F7]/50 focus:outline-none placeholder-white/40 text-white transition-all"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#A855F7] to-[#4F46E5] font-bold hover:shadow-lg hover:shadow-[#A855F7]/50 transition-all"
                  >
                    <Plus size={20} />
                    + Elan Yerləşdir
                  </motion.button>
                </div>

                {/* Categories */}
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                  {categories.map((category) => (
                    <motion.button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      whileHover={{ scale: 1.05 }}
                      className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-[#A855F7] to-[#D4AF37] text-black shadow-lg shadow-[#A855F7]/50'
                          : 'bg-white/5 border border-white/10 text-white hover:border-white/30'
                      }`}
                    >
                      {category}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Marketplace Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {marketplaceItems.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    whileHover={{ y: -12 }}
                    className="relative p-[1px] rounded-2xl bg-gradient-to-br from-[#A855F7]/40 to-transparent overflow-hidden group"
                  >
                    <div className="relative rounded-2xl overflow-hidden bg-[#0B0410]/80 backdrop-blur-xl">
                      {/* Image Placeholder */}
                      <div
                        className={`h-48 bg-gradient-to-br ${item.image} relative overflow-hidden`}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        {/* Category Badge */}
                        <div className="mb-3 inline-block px-3 py-1 rounded-full bg-gradient-to-r from-[#A855F7]/40 to-[#D4AF37]/20 border border-[#A855F7]/40">
                          <span className="text-xs font-semibold text-[#D4AF37]">
                            {item.category}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold mb-3 line-clamp-2 group-hover:text-[#D4AF37] transition-colors">
                          {item.title}
                        </h3>

                        {/* Price */}
                        <div className="mb-4 flex items-baseline gap-2">
                          <span className="text-2xl font-black bg-gradient-to-r from-[#A855F7] to-[#D4AF37] bg-clip-text text-transparent">
                            {item.price}
                          </span>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-2 text-white/60 mb-6 text-sm">
                          <MapPin size={16} />
                          {item.location}
                        </div>

                        {/* Action Button */}
                        <MagneticButton
                          className="w-full py-3 rounded-lg bg-gradient-to-r from-[#A855F7] to-[#4F46E5] font-bold text-sm text-white flex items-center justify-center gap-2"
                        >
                          <Phone size={16} />
                          Əlaqə saxla
                        </MagneticButton>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GLOBAL FOOTER */}
      <footer className="border-t border-white/10 mt-20 bg-black/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-[#A855F7] to-[#D4AF37] bg-clip-text text-transparent">
                KARABAKH MEDIA
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Xankəndinin rəqəmsal mərkəzi, tələbə icması və innovasiya
                platforması.
              </p>
            </motion.div>

            {/* Links */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h4 className="font-bold mb-4">Sürətli Keçidlər</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li>
                  <button
                    onClick={() => setActivePage('home')}
                    className="hover:text-[#A855F7] transition-colors"
                  >
                    Ana Səhifə
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActivePage('marketplace')}
                    className="hover:text-[#A855F7] transition-colors"
                  >
                    Elanlar
                  </button>
                </li>
                <li>
                  <a
                    href="https://t.me/karabakh_media"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#A855F7] transition-colors"
                  >
                    Telegram
                  </a>
                </li>
              </ul>
            </motion.div>

            {/* Social */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="font-bold mb-4">Sosial Şəbəkələr</h4>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2 }}
                    className="text-white/60 hover:text-[#A855F7] transition-colors"
                  >
                    <social.icon size={20} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="border-t border-white/10 pt-8 text-center text-white/50 text-sm"
          >
            © 2026 Karabakh Media by Nexus. Bütün hüquqlar qorunur.
          </motion.div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        authMode={authMode}
        setAuthMode={setAuthMode}
      />
    </div>
  );
}
