import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../../context/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

const About = () => {
  const { t, language } = useLanguage()
  const ta = t('about')
  const sectionRef = useRef(null)
  const wordsRef = useRef([])

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

  return (
    <section
      ref={sectionRef}
      className="about-section"
    >
      {/* Small label */}
      <p className="about-eyebrow">{ta.eyebrow}</p>

      {/* Big text */}
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

      {/* Sub info */}
      <div className="about-sub">
        <p className="about-quote">
          {ta.quote}
        </p>
        <p className="about-attribution">- Mayla, 2026</p>
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
          color: rgba(232,200,255,1);
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
        }
      `}</style>
    </section>
  )
}

export default About