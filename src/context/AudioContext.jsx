import { createContext, useContext, useRef, useState } from 'react'
import MusicMiniPlayer from '../components/MusicMiniPlayer/MusicMiniPlayer'

export const ARTIST_TRACKS = {
  SADE: {
    file: 'Sade Smooth Operator Lyrics.mp3',
    label: 'Smooth Operator'
  },
  ENYA: {
    file: 'Enya Caribbean Blue.mp3',
    label: 'Caribbean Blue'
  },
  'Lana Del Rey': {
    file: 'Lara Del Rey - Young And Beautiful.mp3',
    label: 'Young And Beautiful'
  }
}

const AudioContext = createContext(null)

export const AudioProvider = ({ children }) => {
  const audioRef = useRef(null)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [activeArtist, setActiveArtist] = useState('SADE')
  const [hasActiveSession, setHasActiveSession] = useState(false)

  const activeArtistTrack = `${activeArtist} — ${ARTIST_TRACKS[activeArtist].label}`

  const getTrackSrc = (artist) => {
    const track = ARTIST_TRACKS[artist]
    if (!track) return null
    return `${import.meta.env.BASE_URL}${encodeURI(track.file)}`
  }

  const playArtist = async (artist) => {
    const audio = audioRef.current
    if (!audio || !ARTIST_TRACKS[artist]) return

    setActiveArtist(artist)
    setHasActiveSession(true)

    const src = getTrackSrc(artist)
    if (audio.dataset.artist !== artist) {
      audio.src = src
      audio.dataset.artist = artist
    }

    try {
      await audio.play()
      setIsPlayingAudio(true)
    } catch (err) {
      console.error('Audio playback failed:', err)
      setIsPlayingAudio(false)
    }
  }

  const toggleAudio = async () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlayingAudio) {
      audio.pause()
      setIsPlayingAudio(false)
      return
    }

    if (!audio.src) {
      await playArtist(activeArtist)
      return
    }

    try {
      await audio.play()
      setIsPlayingAudio(true)
    } catch (err) {
      console.error('Audio playback failed:', err)
      setIsPlayingAudio(false)
    }
  }

  return (
    <AudioContext.Provider
      value={{
        isPlayingAudio,
        activeArtist,
        activeArtistTrack,
        hasActiveSession,
        playArtist,
        toggleAudio,
        artistTracks: ARTIST_TRACKS
      }}
    >
      {children}

      <audio
        ref={audioRef}
        preload="metadata"
        onEnded={() => setIsPlayingAudio(false)}
      />

      {hasActiveSession && (
        <MusicMiniPlayer
          isPlaying={isPlayingAudio}
          trackName={activeArtistTrack}
          onToggle={toggleAudio}
          onSelectArtist={playArtist}
        />
      )}
    </AudioContext.Provider>
  )
}

export const useAudio = () => {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider')
  }
  return context
}
