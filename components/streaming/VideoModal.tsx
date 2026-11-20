'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useMusic } from '@/components/MusicaFondo'
import type { VideoItem } from '@/data/serie'

export function VideoModal({ video, onClose }: { video: VideoItem | null; onClose: () => void }) {
  const modalRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)
  const wasMusicPlaying = useRef(false)
  const [playbackError, setPlaybackError] = useState(false)
  const { isPlaying: isMusicPlaying, pauseMusic, resumeMusic } = useMusic()
  const musicPlayingRef = useRef(isMusicPlaying)

  useEffect(() => {
    musicPlayingRef.current = isMusicPlaying
  }, [isMusicPlaying])

  useEffect(() => {
    if (!video) return

    previousActiveElement.current = document.activeElement as HTMLElement | null
    wasMusicPlaying.current = musicPlayingRef.current
    pauseMusic()
    document.body.style.overflow = 'hidden'

    const focusable = modalRef.current?.querySelectorAll<HTMLElement>('button, video')
    focusable?.[0]?.focus()
    setPlaybackError(false)

    const player = videoRef.current
    if (player) {
      const playPromise = player.play()
      if (playPromise) {
        playPromise.catch(() => setPlaybackError(true))
      }
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'Tab' && focusable?.length) {
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      player?.pause()
      if (wasMusicPlaying.current) resumeMusic()
      previousActiveElement.current?.focus()
    }
  }, [onClose, pauseMusic, resumeMusic, video])

  return (
    <AnimatePresence>
      {video && (
        <motion.div
          className="video-modal-backdrop"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose()
          }}
        >
          <motion.section
            ref={modalRef}
            className="video-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="video-modal-title"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          >
            <button className="video-modal-close" type="button" onClick={onClose} aria-label="Cerrar video">
              <X />
            </button>
            <video
              ref={videoRef}
              className="video-modal-player"
              src={video.src}
              controls
              playsInline
              onError={() => setPlaybackError(true)}
              aria-describedby="video-modal-description"
            />
            <div className="video-modal-info">
              <h2 id="video-modal-title">{video.title}</h2>
              <p id="video-modal-description">{video.description}</p>
              {playbackError && (
                <span className="video-modal-error" role="status">
                  No se pudo reproducir este video. Usa los controles para intentar de nuevo.
                </span>
              )}
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
