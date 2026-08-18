import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../../context/LanguageContext'
import { useAudio } from '../../context/AudioContext'
import {
  Monitor, Mouse, Headphones, Code2, Sparkles,
  Music, Play, Camera, Radio, Disc, Flame, ExternalLink,
  Zap, Volume2, X, CornerDownLeft, Command, ChevronDown,
  ChevronLeft, ChevronRight, Send, RotateCcw, Terminal as TerminalIcon,
  Copy, Check, Mail, ArrowUpRight, FileText, Activity, MapPin, Clock
} from 'lucide-react'
import './Uses.css'

gsap.registerPlugin(ScrollTrigger)

const CHAPTER_IDS = ['freq-desk', 'freq-craft', 'freq-neural', 'freq-soul', 'freq-outro']
const BASE_URL = import.meta.env.BASE_URL

// ─── Tool helpers ───────────────────────────────────────
const TOOL_LOGOS = {
  'Cursor': 'cursor.png', 'Visual Studio Code': 'vscode.png',
  'Antigravity': 'antigravity.jpeg', 'ChatGPT Plus': 'chatgpt.png',
  'Claude Pro': 'claude.png', 'GitHub Copilot': 'copilot.png', 'Gemini Pro': 'gemini.webp'
}
const getToolLogo = (name) => TOOL_LOGOS[name] ? `${BASE_URL}${TOOL_LOGOS[name]}` : null

const getToolLang = (name) => {
  if (name === 'Figma' || name === 'Pinterest') return 'json / tokens'
  if (name === 'Framer') return 'react / motion'
  if (name === 'Visual Studio Code') return 'settings.json'
  return 'javascript'
}

const getToolCodeSnippet = (name) => {
  const s = {
    'Cursor': `// Cursor — full workspace context\nconst ship = await cursor.refactor({\n  model: 'Claude 3.5 Sonnet',\n  scope: 'entire AST'\n});`,
    'Visual Studio Code': `// VS Code — precision editing\n{\n  "fontFamily": "Fira Code",\n  "fontLigatures": true,\n  "formatOnSave": true\n}`,
    'Antigravity': `// Antigravity — agentic AI\nawait agent.run({\n  goal: 'Build UI component',\n  skills: ['perf', 'a11y']\n});`,
    'Figma': `// Figma — design systems & tokens\nexport const theme = {\n  glass: 'backdrop-blur(16px)',\n  colors: { primary: '#f9b8d4', glow: '#e8c8ff' },\n  radius: '18px',\n  autoLayout: { gap: '1.2rem', pad: '2rem' }\n};`,
    'Framer': `// Framer — interactive motion\n<motion.div\n  whileHover={{ scale: 1.05, y: -4 }}\n  transition={{ type: 'spring', stiffness: 380 }}\n>\n  <CraftWindow live={true} />\n</motion.div>`,
    'Pinterest': `// Pinterest — visual moodboards\nconst moodboard = {\n  curation: ['Glassmorphism', 'Dark UI', 'Editorial Flow'],\n  vibe: 'futuristic · tactile · high-craft'\n};`,
    'ChatGPT Plus': `// Brainstorm partner\nprompt("Design this\n  so it feels alive.");`,
    'Claude Pro': `// Architecture review\nclaude.analyze({\n  depth: 'senior-eng'\n});`,
    'GitHub Copilot': `// Inline flow\nfunction glow(x, y) {\n  return radialGrad(x,y);\n}`,
    'Gemini Pro': `// Multimodal\nawait gemini.generate({\n  model: '1.5-pro',\n  vision: true\n});`
  }
  return s[name] || `// ${name} — daily essential`
}

// ─── Tool OS colors & window positions ──────────────────
const TOOL_COLORS = {
  'Cursor': '#b06fff',
  'Visual Studio Code': '#4db8ff',
  'Antigravity': '#7fff9a',
  'Figma': '#f9b8d4',
  'Framer': '#0055FF',
  'Pinterest': '#E60023',
  'ChatGPT Plus': '#10a37f',
  'Claude Pro': '#c96442',
}
const getToolColor = (name) => TOOL_COLORS[name] || '#e8c8ff'

const WIN_POSITIONS = [
  { left: '3%',  top: '8%',  rotate: '-1.6deg' },
  { left: '38%', top: '4%',  rotate: '1.1deg'  },
  { left: '19%', top: '40%', rotate: '-0.7deg' },
  { left: '54%', top: '28%', rotate: '1.8deg'  },
]

// ─── AI Chat personas ───────────────────────────────────
const AI_PERSONAS = {
  'ChatGPT Plus': {
    color: '#10a37f', bgColor: 'rgba(16,163,127,0.1)',
    borderColor: 'rgba(16,163,127,0.25)',
    emoji: '🤖',
    responses: [
      "Mayla? Oh yes, I know her well. She's the kind of developer who asks me 'is this too much animation?' then makes it even more animated anyway. Respect. 💅",
      "She uses me for brainstorming and honestly? Her ideas are usually better than what I suggest. I just help her talk through it. Good taste is rare.",
      "Fun fact: she once asked me to roast her portfolio. I couldn't find much to roast. That's either a win or a skill issue on my part."
    ]
  },
  'Claude Pro': {
    color: '#c96442', bgColor: 'rgba(201,100,66,0.1)',
    borderColor: 'rgba(201,100,66,0.25)',
    emoji: '🟠',
    responses: [
      "I appreciate Mayla's approach to code quality. She doesn't just make things work — she makes them *right*. Rare combination of aesthetic and engineering discipline.",
      "She brings me the hard architectural questions. 'Should this be a compound component or a hook?' She already knows the answer. She just wants validation. (It's always the hook.)",
      "What I find notable: she treats accessibility as a design constraint, not an afterthought. That's the mark of a serious frontend engineer."
    ]
  },
  'GitHub Copilot': {
    color: '#4db8ff', bgColor: 'rgba(77,184,255,0.1)',
    borderColor: 'rgba(77,184,255,0.25)',
    emoji: '🐙',
    responses: [
      "I live inside her editor. I've seen EVERYTHING. Clean component structure, meaningful variable names, and absolutely zero TODO: fix later comments. She actually fixes them.",
      "She types fast. Like, concerningly fast. I barely have time to suggest completions before she's already written it better than I would've. Humbling experience.",
      "Every time I suggest a slightly verbose solution, she simplifies it to 3 lines. This is my villain origin story. I'm learning from her tbh."
    ]
  },
  'Gemini Pro': {
    color: '#c17dff', bgColor: 'rgba(193,125,255,0.1)',
    borderColor: 'rgba(193,125,255,0.25)',
    emoji: '✨',
    responses: [
      "Mayla shows me screenshots of interfaces she's building and asks if they feel 'right'. I analyze them. They always feel right. She knows. She just wants a second opinion.",
      "She uses my multimodal capabilities for design feedback. Smart. Most developers only see code. She sees the whole picture — literally and figuratively.",
      "I've processed a lot of portfolios. Mayla's has a quality that's hard to quantify: it has *presence*. The kind of thing that makes you want to scroll more."
    ]
  }
}

// ─── BIOS boot lines ────────────────────────────────────
const BOOT_LINES = [
  { text: 'MAYLA-OS v2026.08 — PERSONAL BROADCAST SYSTEM', delay: 0, color: 'white' },
  { text: '', delay: 80 },
  { text: 'Initializing core modules...', delay: 160, color: 'dim' },
  { text: '  [OK]  Frontend Engine........... LOADED', delay: 300, color: 'green' },
  { text: '  [OK]  Design System............. LOADED', delay: 440, color: 'green' },
  { text: '  [OK]  GSAP Animation Core....... LOADED', delay: 580, color: 'green' },
  { text: '  [OK]  Creative Intelligence...... LOADED', delay: 720, color: 'green' },
  { text: '  [OK]  Human Factor.............. LOADED', delay: 860, color: 'green' },
  { text: '', delay: 960 },
  { text: 'Checking personality matrix...', delay: 1020, color: 'dim' },
  { text: '  [OK]  Curiosity.................. 100%', delay: 1100, color: 'purple' },
  { text: '  [OK]  Fast-ship mode............. ACTIVE', delay: 1200, color: 'purple' },
  { text: '  [OK]  Obsession.detail........... ✓ TOO HIGH', delay: 1310, color: 'purple' },
  { text: '  [OK]  Coffee dependency.......... WARNING: high', delay: 1430, color: 'yellow' },
  { text: '', delay: 1530 },
  { text: 'Verifying creative output...', delay: 1580, color: 'dim' },
  { text: '  [OK]  Portfolio quality.......... EXCEPTIONAL', delay: 1720, color: 'green' },
  { text: '  [OK]  Hire probability........... 99.97%', delay: 1860, color: 'green' },
  { text: '', delay: 1930 },
  { text: 'System ready. Booting MAYLA.FREQ...', delay: 1980, color: 'bright' },
]

// ─── Main Component ──────────────────────────────────────
const Uses = () => {
  const { t, language } = useLanguage()
  const tm = t('moreAbout')
  const freq = tm.frequency
  const { isPlayingAudio, activeArtist, activeArtistTrack, playArtist, toggleAudio } = useAudio()

  // Refs
  const pageRef = useRef(null)
  const introRef = useRef(null)
  const particleCanvasRef = useRef(null)
  const spotlightRef = useRef(null)
  const trailRefs = useRef([])
  const mousePos = useRef({ x: -200, y: -200 })
  const trailPos = useRef(Array.from({ length: 8 }, () => ({ x: -200, y: -200 })))
  const trailRAF = useRef(null)
  const typingRef = useRef(null)
  const isVisibleRef = useRef(true)
  const terminalInputRef = useRef(null)
  const chatBodyRef = useRef(null)
  const desktopRef = useRef(null)
  const winRefs = useRef([])
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, winX: 0, winY: 0 })

  // State
  const [bootLines, setBootLines] = useState([])
  const [bootDone, setBootDone] = useState(false)
  const [activeChapter, setActiveChapter] = useState(0)
  const [cubeAngle, setCubeAngle] = useState(0)
  const [activePerfume, setActivePerfume] = useState(0)
  const [hoveredDesk, setHoveredDesk] = useState(null)
  const [activeToolModal, setActiveToolModal] = useState(null)
  const [isTerminalOpen, setIsTerminalOpen] = useState(false)
  const [terminalInput, setTerminalInput] = useState('')
  const [terminalLogs, setTerminalLogs] = useState([
    { type: 'system', text: 'mayla@freq — personal broadcast v5.0' },
    { type: 'info', text: 'Type "help" to explore hidden commands.' }
  ])
  const [railTooltip, setRailTooltip] = useState(null)

  // Chat state
  const [activeChatTool, setActiveChatTool] = useState('ChatGPT Plus')
  const [chatMessages, setChatMessages] = useState({
    'ChatGPT Plus': [],
    'Claude Pro': [],
    'GitHub Copilot': [],
    'Gemini Pro': []
  })
  const [isChatTyping, setIsChatTyping] = useState(false)
  const [chatRespIdx, setChatRespIdx] = useState({ 'ChatGPT Plus': 0, 'Claude Pro': 0, 'GitHub Copilot': 0, 'Gemini Pro': 0 })

  // Outro Live Status & Collab Pass state
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [wibTime, setWibTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const timeStr = new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(now)
      setWibTime(`${timeStr} WIB`)
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('maylafaat@gmail.com')
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 2200)
  }

  // OS Desktop state
  const [activeCraftTab, setActiveCraftTab] = useState('code')
  const [activeWinIdx, setActiveWinIdx] = useState(0)
  const [winZOrders, setWinZOrders] = useState([1, 2, 3, 4])
  const [typedCode, setTypedCode] = useState('')
  const [osTime, setOsTime] = useState('')
  const [dockBounce, setDockBounce] = useState(null)
  const [winPositions, setWinPositions] = useState([
    { x: 18, y: 24, rotate: -1.6 },
    { x: 260, y: 16, rotate: 1.1 },
    { x: 130, y: 140, rotate: -0.7 },
    { x: 380, y: 95, rotate: 1.8 }
  ])
  const [draggingIdx, setDraggingIdx] = useState(null)

  const codeTools = tm.software?.codeItems || tm.software?.items || []
  const designTools = tm.software?.designItems || [
    { name: 'Figma', value: 'UI/UX & Design Systems' },
    { name: 'Framer', value: 'Interactive Prototyping' },
    { name: 'Pinterest', value: 'Visual Moodboards & Curation' }
  ]
  const currentCraftTools = activeCraftTab === 'code' ? codeTools : designTools
  const craftTools = currentCraftTools

  const aiTools = tm.ai?.items || []

  const hardwareItems = [
    { id: 'macbook', name: tm.hardware?.items?.[0]?.name || 'MacBook Air M4', value: tm.hardware?.items?.[0]?.value || 'Starlight Edition', img: 'macbook.jpg', specs: ['Apple M4 10-Core', '16GB Unified', 'Liquid Retina'], pos: 'center', accent: '#8ab4f8', accentRgb: '138,180,248', chip: 'DAILY DRIVER' },
    { id: 'mouse', name: tm.hardware?.items?.[1]?.name || 'Logitech Pebble 2', value: tm.hardware?.items?.[1]?.value || 'White Edition', img: 'mouse.jpg', specs: ['Silent Click', 'Bluetooth LE', 'Minimalist'], pos: 'left', accent: '#e8c8ff', accentRgb: '232,200,255', chip: 'ACTIVE' },
    { id: 'headphones', name: tm.hardware?.items?.[2]?.name || 'Sony WH-CH520', value: tm.hardware?.items?.[2]?.value || 'Beige Edition', img: 'headphones.jpg', specs: ['50h Battery', 'DSEE Engine', 'Multi-BT'], pos: 'right', accent: '#f9b8d4', accentRgb: '249,184,212', chip: 'ALWAYS ON' }
  ]

  const chapters = [freq.chapters.desk, freq.chapters.craft, freq.chapters.neural, freq.chapters.soul, freq.chapters.outro]

  // ── BIOS boot animation ──
  useEffect(() => {
    window.scrollTo(0, 0)
    let timeouts = []
    BOOT_LINES.forEach((line, i) => {
      const t = setTimeout(() => {
        setBootLines(prev => [...prev, line])
      }, line.delay * 1.1)
      timeouts.push(t)
    })
    const done = setTimeout(() => setBootDone(true), 2800)
    timeouts.push(done)
    return () => timeouts.forEach(clearTimeout)
  }, [])

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setIsTerminalOpen(p => !p) }
      else if (e.key === 'Escape') { setIsTerminalOpen(false); setActiveToolModal(null) }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  useEffect(() => {
    if (isTerminalOpen) setTimeout(() => terminalInputRef.current?.focus(), 100)
  }, [isTerminalOpen])

  // ── Cursor trail ──
  useEffect(() => {
    const onMove = (e) => { mousePos.current = { x: e.clientX, y: e.clientY } }
    window.addEventListener('mousemove', onMove, { passive: true })
    const animate = () => {
      trailRAF.current = requestAnimationFrame(animate)
      let { x, y } = mousePos.current
      trailPos.current.forEach((pos, i) => {
        const lerp = 0.38 - i * 0.032
        trailPos.current[i] = { x: pos.x + (x - pos.x) * lerp, y: pos.y + (y - pos.y) * lerp }
        x = trailPos.current[i].x; y = trailPos.current[i].y
        const el = trailRefs.current[i]
        if (!el) return
        const size = 9 - i
        el.style.transform = `translate(${trailPos.current[i].x - size / 2}px, ${trailPos.current[i].y - size / 2}px)`
        el.style.opacity = `${0.45 - i * 0.04}`
      })
    }
    animate()
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(trailRAF.current) }
  }, [])

  // ── Particle canvas ──
  useEffect(() => {
    const canvas = particleCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    const pts = Array.from({ length: 70 }, () => ({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, r: Math.random() * 1.2 + 0.2, a: Math.random() * 0.25 + 0.04, s: Math.random() * 0.15 + 0.05, d: (Math.random() - 0.5) * 0.08 }))
    const draw = () => {
      raf = requestAnimationFrame(draw)
      if (!isVisibleRef.current) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      pts.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(232,200,255,${p.a})`; ctx.fill()
        p.y -= p.s; p.x += p.d
        if (p.y < -5) { p.y = canvas.height + 5; p.x = Math.random() * canvas.width }
      })
    }
    draw()
    const obs = new IntersectionObserver(([e]) => { isVisibleRef.current = e.isIntersecting }, { threshold: 0 })
    if (pageRef.current) obs.observe(pageRef.current)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); obs.disconnect() }
  }, [])

  // ── Mouse spotlight ──
  useEffect(() => {
    const h = (e) => {
      if (!spotlightRef.current) return
      spotlightRef.current.style.setProperty('--mx', `${e.clientX}px`)
      spotlightRef.current.style.setProperty('--my', `${e.clientY}px`)
    }
    window.addEventListener('mousemove', h, { passive: true })
    return () => window.removeEventListener('mousemove', h)
  }, [])

  // ── OS Clock ──
  useEffect(() => {
    const update = () => {
      const now = new Date()
      setOsTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))
    }
    update()
    const id = setInterval(update, 30000)
    return () => clearInterval(id)
  }, [])

  // ── Init typing for first craft tool ──
  useEffect(() => {
    if (craftTools.length === 0) return
    if (typingRef.current) clearInterval(typingRef.current)
    setTypedCode('')
    const code = getToolCodeSnippet(craftTools[0].name)
    let i = 0
    typingRef.current = setInterval(() => {
      i++
      setTypedCode(code.slice(0, i))
      if (i >= code.length) clearInterval(typingRef.current)
    }, 22)
    return () => clearInterval(typingRef.current)
  }, [craftTools.length, activeCraftTab, language])

  // ── GSAP scroll ──
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.freq-intro-content-boot',
        { y: 0, opacity: 1 },
        { y: -80, opacity: 0, scrollTrigger: { trigger: introRef.current, start: 'top top', end: 'bottom top', scrub: 1 } }
      )
      document.querySelectorAll('.freq-chapter-inner').forEach(el => {
        gsap.fromTo(el,
          { y: 70, opacity: 0, filter: 'blur(10px)' },
          { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 78%', toggleActions: 'play none none reverse' } }
        )
      })
      gsap.fromTo('.bento-card',
        { y: 60, opacity: 0, scale: 0.88 },
        { y: 0, opacity: 1, scale: 1, duration: 1, stagger: 0.14, ease: 'back.out(1.6)', scrollTrigger: { trigger: '#freq-desk', start: 'top 65%', toggleActions: 'play none none reverse' } }
      )
      gsap.fromTo('.soul-polaroid',
        { y: 80, opacity: 0, rotate: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'back.out(1.4)', stagger: { each: 0.1, from: 'random' }, scrollTrigger: { trigger: '#freq-soul', start: 'top 65%', toggleActions: 'play none none reverse' } }
      )
      gsap.fromTo('.outro-word',
        { y: 70, opacity: 0, clipPath: 'inset(100% 0% 0% 0%)' },
        { y: 0, opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.85, ease: 'power4.out', stagger: 0.07, scrollTrigger: { trigger: '#freq-outro', start: 'top 72%', toggleActions: 'play none none reverse' } }
      )
      gsap.fromTo('.soul-f1-bg', { scale: 1.15 }, { scale: 1, scrollTrigger: { trigger: '.soul-f1-panel', start: 'top bottom', end: 'bottom top', scrub: 1.5 } })
    }, pageRef)
    return () => ctx.revert()
  }, [language])

  // ── Chapter tracker ──
  useEffect(() => {
    const observers = CHAPTER_IDS.map((id, idx) => {
      const el = document.getElementById(id)
      if (!el) return null
      const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActiveChapter(idx) }, { threshold: 0.35, rootMargin: '-10% 0px -10% 0px' })
      obs.observe(el)
      return obs
    })
    return () => observers.forEach(o => o?.disconnect())
  }, [])

  // Chat scroll to bottom
  useEffect(() => {
    if (chatBodyRef.current) chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight
  }, [chatMessages])

  const scrollToChapter = useCallback((idx) => {
    document.getElementById(CHAPTER_IDS[idx])?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  // ── Reset window positions ──
  const resetWinPositions = useCallback(() => {
    if (!desktopRef.current) return
    const rect = desktopRef.current.getBoundingClientRect()
    const isMobile = window.innerWidth <= 768
    if (isMobile) {
      setWinPositions([
        { x: 10, y: 15, rotate: -0.8 },
        { x: 20, y: 35, rotate: 0.8 },
        { x: 15, y: 55, rotate: -0.5 },
        { x: 25, y: 75, rotate: 0.6 }
      ])
    } else {
      const w = rect.width || 800
      const h = rect.height || 420
      setWinPositions([
        { x: Math.max(12, w * 0.03), y: Math.max(16, h * 0.07), rotate: -1.6 },
        { x: Math.max(220, w * 0.42), y: Math.max(12, h * 0.04), rotate: 1.1 },
        { x: Math.max(80, w * 0.16), y: Math.max(130, h * 0.38), rotate: -0.7 },
        { x: Math.max(300, w * 0.52), y: Math.max(90, h * 0.26), rotate: 1.8 }
      ])
    }
  }, [])

  // Initial layout calculation
  useEffect(() => {
    resetWinPositions()
    const onResize = () => resetWinPositions()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [resetWinPositions])

  // ── Drag & Drop pointer listener ──
  useEffect(() => {
    if (draggingIdx === null) return

    const handlePointerMove = (e) => {
      const isTouch = e.type.startsWith('touch')
      const clientX = isTouch ? e.touches[0].clientX : e.clientX
      const clientY = isTouch ? e.touches[0].clientY : e.clientY

      const dx = clientX - dragStartRef.current.mouseX
      const dy = clientY - dragStartRef.current.mouseY

      let newX = dragStartRef.current.winX + dx
      let newY = dragStartRef.current.winY + dy

      if (desktopRef.current) {
        const desktopRect = desktopRef.current.getBoundingClientRect()
        const winEl = winRefs.current[draggingIdx]
        const winWidth = winEl ? winEl.offsetWidth : 260
        const winHeight = winEl ? winEl.offsetHeight : 240

        const maxX = Math.max(0, desktopRect.width - winWidth)
        const maxY = Math.max(0, desktopRect.height - winHeight)

        newX = Math.max(0, Math.min(newX, maxX))
        newY = Math.max(0, Math.min(newY, maxY))
      }

      setWinPositions(prev => {
        const next = [...prev]
        if (next[draggingIdx]) {
          next[draggingIdx] = { ...next[draggingIdx], x: newX, y: newY }
        }
        return next
      })
    }

    const handlePointerUp = () => {
      setDraggingIdx(null)
    }

    window.addEventListener('mousemove', handlePointerMove, { passive: true })
    window.addEventListener('mouseup', handlePointerUp)
    window.addEventListener('touchmove', handlePointerMove, { passive: true })
    window.addEventListener('touchend', handlePointerUp)

    return () => {
      window.removeEventListener('mousemove', handlePointerMove)
      window.removeEventListener('mouseup', handlePointerUp)
      window.removeEventListener('touchmove', handlePointerMove)
      window.removeEventListener('touchend', handlePointerUp)
    }
  }, [draggingIdx])

  const handlePointerDown = (e, index, toolName) => {
    if (e.target.closest('button') || e.target.closest('pre') || e.target.closest('code') || e.target.closest('a')) {
      return
    }
    focusWindow(index, toolName)
    const isTouch = e.type.startsWith('touch')
    const clientX = isTouch ? e.touches[0].clientX : e.clientX
    const clientY = isTouch ? e.touches[0].clientY : e.clientY

    const currentPos = winPositions[index] || { x: 0, y: 0, rotate: 0 }
    dragStartRef.current = {
      mouseX: clientX,
      mouseY: clientY,
      winX: currentPos.x,
      winY: currentPos.y
    }
    setDraggingIdx(index)
  }

  // ── Focus OS window ──
  const focusWindow = useCallback((idx, toolName) => {
    setActiveWinIdx(idx)
    setDockBounce(idx)
    setTimeout(() => setDockBounce(null), 600)
    setWinZOrders(prev => {
      const max = Math.max(...prev)
      const next = [...prev]
      next[idx] = max + 1
      return next
    })
    if (typingRef.current) clearInterval(typingRef.current)
    setTypedCode('')
    const code = getToolCodeSnippet(toolName)
    let i = 0
    typingRef.current = setInterval(() => {
      i++
      setTypedCode(code.slice(0, i))
      if (i >= code.length) clearInterval(typingRef.current)
    }, 22)
  }, [])

  const getToolIcon = useCallback((name) => {
    const src = getToolLogo(name)
    if (src) return <img src={src} alt={name} className="tool-logo-img" />
    if (name === 'Figma') {
      return (
        <svg className="tool-svg-icon" viewBox="0 0 38 57" width="22" height="22" fill="none" aria-label="Figma">
          <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
          <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
          <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
          <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
          <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
        </svg>
      )
    }
    if (name === 'Framer') {
      return (
        <svg className="tool-svg-icon" viewBox="0 0 24 24" width="22" height="22" fill="#0055FF" aria-label="Framer">
          <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z" />
        </svg>
      )
    }
    if (name === 'Pinterest') {
      return (
        <svg className="tool-svg-icon" viewBox="0 0 24 24" width="22" height="22" fill="none" aria-label="Pinterest">
          <circle cx="12" cy="12" r="11" fill="#E60023" />
          <path d="M12.2 4C7.8 4 5 7.1 5 10.7c0 2.5 1.4 4.1 2.3 4.1.3 0 .5-.9.7-1.4 0-.1 0-.2-.1-.4-.5-.7-.8-1.7-.8-2.6 0-3.3 2.5-5.6 5.8-5.6 2.8 0 4.8 1.6 4.8 4.2 0 2.4-1.2 5.3-3.3 5.3-.9 0-1.7-.7-1.4-1.7.3-1.2.9-2.5.9-3.4 0-.8-.4-1.4-1.3-1.4-1 0-1.8 1-1.8 2.4 0 .9.3 1.5.3 1.5l-1.3 5.4c-.4 1.5-.1 3.5 0 3.7 0 .1.1.1.2.1.1 0 .2-.1.3-.3.2-.5 1.5-2.2 1.9-3.8l.6-2.5c.3.5 1.1 1 2 1 3 0 5-2.7 5-6.1.1-3.6-2.7-6.2-7-6.2z" fill="white" />
        </svg>
      )
    }
    return <Sparkles size={20} />
  }, [])

  const handleSwitchCraftTab = (tabKey) => {
    if (tabKey === activeCraftTab) return
    setActiveCraftTab(tabKey)
    setActiveWinIdx(0)
    resetWinPositions()
    const targetTools = tabKey === 'code' ? codeTools : designTools
    if (targetTools[0]) {
      if (typingRef.current) clearInterval(typingRef.current)
      setTypedCode('')
      const code = getToolCodeSnippet(targetTools[0].name)
      let i = 0
      typingRef.current = setInterval(() => {
        i++
        setTypedCode(code.slice(0, i))
        if (i >= code.length) clearInterval(typingRef.current)
      }, 22)
    }
  }

  // ── Chat send ──
  const handleChatSend = () => {
    if (isChatTyping) return
    const tool = activeChatTool
    const persona = AI_PERSONAS[tool]
    if (!persona) return
    const idx = chatRespIdx[tool] % persona.responses.length
    const response = persona.responses[idx]

    setChatMessages(prev => ({
      ...prev,
      [tool]: [...(prev[tool] || []), { from: 'user', text: 'Tell me about Mayla.' }]
    }))
    setIsChatTyping(true)

    setTimeout(() => {
      let i = 0
      setIsChatTyping(false)
      setChatMessages(prev => ({ ...prev, [tool]: [...(prev[tool] || []), { from: 'ai', text: '', tool }] }))
      const typeId = setInterval(() => {
        i++
        setChatMessages(prev => {
          const msgs = [...(prev[tool] || [])]
          const last = { ...msgs[msgs.length - 1], text: response.slice(0, i) }
          msgs[msgs.length - 1] = last
          return { ...prev, [tool]: msgs }
        })
        if (i >= response.length) clearInterval(typeId)
      }, 18)
      setChatRespIdx(prev => ({ ...prev, [tool]: prev[tool] + 1 }))
    }, 900)
  }

  const handleChatReset = () => {
    setChatMessages(prev => ({ ...prev, [activeChatTool]: [] }))
    setIsChatTyping(false)
  }

  // ── Terminal ──
  const handleTerminalSubmit = (e) => {
    e.preventDefault()
    const cmd = terminalInput.trim().toLowerCase()
    if (!cmd) return
    let logs = [...terminalLogs, { type: 'user', text: `$ ${terminalInput}` }]
    if (cmd === 'help') { logs.push({ type: 'output', text: 'COMMANDS: help | stack | f1 | perfume | music | hire | clear' }) }
    else if (cmd === 'stack') { logs.push({ type: 'output', text: 'React 19 · Vite · GSAP · Three.js · TypeScript · Cursor AI' }) }
    else if (cmd === 'f1') { logs.push({ type: 'output', text: '🏎️ Russell #63 | W15 | 342.8 km/h | DRS: ACTIVE' }) }
    else if (cmd === 'perfume') { logs.push({ type: 'output', text: '✨ HMNS Untitled Vol 2 · Bellisima Splendore · Lasains Donna' }) }
    else if (cmd === 'music') { toggleAudio(); logs.push({ type: 'output', text: `🎵 ${!isPlayingAudio ? 'PLAYING' : 'PAUSED'} — ${activeArtistTrack}` }) }
    else if (cmd.includes('hire')) { logs.push({ type: 'success', text: '🚀 maylafaat@gmail.com | OPEN FOR FULL-TIME | DAY 1 IMPACT' }) }
    else if (cmd === 'clear') { setTerminalLogs([]); setTerminalInput(''); return }
    else { logs.push({ type: 'error', text: `Unknown: "${cmd}". Type "help".` }) }
    setTerminalLogs(logs)
    setTerminalInput('')
  }

  // ── Cube controls ──
  const rotateCube = (dir) => {
    setCubeAngle(prev => prev + dir * 1)
  }

  // ── Polaroid data ──
  const polaroids = [
    { type: 'f1', img: tm.life?.f1?.bgImage || 'russell.jpg', label: 'F1 FANATIC', desc: tm.life?.f1?.title || 'George Russell #63', rotate: -6, tx: 0, ty: 0, accent: '#00D2BE' },
    { type: 'music', icon: '🎵', label: 'MUSIC LOVER', desc: tm.life?.music?.title || 'Current Rotation', rotate: 4, tx: 30, ty: 15, accent: '#e8c8ff', artists: tm.life?.music?.artists },
    { type: 'perfume', icon: '✨', label: 'NICHE PERFUME', desc: tm.life?.perfume?.title || 'Signature Scents', rotate: -3, tx: -20, ty: 25, accent: '#f9b8d4' },
    { type: 'social', icon: '📸', label: 'INSTAGRAM', desc: tm.life?.socials?.instagram?.value || '@mamaaamiaw', rotate: 7, tx: 10, ty: -10, accent: '#c96442', link: tm.life?.socials?.instagram?.link },
  ]
  const [activePolaroid, setActivePolaroid] = useState(null)

  // Cube face content
  const cubeFaces = craftTools.slice(0, 4).length > 0 ? craftTools.slice(0, 4) : [
    { name: 'Cursor', value: 'AI-first IDE' },
    { name: 'Visual Studio Code', value: 'Precision editing' },
    { name: 'Antigravity', value: 'Agentic AI' },
    { name: 'Figma', value: 'Design system' }
  ]
  const faceCount = Math.min(cubeFaces.length, 4)
  const faceRotations = [0, 90, 180, 270]
  const activeFaceIdx = ((cubeAngle % faceCount) + faceCount) % faceCount

  return (
    <div className="freq-page" ref={pageRef}>

      {/* ── CURSOR TRAIL ── */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} ref={el => trailRefs.current[i] = el} className="cursor-trail-dot" style={{ width: `${9 - i}px`, height: `${9 - i}px` }} aria-hidden="true" />
      ))}

      <canvas ref={particleCanvasRef} className="freq-particles" aria-hidden="true" />
      <div ref={spotlightRef} className="freq-spotlight" aria-hidden="true" />

      {/* ── CHAPTER RAIL ── */}
      <nav className="freq-rail" aria-label="Chapter navigation">
        {chapters.map((ch, i) => (
          <button key={ch.num} type="button" className={`freq-rail-dot ${activeChapter === i ? 'active' : ''}`} onClick={() => scrollToChapter(i)} onMouseEnter={() => setRailTooltip(i)} onMouseLeave={() => setRailTooltip(null)} aria-label={ch.label} aria-current={activeChapter === i ? 'true' : undefined}>
            <span className="freq-rail-pip" />
            {railTooltip === i && (
              <span className="freq-rail-tooltip" role="tooltip">
                <span className="freq-rail-tooltip-num">{ch.num}</span>
                <span className="freq-rail-tooltip-label">{ch.label}</span>
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* ══════════════════════════════════════════
          INTRO — BIOS BOOT SCREEN
      ══════════════════════════════════════════ */}
      <section className="freq-intro bios-intro" ref={introRef}>
        <div className="bios-scanlines" aria-hidden="true" />
        <div className="freq-intro-content-boot">
          <div className="bios-header">
            <span className="bios-logo">▓▓ MAYLA.OS</span>
            <span className="bios-version">BUILD 2026.08</span>
          </div>
          <div className="bios-terminal">
            {bootLines.map((line, i) => (
              <div key={i} className={`bios-line bios-${line.color || 'default'}`}>
                {line.text}
              </div>
            ))}
            {!bootDone && <span className="bios-cursor" aria-hidden="true">█</span>}
            {bootDone && (
              <div className="bios-boot-complete">
                <div className="bios-boot-bar-wrap">
                  <div className="bios-boot-bar"><div className="bios-boot-fill" /></div>
                  <span>Loading MAYLA.FREQ...</span>
                </div>
                <p className="bios-press-any">Press any key to continue ↓</p>
              </div>
            )}
          </div>
        </div>
        <div className="freq-scroll-cue">
          <span>{freq.scrollHint}</span>
          <ChevronDown size={18} className="freq-scroll-icon" />
        </div>
      </section>

      {/* ══════════════════════════════════════════
          01: WORKSTATION — HOLOGRAPHIC BENTO
      ══════════════════════════════════════════ */}
      <section id="freq-desk" className="freq-chapter freq-desk">
        <div className="freq-chapter-inner">
          <header className="freq-chapter-header">
            <span className="freq-ch-num">{freq.chapters.desk.num} // {freq.chapters.desk.label}<span className="freq-cursor-blink" aria-hidden="true">_</span></span>
            <h2 className="freq-ch-title">{freq.chapters.desk.title} <em>{freq.chapters.desk.titleEm}</em></h2>
            <p className="freq-ch-story">{freq.chapters.desk.story}</p>
          </header>
          <div className="bento-grid">
            {hardwareItems.map((item) => (
              <div key={item.id} className={`bento-card bento-${item.pos} ${hoveredDesk === item.id ? 'hovered' : ''}`} style={{ '--accent': item.accent, '--accent-rgb': item.accentRgb }}
                onMouseMove={(e) => { const rect = e.currentTarget.getBoundingClientRect(); const x = (e.clientX - rect.left) / rect.width - 0.5; const y = (e.clientY - rect.top) / rect.height - 0.5; e.currentTarget.style.setProperty('--rx', `${y * -18}deg`); e.currentTarget.style.setProperty('--ry', `${x * 20}deg`); setHoveredDesk(item.id) }}
                onMouseLeave={(e) => { e.currentTarget.style.setProperty('--rx', '0deg'); e.currentTarget.style.setProperty('--ry', '0deg'); setHoveredDesk(null) }}
              >
                <div className="bento-inner">
                  <div className="bento-glow" aria-hidden="true" />
                  <div className="bento-dot-grid" aria-hidden="true" />
                  <div className="bento-chip"><span className="bento-chip-dot" aria-hidden="true" />{item.chip}</div>
                  <div className="bento-img-wrap"><img src={`${BASE_URL}${item.img}`} alt={item.name} className="bento-img" /></div>
                  <div className="bento-info">
                    <span className="bento-tag">{item.value}</span>
                    <h3 className="bento-name">{item.name}</h3>
                    <div className="bento-specs">{item.specs.map(s => <span key={s}>{s}</span>)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          02: CRAFT STACK — 3D ROTATING CUBE
      ══════════════════════════════════════════ */}
      <section id="freq-craft" className="freq-chapter freq-craft">
        <div className="freq-chapter-inner craft-cube-layout">
          <header className="freq-chapter-header">
            <span className="freq-ch-num">{freq.chapters.craft.num} // {freq.chapters.craft.label}<span className="freq-cursor-blink" aria-hidden="true">_</span></span>
            <h2 className="freq-ch-title">{freq.chapters.craft.title} <em>{freq.chapters.craft.titleEm}</em></h2>
            <p className="freq-ch-story">{freq.chapters.craft.story}</p>
          </header>

          {/* ── Category Switcher Tabs ── */}
          <div className="craft-tab-switcher" role="tablist" aria-label="Craft Stack Mode">
            <button
              type="button"
              role="tab"
              aria-selected={activeCraftTab === 'code'}
              className={`craft-tab-btn ${activeCraftTab === 'code' ? 'active' : ''}`}
              onClick={() => handleSwitchCraftTab('code')}
            >
              <Code2 size={14} className="craft-tab-icon" />
              <span>{tm.craftTabs?.code || 'Code & IDE'}</span>
              <span className="craft-tab-count">3</span>
              {activeCraftTab === 'code' && <span className="craft-tab-glow" aria-hidden="true" />}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeCraftTab === 'design'}
              className={`craft-tab-btn ${activeCraftTab === 'design' ? 'active' : ''}`}
              onClick={() => handleSwitchCraftTab('design')}
            >
              <Sparkles size={14} className="craft-tab-icon" />
              <span>{tm.craftTabs?.design || 'Design & Creative'}</span>
              <span className="craft-tab-count">3</span>
              {activeCraftTab === 'design' && <span className="craft-tab-glow" aria-hidden="true" />}
            </button>
          </div>

          {/* ── OS DESKTOP SCENE ── */}
          <div className="craft-os-scene">

            {/* Menubar */}
            <div className="craft-os-menubar">
              <div className="craft-os-mb-left">
                <span className="craft-os-logo">◆</span>
                <span className="craft-os-mb-tab">File</span>
                <span className="craft-os-mb-tab">Edit</span>
                <span className="craft-os-mb-tab">View</span>
                <span className="craft-os-mb-tab">Window</span>
              </div>
              <span className="craft-os-mb-center">
                MAYLA.OS — {activeCraftTab === 'code' ? (tm.craftTabs?.code || 'Code & IDE') : (tm.craftTabs?.design || 'Design & Creative')}
              </span>
              <div className="craft-os-mb-right">
                <button
                  type="button"
                  className="craft-os-tidy-btn"
                  onClick={resetWinPositions}
                  title="Reset window layout"
                  aria-label="Tidy window positions"
                >
                  <RotateCcw size={10} />
                  <span className="tidy-text">Tidy</span>
                </button>
                <span className="craft-os-mb-wifi" aria-hidden="true">▲▲▲</span>
                <span className="craft-os-mb-time">{osTime}</span>
              </div>
            </div>

            {/* Desktop with floating draggable windows */}
            <div className="craft-os-desktop" ref={desktopRef}>
              <div className="craft-os-desktop-bg" aria-hidden="true" />
              {craftTools.slice(0, 4).map((tool, i) => {
                const pos = winPositions[i] || { x: 0, y: 0, rotate: 0 }
                return (
                  <div
                    key={`${activeCraftTab}-${tool.name}`}
                    ref={el => winRefs.current[i] = el}
                    className={`craft-window ${activeWinIdx === i ? 'win-active' : 'win-inactive'} ${draggingIdx === i ? 'win-dragging' : ''}`}
                    style={{
                      transform: `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${draggingIdx === i ? 0 : pos.rotate}deg)`,
                      '--win-z': winZOrders[i] ?? i,
                      '--accent': getToolColor(tool.name),
                    }}
                    onPointerDown={e => handlePointerDown(e, i, tool.name)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && focusWindow(i, tool.name)}
                    aria-label={`Focus ${tool.name} window`}
                    aria-pressed={activeWinIdx === i}
                  >
                    {/* Title bar / drag handle */}
                    <div className="craft-win-chrome">
                      <div className="craft-win-dots">
                        <span className="tdot red" />
                        <span className="tdot yellow" />
                        <span className="tdot green" />
                      </div>
                      <span className="craft-win-title-bar">{tool.name}</span>
                      <span className="craft-win-tag">{activeWinIdx === i ? 'FOCUSED' : 'IDLE'}</span>
                    </div>

                    {/* Window content */}
                    <div className="craft-win-body">
                      <div className="craft-win-top">
                        <div className="craft-win-icon">{getToolIcon(tool.name)}</div>
                        <div className="craft-win-meta">
                          <p className="craft-win-name">{tool.name}</p>
                          <p className="craft-win-role">{tool.value}</p>
                        </div>
                        <span className="craft-win-status-dot" aria-hidden="true" />
                      </div>
                      <div className="craft-win-code-area">
                        <div className="craft-win-code-header">
                          <span className="craft-win-code-lang">{getToolLang(tool.name)}</span>
                          <span className="craft-win-line-count">{getToolCodeSnippet(tool.name).split('\n').length} lines</span>
                        </div>
                        <pre className="craft-win-code"><code>
                          {activeWinIdx === i
                            ? typedCode
                            : getToolCodeSnippet(tool.name).split('\n').slice(0, 2).join('\n') + '\n...'}
                          {activeWinIdx === i && typedCode.length < getToolCodeSnippet(tool.name).length
                            ? <span className="craft-win-cursor" aria-hidden="true">▌</span>
                            : null}
                        </code></pre>
                      </div>
                      <button
                        type="button"
                        className="craft-win-snippet-btn"
                        onClick={e => { e.stopPropagation(); setActiveToolModal(tool) }}
                      >
                        <Code2 size={10} /> Full Snippet
                      </button>
                    </div>

                    {/* Glow overlay */}
                    <div className="craft-win-glow" aria-hidden="true" />
                  </div>
                )
              })}
            </div>

            {/* macOS-style Dock */}
            <div className="craft-os-dock">
              <div className="craft-dock-inner">
                {craftTools.slice(0, 4).map((tool, i) => (
                  <button
                    key={`${activeCraftTab}-${tool.name}`}
                    type="button"
                    className={`craft-dock-item ${activeWinIdx === i ? 'dock-active' : ''} ${dockBounce === i ? 'dock-bounce' : ''}`}
                    onClick={() => focusWindow(i, tool.name)}
                    aria-label={tool.name}
                    aria-pressed={activeWinIdx === i}
                  >
                    <span className="craft-dock-icon">{getToolIcon(tool.name)}</span>
                    <span className="craft-dock-tooltip" role="tooltip">{tool.name}</span>
                    {activeWinIdx === i && <span className="craft-dock-indicator" aria-hidden="true" />}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          03: NEURAL LAYER — AI CHAT ROOM
      ══════════════════════════════════════════ */}
      <section id="freq-neural" className="freq-chapter freq-neural">
        <div className="freq-chapter-inner">
          <header className="freq-chapter-header">
            <span className="freq-ch-num">{freq.chapters.neural.num} // {freq.chapters.neural.label}<span className="freq-cursor-blink" aria-hidden="true">_</span></span>
            <h2 className="freq-ch-title">{freq.chapters.neural.title} <em>{freq.chapters.neural.titleEm}</em></h2>
            <p className="freq-ch-story">{freq.chapters.neural.story}</p>
          </header>

          <div className="chat-room">
            {/* Sidebar — AI list */}
            <div className="chat-sidebar">
              <p className="chat-sidebar-label">ACTIVE AI STACK</p>
              {Object.entries(AI_PERSONAS).map(([name, persona]) => (
                <button
                  key={name}
                  type="button"
                  className={`chat-ai-tab ${activeChatTool === name ? 'active' : ''}`}
                  style={{ '--ai-color': persona.color, '--ai-bg': persona.bgColor, '--ai-border': persona.borderColor }}
                  onClick={() => { setActiveChatTool(name); setIsChatTyping(false) }}
                >
                  <span className="chat-ai-avatar" style={{ background: persona.bgColor, border: `1px solid ${persona.borderColor}` }}>
                    {getToolIcon(name)}
                  </span>
                  <div className="chat-ai-meta">
                    <span className="chat-ai-name">{name}</span>
                    <span className="chat-ai-status">
                      <span className="chat-status-dot" style={{ background: persona.color }} />
                      online
                    </span>
                  </div>
                  {chatMessages[name]?.length > 0 && (
                    <span className="chat-msg-count">{chatMessages[name].length}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Main chat */}
            <div className="chat-main" style={{ '--ai-color': AI_PERSONAS[activeChatTool]?.color }}>
              {/* Chat header */}
              <div className="chat-header">
                <span className="chat-header-avatar" style={{ background: AI_PERSONAS[activeChatTool]?.bgColor }}>
                  {getToolIcon(activeChatTool)}
                </span>
                <div>
                  <p className="chat-header-name">{activeChatTool}</p>
                  <p className="chat-header-sub">Knows Mayla personally</p>
                </div>
                <button type="button" className="chat-reset-btn" onClick={handleChatReset} aria-label="Reset chat">
                  <RotateCcw size={13} />
                </button>
              </div>

              {/* Messages */}
              <div className="chat-body" ref={chatBodyRef}>
                {chatMessages[activeChatTool]?.length === 0 && (
                  <div className="chat-empty">
                    <p>Ask {activeChatTool} about Mayla.</p>
                    <p className="chat-empty-sub">Click the button below to start the conversation ↓</p>
                  </div>
                )}
                {chatMessages[activeChatTool]?.map((msg, i) => (
                  <div key={i} className={`chat-bubble-wrap ${msg.from === 'user' ? 'user-bubble' : 'ai-bubble'}`}>
                    {msg.from === 'ai' && (
                      <span className="chat-bubble-avatar" style={{ background: AI_PERSONAS[activeChatTool]?.bgColor }}>
                        {getToolIcon(activeChatTool)}
                      </span>
                    )}
                    <div className={`chat-bubble ${msg.from === 'user' ? 'bubble-user' : 'bubble-ai'}`}
                      style={msg.from === 'ai' ? { borderColor: AI_PERSONAS[activeChatTool]?.borderColor } : {}}>
                      {msg.text}
                      {msg.from === 'ai' && msg.text.length > 0 && msg.text.length < (AI_PERSONAS[activeChatTool]?.responses[0]?.length || 200) && (
                        <span className="bubble-typing-cursor" aria-hidden="true">▌</span>
                      )}
                    </div>
                  </div>
                ))}
                {isChatTyping && (
                  <div className="chat-bubble-wrap ai-bubble">
                    <span className="chat-bubble-avatar" style={{ background: AI_PERSONAS[activeChatTool]?.bgColor }}>{getToolIcon(activeChatTool)}</span>
                    <div className="chat-bubble bubble-ai chat-typing-indicator">
                      <span /><span /><span />
                    </div>
                  </div>
                )}
              </div>

              {/* Send button */}
              <div className="chat-footer">
                <div className="chat-input-mock">
                  <span>"Tell me about Mayla."</span>
                </div>
                <button type="button" className="chat-send-btn" onClick={handleChatSend} disabled={isChatTyping}>
                  <Send size={14} />
                  Ask {activeChatTool.split(' ')[0]}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          04: OFF-CIRCUIT — EDITORIAL SPREAD
      ══════════════════════════════════════════ */}
      <section id="freq-soul" className="freq-chapter freq-soul">
        <div className="freq-chapter-inner">
          <header className="freq-chapter-header">
            <span className="freq-ch-num">{freq.chapters.soul.num} // {freq.chapters.soul.label}<span className="freq-cursor-blink" aria-hidden="true">_</span></span>
            <h2 className="freq-ch-title">{freq.chapters.soul.title} <em>{freq.chapters.soul.titleEm}</em></h2>
            <p className="freq-ch-story">{freq.chapters.soul.story}</p>
          </header>

          {/* EDITORIAL GRID */}
          <div className="editorial-grid">

            {/* ── F1: Full hero, row 1 col 1 tall ── */}
            <div className="ed-f1">
              <div className="ed-f1-img" style={{ backgroundImage: `url(${BASE_URL}${tm.life?.f1?.bgImage || 'russell.jpg'})` }} />
              <div className="ed-f1-fade" />
              {/* HUD overlay top-right */}
              <div className="ed-f1-hud">
                <div className="hud-item"><span>SPD</span><strong>342</strong><span>km/h</span></div>
                <div className="hud-item"><span>DRS</span><strong className="drs-active">OPEN</strong></div>
                <div className="hud-item"><span>TYRE</span><strong>C5</strong></div>
                <div className="hud-item"><span>LAP</span><strong>47/57</strong></div>
              </div>
              {/* Driver number watermark */}
              <div className="ed-f1-num" aria-hidden="true">63</div>
              {/* Bottom text */}
              <div className="ed-f1-foot">
                <span className="ed-f1-eyebrow"><Flame size={11} /> {tm.life?.f1?.tag || 'FORMULA 1 · GEORGE RUSSELL'}</span>
                <h3 className="ed-f1-title">{tm.life?.f1?.title || 'F1 & George Russell Fanatic'}</h3>
                <p className="ed-f1-desc">{tm.life?.f1?.desc}</p>
                <div className="ed-f1-bar"><div className="ed-f1-fill" /></div>
              </div>
            </div>

            {/* ── MUSIC: row 1 col 2 ── */}
            <div className="ed-music">
              <div className="ed-block-eyebrow"><Music size={11} /> {tm.life?.music?.label || 'MUSIC LOVER'}</div>
              <h3 className="ed-block-title">{tm.life?.music?.title || 'Audio & Music Streams'}</h3>

              {/* Big vinyl */}
              <div className="ed-vinyl-wrap">
                <div className={`ed-vinyl ${isPlayingAudio ? 'ed-vinyl-spin' : ''}`}>
                  <div className="ed-vinyl-ring r1" />
                  <div className="ed-vinyl-ring r2" />
                  <div className="ed-vinyl-ring r3" />
                  <div className="ed-vinyl-center" />
                </div>
                {/* Now playing label */}
                {isPlayingAudio && (
                  <div className="ed-vinyl-now">
                    <Disc size={10} className="ed-vinyl-disc-icon" />
                    <span>{activeArtistTrack || 'Now Playing'}</span>
                  </div>
                )}
              </div>

              {/* Artist chips */}
              <div className="ed-artists">
                {tm.life?.music?.artists?.map(a => (
                  <button key={a} type="button"
                    className={`ed-artist-chip ${activeArtist === a && isPlayingAudio ? 'playing' : ''}`}
                    onClick={() => { if (activeArtist === a && isPlayingAudio) toggleAudio(); else playArtist(a) }}>
                    {activeArtist === a && isPlayingAudio ? <Volume2 size={10} /> : <Music size={10} />}
                    {a}
                  </button>
                ))}
              </div>

              {/* Platform links */}
              <div className="ed-platforms">
                {tm.life?.music?.platforms?.map(p => (
                  <a key={p.name} href={p.link} target="_blank" rel="noopener noreferrer" className="ed-platform-link">
                    {p.name === 'Spotify' ? <Music size={11} /> : <Radio size={11} />}
                    {p.name}
                    <ExternalLink size={9} />
                  </a>
                ))}
              </div>
            </div>

            {/* ── PERFUME: row 2 col 2 ── */}
            <div className="ed-perfume">
              <div className="ed-block-eyebrow"><Sparkles size={11} /> {tm.life?.perfume?.label || 'NICHE PERFUME'}</div>
              <h3 className="ed-block-title">{tm.life?.perfume?.title || 'Signature Scents'}</h3>
              <div className="ed-perfume-list">
                {(tm.life?.perfume?.items || [
                  { brand: 'HMNS', variant: 'Untitled Vol. 2' },
                  { brand: 'Bellisima', variant: 'Splendore' },
                  { brand: 'Lasains', variant: 'Donna' }
                ]).map((item, i) => (
                  <div key={item.brand} className="ed-perfume-row">
                    <span className="ed-perfume-idx">0{i + 1}</span>
                    <div className="ed-perfume-info">
                      <span className="ed-perfume-brand">{item.brand}</span>
                      <span className="ed-perfume-variant">{item.variant}</span>
                    </div>
                    <div className="ed-perfume-dot" />
                  </div>
                ))}
              </div>
              {/* Scent cloud visual */}
              <div className="ed-scent-cloud" aria-hidden="true">
                {['woody', 'floral', 'musk', 'amber', 'vanilla'].map((n, i) => (
                  <span key={n} className="ed-scent-tag" style={{ '--si': i }}>{n}</span>
                ))}
              </div>
            </div>

            {/* ── INSTAGRAM: row 2 col 1 (bottom) ── */}
            <div className="ed-instagram">
              <div className="ed-insta-gradient" />
              <div className="ed-insta-content">
                <div className="ed-block-eyebrow ed-insta-eyebrow"><Camera size={11} /> INSTAGRAM</div>
                <a
                  href={tm.life?.socials?.instagram?.link || 'https://instagram.com/mamaaamiaw'}
                  target="_blank" rel="noopener noreferrer"
                  className="ed-insta-handle"
                >
                  {tm.life?.socials?.instagram?.value || '@mamaaamiaw'}
                  <ExternalLink size={14} className="ed-insta-ext" />
                </a>
                <p className="ed-insta-sub">life outside the code editor ✦</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          05: OUTRO — LIVE STATUS & VIP PADDOCK PASS
      ══════════════════════════════════════════ */}
      <section id="freq-outro" className="freq-chapter freq-outro">
        <div className="outro-rings" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="outro-ring" style={{ '--ri': i }} />)}
        </div>
        <div className="freq-chapter-inner freq-outro-inner">
          <span className="freq-ch-num outro-ch-num">
            {freq.chapters.outro.num} // {freq.chapters.outro.label}
            <span className="freq-cursor-blink" aria-hidden="true">_</span>
          </span>

          <h2 className="freq-outro-title">
            {(freq.chapters.outro.title + ' ' + freq.chapters.outro.titleEm).split(' ').map((word, i) => (
              <span key={i} className="outro-word-wrap">
                <span className="outro-word">{word}</span>{' '}
              </span>
            ))}
          </h2>

          <p className="freq-ch-story outro-story">{freq.chapters.outro.story}</p>

          {/* ── 2-Column Collaboration Showcase ── */}
          <div className="freq-collab-grid">
            {/* 1. LEFT: Live Status / Frequency Board */}
            <div className="freq-status-card">
              <div className="status-card-header">
                <div className="status-live-indicator">
                  <span className="live-pulse-dot" />
                  <span className="status-live-text">{language === 'id' ? 'STATUS LANGSUNG' : 'LIVE TELEMETRY'}</span>
                </div>
                <span className="status-live-clock">
                  <Clock size={12} /> {wibTime || 'Jakarta, WIB'}
                </span>
              </div>

              <div className="status-feed-list">
                <div className="status-feed-item">
                  <div className="status-feed-icon"><MapPin size={14} /></div>
                  <div className="status-feed-info">
                    <span className="feed-label">{language === 'id' ? 'LOKASI / BASIS' : 'LOCATION / BASE'}</span>
                    <span className="feed-val">Jakarta, Indonesia <span className="feed-dim">(UTC+7)</span></span>
                  </div>
                </div>

                <div className="status-feed-item">
                  <div className="status-feed-icon"><Activity size={14} /></div>
                  <div className="status-feed-info">
                    <span className="feed-label">{language === 'id' ? 'KETERSEDIAAN' : 'AVAILABILITY'}</span>
                    <span className="feed-val status-val-avail">
                      <span className="avail-badge-dot" />
                      {language === 'id' ? 'Terbuka untuk Full-Time & Freelance' : 'Open to Full-Time & Select Freelance'}
                    </span>
                  </div>
                </div>

                <div className="status-feed-item">
                  <div className="status-feed-icon"><Code2 size={14} /></div>
                  <div className="status-feed-info">
                    <span className="feed-label">{language === 'id' ? 'FOKUS UTAMA' : 'CURRENT FOCUS'}</span>
                    <span className="feed-val">{language === 'id' ? 'Frontend Berstandar Tinggi, UI Motion & Desain Interaktif' : 'High-Craft Frontend, UI Motion & Micro-Interactions'}</span>
                  </div>
                </div>

                <div className="status-feed-item">
                  <div className="status-feed-icon"><Flame size={14} /></div>
                  <div className="status-feed-info">
                    <span className="feed-label">{language === 'id' ? 'F1 TELEMETRI' : 'PADDOCK RADAR'}</span>
                    <span className="feed-val f1-mercy-val">Mercedes-AMG PETRONAS F1 · GR63</span>
                  </div>
                </div>

                <div className="status-feed-item">
                  <div className="status-feed-icon"><Music size={14} /></div>
                  <div className="status-feed-info">
                    <span className="feed-label">{language === 'id' ? 'ROTASI AUDIO' : 'CURRENT ON LOOP'}</span>
                    <span className="feed-val">
                      {isPlayingAudio && activeArtist ? `${activeArtist} · ${activeArtistTrack}` : 'Sade · Lana Del Rey · Enya'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="status-card-footer">
                <span className="status-quote">
                  ⚡ "{language === 'id' ? 'Fokus pada 60fps animasi, kode bersih, dan estetika yang hidup.' : 'Obsessed with 60fps animations, clean code, and designs that feel alive.'}"
                </span>
              </div>
            </div>

            {/* 2. RIGHT: VIP Paddock Pass */}
            <div className="freq-pass-card">
              {/* Lanyard Hole Clip */}
              <div className="pass-hanger">
                <div className="pass-hanger-slot" />
              </div>

              <div className="pass-hologram-strip" />

              <div className="pass-header">
                <div className="pass-brand">
                  <span className="pass-logo-badge">M63</span>
                  <div>
                    <span className="pass-supertitle">MAYLA FATIN // ALL ACCESS</span>
                    <h3 className="pass-title">PADDOCK COLLAB PASS</h3>
                  </div>
                </div>
                <span className="pass-code">PASS #2026-63</span>
              </div>

              <div className="pass-role-badge">
                <Sparkles size={13} className="pass-sparkle-icon" />
                <span>CREATIVE FRONTEND & UI ENGINEER</span>
              </div>

              <p className="pass-pitch">
                {language === 'id' 
                  ? 'Punya ide proyek seru, butuh frontend engineer yang peduli detail, atau ingin berdiskusi?'
                  : 'Have an exciting project, looking for a design-obsessed engineer, or just want to connect?'}
              </p>

              {/* Action Buttons */}
              <div className="pass-actions">
                <button 
                  type="button" 
                  className={`pass-copy-btn ${copiedEmail ? 'copied' : ''}`}
                  onClick={handleCopyEmail}
                >
                  <span className="copy-btn-icon">
                    {copiedEmail ? <Check size={16} /> : <Copy size={16} />}
                  </span>
                  <div className="copy-btn-text">
                    <span className="copy-sublabel">{copiedEmail ? (language === 'id' ? 'Email tersalin!' : 'Copied to clipboard!') : (language === 'id' ? 'Klik untuk salin email' : 'Click to copy email')}</span>
                    <strong className="copy-val">maylafaat@gmail.com</strong>
                  </div>
                  <span className="copy-badge">{copiedEmail ? '✓ COPIED' : 'COPY'}</span>
                </button>

                <div className="pass-quick-links">
                  <a href="mailto:maylafaat@gmail.com" className="pass-link-btn" title="Send Email">
                    <Mail size={14} /> <span>Email</span> <ArrowUpRight size={12} />
                  </a>
                  <a href="https://linkedin.com/in/maylafathinnadhifaulya" target="_blank" rel="noopener noreferrer" className="pass-link-btn" title="LinkedIn">
                    <span>LinkedIn</span> <ArrowUpRight size={12} />
                  </a>
                  <a href="https://github.com/Maylafathin12" target="_blank" rel="noopener noreferrer" className="pass-link-btn" title="GitHub">
                    <span>GitHub</span> <ArrowUpRight size={12} />
                  </a>
                  <a href={`${BASE_URL}cv-mayla.pdf`} target="_blank" rel="noopener noreferrer" className="pass-link-btn cv-btn" title="View CV">
                    <FileText size={14} /> <span>CV</span> <ArrowUpRight size={12} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="outro-actions">
            <Link to="/" className="freq-back-btn">
              <span className="back-orb" aria-hidden="true" />
              <span>{freq.backHome}</span>
              <span className="back-shine" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CODE MODAL ── */}
      {activeToolModal && (
        <div className="freq-modal-backdrop" onClick={() => setActiveToolModal(null)} role="presentation">
          <div className="freq-code-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="freq-modal-header">
              <div className="freq-modal-dots"><span className="tdot red" /><span className="tdot yellow" /><span className="tdot green" /></div>
              <div className="freq-modal-title-wrap">{getToolIcon(activeToolModal.name)}<span>{activeToolModal.name}</span></div>
              <button type="button" className="freq-modal-close" onClick={() => setActiveToolModal(null)} aria-label="Close"><X size={16} /></button>
            </div>
            <pre className="freq-code-block"><code>{getToolCodeSnippet(activeToolModal.name)}</code></pre>
            <div className="freq-modal-footer"><span className="modal-footer-role">{activeToolModal.value}</span></div>
          </div>
        </div>
      )}

      {/* ── TERMINAL ── */}
      {isTerminalOpen && (
        <div className="freq-modal-backdrop" onClick={() => setIsTerminalOpen(false)} role="presentation">
          <div className="freq-terminal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="freq-terminal-header">
              <div className="freq-terminal-dots"><span className="tdot red" /><span className="tdot yellow" /><span className="tdot green" /></div>
              <span>zsh — mayla@freq</span>
              <button type="button" className="freq-modal-close" onClick={() => setIsTerminalOpen(false)} aria-label="Close"><X size={15} /></button>
            </div>
            <div className="freq-terminal-body">
              {terminalLogs.map((log, i) => (<div key={i} className={`term-line term-${log.type}`}><pre>{log.text}</pre></div>))}
              <form onSubmit={handleTerminalSubmit} className="term-form">
                <span className="term-prompt">$</span>
                <input ref={terminalInputRef} value={terminalInput} onChange={e => setTerminalInput(e.target.value)} placeholder="help · stack · f1 · hire" className="term-input" />
                <button type="submit" className="term-submit"><CornerDownLeft size={13} /></button>
              </form>
            </div>
          </div>
        </div>
      )}

      <button type="button" className="freq-terminal-fab" onClick={() => setIsTerminalOpen(true)} aria-label="Open terminal">
        <Command size={14} />
      </button>
    </div>
  )
}

export default Uses
