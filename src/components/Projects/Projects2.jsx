import React, { useEffect, useRef, useLayoutEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import { useIsMobile } from '../../hooks/useIsMobile'
import sehatImg from '../../assets/sehat.webp'
import sahalImg from '../../assets/sahal.webp'
import commandImg from '../../assets/command.webp'
import yumyImg from '../../assets/yumy.webp'
import recycleImg from '../../assets/recycle.webp'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    number: '01',
    title: 'EduResearch AI',
    role: 'Lead Front-End Developer',
    year: '2026 (June)',
    desc: 'Building the front-end foundation for an AI-powered research platform — designing the component architecture, AI interaction flows, and structured UX for academic workflows.',
    tags: ['React.js', 'GSAP', 'AI Integration', 'SaaS'],
    link: null,
    isComingSoon: true,
    glow: '#F3E5F5', // Ghost Purple (Paling Muda)
    geometry: 'box',
    previewImage: null,
  },
  {
    number: '02',
    title: 'Global Educativa.id',
    role: 'Front-End Developer',
    year: '2026 (Feb - April)',
    desc: 'Production landing page for Global Educativa — an international academic consulting platform. Owned full component architecture, responsive design, and deployment end-to-end using React.js and Tailwind CSS.',
    tags: ['React.js', 'Tailwind CSS', 'Responsive', 'Production'],
    link: 'https://global.educativa.id',
    glow: '#E1BEE7', // Pale Pastel Purple
    geometry: 'sphere',
    previewImage: null,
  },
  {
    number: '03',
    title: 'Kelas Riset by Educativa',
    role: 'Front-End Developer — Revamp',
    year: '2026',
    desc: 'Rebuilt and redesigned the KelasRiset landing page from the ground up — modernizing the visual identity and delivering a brand-aligned UI now serving 45,000+ members.',
    tags: ['HTML', 'CSS', 'JavaScript', 'UI Revamp'],
    link: 'https://kelasriset.com',
    glow: '#CE93D8', // Soft Lilac
    geometry: 'torus',
    previewImage: null,
  },
  {
    number: '04',
    title: 'Command Center Kab. Blora',
    role: 'Front-End Developer · DINKOMINFO',
    year: '2024',
    desc: 'Real-time operations dashboard built for DINKOMINFO Kabupaten Blora — actively used by local government officials to monitor regional data daily.',
    tags: ['Dashboard', 'Government', 'Real-time Data'],
    link: null,
    glow: '#B39DDB', // Muted Lavender
    geometry: 'octahedron',
    previewImage: commandImg,
  },
  {
    number: '05',
    title: 'SAHAL',
    role: 'Web Developer',
    year: '2024',
    desc: 'Arabic language learning platform serving 500+ active students from elementary to high school level — built to make classical Arabic accessible and engaging across all age groups.',
    tags: ['Web', 'EdTech', 'Arabic Learning', '500+ Users', 'SD–SMA'],
    link: null,
    glow: '#9F86C0', // Pastel Deep Lavender
    geometry: 'dodecahedron',
    previewImage: sahalImg,
  },
  {
    number: '06',
    title: 'SEHAT+ App (Mobile)',
    role: 'Mobile App Developer',
    year: '2023',
    desc: 'AI-powered HIV/AIDS awareness mobile app with integrated chatbot for personalized health advice. Built with Kotlin — won 1st Place National at PKP2 PTMA.',
    tags: ['Flutter', 'AI Chatbot', 'Mobile', '🏆 1st Place National'],
    link: null,
    glow: '#6E548E', // Muted Deep Purple
    geometry: 'icosahedron',
    previewImage: sehatImg,
  },
  {
    number: '07',
    title: 'SEHAT+ Landing Page',
    role: 'Web Developer',
    year: '2023',
    desc: 'Build landing page website for SEHAT+ providing accessibility and information about the mobile ecosystem.',
    tags: ['HTML5', 'CSS', 'WEBSITE', '🏆 1st Place National'],
    link: null,
    glow: '#6E548E', // Deep Pastel Violet
    geometry: 'icosahedron',
    previewImage: sehatImg,
  },
  {
    number: '08',
    title: 'YUMMY Cafe and Resto',
    role: 'Web Developer',
    year: '2023',
    desc: 'Interactive restaurant website with integrated web-based booking system. Awarded Most Favorited Web Champion — recognized for UX quality and user engagement.',
    tags: ['Web', 'Booking System', '🏆 Most Favorited Web'],
    link: null,
    glow: '#6E5B9A', // Dusty Purple
    geometry: 'knot',
    previewImage: yumyImg,
  },
  {
    number: '09',
    title: '3Cycle — Recycling Redefined',
    role: 'Mobile App Developer',
    year: '2022',
    desc: 'Multiplatform waste management app built with Flutter — featuring real-time geospatial mapping and a gamified points system to encourage sustainable habits.',
    tags: ['Flutter', 'Dart', 'Google Maps API', 'Sustainability'],
    link: null,
    glow: '#42326E', // Dark Muted Purple (Paling Gelap)
    geometry: 'dodecahedron',
    previewImage: recycleImg,
  },
];

// ─── THREE.JS HOOK ────────────────────────────────────────────────────────────
const useThreeScene = (canvasRef, geometry, glow, isMobile) => {
  const rafRef = useRef()
  const isVisibleRef = useRef(false)

  useEffect(() => {
    if (isMobile) return
    const canvas = canvasRef.current
    if (!canvas) return

    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting
    }, { threshold: 0 })
    observer.observe(canvas)

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100)
    camera.position.z = 4.5

    scene.add(new THREE.AmbientLight('#ffffff', 0.04))
    const pLight = new THREE.PointLight(glow, 3, 14)
    pLight.position.set(2, 2, 2)
    scene.add(pLight)
    const rim = new THREE.PointLight('#c8b4ff', 1.5, 10)
    rim.position.set(-2, -1, 1)
    scene.add(rim)

    let geo
    if (geometry === 'box') geo = new THREE.BoxGeometry(1.5, 1.5, 1.5)
    else if (geometry === 'sphere') geo = new THREE.SphereGeometry(1.3, 32, 32)
    else if (geometry === 'torus') geo = new THREE.TorusGeometry(1.1, 0.38, 24, 60)
    else if (geometry === 'icosahedron') geo = new THREE.IcosahedronGeometry(1.35, 1)
    else if (geometry === 'octahedron') geo = new THREE.OctahedronGeometry(1.35, 0)
    else if (geometry === 'dodecahedron') geo = new THREE.DodecahedronGeometry(1.3, 0)
    else geo = new THREE.TorusKnotGeometry(0.9, 0.28, 128, 20)

    const wireMesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
      color: new THREE.Color(glow).multiplyScalar(0.22),
      wireframe: true, transparent: true, opacity: 0.6,
    }))
    scene.add(wireMesh)

    const solidMesh = new THREE.Mesh(geo, new THREE.MeshPhongMaterial({
      color: new THREE.Color('#0d0820'),
      emissive: new THREE.Color(glow).multiplyScalar(0.07),
      transparent: true, opacity: 0.75, shininess: 90,
    }))
    solidMesh.scale.setScalar(0.96)
    scene.add(solidMesh)

    const pN = 220
    const pPos = new Float32Array(pN * 3)
    for (let i = 0; i < pN; i++) {
      const r = 2.0 + Math.random() * 1.3
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      pPos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pPos[i * 3 + 2] = r * Math.cos(phi)
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({
      color: new THREE.Color(glow), size: 0.024, transparent: true, opacity: 0.5,
    })))

    const resize = () => {
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', resize)

    let t = 0
    const loop = () => {
      rafRef.current = requestAnimationFrame(loop)
      if (!isVisibleRef.current) return

      t += 0.006
      wireMesh.rotation.y = t * 0.35
      wireMesh.rotation.x = t * 0.18
      solidMesh.rotation.y = t * 0.35
      solidMesh.rotation.x = t * 0.18
      wireMesh.position.y = Math.sin(t * 0.7) * 0.09
      solidMesh.position.y = Math.sin(t * 0.7) * 0.09
      renderer.render(scene, camera)
    }
    loop()

    return () => {
      cancelAnimationFrame(rafRef.current)
      observer.disconnect()
      window.removeEventListener('resize', resize)
      renderer.dispose()
      pGeo.dispose()
      geo.dispose()
    }
  }, [geometry, glow, isMobile])
}

// ─── CARD ─────────────────────────────────────────────────────────────────────
const Card = React.forwardRef(({ project }, ref) => {
  const canvasRef = useRef(null)
  const isMobile = useIsMobile(900)
  useThreeScene(canvasRef, project.geometry, project.glow, isMobile)

  // Pisah state: satu untuk hover di title (fixed popup ikut mouse)
  // satu untuk hover di tombol preview (popup muncul di atas tombol)
  const [titleHovered, setTitleHovered] = useState(false)
  const [linkHovered, setLinkHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX + 20, y: e.clientY - 80 })
  }

  return (
    <div ref={ref} className="pc-card">
      {!isMobile ? (
        <canvas ref={canvasRef} className="pc-canvas" />
      ) : (
        <div className="pc-mobile-fallback">
          <div className="pc-fallback-orb" style={{ '--glow': project.glow }} />
        </div>
      )}
      <div className="pc-glow" style={{ background: `radial-gradient(circle, ${project.glow}22 0%, transparent 68%)` }} />

      {/* Top bar */}
      <div className="pc-topbar">
        <span className="pc-idx">{project.number}</span>
        <div className="pc-topbar-line" />
        {project.isComingSoon && <span className="pc-badge">COMING SOON</span>}
        <span className="pc-yr">{project.year}</span>
      </div>

      {/* Body */}
      <div className="pc-body">
        <div className="pc-left">
          <div className="pc-bgnumber" style={{ color: `${project.glow}10` }}>{project.number}</div>
          <p className="pc-role">{project.role}</p>

          {/* Title dengan hover preview ikut kursor — hanya jika ADA gambar & tidak ada link */}
          <h2
            className="pc-title"
            onMouseEnter={() => project.previewImage && !project.link && setTitleHovered(true)}
            onMouseLeave={() => setTitleHovered(false)}
            onMouseMove={handleMouseMove}
            style={{ cursor: project.previewImage && !project.link ? 'crosshair' : 'default' }}
          >
            {project.title}

            {/* Fixed popup ikut mouse — hanya tampil di title hover */}
            {project.previewImage && titleHovered && (
              <div style={{
                position: 'fixed',
                left: mousePos.x,
                top: mousePos.y,
                width: '260px',
                borderRadius: '12px',
                overflow: 'hidden',
                zIndex: 9999,
                pointerEvents: 'none',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)',
                transition: 'opacity 0.2s ease',
              }}>
                <img src={project.previewImage} alt={project.title} style={{ width: '100%', display: 'block' }} />
                <div style={{
                  padding: '8px 12px',
                  background: 'rgba(7,5,15,0.95)',
                  backdropFilter: 'blur(8px)',
                  fontSize: '10px',
                  color: 'rgba(255,255,255,0.4)',
                  letterSpacing: '0.08em',
                  fontFamily: 'DM Sans, sans-serif',
                }}>
                  {project.title} · Screenshot Preview
                </div>
              </div>
            )}
          </h2>

          <p className="pc-desc">{project.desc}</p>
          <div className="pc-tags">
            {project.tags.map((tag, t) => (
              <span key={t} className="pc-tag" style={{ '--ac': project.glow }}>{tag}</span>
            ))}
          </div>

          {/* ─── CTA AREA ─────────────────────────────────────────────── */}
          {project.isComingSoon ? (
            // Coming soon badge
            <div className="pc-status-wip">
              <span className="pc-pulse italic" style={{ backgroundColor: project.glow }}></span>
              <span style={{ fontFamily: 'Cormorant Garamond', color: project.glow, fontSize: '11px', letterSpacing: '1px' }}>
                Development in Progress
              </span>
            </div>

          ) : project.link ? (
            // Ada live link — tombol View Live
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="pc-link"
              style={{ '--ac': project.glow }}
            >
              <span>View Live</span>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M2 12L12 2M12 2H5M12 2V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>

          ) : (
            // Tidak ada link — tampilkan "Not publicly deployed" + tombol Preview jika ada gambar
            <div style={{ position: 'relative', display: 'inline-block' }}>

              {/* Popup preview muncul di atas tombol */}
              {project.previewImage && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 'calc(100% + 12px)',
                    left: '0',
                    width: '280px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    zIndex: 9999,
                    pointerEvents: 'none',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.08)',
                    opacity: linkHovered ? 1 : 0,
                    transform: linkHovered ? 'translateY(0px)' : 'translateY(10px)',
                    transition: 'opacity 0.25s ease, transform 0.25s ease',
                  }}
                >
                  <img
                    src={project.previewImage}
                    alt={project.title}
                    style={{ width: '100%', display: 'block' }}
                  />
                  <div style={{
                    padding: '8px 12px',
                    background: 'rgba(7,5,15,0.95)',
                    backdropFilter: 'blur(8px)',
                    fontSize: '10px',
                    color: 'rgba(255,255,255,0.4)',
                    letterSpacing: '0.08em',
                    fontFamily: 'DM Sans, sans-serif',
                  }}>
                    {project.title} · Screenshot Preview
                  </div>
                </div>
              )}

              {/* Row: teks + tombol Preview */}
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                onMouseEnter={() => setLinkHovered(true)}
                onMouseLeave={() => setLinkHovered(false)}
              >
                <span className="pc-no-link">Not publicly deployed</span>

                {/* Tombol Preview — hanya muncul kalau ada gambar */}
                {project.previewImage && (
                  <span
                    style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '10px',
                      padding: '4px 12px',
                      border: `1px solid ${project.glow}55`,
                      borderRadius: '99px',
                      color: project.glow,
                      cursor: 'default',
                      letterSpacing: '0.08em',
                      transition: 'background 0.2s ease, border-color 0.2s ease',
                      background: linkHovered ? `${project.glow}15` : 'transparent',
                    }}
                  >
                    Preview ↗
                  </span>
                )}
              </div>
            </div>
          )}
          {/* ─── END CTA AREA ─────────────────────────────────────────── */}
        </div>
      </div>

      <div className="pc-bottom-rule" style={{ background: `linear-gradient(90deg,transparent,${project.glow}28,transparent)` }} />
    </div>
  )
})

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const Projects = () => {
  const wrapperRef = useRef(null)
  const stickyRef = useRef(null)
  const headerRef = useRef(null)
  const progressFillRef = useRef(null)
  const counterRef = useRef(null)
  const cardRefs = useRef([])
  const dotRefs = useRef([])

  useLayoutEffect(() => {
    const cards = cardRefs.current
    const dots = dotRefs.current
    const total = cards.length

    cards.forEach((card, i) => {
      gsap.set(card, {
        position: 'absolute', inset: 0,
        opacity: i === 0 ? 1 : 0,
        y: i === 0 ? 0 : 60,
        scale: i === 0 ? 1 : 0.96,
        zIndex: i === 0 ? total : total - i,
        pointerEvents: i === 0 ? 'auto' : 'none',
      })
    })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: 'top top',
        end: `+=${total * 100}vh`,
        scrub: 0.6,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress
          const idx = Math.round(progress * (total - 1))

          if (counterRef.current) counterRef.current.innerText = `0${idx + 1}`
          if (progressFillRef.current) progressFillRef.current.style.width = `${progress * 100}%`

          dots.forEach((dot, di) => {
            if (di === idx) dot.classList.add('active')
            else dot.classList.remove('active')
          })
        },
      },
    })

    cards.forEach((card, i) => {
      if (i === total - 1) return
      const next = cards[i + 1]

      tl.to(card, {
        opacity: 0,
        y: -100,
        scale: 0.94,
        rotateX: 12,
        filter: 'blur(10px)',
        duration: 1,
      }, i)

      tl.fromTo(next,
        { opacity: 0, y: 100, scale: 0.92, filter: 'blur(15px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', pointerEvents: 'auto', duration: 1 },
        i
      )
    })

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <div ref={wrapperRef} className="projects-wrapper">
      <div ref={stickyRef} className="projects-sticky">

        {/* Header Section */}
        <div ref={headerRef} className="projects-header">
          <div className="ph-left">
            <p className="ph-eyebrow" style={{ color: 'rgba(232,200,255,0.8)' }}>✦ Selected Works</p>
            <h2 className="ph-title">Featured <span className="gradient-text">Projects</span></h2>
          </div>
          <div className="ph-right">
            <div className="ph-counter">
              <span ref={counterRef} className="ph-current">01</span>
              <span className="ph-sep">/</span>
              <span className="ph-total">0{projects.length}</span>
            </div>
            <div className="ph-progress-bg">
              <div ref={progressFillRef} className="ph-progress-fill" />
            </div>
          </div>
        </div>

        {/* Cards Container */}
        <div className="cards-container">
          {projects.map((project, i) => (
            <Card
              key={i}
              project={project}
              ref={el => cardRefs.current[i] = el}
            />
          ))}
        </div>

        {/* Side Pagination */}
        <div className="projects-nav">
          {projects.map((_, i) => (
            <div
              key={i}
              ref={el => dotRefs.current[i] = el}
              onClick={() => {
                const st = ScrollTrigger.getAll().find(t => t.trigger === wrapperRef.current)
                if (st) {
                  const start = st.start
                  const end = st.end
                  const progress = i / (projects.length - 1)
                  const targetScroll = start + (end - start) * progress
                  window.scrollTo({ top: targetScroll, behavior: 'smooth' })
                }
              }}
              className={`nav-dot ${i === 0 ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>

      <style>{`
        .projects-wrapper { position: relative; width: 100%; height: auto; background: #07050f; }
        .projects-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; display: flex; flex-direction: column; }
        
        .projects-header { display: flex; justify-content: space-between; align-items: flex-end; padding: 6vh 6vw 4vh; z-index: 50; }
        .ph-eyebrow { font-family: 'DM Sans', sans-serif; font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(232,200,255,0.4); margin-bottom: 0.5rem; }
        .ph-title { font-family: 'Clash Display', sans-serif; font-size: clamp(32px, 4.5vw, 60px); font-weight: 700; color: #fff; margin: 0; letter-spacing: -0.02em; line-height: 1; }
        .gradient-text { background: linear-gradient(135deg, #e8c8ff 0%, #f9b8d4 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
        .ph-right { display: flex; flex-direction: column; align-items: flex-end; gap: 0.8rem; }
        .ph-counter { font-family: 'Clash Display', sans-serif; font-size: 24px; font-weight: 600; color: #fff; }
        .ph-sep { color: rgba(255,255,255,0.2); margin: 0 0.4rem; }
        .ph-total { color: rgba(255,255,255,0.3); font-size: 16px; }
        .ph-progress-bg { width: 140px; height: 2px; background: rgba(255,255,255,0.06); position: relative; overflow: hidden; border-radius: 99px; }
        .ph-progress-fill { position: absolute; left: 0; top: 0; height: 100%; width: 0%; background: linear-gradient(90deg, #e8c8ff, #f9b8d4); transition: width 0.2s ease-out; }

        .cards-container { position: relative; flex: 1; margin: 0 6vw 6vh; perspective: 1500px; }
        
        .pc-card { width: 100%; height: 100%; background: rgba(255,255,255,0.015); border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; padding: 2.5rem; display: flex; flex-direction: column; backdrop-filter: blur(12px); overflow: hidden; transform-style: preserve-3d; }
        .pc-canvas { position: absolute; right: -5%; top: 50%; transform: translateY(-50%); width: 50%; height: 80%; z-index: 1; pointer-events: none; }
        .pc-glow { position: absolute; right: -10%; top: 50%; transform: translateY(-50%); width: 60%; height: 100%; z-index: 0; pointer-events: none; border-radius: 50%; }

        .pc-topbar { display: flex; align-items: center; gap: 1.2rem; margin-bottom: 2rem; z-index: 2; }
        .pc-idx { font-family: 'Clash Display', sans-serif; font-size: 14px; color: #fff; opacity: 0.5; }
        .pc-topbar-line { flex: 1; height: 1px; background: rgba(255,255,255,0.06); }
        .pc-badge { font-family: 'DM Sans', sans-serif; font-size: 8px; letter-spacing: 0.2em; color: #f9b8d4; border: 1px solid rgba(249,184,212,0.3); padding: 3px 8px; border-radius: 4px; background: rgba(249,184,212,0.05); }
        .pc-yr { font-family: 'DM Sans', sans-serif; font-size: 11px; color: rgba(255,255,255,0.3); letter-spacing: 0.05em; }

        .pc-body { flex: 1; display: flex; flex-direction: column; z-index: 2; position: relative; }
        .pc-left { display: flex; flex-direction: column; position: relative; }
        .pc-bgnumber { position: absolute; left: -1rem; top: -1.5rem; font-family: 'Clash Display', sans-serif; font-size: 180px; font-weight: 700; opacity: 0.1; line-height: 1; z-index: -1; pointer-events: none; }
        .pc-role { font-family: 'DM Sans', sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.25em; color: rgba(255,255,255,0.6); margin-bottom: 0.8rem; }
        .pc-title { font-family: 'Clash Display', sans-serif; font-size: clamp(24px, 3.5vw, 44px); font-weight: 700; color: #fff; margin: 0 0 1.2rem; letter-spacing: -0.01em; }
        .pc-desc { font-family: 'Cormorant Garamond', serif; font-size: clamp(16px, 1.8vw, 22px); line-height: 1.35; color: rgba(255,255,255,0.6); margin-bottom: 2rem; max-width: 440px; font-style: italic; }
        
        .pc-tags { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-bottom: 2.5rem; }
        .pc-tag { font-family: 'DM Sans', sans-serif; font-size: 10px; padding: 6px 14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 99px; color: rgba(255,255,255,0.5); transition: all 0.3s; }
        .pc-tag:hover { color: var(--ac); border-color: var(--ac); background: rgba(255,255,255,0.06); }

        .pc-link { display: inline-flex; align-items: center; gap: 0.8rem; text-decoration: none; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; padding: 12px 24px; border: 1px solid rgba(255,255,255,0.15); border-radius: 99px; transition: all 0.3s; width: fit-content; }
        .pc-link:hover { background: var(--ac); border-color: var(--ac); color: #000; }
        .pc-status-wip { display: flex; align-items: center; gap: 0.6rem; }
        .pc-pulse { width: 6px; height: 6px; border-radius: 50%; display: inline-block; animation: pc-pulse 2s infinite; }
        @keyframes pc-pulse { 0% { transform: scale(0.95); opacity: 0.5; } 50% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(0.95); opacity: 0.5; } }
        .pc-no-link { font-family: 'DM Sans', sans-serif; font-size: 11px; color: rgba(255,255,255,0.25); letter-spacing: 0.05em; font-style: italic; }

        .pc-bottom-rule { position: absolute; bottom: 0; left: 10%; right: 10%; height: 1px; opacity: 0.5; }

        .projects-nav { position: absolute; right: 2.5vw; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 1.5rem; z-index: 100; }
        .nav-dot { width: 4px; height: 4px; background: rgba(255,255,255,0.15); border-radius: 50%; transition: all 0.4s ease; cursor: pointer; }
        .nav-dot.active { height: 24px; background: #e8c8ff; border-radius: 4px; box-shadow: 0 0 10px #e8c8ff; }

        @media (max-width: 900px) {
          .pc-card { padding: 1.5rem; }
          .pc-canvas { width: 70%; right: -15%; }
          .pc-bgnumber { font-size: 120px; top: -1rem; }
          .ph-right { display: none; }
          
          .pc-mobile-fallback { position: absolute; right: -5%; top: 50%; transform: translateY(-50%); width: 50%; height: 80%; z-index: 1; display: flex; align-items: center; justify-content: center; pointer-events: none; }
          .pc-fallback-orb { width: 120px; height: 120px; border-radius: 50%; background: var(--glow); filter: blur(40px); opacity: 0.15; animation: pulse 4s ease-in-out infinite; }
          @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.15; } 50% { transform: scale(1.2); opacity: 0.25; } }
        }
      `}</style>
    </div>
  )
}

export default Projects