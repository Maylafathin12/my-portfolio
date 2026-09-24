import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ExternalLink, Users, Target, Rocket, AlertCircle, CheckCircle2, Map, ChevronLeft, ChevronRight, Lightbulb, GripVertical, X } from 'lucide-react';
import { projectsData } from '../../data/projectsData';
import { useLanguage } from '../../context/LanguageContext';

const ProjectDetail = () => {
  const { language } = useLanguage();
  const projects = projectsData[language];
  const { id } = useParams();
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === id);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const getScreenshotUrl = (src) => {
    if (!src) return '';
    // If it's already a resolved Vite asset URL (blob:, data:, or http/https or a hashed path), use as-is
    if (src.startsWith('blob:') || src.startsWith('data:') || src.startsWith('http') || src.startsWith('/assets/')) return src;
    // Otherwise it's a raw public path like /ss-eduresearch/..., prepend BASE_URL
    const cleanSrc = src.startsWith('/') ? src.slice(1) : src;
    return `${import.meta.env.BASE_URL}${cleanSrc}`;
  };

  // Auto-scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isLightboxOpen || !project.screenshots) return;
      if (e.key === 'ArrowRight') {
        setCurrentImgIndex((prev) => (prev + 1) % project.screenshots.length);
      } else if (e.key === 'ArrowLeft') {
        setCurrentImgIndex((prev) => (prev - 1 + project.screenshots.length) % project.screenshots.length);
      } else if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, project.screenshots]);

  // Prevent background scrolling when lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLightboxOpen]);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#07050f] flex flex-col items-center justify-center text-white font-['DM_Sans']">
        <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
        <Link to="/" className="text-[#e8c8ff] hover:underline">Return Home</Link>
      </div>
    );
  }

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % project.testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + project.testimonials.length) % project.testimonials.length);
  };

  return (
    <div className="min-h-screen bg-[#07050f] text-white selection:bg-[#e8c8ff]/30 selection:text-[#e8c8ff]">
      <style>{`
        @keyframes shimmer-sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulse-ring {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 var(--glow-color);
            opacity: 0.8;
          }
          70% {
            transform: scale(1.12);
            box-shadow: 0 0 0 15px var(--glow-color);
            opacity: 0;
          }
          100% {
            transform: scale(1.15);
            box-shadow: 0 0 0 0 var(--glow-color);
            opacity: 0;
          }
        }
        .view-live-draggable-btn:hover .shimmer-effect {
          animation: shimmer-sweep 1.5s infinite;
        }
        .pulse-ring-effect {
          animation: pulse-ring 2s cubic-bezier(0.25, 0, 0, 1) infinite;
          border: 1px solid var(--glow-color);
        }
      `}</style>

      {/* ─── NAVIGATION BAR ────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center pointer-events-none">
        <button
          onClick={() => navigate('/#projects')}
          className="pointer-events-auto flex items-center gap-2 font-['DM_Sans'] text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
        >
          <ArrowLeft size={14} /> Back to Works
        </button>
      </nav>

      {/* ─── HERO SECTION ──────────────────────────────────────── */}
      <section className="relative pt-32 pb-16 px-6 md:px-12 lg:px-24 max-w-[1200px] mx-auto flex flex-col justify-center min-h-[40vh] md:min-h-[50vh]">
        {/* Glow Background */}
        <div
          className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[120px] opacity-20 pointer-events-none"
          style={{ backgroundColor: project.glow }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="font-['DM_Sans'] text-xs font-semibold tracking-[0.2em] uppercase text-white/50">{project.company}</span>
            <div className="w-8 h-[1px] bg-white/20" />
            <span className="font-['DM_Sans'] text-xs tracking-[0.2em] uppercase text-[#e8c8ff]/80">
              No. {project.number}
            </span>
          </div>

          <h1 className="font-['Clash_Display'] text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-8">
            {project.title}
          </h1>

          {project.desc && (
            <p className="font-['Cormorant_Garamond'] text-xl md:text-2xl text-white/60 italic max-w-3xl mb-12 leading-relaxed">
              {project.desc}
            </p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 border-t border-white/10 pt-8 mt-12 md:mt-16">
            <div>
              <p className="font-['DM_Sans'] text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Role</p>
              <p className="font-['DM_Sans'] text-sm md:text-base text-white/90 font-medium">{project.role}</p>
            </div>
            <div>
              <p className="font-['DM_Sans'] text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Timeline</p>
              <p className="font-['DM_Sans'] text-sm md:text-base text-white/90 font-medium">{project.year}</p>
            </div>
            <div className="col-span-2 md:col-span-2">
              <p className="font-['DM_Sans'] text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Tech Stack</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, i) => (
                  <span key={i} className="font-['DM_Sans'] text-[11px] px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/70">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── PREVIEW IMAGE (IF ANY) ────────────────────────────── */}
      {project.previewImage && (
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="px-6 md:px-12 lg:px-24 max-w-[1200px] mx-auto mb-24 md:mb-32"
        >
          <div className="w-full rounded-2xl overflow-hidden border border-white/10 bg-white/5 p-2 md:p-4 backdrop-blur-sm relative group shadow-2xl shadow-black/50">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 pointer-events-none" />
            <img
              src={project.previewImage}
              alt={`${project.title} Preview`}
              className="w-full h-auto rounded-xl transform group-hover:scale-[1.02] transition-transform duration-700 ease-in-out"
            />
          </div>
        </motion.section>
      )}

      {/* ─── OVERVIEW METRICS (BENTO BOX LAYOUT) ───────────────── */}
      <section className="px-6 md:px-12 lg:px-24 max-w-[1200px] mx-auto mb-24 md:mb-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">

          {/* 1. The Objective (Full Width for long text) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-12 bg-gradient-to-br from-white/[0.04] to-transparent border border-white/5 p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden group"
          >
            {/* Background decorative icon */}
            <div className="absolute -top-12 -right-12 md:top-0 md:right-0 md:p-12 opacity-[0.03] pointer-events-none transform group-hover:scale-110 transition-transform duration-1000">
              <Target size={250} />
            </div>

            <div className="relative z-10 max-w-4xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#e8c8ff]/10 text-[#e8c8ff]">
                  <Target size={20} />
                </div>
                <h3 className="font-['DM_Sans'] text-xs uppercase tracking-widest text-white/50">The Objective</h3>
              </div>
              <p className="font-['DM_Sans'] text-base md:text-xl text-white/80 leading-relaxed md:leading-loose">
                {project.reason}
              </p>
            </div>
          </motion.div>

          {/* 2. Audience (Stat Card) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-5 bg-gradient-to-br from-[#f9b8d4]/[0.05] to-transparent border border-[#f9b8d4]/10 p-8 md:p-12 rounded-[2.5rem] flex flex-col justify-center relative overflow-hidden group"
          >
            {/* Background decorative icon */}
            <div className="absolute -bottom-10 -right-10 opacity-[0.03] pointer-events-none transform group-hover:-translate-y-4 transition-transform duration-1000">
              <Users size={200} />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#f9b8d4]/10 text-[#f9b8d4]">
                  <Users size={20} />
                </div>
                <h3 className="font-['DM_Sans'] text-xs uppercase tracking-widest text-[#f9b8d4]/70">Audience</h3>
              </div>
              <p className="font-['Clash_Display'] text-3xl md:text-4xl font-semibold text-white/90 leading-[1.2]">
                {project.userCount}
              </p>
            </div>
          </motion.div>

          {/* 3. The Impact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-7 bg-gradient-to-br from-[#c8b4ff]/[0.05] to-transparent border border-[#c8b4ff]/10 p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden group"
          >
            {/* Background decorative icon */}
            <div className="absolute -bottom-10 -right-10 opacity-[0.03] pointer-events-none transform group-hover:rotate-12 transition-transform duration-1000">
              <Rocket size={200} />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#c8b4ff]/10 text-[#c8b4ff]">
                  <Rocket size={20} />
                </div>
                <h3 className="font-['DM_Sans'] text-xs uppercase tracking-widest text-[#c8b4ff]/70">The Impact</h3>
              </div>
              <p className="font-['DM_Sans'] text-base md:text-lg text-white/80 leading-relaxed md:leading-loose">
                {project.impact}
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ─── CASE STUDY & JOURNEY ──────────────────────────────── */}
      <section className="px-6 md:px-12 lg:px-24 max-w-[1200px] mx-auto mb-32 space-y-20 md:space-y-32">

        {/* Overview */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-100px" }} className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
          <div className="md:col-span-4 lg:col-span-3">
            <h3 className="font-['Clash_Display'] text-2xl md:text-3xl font-semibold text-white md:sticky md:top-32">Project Overview</h3>
          </div>
          <div className="md:col-span-8 lg:col-span-9">
            <p className="font-['DM_Sans'] text-base md:text-lg text-white/70 leading-relaxed whitespace-pre-line">
              {project.studyCase}
            </p>
          </div>
        </motion.div>

        {/* Challenges & Solutions */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
          <div className="md:col-span-4 lg:col-span-3">
            <h3 className="font-['Clash_Display'] text-2xl md:text-3xl font-semibold text-white md:sticky md:top-32">Challenges &<br className="hidden md:block" />Solutions</h3>
          </div>
          <div className="md:col-span-8 lg:col-span-9 space-y-12">
            <div>
              <div className="flex items-center gap-3 mb-4 text-[#ff6b6b]">
                <AlertCircle size={20} />
                <h4 className="font-['DM_Sans'] text-lg font-medium text-white">The Challenge</h4>
              </div>
              <p className="font-['DM_Sans'] text-base md:text-lg text-white/60 leading-relaxed whitespace-pre-line bg-white/[0.01] p-6 md:p-8 rounded-2xl border border-white/5">
                {project.challenges}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4 text-[#51cf66]">
                <CheckCircle2 size={20} />
                <h4 className="font-['DM_Sans'] text-lg font-medium text-white">{project.solutionTitle || "The Solution"}</h4>
              </div>
              <p className="font-['DM_Sans'] text-base md:text-lg text-white/60 leading-relaxed whitespace-pre-line bg-white/[0.01] p-6 md:p-8 rounded-2xl border border-white/5">
                {project.solutions}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Journey */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
          <div className="md:col-span-4 lg:col-span-3">
            <h3 className="font-['Clash_Display'] text-2xl md:text-3xl font-semibold text-white md:sticky md:top-32">The Journey</h3>
          </div>
          <div className="md:col-span-8 lg:col-span-9">
            <div className="pl-6 md:pl-8 border-l border-white/10 relative">
              <span className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-[#74c0fc]" />
              <p className="font-['DM_Sans'] text-base md:text-lg text-white/70 leading-relaxed whitespace-pre-line">
                {project.journey}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Emotional Worlds */}
        {project.emotionalWorlds && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
            <div className="md:col-span-4 lg:col-span-3">
              <h3 className="font-['Clash_Display'] text-2xl md:text-3xl font-semibold text-white md:sticky md:top-32">
                {project.emotionalWorldsTitle || "Emotional Worlds"}
              </h3>
            </div>
            <div className="md:col-span-8 lg:col-span-9">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.emotionalWorlds.map((world, idx) => (
                  <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.05] transition-colors group">
                    <div className="text-white group-hover:text-[#e8c8ff] transition-colors font-['Clash_Display'] font-semibold text-xl mb-1">{world.name}</div>
                    <div className="font-['DM_Sans'] text-white/50 text-sm uppercase tracking-widest">{world.emotion}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* What I Learned */}
        {project.learned && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
            <div className="md:col-span-4 lg:col-span-3">
              <h3 className="font-['Clash_Display'] text-2xl md:text-3xl font-semibold text-white md:sticky md:top-32">
                {language === 'en' ? 'What I Learned' : 'Yang Saya Pelajari'}
              </h3>
            </div>
            <div className="md:col-span-8 lg:col-span-9">
              <div className="pl-6 md:pl-8 border-l border-white/10 relative">
                <span className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-[#fcc419]" />
                <p className="font-['DM_Sans'] text-base md:text-lg text-white/70 leading-relaxed whitespace-pre-line">
                  {project.learned}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* ─── TESTIMONIALS CAROUSEL ─────────────────────────────── */}
      {project.testimonials && project.testimonials.length > 0 && (
        <section className="py-24 px-6 md:px-12 overflow-hidden relative border-t border-white/5 bg-gradient-to-b from-transparent to-white/[0.02]">
          <div className="max-w-[1000px] mx-auto text-center mb-16 relative z-10">
            <p className="font-['DM_Sans'] text-[10px] uppercase tracking-[0.3em] text-[#e8c8ff]/80 mb-4">Feedback</p>
            <h2 className="font-['Clash_Display'] text-4xl font-semibold">What They Say</h2>
          </div>

          <div className="max-w-[700px] mx-auto relative z-10">
            <div className="relative min-h-[200px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="absolute w-full text-center px-4 md:px-10"
                >
                  <div className="text-3xl text-white/10 font-serif mb-3">"</div>
                  <p className="font-['Cormorant_Garamond'] text-[24px] italic text-white/85 leading-relaxed mb-6">
                    {project.testimonials[activeTestimonial].text}
                  </p>
                  <div>
                    <h4 className="font-['DM_Sans'] text-xs font-bold text-white tracking-widest uppercase mb-1">
                      {project.testimonials[activeTestimonial].name}
                    </h4>
                    <p className="font-['DM_Sans'] text-[10px] text-white/40 tracking-wider uppercase">
                      {project.testimonials[activeTestimonial].role}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex justify-center items-center gap-6 mt-12">
              <button
                onClick={prevTestimonial}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex gap-2">
                {project.testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === activeTestimonial ? 'w-6 bg-[#e8c8ff]' : 'w-1.5 bg-white/20'}`}
                  />
                ))}
              </div>
              <button
                onClick={nextTestimonial}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
            
            {/* Stats */}
            {project.testimonialStats && (
              <div className="flex justify-center mt-8">
                <span className="inline-block px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 font-['DM_Sans'] text-sm text-white/80 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                  {project.testimonialStats}
                </span>
              </div>
            )}
          </div>
        </section>
      )}


      {/* ─── CLOSING LINE ──────────────────────────────────────── */}
      {project.closingLine && (
        <section className="px-6 md:px-12 lg:px-24 max-w-[800px] mx-auto mb-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 md:p-8 rounded-3xl border border-white/10 bg-white/[0.02]"
          >
            <p className="font-['Cormorant_Garamond'] text-[24px] italic text-white/70 leading-relaxed whitespace-pre-line">
              "{project.closingLine}"
            </p>
          </motion.div>
        </section>
      )}

      {/* ─── FOOTER CTA ────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6 text-center border-t border-white/5 relative overflow-hidden">
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[150px] opacity-10 pointer-events-none"
          style={{ backgroundColor: project.glow }}
        />

        <h2 className="font-['Clash_Display'] text-3xl md:text-4xl mb-8 relative z-10">Interested in building something similar?</h2>
        
        {/* Screenshots Preview Box */}
        {project.screenshots && project.screenshots.length > 0 && (
          <div className="max-w-[800px] mx-auto mb-12 relative z-10 px-4">
            <div 
              className="relative rounded-3xl border border-white/10 bg-white/[0.02] p-5 shadow-2xl backdrop-blur-md"
              style={{ boxShadow: `inset 0 0 20px ${project.glow}10, 0 10px 30px rgba(0,0,0,0.5)` }}
            >
              <div className={`grid gap-4 ${
                project.screenshots.length === 1 ? 'grid-cols-1' :
                project.screenshots.length === 2 ? 'grid-cols-2' :
                project.screenshots.length === 3 ? 'grid-cols-3' :
                'grid-cols-2 md:grid-cols-4'
              }`}>
                {project.screenshots.slice(0, 4).map((src, index) => (
                  <div 
                    key={index}
                    onClick={() => {
                      setCurrentImgIndex(index);
                      setIsLightboxOpen(true);
                    }}
                    className={`group relative overflow-hidden cursor-pointer border border-white/5 hover:border-[#e8c8ff]/30 hover:scale-[1.03] transition-all duration-300 bg-black/40 rounded-xl ${
                      project.screenshots.length === 1 ? 'aspect-video' : 'aspect-video md:aspect-[4/3]'
                    }`}
                  >
                    <img 
                      src={getScreenshotUrl(src)} 
                      alt={`Screenshot preview ${index + 1}`} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-[10px] font-['DM_Sans'] uppercase tracking-wider bg-black/75 px-3 py-1.5 rounded-full border border-white/10">
                        {language === 'en' ? 'View' : 'Lihat'}
                      </span>
                    </div>
                    {index === 3 && project.screenshots.length > 4 && (
                      <div 
                        className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-center p-2 cursor-pointer group-hover:bg-black/70 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImgIndex(3);
                          setIsLightboxOpen(true);
                        }}
                      >
                        <span className="text-xl md:text-2xl font-bold text-white">+{project.screenshots.length - 3}</span>
                        <span className="text-[9px] text-[#e8c8ff] uppercase tracking-wider font-['DM_Sans'] mt-0.5">
                          {language === 'en' ? 'More Screenshots' : 'Screenshot Lain'}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
          <Link
            to="/#projects"
            className="font-['DM_Sans'] text-xs uppercase tracking-widest px-8 py-4 rounded-full border border-white/20 hover:bg-white/5 transition-colors"
          >
            Back to Portfolio
          </Link>
          {project.link && !project.isComingSoon && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="font-['DM_Sans'] text-xs uppercase tracking-widest px-8 py-4 rounded-full text-black transition-all hover:scale-105"
              style={{ backgroundColor: project.glow, boxShadow: `0 0 30px ${project.glow}40` }}
            >
              {language === 'en' ? 'View Live Website' : 'Lihat Website'}
            </a>
          )}
          {project.screenshots && project.screenshots.length > 0 && (
            <button
              onClick={() => {
                setCurrentImgIndex(0);
                setIsLightboxOpen(true);
              }}
              className="font-['DM_Sans'] text-xs uppercase tracking-widest px-8 py-4 rounded-full text-black transition-all hover:scale-105 cursor-pointer"
              style={{ backgroundColor: project.glow, boxShadow: `0 0 30px ${project.glow}40` }}
            >
              {language === 'en' ? 'View Screenshots' : 'Lihat Screenshot'}
            </button>
          )}
        </div>
      </section>

      {/* Floating Action Button (View Live or View Screenshots) */}
      {((project.link && !project.isComingSoon) || (project.screenshots && project.screenshots.length > 0)) && (
        <motion.div
          drag
          dragMomentum={false}
          whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
          initial={{ y: 150, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 100, delay: 0.5 }}
          className="pointer-events-auto fixed bottom-10 z-[9999] flex items-center bg-black/60 backdrop-blur-xl border border-white/10 p-2 pr-4 rounded-full shadow-2xl cursor-grab touch-none select-none view-live-draggable"
          style={{ 
            left: 'calc(50% - 115px)',
            '--glow-color': project.glow 
          }}
        >
          {/* Subtle glow aura */}
          <div 
            className="absolute inset-0 -z-10 rounded-full blur-xl opacity-30 animate-pulse pointer-events-none"
            style={{ backgroundColor: project.glow }}
          />
          
          {/* Drag Handle vertical grip icon */}
          <div className="text-white/40 ml-1 mr-2 flex items-center justify-center hover:text-white/60 transition-colors">
            <GripVertical size={16} />
          </div>

          {project.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto relative flex items-center gap-2 font-['DM_Sans'] text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full text-black transition-all duration-300 hover:scale-102 group overflow-hidden view-live-draggable-btn"
              style={{ 
                backgroundColor: project.glow, 
                boxShadow: `0 0 20px ${project.glow}50`,
              }}
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full shimmer-effect" />
              <span className="absolute inset-0 rounded-full pulse-ring-effect pointer-events-none" />
              {language === 'en' ? 'View Live' : 'Lihat Website'} <ExternalLink size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          ) : (
            <button
              onClick={() => {
                setCurrentImgIndex(0);
                setIsLightboxOpen(true);
              }}
              className="pointer-events-auto relative flex items-center gap-2 font-['DM_Sans'] text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full text-black transition-all duration-300 hover:scale-102 group overflow-hidden view-live-draggable-btn cursor-pointer"
              style={{ 
                backgroundColor: project.glow, 
                boxShadow: `0 0 20px ${project.glow}50`,
              }}
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full shimmer-effect" />
              <span className="absolute inset-0 rounded-full pulse-ring-effect pointer-events-none" />
              {language === 'en' ? 'Screenshots' : 'Galeri Foto'} <ExternalLink size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          )}
        </motion.div>
      )}

      {/* ─── LIGHTBOX MODAL ────────────────────────────────────── */}
      <AnimatePresence>
        {isLightboxOpen && project.screenshots && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md select-none"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 z-[10002] w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Navigation Indicators */}
            <div className="absolute top-6 left-6 z-[10002] font-['DM_Sans'] text-xs text-white/50 tracking-widest">
              {currentImgIndex + 1} <span className="mx-1">/</span> {project.screenshots.length}
            </div>

            {/* Main Interactive Image Area */}
            <div className="relative w-full max-w-[1200px] h-[75vh] flex items-center justify-center px-4 md:px-16" onClick={(e) => e.stopPropagation()}>
              
              {/* Prev Button */}
              <button
                onClick={() => setCurrentImgIndex((prev) => (prev - 1 + project.screenshots.length) % project.screenshots.length)}
                className="absolute left-4 md:left-6 z-[10002] w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 hover:scale-105 transition-all cursor-pointer"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Image Container with framer motion slide effect */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImgIndex}
                  src={getScreenshotUrl(project.screenshots[currentImgIndex])}
                  alt={`Screenshot ${currentImgIndex + 1}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl border border-white/5"
                />
              </AnimatePresence>

              {/* Next Button */}
              <button
                onClick={() => setCurrentImgIndex((prev) => (prev + 1) % project.screenshots.length)}
                className="absolute right-4 md:right-6 z-[10002] w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 hover:scale-105 transition-all cursor-pointer"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Sub-text label or instructions */}
            <div className="absolute bottom-6 font-['DM_Sans'] text-[10px] text-white/30 uppercase tracking-[0.2em] text-center px-4">
              {language === 'en' ? 'Use Arrow Keys ← / → to Navigate • ESC to Close' : 'Gunakan Tombol Panah ← / → untuk Navigasi • ESC untuk Keluar'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ProjectDetail;
