import { createContext, useCallback, useContext, useState } from 'react'

const STORAGE_KEY = 'about-section-unlocked'

const AboutUnlockContext = createContext(null)

export const AboutUnlockProvider = ({ children }) => {
  const [isUnlocked, setIsUnlocked] = useState(
    () => sessionStorage.getItem(STORAGE_KEY) === 'true'
  )
  const [shakeTrigger, setShakeTrigger] = useState(0)

  const unlock = useCallback(() => {
    sessionStorage.setItem(STORAGE_KEY, 'true')
    setIsUnlocked(true)
  }, [])

  const requestShake = useCallback(() => {
    setShakeTrigger((prev) => prev + 1)
  }, [])

  return (
    <AboutUnlockContext.Provider
      value={{ isUnlocked, unlock, shakeTrigger, requestShake }}
    >
      {children}
    </AboutUnlockContext.Provider>
  )
}

export const useAboutUnlock = () => {
  const context = useContext(AboutUnlockContext)
  if (!context) {
    throw new Error('useAboutUnlock must be used within an AboutUnlockProvider')
  }
  return context
}

export const LOCKED_SECTION_IDS = [
  'projects',
  'experience',
  'skills',
  'certifications',
  'education',
  'contact'
]
