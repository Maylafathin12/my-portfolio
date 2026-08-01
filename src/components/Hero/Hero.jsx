import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import maylaPhoto from '../../assets/may.png'
import { useIsMobile } from '../../hooks/useIsMobile'
import { useLanguage } from '../../context/LanguageContext'

const Hero = () => {
  const { t } = useLanguage()
  const th = t('hero')
  const sectionRef = useRef(null)
  const figureRef = useRef(null)
  const canvasRef = useRef(null)
  const nameRef = useRef(null)
  const roleRef = useRef(null)
  const leftInfoRef = useRef(null)
  const rightInfoRef = useRef(null)
  const badgeRef = useRef(null)
  const gridRef = useRef(null)
  const rafRef = useRef(null)
  const isVisibleRef = useRef(false)
  const isMobile = useIsMobile(768)
  const [showBanner, setShowBanner] = useState(true)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting
    }, { threshold: 0 })
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!isMobile && canvas) {
      const ctx = canvas.getContext('2d')
      const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
      resize()
      window.addEventListener('resize', resize)

      const particles = Array.from({ length: 120 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.2,
        alpha: Math.random() * 0.35 + 0.05,
        speed: Math.random() * 0.2 + 0.05,
        drift: (Math.random() - 0.5) * 0.1,
      }))

      const drawParticles = () => {
        rafRef.current = requestAnimationFrame(drawParticles)
        if (!isVisibleRef.current) return
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        particles.forEach(p => {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(232,200,255,${p.alpha})`
          ctx.fill()
          p.y -= p.speed
          p.x += p.drift
          if (p.y < -5) { p.y = canvas.height + 5; p.x = Math.random() * canvas.width }
        })
      }
      drawParticles()
    }

    const tl = gsap.timeline({ delay: 0.1 })

    tl.fromTo(gridRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 2, ease: 'power2.out' }
    )
    tl.fromTo(figureRef.current,
      { opacity: 0, y: 40, scale: 0.92 },
      { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: 'power3.out' },
      '-=1.5'
    )
    tl.fromTo(badgeRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.8'
    )
    tl.fromTo(nameRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
      '-=0.6'
    )
    tl.fromTo(roleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.6'
    )
    tl.fromTo(leftInfoRef.current,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.5'
    )
    tl.fromTo(rightInfoRef.current,
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.8'
    )

    const onMouse = (e) => {
      const dx = (e.clientX / window.innerWidth - 0.5) * 18
      const dy = (e.clientY / window.innerHeight - 0.5) * 10
      gsap.to(figureRef.current, { x: dx, y: dy, duration: 1.4, ease: 'power2.out' })
    }
    if (!isMobile) {
      window.addEventListener('mousemove', onMouse)
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', () => { })
      window.removeEventListener('mousemove', onMouse)
    }
  }, [isMobile])

  return (
    <section ref={sectionRef} className="hero-section">

      {/* ── MOBILE BANNER ── */}
      {isMobile && showBanner && (
        <div
          onClick={() => setShowBanner(false)}
          style={{
            position: 'fixed',
            bottom: '5.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 999,
            background: 'rgba(232,200,255,0.07)',
            border: '1px solid rgba(232,200,255,0.2)',
            borderRadius: '999px',
            padding: '8px 18px',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            whiteSpace: 'nowrap',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '10px',
            letterSpacing: '0.15em',
            color: 'rgba(232,200,255,0.7)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            userSelect: 'none',
          }}
        >
          <span>{th.mobileBanner}</span>
          <span style={{ opacity: 0.5, fontSize: '12px' }}>✕</span>
        </div>
      )}

      {/* Particles */}
      {!isMobile && <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />}

      {/* Subtle grid lines */}
      <div ref={gridRef} style={{
        position: 'absolute', inset: 0, zIndex: 1, opacity: 0, pointerEvents: 'none',
      }}>
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'linear-gradient(to bottom, transparent, rgba(232,200,255,0.06) 20%, rgba(232,200,255,0.06) 80%, transparent)' }} />
        <div style={{ position: 'absolute', top: '52%', left: 0, right: 0, height: 1, background: 'linear-gradient(to right, transparent, rgba(232,200,255,0.06) 20%, rgba(232,200,255,0.06) 80%, transparent)' }} />
        <div style={{ position: 'absolute', bottom: '14%', left: 0, right: 0, height: 1, background: 'linear-gradient(to right, transparent, rgba(232,200,255,0.08) 20%, rgba(232,200,255,0.08) 80%, transparent)' }} />
      </div>

      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: '50%',
        transform: 'translateX(-50%)',
        width: '70vw', height: '60vh',
        background: 'radial-gradient(ellipse at 50% 100%, rgba(155,114,207,0.25) 0%, rgba(200,150,255,0.05) 50%, transparent 70%)',
        pointerEvents: 'none', zIndex: 1,
      }} />

      {/* ── MAIN CONTENT WRAPPER ── */}
      <div className="hero-content">

        {/* ── LEFT INFO ── */}
        <div ref={leftInfoRef} className="hero-left-info">
          <div className="hero-stat">
            <p className="hero-stat-label">{th.projectExp}</p>
            <p className="hero-stat-num">2+</p>
            <p className="hero-stat-sub">{th.yearsBuilding}</p>
          </div>
          <div className="hero-divider-v" />
          <div className="hero-stat">
            <p className="hero-stat-label">{th.awards}</p>
            <p className="hero-stat-num">6✦</p>
            <p className="hero-stat-sub">{th.nationalWins}</p>
          </div>
          <div className="hero-divider-v" />
          <div className="hero-stat">
            <p className="hero-stat-label">{th.basedIn}</p>
            <p className="hero-stat-loc">Yogyakarta</p>
            <p className="hero-stat-sub">{th.indonesia}</p>
          </div>
        </div>

        {/* ── CENTER: FIGURE & TEXT ── */}
        <div className="hero-center">
          <div ref={figureRef} className="hero-figure">
            <div className="hero-figure-aura" />
            <img
              src={maylaPhoto}
              alt="Mayla Fathin Nadhifa Ulya"
              className="hero-figure-img"
              draggable={false}
            />
          </div>

          <div className="hero-text-wrap">
            <div ref={badgeRef} className="hero-badge">
              <span className="hero-badge-dot" />
              {th.available}
            </div>

            <h1 ref={nameRef} className="hero-name">
              <span className="hero-name-first">MAYLA FATHIN </span>
              <span className="hero-name-gradient">NADHIFA ULYA</span>
            </h1>

            <div ref={roleRef} className="hero-role">
              <span>{th.role1}</span>
              <span className="hero-role-dot" />
              <span>{th.role2}</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT INFO ── */}
        <div ref={rightInfoRef} className="hero-right-info">
          {[
            { label: th.coreStack, value: 'React · Vite · TypeScript' },
            { label: th.creative3D, value: 'Three.js · GSAP · Framer-Motion' },
            { label: th.designTools, value: 'Figma · UI/UX' },
            { label: th.readyToShip, value: th.readyToShipSub },
          ].map((item, i) => (
            <div key={i} className="hero-right-item">
              <p className="hero-right-label">{item.label}</p>
              <p className="hero-right-value">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── BOTTOM ELEMENTS ── */}
      <div className="hero-bottom-area">
        {/* Scroll hint - kiri bawah, nggak bentrok sama nama */}
        <div className="hero-scroll-hint">
          <span className="hero-scroll-text">{th.scrollToExplore}</span>
          <div className="hero-scroll-line" />
        </div>

        {/* CV Download button */}
        <a href={`${import.meta.env.BASE_URL}cv-mayla.pdf`} download="cv-mayla.pdf" className="hero-cv-btn">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v7M3 5l3 3 3-3M1 10h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {th.getResume}
        </a>
      </div>

      <style>{`
        .hero-section {
          position: relative;
          width: 100%;
          min-height: 100svh;
          overflow: hidden;
          background: #0a0814;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
        }

        .hero-content {
          position: relative;
          width: 100%;
          flex: 1;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          padding: 0 4vw;
          z-index: 5;
          pointer-events: none;
        }
        .hero-content > * { pointer-events: auto; }

        .hero-left-info {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          margin-bottom: 25vh;
          opacity: 0;
        }
        .hero-stat { display: flex; flex-direction: column; }
        .hero-stat-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(232,200,255,1);
          margin: 0 0 4px;
        }
        .hero-stat-num {
          font-family: 'Clash Display', sans-serif;
          font-size: clamp(28px, 3.5vw, 44px);
          font-weight: 700;
          color: #fff;
          margin: 0 0 2px;
          line-height: 1;
          letter-spacing: -0.02em;
        }
        .hero-stat-loc {
          font-family: 'Clash Display', sans-serif;
          font-size: clamp(14px, 1.8vw, 20px);
          font-weight: 700;
          color: #fff;
          margin: 0 0 2px;
          line-height: 1.2;
          letter-spacing: -0.01em;
        }
        .hero-stat-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: rgba(255,255,255,0.7);
          margin: 0;
        }
        .hero-divider-v {
          width: 1px;
          height: 30px;
          background: linear-gradient(to bottom, rgba(232,200,255,1), transparent);
          margin-left: 2px;
        }

        .hero-center {
          position: absolute;
          left: 50%;
          bottom: 0;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        .hero-figure {
          width: clamp(260px, 40vw, 540px);
          opacity: 0;
          display: flex;
          justify-content: center;
          position: relative;
          z-index: 2;
        }
        .hero-figure-aura {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80%;
          height: 80%;
          background: radial-gradient(circle, rgba(222, 197, 255, 0.4) 0%, transparent 70%);
          filter: blur(40px);
          z-index: -1;
          pointer-events: none;
        }
        .hero-figure-img {
          width: 100%;
          height: auto;
          object-fit: cover;
          object-position: top center;
          display: block;
          mask-image: linear-gradient(to bottom, black 55%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, black 55%, transparent 100%);
        }

        .hero-text-wrap {
          position: absolute;
          bottom: 12%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          text-align: center;
          width: max-content;
          max-width: 90vw;
          z-index: 10;
        }

        .hero-badge {
          opacity: 0;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(184,245,176,0.06);
          border: 1px solid rgba(184,245,176,0.25);
          border-radius: 999px;
          padding: 5px 14px;
          margin-bottom: 0.2rem;
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(9px, 1vw, 10px);
          letter-spacing: 0.15em;
          color: rgba(184,245,176,0.8);
          white-space: nowrap;
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }
        .hero-badge-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #b8f5b0;
          display: inline-block;
          box-shadow: 0 0 8px #b8f5b0;
          flex-shrink: 0;
        }

        .hero-name {
          opacity: 0;
          font-family: 'Clash Display', sans-serif;
          font-size: clamp(40px, 8vw, 90px);
          font-weight: 700;
          line-height: 0.9;
          letter-spacing: -0.03em;
          margin: 0;
          text-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .hero-name-first { color: #fff; display: block; }
        .hero-name-gradient {
          display: block;
          background: linear-gradient(135deg, #e8c8ff 0%, #f9b8d4 55%, #c8b4ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-role {
          opacity: 0;
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(10px, 1.2vw, 14px);
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(255,255,255,1);
          flex-wrap: wrap;
          justify-content: center;
        }
        .hero-role-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: rgba(232,200,255,0.4);
          display: inline-block;
          flex-shrink: 0;
        }

        .hero-right-info {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          align-items: flex-end;
          margin-bottom: 25vh;
          opacity: 0;
        }
        .hero-right-item { text-align: right; }
        .hero-right-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 9px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(232,200,255,0.8);
          margin: 0 0 3px;
        }
        .hero-right-value {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(11px, 1.2vw, 14px);
          font-weight: 500;
          color: rgba(255,255,255,0.8);
          margin: 0;
        }

        /* ── BOTTOM AREA — scroll kiri, CV kanan ── */
        .hero-bottom-area {
          position: absolute;
          bottom: 2.5rem;
          width: 100%;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          padding-left: 4vw;
          z-index: 10;
          pointer-events: none;
        }

        .hero-scroll-hint {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          opacity: 0;
          animation: heroFadeIn 1s 3s forwards;
        }
        .hero-scroll-text {
          font-size: 9px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.2);
          font-family: 'DM Sans', sans-serif;
        }
        .hero-scroll-line {
          width: 1px;
          height: 36px;
          background: linear-gradient(to bottom, rgba(232,200,255,0.5), transparent);
          animation: scrollPulse 2s ease-in-out infinite;
        }

        .hero-cv-btn {
          position: absolute;
          right: 4vw;
          pointer-events: auto;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(232,200,255,0.9);
          text-decoration: none;
          border: 1px solid rgba(232,200,255,0.25);
          border-radius: 999px;
          padding: 10px 20px;
          background: rgba(232,200,255,0.05);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          transition: all 0.3s ease;
          opacity: 0;
          animation: heroFadeIn 1s 3s forwards;
          white-space: nowrap;
        }
        .hero-cv-btn:hover {
          color: #fff;
          border-color: rgba(232,200,255,0.6);
          background: rgba(232,200,255,0.12);
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }

        @keyframes scrollPulse {
          0%, 100% { opacity: 0.2; transform: scaleY(0.8); }
          50% { opacity: 1; transform: scaleY(1); }
        }
        @keyframes heroFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 1024px) {
          .hero-left-info { margin-bottom: 20vh; }
          .hero-right-info { margin-bottom: 20vh; }
          .hero-text-wrap { bottom: 15%; }
        }

        @media (max-width: 768px) {
          .hero-content {
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            padding: 12vh 5vw 0;
            gap: 2rem;
          }
          .hero-center {
            position: relative;
            left: 0;
            transform: none;
            order: 1;
            margin-bottom: 1rem;
          }
          .hero-figure { width: clamp(220px, 65vw, 320px); }
          .hero-text-wrap { position: relative; bottom: 0; margin-top: -10%; }
          .hero-left-info {
            order: 2;
            flex-direction: row;
            flex-wrap: wrap;
            gap: 1.5rem;
            margin-bottom: 0;
            width: 100%;
            justify-content: center;
            background: rgba(255,255,255,0.02);
            border: 1px solid rgba(255,255,255,0.05);
            padding: 1rem;
            border-radius: 16px;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
          }
          .hero-divider-v { width: 1px; height: auto; background: rgba(255,255,255,0.1); }
          .hero-stat { text-align: center; }
          .hero-stat-num { font-size: 24px; }
          .hero-stat-loc { font-size: 14px; }
          .hero-right-info {
            order: 3;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
            width: 100%;
            margin-bottom: 12vh;
            align-items: start;
            padding: 0 1rem;
          }
          .hero-right-item { text-align: left; }
          .hero-scroll-hint { display: none; }
          .hero-cv-btn {
            position: fixed;
            bottom: 2rem;
            right: 50%;
            transform: translateX(50%);
            width: max-content;
            padding: 12px 28px;
            background: rgba(155,114,207,0.15);
            border: 1px solid rgba(232,200,255,0.4);
            box-shadow: 0 8px 32px rgba(0,0,0,0.4);
            animation: none;
            opacity: 1;
            z-index: 99;
          }
          .hero-cv-btn:hover { transform: translateX(50%) translateY(-2px); }
        }

        @media (max-width: 480px) {
          .hero-left-info { gap: 1rem; padding: 0.8rem; }
          .hero-stat-label { font-size: 8px; }
          .hero-stat-sub { font-size: 10px; }
          .hero-right-info { grid-template-columns: 1fr; }
          .hero-right-item { text-align: center; }
        }

        @media (min-width: 1920px) {
          .hero-content { max-width: 1600px; margin: 0 auto; padding: 0 2rem; }
          .hero-cv-btn { right: calc(50% - 760px); }
        }
      `}</style>
    </section>
  )
}

export default Hero