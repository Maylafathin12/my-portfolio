import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import photo from '../../assets/may.webp'

gsap.registerPlugin(ScrollTrigger)

const orgs = [
  { short: 'GDSC', name: 'Google Developer Student Clubs', year: '2023', glow: '#a8c7ff' },
  { short: 'WTM', name: 'Google Women Techmakers', year: '2023', glow: '#ffb3ae' },
  { short: 'KPM', name: 'Kelompok Penelitian Mahasiswa', year: '2022–2024', glow: '#b8f5b0' },
  { short: 'SEA', name: 'Student English Activity', year: '2021–2023', glow: '#ffd6a5' },
]

const Education = () => {
  const sectionRef = useRef(null)
  const cardWrapRef = useRef(null)
  const cardRef = useRef(null)
  const leftRef = useRef(null)

  const [swingAngle, setSwingAngle] = useState(0)
  const pendulumRef = useRef({ angle: 0, velocity: 0, running: false })
  const rafRef = useRef(null)

  const isDragging = useRef(false)
  const dragStartX = useRef(0)
  const cardCurrentX = useRef(0)
  const hasAnimated = useRef(false)

  // ── Pendulum physics ──────────────────────────────────────────────
  const startPendulum = (initialAngle = 28) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    const state = pendulumRef.current
    state.angle = initialAngle
    state.velocity = 0
    state.running = true

    const tick = () => {
      if (!state.running) return
      state.velocity -= 0.65 * Math.sin((state.angle * Math.PI) / 180)
      state.velocity *= 0.96
      state.angle += state.velocity
      setSwingAngle(state.angle)
      if (Math.abs(state.angle) > 0.25 || Math.abs(state.velocity) > 0.15) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        state.angle = 0
        state.running = false
        setSwingAngle(0)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  const stopPendulum = () => {
    pendulumRef.current.running = false
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
  }

  // ── Drag ──────────────────────────────────────────────────────────
  const onDragStart = (e) => {
    e.preventDefault()
    stopPendulum()
    isDragging.current = true
    dragStartX.current = (e.touches ? e.touches[0].clientX : e.clientX) - cardCurrentX.current
    if (cardRef.current) cardRef.current.style.cursor = 'grabbing'
  }

  const onDragMove = (e) => {
    if (!isDragging.current) return
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const newX = clientX - dragStartX.current
    cardCurrentX.current = newX
    gsap.set(cardWrapRef.current, { x: newX })
    const ratio = Math.max(-1, Math.min(1, newX / (window.innerWidth * 0.3)))
    setSwingAngle(ratio * 38)
  }

  const onDragEnd = () => {
    if (!isDragging.current) return
    isDragging.current = false
    if (cardRef.current) cardRef.current.style.cursor = 'grab'

    const releaseAngle = Math.max(-1, Math.min(1, cardCurrentX.current / (window.innerWidth * 0.3))) * 38

    gsap.to(cardWrapRef.current, {
      x: 0,
      duration: 1.6,
      ease: 'elastic.out(1, 0.42)',
      onUpdate: () => {
        cardCurrentX.current = gsap.getProperty(cardWrapRef.current, 'x')
      },
      onComplete: () => { cardCurrentX.current = 0 },
    })

    startPendulum(releaseAngle)
  }

  // ── Mouse tilt ────────────────────────────────────────────────────
  const onMouseMove = (e) => {
    if (isDragging.current) return
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    gsap.to(cardRef.current, { rotateY: x * 20, rotateX: -y * 14, duration: 0.35, ease: 'power2.out' })
  }

  const onMouseLeave = () => {
    if (isDragging.current) return
    gsap.to(cardRef.current, { rotateY: 0, rotateX: 0, duration: 0.9, ease: 'elastic.out(1, 0.5)' })
  }

  // ── Global listeners ──────────────────────────────────────────────
  useEffect(() => {
    const move = (e) => onDragMove(e)
    const up = () => onDragEnd()
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
    window.addEventListener('touchmove', move, { passive: true })
    window.addEventListener('touchend', up)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
      window.removeEventListener('touchmove', move)
      window.removeEventListener('touchend', up)
    }
  }, [])

  // ── Scroll entrance ───────────────────────────────────────────────
  useEffect(() => {
    gsap.set(cardWrapRef.current, { y: -360, opacity: 0 })
    gsap.set(leftRef.current, { opacity: 0, x: -50 })

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 65%',
      once: true,
      onEnter: () => {
        if (hasAnimated.current) return
        hasAnimated.current = true
        gsap.to(cardWrapRef.current, {
          y: 0, opacity: 1, duration: 1.1, ease: 'power4.out',
          onComplete: () => startPendulum(28),
        })
        gsap.to(leftRef.current, { opacity: 1, x: 0, duration: 1, ease: 'power3.out', delay: 0.5 })
      },
    })

    return () => { trigger.kill(); stopPendulum() }
  }, [])

  const angle = Math.max(-40, Math.min(40, swingAngle))
  const shift = angle * 1.3

  // ── Lanyard SVG ───────────────────────────────────────────────────
  const LanyardSVG = () => (
    <svg width="110" height="205" viewBox="0 0 110 205" fill="none" style={{ display: 'block', margin: '0 auto' }}>
      <path
        d={`M 28 0 Q ${46 + shift} 95 ${52 + shift * 0.45} 172 Q ${54 + shift * 0.25} 190 55 202`}
        stroke="rgba(232,200,255,0.22)" strokeWidth="4.5" strokeLinecap="round" fill="none"
      />
      <path
        d={`M 82 0 Q ${64 + shift} 95 ${58 + shift * 0.45} 172 Q ${56 + shift * 0.25} 190 55 202`}
        stroke="rgba(232,200,255,0.22)" strokeWidth="4.5" strokeLinecap="round" fill="none"
      />
      {[16, 38, 60, 82, 106, 130, 154, 174].map((t, i) => {
        const frac = t / 202
        const mx = 55 + shift * (1 - frac)
        return <line key={i} x1={mx - 10 + frac * 5} y1={t} x2={mx + 10 - frac * 5} y2={t + 5} stroke="rgba(232,200,255,0.09)" strokeWidth="1.2" />
      })}
      <ellipse cx="55" cy="197" rx="7" ry="5" stroke="rgba(200,180,255,0.38)" strokeWidth="1.5" fill="rgba(155,114,207,0.14)" />
      <rect x="51.5" y="198" width="7" height="6" rx="1.5" fill="rgba(200,180,255,0.28)" stroke="rgba(232,200,255,0.22)" strokeWidth="0.5" />
    </svg>
  )

  return (
    <section ref={sectionRef} className="edu-section">
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 40% 50% at 20% 50%, rgba(30,15,60,0.18) 0%, transparent 70%)' }} />

      <p className="edu-eyebrow">✦ Education & Organizations</p>

      <div className="edu-grid">

        {/* LEFT */}
        <div ref={leftRef} style={{ opacity: 0 }}>
          <p className="edu-period">2021 – 2025</p>
          <h2 className="edu-degree">
            B.Comp.Sc.<br />
            <span className="edu-degree-grad">Information Technology</span>
          </h2>
          <p className="edu-university">Universitas Muhammadiyah Yogyakarta</p>

          <div style={{ width: 36, height: 1, background: 'rgba(232,200,255,0.18)', marginBottom: '2rem' }} />

          <div className="edu-achievements">
            {[
              { label: 'Bangkit Academy 2024', sub: 'Google × GoTo × Traveloka — Android Learning Path', accent: '#a8c7ff' },
              { label: 'Teaching Assistant', sub: 'Software Testing & Quality Assurance (STQA)', accent: '#c8b4ff' },
            ].map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: a.accent, marginTop: 6, flexShrink: 0, boxShadow: `0 0 8px ${a.accent}88` }} />
                <div>
                  <p className="edu-achievement-label">{a.label}</p>
                  <p className="edu-achievement-sub">{a.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="edu-orgs-label">Organizations</p>
          <div className="edu-orgs-grid">
            {orgs.map((org, i) => (
              <div
                key={i}
                className="edu-org-card"
                style={{ background: org.glow + '07', border: '1px solid ' + org.glow + '18' }}
                onMouseEnter={e => { e.currentTarget.style.background = org.glow + '14'; e.currentTarget.style.borderColor = org.glow + '40'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = org.glow + '07'; e.currentTarget.style.borderColor = org.glow + '18'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', color: org.glow, margin: '0 0 4px', textTransform: 'uppercase' }}>{org.short}</p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.65)', margin: '0 0 3px', lineHeight: 1.3 }}>{org.name}</p>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, color: org.glow, opacity: 0.5, margin: 0 }}>{org.year}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Lanyard + Card */}
        <div
          ref={cardWrapRef}
          className="edu-card-wrap"
        >
          {/* Lanyard swings with card */}
          <div style={{ transform: `rotate(${angle * 0.85}deg)`, transformOrigin: 'top center', width: 110, pointerEvents: 'none', userSelect: 'none' }}>
            <LanyardSVG />
          </div>

          {/* Card */}
          <div
            ref={cardRef}
            onMouseDown={onDragStart}
            onTouchStart={onDragStart}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            className="edu-card"
            style={{ transform: `rotate(${angle * 0.85}deg)` }}
          >
            {/* Holo shimmer */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none', background: 'linear-gradient(135deg, transparent 35%, rgba(232,200,255,0.05) 50%, transparent 65%)', borderRadius: 20 }} />

            {/* Top bar */}
            <div style={{ background: 'linear-gradient(90deg, rgba(155,114,207,0.28), rgba(200,180,255,0.12))', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(232,200,255,0.08)' }}>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 8, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(232,200,255,0.7)' }}>Portofolio 2026</span>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#9b72cf', boxShadow: '0 0 7px #9b72cf' }} />
            </div>

            {/* Photo */}
            <div style={{ padding: '18px 18px 10px', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: 114, height: 138, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(232,200,255,0.14)', boxShadow: '0 8px 24px rgba(0,0,0,0.55)', position: 'relative' }}>
                <img src={photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', pointerEvents: 'none', userSelect: 'none' }} draggable={false} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(10,6,20,0.45) 100%)' }} />
              </div>
            </div>

            {/* Info */}
            <div style={{ padding: '0 18px 18px', textAlign: 'center' }}>
              <h3 style={{ fontFamily: 'Clash Display, Arial Black, sans-serif', fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 4px' }}>Mayla</h3>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 12, color: 'rgba(232,200,255,0.9)', margin: '0 0 14px' }}>Design Engineer</p>

              <div style={{ width: '100%', height: 1, background: 'rgba(232,200,255,0.2)', marginBottom: 14 }} />

              {[
                { label: 'Institution', value: 'UMY' },
                { label: 'Major', value: 'Info. Technology' },
                { label: 'Year', value: '2021 – 2025' },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(232,200,255,0.8)' }}>{row.label}</span>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'rgba(255,255,255,1)' }}>{row.value}</span>
                </div>
              ))}

              <div style={{ width: '100%', height: 1, background: 'rgba(232,200,255,0.08)', margin: '12px 0' }} />

              <div style={{ display: 'flex', gap: 2, justifyContent: 'center', opacity: 0.18 }}>
                {Array.from({ length: 26 }).map((_, i) => (
                  <div key={i} style={{ width: i % 3 === 0 ? 2 : 1, height: i % 5 === 0 ? 18 : 13, background: 'rgba(232,200,255,0.9)', borderRadius: 1 }} />
                ))}
              </div>
              <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 7, letterSpacing: '0.2em', color: 'rgba(232,200,255,0.18)', margin: '5px 0 0' }}>MYL-IT-2025-001</p>
            </div>
          </div>

          <p className="edu-drag-hint">← drag me →</p>
        </div>
      </div>

      <style>{`
        .edu-section {
          background: #07040f;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: clamp(8vh, 10vh, 12vh) clamp(4vw, 6vw, 8vw);
          position: relative;
          overflow: hidden;
        }

        .edu-eyebrow {
          position: absolute;
          top: clamp(4vh, 6vh, 8vh);
          left: clamp(4vw, 6vw, 8vw);
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(232,200,255,0.8);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .edu-grid {
          width: 100%;
          max-width: 1100px;
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 5vw;
          align-items: center;
        }

        .edu-period {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(232,200,255,0.7);
          margin: 0 0 0.6rem;
        }
        .edu-degree {
          font-family: 'Clash Display', 'Arial Black', sans-serif;
          font-size: clamp(22px, 3.5vw, 52px);
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.03em;
          line-height: 1.0;
          margin: 0 0 0.5rem;
        }
        .edu-degree-grad {
          background: linear-gradient(120deg, #e8c8ff, #c8b4ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .edu-university {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: clamp(13px, 1.6vw, 20px);
          color: rgba(232,200,255,0.6);
          margin: 0 0 2rem;
        }

        .edu-achievements {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          margin-bottom: 3rem;
        }
        .edu-achievement-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: rgba(255,255,255,0.8);
          margin: 0 0 3px;
        }
        .edu-achievement-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          color: rgba(232,200,255,0.38);
          margin: 0;
          line-height: 1.6;
        }

        .edu-orgs-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(232,200,255,0.3);
          margin: 0 0 1.2rem;
        }
        .edu-orgs-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        .edu-org-card {
          padding: 0.8rem 1rem;
          border-radius: 12px;
          cursor: default;
          transition: all 0.3s ease;
        }

        /* RIGHT column */
        .edu-card-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          opacity: 0;
        }
        .edu-card {
          width: 250px;
          border-radius: 20px;
          background: linear-gradient(145deg, rgba(30,18,60,0.97) 0%, rgba(12,8,28,0.99) 100%);
          border: 1px solid rgba(232,200,255,0.12);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          overflow: hidden;
          box-shadow: 0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(232,200,255,0.05), inset 0 1px 0 rgba(232,200,255,0.08);
          transform-style: preserve-3d;
          cursor: grab;
          position: relative;
          user-select: none;
          transform-origin: top center;
        }
        .edu-drag-hint {
          font-family: 'DM Sans', sans-serif;
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(232,200,255,0.15);
          margin: 14px 0 0;
          user-select: none;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .edu-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          .edu-card-wrap {
            order: -1;
          }
          .edu-eyebrow {
            position: relative;
            top: auto;
            left: auto;
            margin-bottom: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .edu-orgs-grid {
            grid-template-columns: 1fr;
          }
          .edu-card {
            width: min(250px, 82vw);
          }
        }
      `}</style>
    </section>
  )
}

export default Education