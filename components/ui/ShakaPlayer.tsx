import React, { useEffect, useRef, useState } from "react";
// @ts-ignore
import * as shaka from "shaka-player/dist/shaka-player.compiled.js";

type ShakaPlayerProps = {
  src: string; // URL du manifest DASH ou HLS
  poster?: string;
  autoPlay?: boolean;
  controls?: boolean;
};

export const ShakaPlayer: React.FC<ShakaPlayerProps> = ({
  src,
  poster,
  autoPlay = false,
  controls = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [aspectRatio, setAspectRatio] = useState<string>("16/9"); // Default

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Instancie le player (API v5 ready)
    const player = new shaka.Player();
    player.attach(video);

    // Gestion des erreurs
    player.addEventListener("error", (e: Event) => {
      // @ts-ignore
      console.error("Shaka Player Error", e.detail);
    });

    // Détection du ratio d'aspect
    const handleLoadedMetadata = () => {
      const { videoWidth, videoHeight } = video;
      if (videoWidth && videoHeight) {
        const ratio = videoWidth / videoHeight;
        let aspectRatioCSS = "16/9"; // Default
        
        if (ratio > 1.5) {
          aspectRatioCSS = "16/9"; // Landscape
        } else if (ratio < 0.8) {
          aspectRatioCSS = "9/16"; // Portrait (TikTok, Stories)
        } else if (ratio > 0.9 && ratio < 1.1) {
          aspectRatioCSS = "1/1"; // Square (Instagram)
        } else if (ratio > 1.1 && ratio < 1.5) {
          aspectRatioCSS = "4/3"; // Classic
        }
        
        setAspectRatio(aspectRatioCSS);
      }
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    // Charge la source
    player.load(src).catch((e: unknown) => {
      console.error("Erreur de chargement Shaka", e);
    });

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      player.destroy();
    };
  }, [src]);

  return (
    <div 
      className="w-full overflow-hidden rounded-lg"
      style={{ 
        aspectRatio: aspectRatio,
        maxHeight: aspectRatio === "9/16" ? "80vh" : "none" // Limite la hauteur pour les vidéos portrait
      }}
    >
      <video
        ref={videoRef}
        poster={poster}
        autoPlay={autoPlay}
        controls={controls}
        className="w-full h-full object-cover"
        style={{ 
          aspectRatio: aspectRatio,
        }}
      />
    </div>
  );
}; 