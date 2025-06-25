import React, { useEffect, useRef } from "react";
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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Instancie le player
    const player = new shaka.Player(video);

    // Gestion des erreurs
    player.addEventListener("error", (e: Event) => {
      // @ts-ignore
      console.error("Shaka Player Error", e.detail);
    });

    // Charge la source
    player.load(src).catch((e: unknown) => {
      console.error("Erreur de chargement Shaka", e);
    });

    return () => {
      player.destroy();
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      poster={poster}
      autoPlay={autoPlay}
      controls={controls}
      style={{ width: "100%", height: "auto" }}
    />
  );
}; 