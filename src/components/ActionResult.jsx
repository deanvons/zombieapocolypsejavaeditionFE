import "../css/ActionPage.css";
import { useEffect, useState } from "react";
import { Howl } from "howler";

// This is vibe coded: Attack-only laser charge during the score count-up.
const attackChargingSound = new Howl({
    src: ["/audio/freesound_community-062708_laser-charging-81968.mp3"],
    volume: 1,
    preload: true,
    onloaderror: (_id, error) => console.error("Could not load charging sound:", error),
    onplayerror: (_id, error) => console.error("Could not play charging sound:", error),
});

// This is vibe coded: healing spell plays while a Heal result counts up.
const healingSpellSound = new Howl({
    src: ["/audio/vadim_makes_sound-fantasy-healing-spell-cast-1-547831.mp3"],
    volume: 0.8,
    preload: true,
    // This is vibe coded: skip the quiet intro of the healing spell.
    sprite: { spell: [400, 4600] },
});

// This is vibe coded: footsteps play while a Scavenge result counts up.
const scavengeFootstepsSound = new Howl({
    src: ["/audio/soumages-walking-on-dirt-363354.mp3"],
    volume: 0.8,
    preload: true,
});

// This is vibe coded: breaking wood plays while a Shelter result counts up.
const shelterChargeSound = new Howl({
    src: ["/audio/dragon-studio-breaking-wood-356120.mp3"],
    volume: 0.8,
    preload: true,
    // This is vibe coded: skip the intro and start at the Breaking Wood hit.
    sprite: { wood: [1000, 4000] },
});

// This is vibe coded: Pixabay knife slice played when the Attack boom starts.
const attackSound = new Howl({
    src: ["/audio/freesound_community-knife-slice-41231.mp3"],
    volume: 0.7,
    preload: true,
    // This is vibe coded: skip the quiet lead-in so the slice transient hits with the animation.
    sprite: { slice: [200, 800] },
});

// This is vibe coded: health pickup plays when a Heal count reaches its final value.
const healthPickupSound = new Howl({
    src: ["/audio/freesound_community-health-pickup-6860.mp3"],
    volume: 0.8,
    preload: true,
});

// This is vibe coded: coin drop plays when a Scavenge count reaches its final value.
const coinDropSound = new Howl({
    src: ["/audio/universfield-coin-drop-229314.mp3"],
    volume: 0.8,
    preload: true,
});

// This is vibe coded: bonfire plays when the Shelter result completes.
const shelterBuildSound = new Howl({
    src: ["/audio/alexzavesa-bonfire-1-468364.mp3"],
    volume: 0.8,
    preload: true,
    // This is vibe coded: skip the intro and cap the completion sound at two seconds.
    sprite: { shelter: [1000, 2000] },
});

// This is vibe coded: a looping drone underscores Persuade and fades away at the result.
const persuadeDroneSound = new Howl({
    src: ["/audio/soundreality-deep-drone-588746.mp3"],
    volume: 0.8,
    preload: true,
});

// This is vibe coded.
function playAttackSound() {
    attackSound.stop();
    attackSound.play("slice");
}

function playHealthPickupSound() {
    healthPickupSound.stop();
    const soundId = healthPickupSound.play();
    // This is vibe coded: slightly slow the Heal completion sound.
    healthPickupSound.rate(0.9, soundId);
}

function playCoinDropSound() {
    coinDropSound.stop();
    coinDropSound.play();
}

function playShelterBuildSound() {
    shelterBuildSound.stop();
    const soundId = shelterBuildSound.play("shelter");
    // This is vibe coded. Fade out during the final 400 ms of the sprite.
    window.setTimeout(() => {
        const currentVolume = shelterBuildSound.volume(soundId);
        shelterBuildSound.fade(currentVolume, 0, 400, soundId);
    }, 1600);
}

// This is vibe coded: recognize both "Shelter" and "Build Shelter" action names.
function isShelterAction(actionType) {
    return actionType?.includes("shelter") ?? false;
}

function ActionResultPanel({effectiveness, displayedScore, resultRunKey, revealRunKey, impactStyle, actionType}) {
    // This is vibe coded: only reveal effects for the current completed action.
    const isRevealActive = revealRunKey === resultRunKey;
    // This is vibe coded: name the action in the result heading.
    const actionLabel = actionType?.replace(/\b\w/g, (letter) => letter.toUpperCase()) ?? "Action";

    return (
        <div
            className={`action-card action-panel-soft-border flex flex-col ${actionType === "attack" && isRevealActive ? "attack-impact" : ""} ${actionType === "heal" && isRevealActive ? "heal-light" : ""} ${isShelterAction(actionType) && isRevealActive ? "shelter-relief" : ""} ${actionType === "persuade" && isRevealActive ? "persuade-dread" : ""}`}
            style={impactStyle}
            // This is vibe coded: sync the slice sound to the box animation start.
            onAnimationStart={(event) => {
                if (actionType === "attack" && event.animationName === "attack-impact") {
                    playAttackSound();
                }
            }}
        >
            <h3 className="action-card-title action-result-heading">Result of {actionLabel}</h3>
            <div className="relative flex flex-1 items-center justify-center">
                { effectiveness != null ? (
                    <div className="flex flex-col items-center justify-center">
                        <p className="action-effectiveness-label">Effectiveness</p>
                        <div className="scavenge-score-stage">
                            <p className={`action-result-score ${actionType === "attack" && isRevealActive ? "attack-score" : ""} ${actionType === "heal" && isRevealActive ? "heal-score" : ""} ${actionType === "scavenge" && isRevealActive ? "scavenge-score" : ""} ${isShelterAction(actionType) && isRevealActive ? "shelter-score" : ""} ${actionType === "persuade" && isRevealActive ? "persuade-score" : ""}`}>
                                {displayedScore ?? 0}
                            </p>
                            {actionType === "scavenge" && isRevealActive && (
                                <div className="scavenge-sparkles" aria-hidden="true">
                                    <span className="scavenge-star scavenge-star-one">✦</span>
                                    <span className="scavenge-star scavenge-star-two">✦</span>
                                    <span className="scavenge-star scavenge-star-three">✦</span>
                                    <span className="scavenge-star scavenge-star-four">✦</span>
                                    <span className="scavenge-star scavenge-star-five">✦</span>
                                    <span className="scavenge-star scavenge-star-six">✦</span>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <p className="font-russo text-sm text-center px-24">Select and perform an action to see its effectiveness</p>
                )}
            </div>
        </div>
    );
}

export default function ActionResult({effectiveness, resultRunKey, actionType}) {
    const [displayedScore, setDisplayedScore] = useState(null);
    const [revealRunKey, setRevealRunKey] = useState(null);
    const finalScore = effectiveness == null ? null : Math.round(effectiveness);
    const intensity = finalScore == null ? 0 : Math.min(Math.abs(finalScore) / 100, 1);
    // This is vibe coded: stronger scores get a larger and longer boom animation.
    const impactStyle = {
        "--attack-duration": `${550 + intensity * 850}ms`,
        "--impact-glow": `${8 + intensity * 30}px`,
        "--impact-rebound-glow": `${(8 + intensity * 30) * 0.6}px`,
        "--box-pop-scale": 1.025 + intensity * 0.085,
        "--box-rebound-scale": 1.01 + intensity * 0.06,
        "--box-late-pulse-scale": 1.005 + intensity * 0.035,
        "--score-pop-scale": 1.1 + intensity * 0.45,
        "--score-rebound-scale": 1.02 + intensity * 0.24,
        "--score-late-pulse-scale": 1.04 + intensity * 0.2,
    };

    // This is vibe coded: count to the result while fading in the charging sound.
    useEffect(() => {
        if (finalScore == null) return;

        let frameId;
        let attackChargingSoundId;
        let healingSpellSoundId;
        let scavengeFootstepsSoundId;
        let shelterChargeSoundId;
        let persuadeDroneSoundId;
        const fadeOutTimeoutIds = [];

        function fadeOut(sound, soundId, duration = 250, delay = 0) {
            if (soundId == null) return;
            const startFade = () => {
                const currentVolume = sound.volume(soundId);
                sound.fade(currentVolume, 0, duration, soundId);
                fadeOutTimeoutIds.push(window.setTimeout(() => sound.stop(soundId), duration));
            };
            if (delay > 0) {
                fadeOutTimeoutIds.push(window.setTimeout(startFade, delay));
            } else {
                startFade();
            }
        }

        function finishCount(playSlashImmediately = false) {
            // This is vibe coded: fade count-up audio instead of cutting it off abruptly.
            fadeOut(attackChargingSound, attackChargingSoundId);
            fadeOut(healingSpellSound, healingSpellSoundId);
            fadeOut(scavengeFootstepsSound, scavengeFootstepsSoundId);
            fadeOut(shelterChargeSound, shelterChargeSoundId);
            fadeOut(persuadeDroneSound, persuadeDroneSoundId, 1000, 1200);
            setDisplayedScore(finalScore);
            if (actionType === "attack") {
                if (playSlashImmediately) playAttackSound();
            } else if (actionType === "heal") {
                playHealthPickupSound();
            } else if (actionType === "scavenge") {
                playCoinDropSound();
            } else if (isShelterAction(actionType)) {
                playShelterBuildSound();
            }
            setRevealRunKey(resultRunKey);
        }

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            frameId = requestAnimationFrame(() => finishCount(true));
            return () => cancelAnimationFrame(frameId);
        }

        attackChargingSound.stop();
        healingSpellSound.stop();
        scavengeFootstepsSound.stop();
        shelterChargeSound.stop();
        if (actionType === "attack") {
            attackChargingSound.volume(0);
            attackChargingSoundId = attackChargingSound.play();
            attackChargingSound.fade(0, 1, 400, attackChargingSoundId);
        } else if (actionType === "heal") {
            healingSpellSound.volume(0);
            healingSpellSoundId = healingSpellSound.play("spell");
            // This is vibe coded: slightly slow the healing spell playback.
            healingSpellSound.rate(0.85, healingSpellSoundId);
            healingSpellSound.fade(0, 0.8, 350, healingSpellSoundId);
        } else if (actionType === "scavenge") {
            scavengeFootstepsSound.volume(0);
            scavengeFootstepsSoundId = scavengeFootstepsSound.play();
            scavengeFootstepsSound.fade(0, 0.8, 350, scavengeFootstepsSoundId);
        } else if (isShelterAction(actionType)) {
            shelterChargeSound.volume(0);
            shelterChargeSoundId = shelterChargeSound.play("wood");
            shelterChargeSound.fade(0, 0.8, 350, shelterChargeSoundId);
        } else if (actionType === "persuade") {
            persuadeDroneSound.stop();
            persuadeDroneSoundId = persuadeDroneSound.play();
            persuadeDroneSound.seek(2, persuadeDroneSoundId);
            persuadeDroneSound.volume(0, persuadeDroneSoundId);
            persuadeDroneSound.fade(0, 0.8, 500, persuadeDroneSoundId);
        }

        const duration = 900 + intensity * 850;
        let startTime;

        function countUp(timestamp) {
            startTime ??= timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const easedProgress = progress * progress;
            setDisplayedScore(Math.round(finalScore * easedProgress));

            if (progress < 1) {
                frameId = requestAnimationFrame(countUp);
            } else {
                finishCount();
            }
        }

        frameId = requestAnimationFrame(countUp);
        return () => {
            cancelAnimationFrame(frameId);
            fadeOutTimeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
            attackChargingSound.stop();
            healingSpellSound.stop();
            scavengeFootstepsSound.stop();
            shelterChargeSound.stop();
            persuadeDroneSound.stop();
        };
    }, [finalScore, intensity, resultRunKey, actionType]);

    return (
        <ActionResultPanel
            effectiveness={effectiveness}
            displayedScore={displayedScore}
            resultRunKey={resultRunKey}
            revealRunKey={revealRunKey}
            impactStyle={impactStyle}
            actionType={actionType}
        />
    );
}
