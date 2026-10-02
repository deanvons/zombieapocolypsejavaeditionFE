import "../css/ActionPage.css";
import { useEffect, useState } from "react";
import { Howl } from "howler";

// This is vibe coded: Pixabay charging sound played while the score counts up.
const chargingSound = new Howl({
    src: ["/audio/freesound_community-062708_laser-charging-81968.mp3"],
    volume: 1,
    preload: true,
    onloaderror: (_id, error) => console.error("Could not load charging sound:", error),
    onplayerror: (_id, error) => console.error("Could not play charging sound:", error),
});

// This is vibe coded: Pixabay knife slice played when the Attack boom starts.
const attackSound = new Howl({
    src: ["/audio/freesound_community-knife-slice-41231.mp3"],
    volume: 0.7,
    preload: true,
    // This is vibe coded: skip the quiet lead-in so the slice transient hits with the animation.
    sprite: { slice: [150, 850] },
});

// This is vibe coded.
function playAttackSound() {
    attackSound.stop();
    attackSound.play("slice");
}

function ActionResultPanel({effectiveness, displayedScore, attackEffectKey, impactStyle, isAttackResult}) {
    return (
        <div
            className={`action-card flex flex-col ${attackEffectKey > 0 ? "attack-impact" : ""}`}
            style={impactStyle}
            // This is vibe coded: sync the slice sound to the box animation start.
            onAnimationStart={(event) => {
                if (isAttackResult && event.animationName === "attack-impact") {
                    playAttackSound();
                }
            }}
        >
            <h3 className="action-card-title">Result</h3>
            <div className="flex flex-1 items-center justify-center">
                { effectiveness != null ? (
                    <div className="flex flex-col items-center">
                        <p className="action-title">Effectiveness: </p>
                        <p className={`action-result-score ${attackEffectKey > 0 ? "attack-score" : ""}`}>
                            {displayedScore ?? 0}
                        </p>
                    </div>
                ) : (
                    <p className="font-russo text-sm text-center px-24">Select and perform an action to see its effectiveness</p>
                )}
            </div>
        </div>
    );
}

export default function ActionResult({effectiveness, resultRunKey, isAttackResult}) {
    const [displayedScore, setDisplayedScore] = useState(null);
    const [attackEffectKey, setAttackEffectKey] = useState(0);
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

        function finishCount(playSlashImmediately = false) {
            chargingSound.stop();
            setDisplayedScore(finalScore);
            if (isAttackResult) {
                if (playSlashImmediately) playAttackSound();
                setAttackEffectKey((key) => key + 1);
            }
        }

        let frameId;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            frameId = requestAnimationFrame(() => finishCount(true));
            return () => cancelAnimationFrame(frameId);
        }

        chargingSound.stop();
        chargingSound.volume(0);
        const chargingSoundId = chargingSound.play();
        chargingSound.fade(0, 1, 400, chargingSoundId);
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
            chargingSound.stop();
        };
    }, [finalScore, intensity, resultRunKey, isAttackResult]);

    return (
        <ActionResultPanel
            key={attackEffectKey}
            effectiveness={effectiveness}
            displayedScore={displayedScore}
            attackEffectKey={attackEffectKey}
            impactStyle={impactStyle}
            isAttackResult={isAttackResult}
        />
    );
}
