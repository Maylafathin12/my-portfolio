import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../../context/LanguageContext'
import { useAboutUnlock } from '../../context/AboutUnlockContext'

gsap.registerPlugin(ScrollTrigger)

import { Link } from 'react-router-dom'

const About = () => {
  const { t, language } = useLanguage()
  const { isUnlocked, unlock, shakeTrigger } = useAboutUnlock()
  const ta = t('about')
  const sectionRef = useRef(null)
  const wordsRef = useRef([])
  const btnRef = useRef(null)
  const [isShaking, setIsShaking] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      wordsRef.current.forEach((word) => {
        if (!word) return
        gsap.fromTo(word,
          { opacity: 0.12, color: 'rgba(255,255,255,0.12)' },
          {
            opacity: 1,
            color: word.dataset.highlight === 'true'
              ? '#e8c8ff'
              : 'rgba(255,255,255,0.95)',
            duration: 0.4,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: word,
              start: 'top 72%',
              end: 'top 40%',
              scrub: 1,
            }
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [language, ta.words])

  useEffect(() => {
    if (!shakeTrigger || !btnRef.current) return

    setIsShaking(true)
    gsap.fromTo(
      btnRef.current,
      { x: 0, rotation: 0, scale: 1 },
      {
        keyframes: [
          { x: -14, rotation: -4, scale: 1.06, duration: 0.07 },
          { x: 14, rotation: 4, scale: 1.08, duration: 0.07 },
          { x: -12, rotation: -3, scale: 1.06, duration: 0.07 },
          { x: 12, rotation: 3, scale: 1.08, duration: 0.07 },
          { x: -8, rotation: -2, duration: 0.07 },
          { x: 8, rotation: 2, duration: 0.07 },
          { x: 0, rotation: 0, scale: 1, duration: 0.1 }
        ],
        ease: 'power2.out',
        onComplete: () => setIsShaking(false)
      }
    )
  }, [shakeTrigger])

  const handleUnlockClick = () => {
    unlock()
  }

  return (
    <section
      ref={sectionRef}
      className="about-section"
    >
      <p className="about-eyebrow">{ta.eyebrow}</p>

      <div className="about-words-wrap">
        {ta.words && ta.words.map((w, i) => (
          <span
            key={i}
            ref={el => wordsRef.current[i] = el}
            data-highlight={w.highlight}
            className="about-word"
          >
            {w.text}
          </span>
        ))}
      </div>

      <div className="about-sub">
        <p className="about-quote">
          {ta.quote}
        </p>
        <p className="about-attribution">- Mayla, 2026</p>

        {!isUnlocked && (
          <p className="about-unlock-hint" aria-live="polite">
            {language === 'en' ? '↑ Press this to continue ↓' : '↑ Tekan ini dulu buat lanjut ↓'}
          </p>
        )}

        <Link
          ref={btnRef}
          to="/uses"
          className={`about-unlock-btn ${!isUnlocked ? 'locked' : ''} ${isShaking ? 'shake-burst' : ''}`}
          onClick={handleUnlockClick}
        >
          <span className="btn-text">
            {ta.buttonUnlock}
          </span>
          <span className="btn-glow"></span>
          {!isUnlocked && <span className="btn-ring-pulse" aria-hidden="true" />}
        </Link>
      </div>

      <style>{`
        .about-section {
          min-height: 100vh;
          background: #0d0a14;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: clamp(6vh, 10vh, 12vh) clamp(5vw, 8vw, 10vw);
        }

        .about-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(232, 200, 255, 0.15);
          margin-bottom: clamp(2rem, 4rem, 5rem);
          align-self: flex-start;
        }

        .about-words-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4em 0.5em;
          max-width: min(1100px, 100%);
          align-self: flex-start;
        }

        .about-word {
          font-family: 'Clash Display', sans-serif;
          font-size: clamp(40px, 5.5vw, 100px);
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: rgba(255,255,255,0.12);
          transition: color 0.3s;
          cursor: default;
        }

        .about-sub {
          margin-top: clamp(3rem, 6rem, 8rem);
          align-self: flex-end;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
          opacity: 0;
          animation: aboutFadeUp 1s ease forwards;
          animation-delay: 0.5s;
          max-width: min(680px, 100%);
        }

        .about-quote {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(14px, 2vw, 24px);
          font-style: italic;
          font-weight: 900;
          color: rgba(243, 216, 227, 0.9);
          letter-spacing: 0.05em;
          text-align: right;
          margin: 0;
        }

        .about-attribution {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.6);
          margin: 0;
        }

        .about-unlock-hint {
          margin: 1.2rem 0 0;
          font-family: 'Fira Code', monospace;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #d8b4fe;
          animation: hintBlink 1.6s ease-in-out infinite;
        }

        @keyframes hintBlink {
          0%, 100% { opacity: 0.55; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-2px); }
        }

        .about-unlock-btn {
          margin-top: 1rem;
          padding: 1rem 2.5rem;
          background: linear-gradient(135deg, #eed7ff 0%, #d8b4fe 100%);
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: 100px;
          color: #2e0854;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          position: relative;
          overflow: visible;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                      box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                      filter 0.3s ease;
          display: inline-block;
          text-decoration: none;
          box-shadow: 0 4px 20px rgba(216, 180, 254, 0.25);
        }

        .about-unlock-btn.locked {
          background: linear-gradient(135deg, #f0dcff 0%, #dfbaff 100%);
          border-color: rgba(255, 255, 255, 0.8);
          color: #2a0845;
          box-shadow: 0 0 28px rgba(216, 180, 254, 0.35);
          animation: btnAttention 2.5s ease-in-out infinite;
        }

        .about-unlock-btn.shake-burst {
          animation: none !important;
          box-shadow: 0 0 40px rgba(216, 180, 254, 0.6) !important;
        }

        @keyframes btnAttention {
          0%, 55%, 100% {
            transform: translateX(0) rotate(0) scale(1);
            box-shadow: 0 0 20px rgba(216, 180, 254, 0.25);
          }
          8% { transform: translateX(-4px) rotate(-1.5deg) scale(1.02); }
          16% { transform: translateX(4px) rotate(1.5deg) scale(1.03); }
          24% { transform: translateX(-3px) rotate(-1deg) scale(1.02); }
          32% { transform: translateX(3px) rotate(1deg) scale(1.03); }
          40% { transform: translateX(0) rotate(0) scale(1.04); box-shadow: 0 0 30px rgba(216, 180, 254, 0.5); }
          48% { transform: translateX(0) rotate(0) scale(1); }
        }

        .about-unlock-btn:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 10px 30px rgba(216, 180, 254, 0.45);
          filter: brightness(1.05);
        }

        .about-unlock-btn.locked:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 12px 36px rgba(216, 180, 254, 0.55);
          filter: brightness(1.08);
        }

        .btn-glow {
          display: none;
        }

        .btn-ring-pulse {
          position: absolute;
          inset: -6px;
          border-radius: 100px;
          border: 2px solid rgba(216, 180, 254, 0.4);
          animation: ringPulse 2s ease-out infinite;
          pointer-events: none;
        }

        @keyframes ringPulse {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(1.15); opacity: 0; }
        }

        @keyframes aboutFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .about-section {
            padding: clamp(6vh, 8vh, 10vh) clamp(1.5rem, 6vw, 3rem);
          }
          .about-word {
            font-size: clamp(34px, 9vw, 90px);
            letter-spacing: -0.01em;
          }
          .about-words-wrap {
            gap: 0.25em 0.35em;
          }
          .about-sub {
            margin-top: clamp(3rem, 8vh, 5rem);
            align-self: flex-start;
            align-items: flex-start;
          }
          .about-quote {
            text-align: left;
            font-size: clamp(14px, 4vw, 18px);
            line-height: 1.4;
          }
          .about-unlock-hint {
            font-size: 10px;
          }
        }
      `}</style>
    </section>
  )
}

export default About
