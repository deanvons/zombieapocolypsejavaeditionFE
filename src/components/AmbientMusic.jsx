import { useEffect } from "react";
import { Howl } from "howler";
import { useLocation } from "react-router";
import "../service/audio-settings.js";

const GLOBAL_AMBIENCE = {
  src: "/audio/universfield-dark-crime-atmosphere-04-485924.mp3",
  volume: 0.12,
  fadeInDuration: 1800,
  fadeOutDuration: 0,
};
const HOMEPAGE_MUSIC = {
  src: "/audio/universfield-dark-tension-atmosphere-30s-453257.mp3",
  volume: 0.3,
};
const CAMP_MUSIC = {
  src: "/audio/soundsforyou-campfire-crackling-fireplace-sound-119594.mp3",
  volume: 0.35,
};

function startLoopingTrack({ src, volume, fadeInDuration = 1000, fadeOutDuration = 1200 }) {
  let isActive = true;
  let soundId;
  const music = new Howl({
    src: [src],
    loop: true,
    volume: 0,
    preload: true,
  });

  const startMusic = () => {
    if (!isActive) return;
    soundId = music.play();
    music.fade(0, volume, fadeInDuration, soundId);
  };

  music.once("playerror", () => {
    music.once("unlock", startMusic);
  });
  startMusic();

  return () => {
    isActive = false;
    if (soundId != null && music.playing(soundId)) {
      const stopMusic = () => {
        music.stop(soundId);
        music.unload();
      };
      if (fadeOutDuration > 0) {
        music.fade(music.volume(soundId), 0, fadeOutDuration, soundId);
        window.setTimeout(stopMusic, fadeOutDuration);
      } else {
        stopMusic();
      }
    } else {
      music.unload();
    }
  };
}

export default function AmbientMusic({ enabled = true }) {
  const { pathname } = useLocation();
  const track = !enabled
    ? null
    : pathname === "/camp"
      ? CAMP_MUSIC
      : ["/", "/settings", "/create-survivor", "/delete-survivor"].includes(pathname)
        ? HOMEPAGE_MUSIC
        : null;
  const shouldPlayGlobalAmbience = enabled
    && !["/", "/settings", "/create-survivor", "/delete-survivor"].includes(pathname);

  // This is vibe coded: keep low dark-crime ambience only on the other pages.
  useEffect(() => {
    if (shouldPlayGlobalAmbience) return startLoopingTrack(GLOBAL_AMBIENCE);
  }, [shouldPlayGlobalAmbience]);

  useEffect(() => {
    if (track) return startLoopingTrack(track);
  }, [track]);

  return null;
}