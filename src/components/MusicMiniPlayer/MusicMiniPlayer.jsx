import { useLocation } from 'react-router-dom'
import { Music, Pause, Play } from 'lucide-react'
import { ARTIST_TRACKS } from '../../context/AudioContext'
import './MusicMiniPlayer.css'

const MusicMiniPlayer = ({ isPlaying, trackName, onToggle, onSelectArtist }) => {
  const location = useLocation()
  const isUsesPage = location.pathname.endsWith('/uses')

  if (isUsesPage) return null

  return (
    <div className="music-mini-player" role="region" aria-label="Now playing">
      <div className="mini-player-left">
        <div className={`mini-eq ${isPlaying ? 'active' : ''}`}>
          <span /><span /><span />
        </div>
        <div className="mini-track-info">
          <span className="mini-label">NOW PLAYING</span>
          <span className="mini-track">{trackName}</span>
        </div>
      </div>

      <div className="mini-artists">
        {Object.keys(ARTIST_TRACKS).map((artist) => (
          <button
            key={artist}
            type="button"
            className={`mini-artist-btn ${trackName.startsWith(artist) ? 'active' : ''}`}
            onClick={() => onSelectArtist(artist)}
            title={artist}
          >
            <Music size={11} />
            {artist.split(' ')[0]}
          </button>
        ))}
      </div>

      <button
        type="button"
        className={`mini-toggle ${isPlaying ? 'playing' : ''}`}
        onClick={onToggle}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
      </button>
    </div>
  )
}

export default MusicMiniPlayer
