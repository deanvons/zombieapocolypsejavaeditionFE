import { Howler } from "howler";

const AUDIO_SETTINGS_KEY = "zombie-apocalypse-audio-settings";
const DEFAULT_AUDIO_SETTINGS = { volume: 0.5, muted: false };

export function getAudioSettings() {
  try {
    const storedSettings = JSON.parse(localStorage.getItem(AUDIO_SETTINGS_KEY));
    return {
      volume: Number.isFinite(storedSettings?.volume)
        ? Math.min(1, Math.max(0, storedSettings.volume))
        : DEFAULT_AUDIO_SETTINGS.volume,
      muted: typeof storedSettings?.muted === "boolean"
        ? storedSettings.muted
        : DEFAULT_AUDIO_SETTINGS.muted,
    };
  } catch {
    return DEFAULT_AUDIO_SETTINGS;
  }
}

export function updateAudioSettings(changes) {
  const settings = { ...getAudioSettings(), ...changes };
  localStorage.setItem(AUDIO_SETTINGS_KEY, JSON.stringify(settings));
  applyAudioSettings(settings);
  return settings;
}

function applyAudioSettings(settings) {
  Howler.volume(settings.volume);
  Howler.mute(settings.muted);
}

// This is vibe coded: apply the saved master controls to every Howler sound.
applyAudioSettings(getAudioSettings());