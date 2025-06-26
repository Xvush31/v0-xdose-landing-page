import { ShakaPlayer } from "./ShakaPlayer";
import { useRef, useState } from "react";

type VideoPlayerProps = {
  playbackId?: string | null;
  poster?: string;
  autoPlay?: boolean;
  controls?: boolean;
  className?: string;
  previewOnHover?: boolean;
};

export const VideoPlayer = ({
  playbackId,
  poster,
  autoPlay = false,
  controls = true,
  className,
  previewOnHover = false,
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  if (!playbackId) return <div>Vidéo non disponible</div>;
  const src = `https://stream.mux.com/${playbackId}.m3u8`;

  // Hover preview logic (desktop only)
  const handleMouseEnter = () => {
    if (previewOnHover && videoRef.current) {
      const video = videoRef.current.querySelector('video') as HTMLVideoElement | null;
      if (video) {
        video.muted = true;
        video.play().catch(() => {});
      }
    }
  };
  const handleMouseLeave = () => {
    if (previewOnHover && videoRef.current) {
      const video = videoRef.current.querySelector('video') as HTMLVideoElement | null;
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    }
  };

  // Play/Pause on overlay click
  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const video = videoRef.current.querySelector('video') as HTMLVideoElement | null;
      if (video) {
        if (isPlaying) {
          video.pause();
          setIsPlaying(false);
        } else {
          video.muted = false;
          video.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      }
    }
  };

  // Listen to pause event to update isPlaying
  const handleVideoClick = () => {
    if (videoRef.current) {
      const video = videoRef.current.querySelector('video') as HTMLVideoElement | null;
      if (video) {
        if (video.paused) {
          video.muted = false;
          video.play().then(() => setIsPlaying(true)).catch(() => {});
        } else {
          video.pause();
          setIsPlaying(false);
        }
      }
    }
  };

  // Hide overlay Play when playing
  return (
    <div
      className={className + " relative"}
      ref={videoRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleVideoClick}
    >
      <ShakaPlayer
        src={src}
        poster={poster}
        autoPlay={autoPlay && !previewOnHover}
        controls={controls}
      />
      {/* Overlay Play (affiché si pas playing) */}
      {!isPlaying && (
        <button
          type="button"
          className="absolute inset-0 flex items-center justify-center focus:outline-none"
          tabIndex={0}
          aria-label="Lire la vidéo"
          onClick={handlePlayClick}
          style={{ background: "rgba(0,0,0,0.25)", transition: "background 0.2s" }}
        >
          <div className="w-16 h-16 bg-black/60 rounded-full flex items-center justify-center shadow-xl animate-pulse">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21" /></svg>
          </div>
        </button>
      )}
    </div>
  );
}; 