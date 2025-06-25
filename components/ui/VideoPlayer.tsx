import { ShakaPlayer } from "./ShakaPlayer";

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
  if (!playbackId) return <div>Vidéo non disponible</div>;
  const src = `https://stream.mux.com/${playbackId}.m3u8`;
  return (
    <div className={className}>
      <ShakaPlayer
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        controls={controls}
      />
    </div>
  );
}; 