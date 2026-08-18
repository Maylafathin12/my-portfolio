import { useState, useEffect, useRef } from 'react'
import Lenis from 'lenis'
import Preloader from './components/Preloader/Preloader'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
import Projects from './components/Projects/Projects'
import Experience from './components/Experience/Experience'
import Skills from './components/Skills/Skills'
import Education from './components/Education/Education'
import Contact from './components/Contact/Contact'
import { Routes, Route, useLocation } from 'react-router-dom'
import ConstellationNav from './components/ConstellationNav/ConstellationNav'
import Certifications from './components/Certifications/Certifications'
import ProjectDetail from './components/ProjectDetail/ProjectDetail'
import LanguageToggle from './components/LanguageToggle/LanguageToggle'
import Uses from './components/Uses/Uses'
import { useAboutUnlock } from './context/AboutUnlockContext'

function Home({ preloaderDone, activeSection }) {
  return (
    <div style={{ opacity: preloaderDone ? 1 : 0, transition: 'opacity 0.8s ease' }}>
      <ConstellationNav activeSection={activeSection} />
      <section id="hero"><Hero /></section>
      <section id="about"><About /></section>
      <section id="projects"><Projects /></section>
      <section id="experience"><Experience /></section>
      <section id="skills"><Skills /></section>
      <section id="certifications"><Certifications /></section>
      <section id="education"><Education /></section>
      <section id="contact"><Contact /></section>
    </div>
  )
}

function App() {
  const [preloaderDone, setPreloaderDone] = useState(true)
  const [activeSection, setActiveSection] = useState('hero')
  const lenisRef = useRef(null)
  const location = useLocation()
  const { isUnlocked, requestShake } = useAboutUnlock()
  const isHomeRoute = location.pathname === '/' || location.pathname === ''

  // Scroll to top or hash on route change
  useEffect(() => {
    if (location.hash) {
      // Small timeout to ensure DOM is ready after route transition
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const el = document.getElementById(id);
        if (el) {
          // If lenis is initialized, use its scrollTo, otherwise fallback to native
          if (lenisRef.current) {
            lenisRef.current.scrollTo(el);
          } else {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  // Lenis smooth scroll
  useEffect(() => {
    if (!preloaderDone) return

    const lenis = new Lenis({
      duration: 1.4,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.8,
    })
    lenisRef.current = lenis

    const raf = (time) => {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => lenis.destroy()
  }, [preloaderDone])

  // Lock scroll past About until "More About Me" is clicked
  useEffect(() => {
    if (!preloaderDone || !isHomeRoute || isUnlocked) return

    const aboutEl = document.getElementById('about')
    if (!aboutEl) return

    const getMaxScroll = () => {
      const aboutBottom = aboutEl.offsetTop + aboutEl.offsetHeight
      return Math.max(0, aboutBottom - window.innerHeight + 32)
    }

    let shakeCooldown = false
    const triggerBlockedScroll = () => {
      if (shakeCooldown) return
      shakeCooldown = true
      requestShake()
      setTimeout(() => {
        shakeCooldown = false
      }, 700)
    }

    const enforceLock = () => {
      const maxScroll = getMaxScroll()
      if (window.scrollY > maxScroll + 2) {
        const lenis = lenisRef.current
        if (lenis) {
          lenis.scrollTo(maxScroll, { immediate: true })
        } else {
          window.scrollTo({ top: maxScroll, behavior: 'auto' })
        }
        triggerBlockedScroll()
      }
    }

    const handleWheel = (e) => {
      const maxScroll = getMaxScroll()
      if (window.scrollY >= maxScroll - 8 && e.deltaY > 0) {
        e.preventDefault()
        triggerBlockedScroll()
      }
    }

    let touchStartY = 0
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY
    }

    const handleTouchMove = (e) => {
      const maxScroll = getMaxScroll()
      const deltaY = touchStartY - e.touches[0].clientY
      if (window.scrollY >= maxScroll - 8 && deltaY > 0) {
        e.preventDefault()
        triggerBlockedScroll()
      }
    }

    const lenis = lenisRef.current
    if (lenis) {
      lenis.on('scroll', enforceLock)
    }

    window.addEventListener('scroll', enforceLock, { passive: true })
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      if (lenis) {
        lenis.off('scroll', enforceLock)
      }
      window.removeEventListener('scroll', enforceLock)
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [preloaderDone, isHomeRoute, isUnlocked, requestShake])

  // Active section tracker
  useEffect(() => {
    if (!preloaderDone) return
    const sectionIds = ['hero', 'about', 'projects', 'experience', 'skills', 'certifications', 'education', 'contact']

    const handleScroll = () => {
      const center = window.innerHeight / 2
      let currentId = 'hero'

      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          // If the middle of the screen is within this element's bounds
          if (rect.top <= center && rect.bottom >= center) {
            currentId = id
            break
          }
        }
      }

      // Prevent unnecessary state updates
      setActiveSection((prev) => (prev !== currentId ? currentId : prev))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    // Initial check
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [preloaderDone])

  return (
    <main>
      <LanguageToggle />
      {!preloaderDone && <Preloader onComplete={() => setPreloaderDone(true)} />}

      <Routes>
        <Route path="/" element={<Home preloaderDone={preloaderDone} activeSection={activeSection} />} />
        <Route path="/uses" element={
          <div style={{ opacity: preloaderDone ? 1 : 0, transition: 'opacity 0.8s ease' }}>
            <Uses />
          </div>
        } />
        <Route path="/project/:id" element={
          <div style={{ opacity: preloaderDone ? 1 : 0, transition: 'opacity 0.8s ease' }}>
            <ProjectDetail />
          </div>
        } />
      </Routes>
    </main>
  )
}

export default App