import { ShakaPlayer } from "./ShakaPlayer";
import { useRef, useEffect, useState, useCallback } from "react";

type VideoPlayerProps = {
  playbackId?: string | null;
  poster?: string;
  autoPlay?: boolean;
  controls?: boolean;
  className?: string;
};

export const VideoPlayer = ({
  playbackId,
  poster,
  autoPlay = false,
  controls = true,
  className,
}: VideoPlayerProps) => {
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
  const refCallback = useCallback((el: HTMLVideoElement | null) => {
    if (el) setVideoEl(el);
  }, []);
  if (!playbackId) return <div>Vidéo non disponible</div>;
  const src = `https://stream.mux.com/${playbackId}.m3u8`;

  // Auto-pause des autres vidéos
  useEffect(() => {
    if (!videoEl) return;
    const handlePauseOthers = (e: CustomEvent) => {
      if (e.detail !== videoEl) {
        videoEl.pause();
      }
    };
    window.addEventListener('xdose-video-play', handlePauseOthers as EventListener);
    return () => {
      window.removeEventListener('xdose-video-play', handlePauseOthers as EventListener);
    };
  }, [videoEl]);

  // Dispatch event quand la vidéo est jouée
  useEffect(() => {
    if (!videoEl) return;
    const onPlay = () => {
      window.dispatchEvent(new CustomEvent('xdose-video-play', { detail: videoEl }));
    };
    videoEl.addEventListener('play', onPlay);
    return () => {
      videoEl.removeEventListener('play', onPlay);
    };
  }, [playbackId, videoEl]);

  return (
    <div className={className}>
      <ShakaPlayer
        ref={refCallback}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        controls={controls}
      />
    </div>
  );
}; 