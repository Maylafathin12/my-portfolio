import React, { useEffect, useRef, useLayoutEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import { useIsMobile } from '../../hooks/useIsMobile'
import { projectsData } from '../../data/projectsData'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

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

    const modelGroup = new THREE.Group()
    scene.add(modelGroup)

    const wireMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(glow).multiplyScalar(0.22),
      wireframe: true, transparent: true, opacity: 0.6,
    })
    const solidMat = new THREE.MeshPhongMaterial({
      color: new THREE.Color('#0d0820'),
      emissive: new THREE.Color(glow).multiplyScalar(0.07),
      transparent: true, opacity: 0.75, shininess: 90,
    })

    const addPart = (geo, scale = 1, pos = [0,0,0], rot = [0,0,0]) => {
      const w = new THREE.Mesh(geo, wireMat)
      const s = new THREE.Mesh(geo, solidMat)
      w.scale.setScalar(scale)
      s.scale.setScalar(scale * 0.96)
      w.position.set(...pos)
      s.position.set(...pos)
      w.rotation.set(...rot)
      s.rotation.set(...rot)
      modelGroup.add(w, s)
    }

    if (geometry === 'jar') {
      addPart(new THREE.CylinderGeometry(0.8, 0.8, 1.4, 32))
      addPart(new THREE.CylinderGeometry(0.6, 0.8, 0.3, 32), 1, [0, 0.85, 0])
      addPart(new THREE.CylinderGeometry(0.65, 0.65, 0.15, 32), 1, [0, 1.075, 0])
    } else if (geometry === 'headphones') {
      addPart(new THREE.TorusGeometry(0.8, 0.12, 16, 48, Math.PI), 1, [0, 0.2, 0])
      addPart(new THREE.CylinderGeometry(0.35, 0.35, 0.25, 32), 1, [-0.85, 0.1, 0], [0, 0, Math.PI/2])
      addPart(new THREE.CylinderGeometry(0.35, 0.35, 0.25, 32), 1, [0.85, 0.1, 0], [0, 0, Math.PI/2])
      addPart(new THREE.CylinderGeometry(0.04, 0.04, 0.7), 1, [0.95, -0.15, 0.3], [Math.PI/2, 0, 0])
      addPart(new THREE.SphereGeometry(0.08), 1, [0.95, -0.15, 0.65])
    } else if (geometry === 'frame') {
      addPart(new THREE.BoxGeometry(1.6, 0.2, 0.1), 1, [0, 1.0, 0])
      addPart(new THREE.BoxGeometry(1.6, 0.6, 0.1), 1, [0, -0.8, 0])
      addPart(new THREE.BoxGeometry(0.2, 1.6, 0.1), 1, [-0.7, 0.1, 0])
      addPart(new THREE.BoxGeometry(0.2, 1.6, 0.1), 1, [0.7, 0.1, 0])
    } else if (geometry === 'magnifier') {
      addPart(new THREE.TorusGeometry(0.7, 0.15, 16, 48), 1, [0, 0.5, 0])
      addPart(new THREE.CylinderGeometry(0.12, 0.12, 1.4, 16), 1, [0, -0.8, 0])
    } else if (geometry === 'dashboard') {
      addPart(new THREE.BoxGeometry(2.4, 1.6, 0.1))
      addPart(new THREE.BoxGeometry(2.4, 0.2, 0.12), 1, [0, 0.7, 0.02])
      addPart(new THREE.SphereGeometry(0.04), 1, [-1.0, 0.7, 0.1])
      addPart(new THREE.SphereGeometry(0.04), 1, [-0.85, 0.7, 0.1])
      addPart(new THREE.SphereGeometry(0.04), 1, [-0.7, 0.7, 0.1])
    } else if (geometry === 'chart') {
      addPart(new THREE.BoxGeometry(2.2, 0.1, 1.2), 1, [0, -0.8, 0])
      addPart(new THREE.BoxGeometry(0.4, 1.2, 0.4), 1, [-0.6, -0.15, 0])
      addPart(new THREE.BoxGeometry(0.4, 0.6, 0.4), 1, [0, -0.45, 0])
      addPart(new THREE.BoxGeometry(0.4, 1.8, 0.4), 1, [0.6, 0.15, 0])
    } else if (geometry === 'phone') {
      addPart(new THREE.BoxGeometry(1.0, 2.0, 0.15))
      addPart(new THREE.BoxGeometry(0.9, 1.8, 0.16), 1, [0, 0, 0.01])
      addPart(new THREE.BoxGeometry(0.3, 0.3, 0.17), 1, [-0.2, 0.7, -0.02])
    } else if (geometry === 'robot') {
      addPart(new THREE.BoxGeometry(1.2, 1.0, 1.0))
      addPart(new THREE.BoxGeometry(0.3, 0.2, 0.1), 1, [-0.3, 0.1, 0.51])
      addPart(new THREE.BoxGeometry(0.3, 0.2, 0.1), 1, [0.3, 0.1, 0.51])
      addPart(new THREE.CylinderGeometry(0.05, 0.05, 0.4), 1, [0, 0.6, 0])
      addPart(new THREE.SphereGeometry(0.15), 1, [0, 0.8, 0])
      addPart(new THREE.CylinderGeometry(0.2, 0.2, 0.2), 1, [-0.65, 0, 0], [0, 0, Math.PI/2])
      addPart(new THREE.CylinderGeometry(0.2, 0.2, 0.2), 1, [0.65, 0, 0], [0, 0, Math.PI/2])
    } else if (geometry === 'trashcan') {
      addPart(new THREE.CylinderGeometry(0.6, 0.5, 1.6, 24))
      addPart(new THREE.CylinderGeometry(0.65, 0.65, 0.1, 24), 1, [0, 0.85, 0])
      addPart(new THREE.TorusGeometry(0.15, 0.05, 8, 16), 1, [0, 0.95, 0], [Math.PI/2, 0, 0])
      addPart(new THREE.TorusGeometry(0.58, 0.04, 8, 24), 1, [0, 0.4, 0], [Math.PI/2, 0, 0])
      addPart(new THREE.TorusGeometry(0.54, 0.04, 8, 24), 1, [0, -0.4, 0], [Math.PI/2, 0, 0])
    } else if (geometry === 'box') {
      addPart(new THREE.BoxGeometry(1.5, 1.5, 1.5))
    } else if (geometry === 'otter') {
      // Body
      addPart(new THREE.CylinderGeometry(0.35, 0.35, 1.2, 32), 1, [0, -0.1, 0], [0, 0, Math.PI/2])
      // Head
      addPart(new THREE.SphereGeometry(0.35, 32, 32), 1, [0.7, 0.1, 0])
      // Ears
      addPart(new THREE.SphereGeometry(0.1, 16, 16), 1, [0.75, 0.35, 0.2])
      addPart(new THREE.SphereGeometry(0.1, 16, 16), 1, [0.75, 0.35, -0.2])
      // Snout
      addPart(new THREE.SphereGeometry(0.15, 16, 16), 1, [1.0, 0.05, 0])
      // Tail
      addPart(new THREE.CylinderGeometry(0.15, 0.02, 0.8, 16), 1, [-0.8, -0.2, 0], [0, 0, -Math.PI/2.5])
      // Paws
      addPart(new THREE.CylinderGeometry(0.08, 0.08, 0.3, 16), 1, [0.4, -0.3, 0.25], [Math.PI/4, 0, 0])
      addPart(new THREE.CylinderGeometry(0.08, 0.08, 0.3, 16), 1, [0.4, -0.3, -0.25], [-Math.PI/4, 0, 0])
      addPart(new THREE.CylinderGeometry(0.08, 0.08, 0.3, 16), 1, [-0.4, -0.3, 0.25], [Math.PI/4, 0, 0])
      addPart(new THREE.CylinderGeometry(0.08, 0.08, 0.3, 16), 1, [-0.4, -0.3, -0.25], [-Math.PI/4, 0, 0])
    } else if (geometry === 'sphere') {
      addPart(new THREE.SphereGeometry(1.3, 32, 32))
    } else if (geometry === 'torus') {
      addPart(new THREE.TorusGeometry(1.1, 0.38, 24, 60))
    } else if (geometry === 'icosahedron') {
      addPart(new THREE.IcosahedronGeometry(1.35, 1))
    } else if (geometry === 'octahedron') {
      addPart(new THREE.OctahedronGeometry(1.35, 0))
    } else if (geometry === 'dodecahedron') {
      addPart(new THREE.DodecahedronGeometry(1.3, 0))
    } else {
      addPart(new THREE.TorusKnotGeometry(0.9, 0.28, 128, 20))
    }

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
      modelGroup.rotation.y = t * 0.35
      modelGroup.rotation.x = t * 0.18
      modelGroup.position.y = Math.sin(t * 0.7) * 0.09
      renderer.render(scene, camera)
    }
    loop()

    return () => {
      cancelAnimationFrame(rafRef.current)
      observer.disconnect()
      window.removeEventListener('resize', resize)
      renderer.dispose()
      pGeo.dispose()
      modelGroup.children.forEach(c => {
        if (c.geometry) c.geometry.dispose()
      })
    }
  }, [geometry, glow, isMobile])
}

// ─── CARD ─────────────────────────────────────────────────────────────────────
const Card = React.forwardRef(({ project }, ref) => {
  const { t } = useLanguage()
  const tp = t('projects')
  const canvasRef = useRef(null)
  const isMobile = useIsMobile(900)
  useThreeScene(canvasRef, project.geometry, project.glow, isMobile)

  // Pisah state: satu untuk hover di title (fixed popup ikut mouse)
  const [titleHovered, setTitleHovered] = useState(false)
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
        {project.isComingSoon && <span className="pc-badge">{tp.comingSoon}</span>}
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
          <div className="pc-preview-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
            <Link
              to={`/project/${project.id}`}
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '10px',
                padding: '4px 12px',
                border: `1px solid ${project.glow}55`,
                borderRadius: '99px',
                color: project.glow,
                cursor: 'pointer',
                letterSpacing: '0.08em',
                textDecoration: 'none',
                transition: 'background 0.2s ease, border-color 0.2s ease',
                display: 'inline-block'
              }}
              onMouseEnter={e => e.currentTarget.style.background = `${project.glow}15`}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {tp.readCaseStudy}
            </Link>
          </div>
          {/* ─── END CTA AREA ─────────────────────────────────────────── */}
        </div>
      </div>

      <div className="pc-bottom-rule" style={{ background: `linear-gradient(90deg,transparent,${project.glow}28,transparent)` }} />
    </div>
  )
})

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const Projects = () => {
  const { language, t } = useLanguage()
  const tp = t('projects')
  const projects = projectsData[language]
  const isMobile = useIsMobile(900)
  const [activePreviewMobile, setActivePreviewMobile] = useState(null)
  const wrapperRef = useRef(null)
  const stickyRef = useRef(null)
  const headerRef = useRef(null)
  const progressFillRef = useRef(null)
  const counterRef = useRef(null)
  const cardRefs = useRef([])
  const dotRefs = useRef([])

  useLayoutEffect(() => {
    if (isMobile) return

    let ctx = gsap.context(() => {
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

            cards.forEach((card, ci) => {
              if (card) {
                card.style.pointerEvents = ci === idx ? 'auto' : 'none'
              }
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
          { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1 },
          i
        )
      })
    }, wrapperRef)

    return () => ctx.revert()
  }, [isMobile])

  // ─── MOBILE RENDER (STACKED CARDS) ──────────────────────────────────────────
  if (isMobile) {
    return (
      <div className="w-full bg-[#07050f] py-20 px-6 overflow-hidden">
        <div className="mb-12">
          <p className="font-['DM_Sans'] text-[10px] tracking-[0.3em] uppercase text-[#e8c8ff]/80 mb-3">{tp.selectedWorks}</p>
          <h2 className="font-['Clash_Display'] text-[38px] font-bold text-white tracking-tight leading-[1.1]">
            {tp.featured} <br /><span className="bg-gradient-to-br from-[#e8c8ff] to-[#f9b8d4] bg-clip-text text-transparent">{tp.projects}</span>
          </h2>
        </div>

        <div className="flex flex-col gap-6">
          {projects.map((project, i) => {
            // Ringkas deskripsi: ambil 1-2 kalimat pertama
            const sentences = project.desc.split('.')
            const shortDesc = (sentences[0] + (sentences.length > 1 ? '.' : '')).trim()

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 overflow-hidden flex flex-col"
              >
                {/* Background Glow */}
                <div
                  className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[180px] h-[180px] rounded-full blur-[45px] opacity-20 pointer-events-none"
                  style={{ background: project.glow }}
                />

                {/* Header (Role, Title, Number) */}
                <div className="flex justify-between items-start mb-5 relative z-10">
                  <div className="flex flex-col pr-4">
                    <span className="font-['DM_Sans'] text-[9px] uppercase tracking-[0.2em] text-white/50 mb-1.5">{project.role}</span>
                    <h3 className="font-['Clash_Display'] text-2xl font-bold text-white leading-[1.2] tracking-[-0.01em]">{project.title}</h3>
                  </div>
                  <span className="font-['Clash_Display'] text-sm font-semibold text-white/30 pt-1">{project.number}</span>
                </div>

                {/* Short Desc */}
                <p className="font-['Cormorant_Garamond'] italic text-[15px] text-white/70 leading-relaxed mb-6 relative z-10">
                  {shortDesc}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2 mb-7 relative z-10">
                  {project.tags.map((tag, t) => (
                    <span
                      key={t}
                      className="font-['DM_Sans'] text-[9px] uppercase tracking-[0.1em] px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer Actions */}
                <div className="mt-auto relative z-10 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="font-['DM_Sans'] text-[10px] tracking-wider text-white/30">{project.year.split(' ')[0]}</span>

                  <Link to={`/project/${project.id}`}
                    className="inline-flex items-center font-['DM_Sans'] text-[10px] font-medium tracking-[0.1em] uppercase px-5 py-2.5 rounded-full border border-[#e8c8ff]/30 text-[#e8c8ff] hover:bg-[#e8c8ff]/10 transition-colors">
                    {tp.readCaseStudy}
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    )
  }

  // ─── DESKTOP RENDER (3D STACKED) ──────────────────────────────────────────
  return (
    <div ref={wrapperRef} className="projects-wrapper">
      <div ref={stickyRef} className="projects-sticky">

        {/* Header Section */}
        <div ref={headerRef} className="projects-header">
          <div className="ph-left">
            <p className="ph-eyebrow" style={{ color: 'rgba(232,200,255,0.8)' }}>{tp.selectedWorks}</p>
            <h2 className="ph-title">{tp.featured} <span className="gradient-text">{tp.projects}</span></h2>
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
        
        .projects-header { display: flex; justify-content: space-between; align-items: flex-end; padding: clamp(3vh, 6vh, 8vh) clamp(4vw, 6vw, 8vw) clamp(2vh, 4vh, 5vh); z-index: 50; }
        .ph-eyebrow { font-family: 'DM Sans', sans-serif; font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(232,200,255,0.4); margin-bottom: 0.5rem; }
        .ph-title { font-family: 'Clash Display', sans-serif; font-size: clamp(24px, 4.5vw, 60px); font-weight: 700; color: #fff; margin: 0; letter-spacing: -0.02em; line-height: 1; }
        .gradient-text { background: linear-gradient(135deg, #e8c8ff 0%, #f9b8d4 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
        .ph-right { display: flex; flex-direction: column; align-items: flex-end; gap: 0.8rem; }
        .ph-counter { font-family: 'Clash Display', sans-serif; font-size: 24px; font-weight: 600; color: #fff; }
        .ph-sep { color: rgba(255,255,255,0.2); margin: 0 0.4rem; }
        .ph-total { color: rgba(255,255,255,0.3); font-size: 16px; }
        .ph-progress-bg { width: 140px; height: 2px; background: rgba(255,255,255,0.06); position: relative; overflow: hidden; border-radius: 99px; }
        .ph-progress-fill { position: absolute; left: 0; top: 0; height: 100%; width: 0%; background: linear-gradient(90deg, #e8c8ff, #f9b8d4); transition: width 0.2s ease-out; }

        .cards-container { position: relative; flex: 1; margin: 0 clamp(3vw, 6vw, 8vw) clamp(3vh, 6vh, 8vh); perspective: 1500px; }
        
        .pc-card { width: 100%; height: 100%; background: rgba(255,255,255,0.015); border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; padding: clamp(1.2rem, 2.5rem, 3rem); display: flex; flex-direction: column; backdrop-filter: blur(12px); transform-style: preserve-3d; }
        .pc-canvas { position: absolute; right: -5%; top: 50%; transform: translateY(-50%); width: 50%; height: 80%; z-index: 1; pointer-events: none; }
        .pc-glow { position: absolute; right: -10%; top: 50%; transform: translateY(-50%); width: 60%; height: 100%; z-index: 0; pointer-events: none; border-radius: 50%; }

        .pc-topbar { display: flex; align-items: center; gap: 1.2rem; margin-bottom: 2rem; z-index: 2; }
        .pc-idx { font-family: 'Clash Display', sans-serif; font-size: 14px; color: #fff; opacity: 0.5; }
        .pc-topbar-line { flex: 1; height: 1px; background: rgba(255,255,255,0.06); }
        .pc-badge { font-family: 'DM Sans', sans-serif; font-size: 8px; letter-spacing: 0.2em; color: #f9b8d4; border: 1px solid rgba(249,184,212,0.3); padding: 3px 8px; border-radius: 4px; background: rgba(249,184,212,0.05); }
        .pc-yr { font-family: 'DM Sans', sans-serif; font-size: 11px; color: rgba(255,255,255,0.3); letter-spacing: 0.05em; }

        .pc-body { flex: 1; display: flex; flex-direction: column; z-index: 2; position: relative; }
        .pc-left { display: flex; flex-direction: column; position: relative; }
        .pc-bgnumber { position: absolute; left: -1rem; top: -1.5rem; font-family: 'Clash Display', sans-serif; font-size: clamp(80px, 14vw, 180px); font-weight: 700; opacity: 0.1; line-height: 1; z-index: -1; pointer-events: none; }
        .pc-role { font-family: 'DM Sans', sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 0.25em; color: rgba(255,255,255,0.6); margin-bottom: 0.8rem; }
        .pc-title { font-family: 'Clash Display', sans-serif; font-size: clamp(20px, 3.5vw, 44px); font-weight: 700; color: #fff; margin: 0 0 1.2rem; letter-spacing: -0.01em; }
        .pc-desc { font-family: 'Cormorant Garamond', serif; font-size: clamp(20px, 2vw, 20px); font-weight: 500; line-height: 1.35; color: rgba(255,255,255,0.6); margin-bottom: 1rem; max-width: min(664px, 100%); font-style: italic; }
        .pc-tags { display: flex; flex-wrap: wrap; gap: 0.6rem; margin-bottom: 2.5rem; }
        .pc-tag { font-family: 'DM Sans', sans-serif; font-size: 10px; padding: 6px 14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 99px; color: rgba(255,255,255,0.5); transition: all 0.3s; }
        .pc-tag:hover { color: var(--ac); border-color: var(--ac); background: rgba(255,255,255,0.06); }

        .pc-link { display: inline-flex; align-items: center; gap: 0.8rem; text-decoration: none; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; padding: 10px 24px; border: 1px solid rgba(255,255,255,0.15); border-radius: 99px; transition: all 0.3s; width: fit-content; }
        .pc-link:hover { background: var(--ac); border-color: var(--ac); color: #000; }
        .pc-no-link { font-family: 'DM Sans', sans-serif; font-size: 11px; color: rgba(255,255,255,0.25); letter-spacing: 0.05em; font-style: italic; }
        
        .pc-preview-popup { opacity: 0; transform: translateY(10px); transition: opacity 0.25s ease, transform 0.25s ease; pointer-events: none; }
        .pc-preview-wrapper:hover .pc-preview-popup { opacity: 1; transform: translateY(0); }

        .pc-bottom-rule { position: absolute; bottom: 0; left: 10%; right: 10%; height: 1px; opacity: 0.5; }

        .projects-nav { position: absolute; right: 2.5vw; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 1.5rem; z-index: 100; }
        .nav-dot { width: 4px; height: 4px; background: rgba(255,255,255,0.15); border-radius: 50%; transition: all 0.4s ease; cursor: pointer; }
        .nav-dot.active { height: 24px; background: #e8c8ff; border-radius: 4px; box-shadow: 0 0 10px #e8c8ff; }

        @media (max-width: 900px) {
          .pc-canvas { width: 70%; right: -15%; }
          .ph-right { display: none; }
          .pc-mobile-fallback { position: absolute; right: -5%; top: 50%; transform: translateY(-50%); width: 50%; height: 80%; z-index: 1; display: flex; align-items: center; justify-content: center; pointer-events: none; }
          .pc-fallback-orb { width: 120px; height: 120px; border-radius: 50%; background: var(--glow); filter: blur(40px); opacity: 0.15; animation: pulse 4s ease-in-out infinite; }
          @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.15; } 50% { transform: scale(1.2); opacity: 0.25; } }
          
          /* Hide side nav earlier to prevent overlapping text on tablet */
          .projects-nav { display: none; }
        }

        @media (max-width: 768px) {
          .projects-header { padding: clamp(2vh, 4vh, 6vh) 1.5rem clamp(1.5vh, 3vh, 4vh); }
          .ph-title { font-size: clamp(28px, 6vw, 40px); }
          .cards-container { margin: 0 1.5rem 2rem; }
          .pc-card { padding: 1.25rem; border-radius: 16px; }
          .pc-topbar { margin-bottom: 1rem; gap: 0.8rem; }
          .pc-title { font-size: 22px; margin-bottom: 0.8rem; }
          .pc-desc { font-size: 13px; line-height: 1.45; font-weight: 1000; margin-bottom: 1.25rem; }
          .pc-tags { margin-bottom: 1.5rem; gap: 0.4rem; flex-wrap: wrap; }
          .pc-tag { font-size: 10px; padding: 4px 10px; }
          .pc-bgnumber { top: -0.5rem; left: -0.5rem; font-size: 80px; }
        }

        @media (min-width: 1920px) {
          .cards-container { max-width: 1600px; margin-left: auto; margin-right: auto; }
        }
      `}</style>

    </div>
  )
}

export default Projects
