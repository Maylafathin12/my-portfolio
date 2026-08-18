import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'

gsap.registerPlugin(ScrollTrigger)

// Fix ScrollTrigger conflict
ScrollTrigger.config({
  ignoreMobileResize: true,
  autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load'
})

import { LanguageProvider } from './context/LanguageContext'
import { AudioProvider } from './context/AudioContext'
import { AboutUnlockProvider } from './context/AboutUnlockContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <LanguageProvider>
        <AudioProvider>
          <AboutUnlockProvider>
            <App />
          </AboutUnlockProvider>
        </AudioProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
)