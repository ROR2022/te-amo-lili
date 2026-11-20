import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import { serie, type VideoItem } from '@/data/serie'
import { reveal } from './animations'

export function VideoRow({ onVideo }: { onVideo: (video: VideoItem) => void }) {
  return (
    <motion.section className="content-section videos-section" id="videos" {...reveal}>
      <div className="section-heading">
        <h2>Nuestros momentos</h2>
        <span>Recuerdos que siempre volvería a reproducir</span>
      </div>
      <div className="video-grid">
        {serie.videos.map((video) => (
          <motion.button
            key={video.src}
            className="video-card"
            type="button"
            onClick={() => onVideo(video)}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            aria-label={`Reproducir ${video.title}`}
          >
            <div className="video-card-preview">
              <video src={video.src} muted preload="metadata" playsInline aria-hidden="true" />
              <span className="video-card-overlay">
                <span className="video-play-button">
                  <Play fill="currentColor" size={20} />
                </span>
              </span>
            </div>
            <div className="video-card-copy">
              <strong>{video.title}</strong>
              <p>{video.description}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.section>
  )
}
