import MuxPlayer from '@mux/mux-player-react';

interface VideoPlayerProps {
  playbackId: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  context?: string;
}

export const VideoPlayer = ({
  playbackId,
  poster,
  className = "",
  autoPlay = false,
  context = "unknown"
}: VideoPlayerProps) => {
  console.log("[VideoPlayer] render", { playbackId, context });
  return (
    <div className={`relative group overflow-hidden rounded-xl ${className}`}>
      <MuxPlayer
        playbackId={playbackId}
        poster={poster}
        autoPlay={autoPlay}
        streamType="on-demand"
        accentColor="#a21caf"
        metadata={{
          video_title: 'Vidéo Xdose',
          viewer_user_id: 'anonymous',
        }}
        className="w-full aspect-video object-cover"
      />
      {/* Badge VIP */}
      <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-lg">
        VIP
      </div>
    </div>
  );
} 