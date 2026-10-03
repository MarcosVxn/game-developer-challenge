import { useCallback, useEffect, useRef, useState } from "react";
import { Application } from "pixi.js";
import { Game, type GameResult, type GameSnapshot } from "../game/core/Game";
import { recordMatch } from "../config/matchStorage";
import Options from "./Options";
import "./GameScreen.css";

interface GameScreenProps { onFinish: (result: GameResult) => void; onMenu: () => void; }
const initial: GameSnapshot = { score: 0, health: 100, maxHealth: 100, remaining: 120, duration: 0, paused: false };

export default function GameScreen({ onFinish, onMenu }: GameScreenProps) {
    const host = useRef<HTMLDivElement>(null);
    const game = useRef<Game | null>(null);
    const [snapshot, setSnapshot] = useState(initial);
    const [showOptions, setShowOptions] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const update = useCallback((state: GameSnapshot) => setSnapshot(state), []);
    useEffect(() => {
        let cancelled = false;
        let app: Application | null = null;
        let current: Game | null = null;
        const boot = async () => {
            if (!host.current) return;
            try {
                app = new Application();
                await app.init({ resizeTo: host.current, backgroundAlpha: 0, antialias: true, resolution: Math.min(window.devicePixelRatio || 1, 2), autoDensity: true });
                if (cancelled || !host.current) { app.destroy(true); return; }
                current = new Game(app, update, (result) => { localStorage.setItem("last-match-result", JSON.stringify(result)); recordMatch(result); onFinish(result); });
                game.current = current;
                await current.start();
                if (cancelled) return;
                if (!host.current!.contains(app.canvas)) host.current!.appendChild(app.canvas);
                setLoading(false);
            } catch (error) {
                if (cancelled) return;
                if (current) current.destroy(); else app?.destroy(true);
                setLoadError(error instanceof Error ? error.message : "Unable to load battle resources.");
                setLoading(false);
            }
        };
        void boot();
        return () => { cancelled = true; game.current = null; current?.destroy(); };
    }, [onFinish, update]);

    return <main className="battle-screen">
        <div className="battle-canvas" ref={host} aria-label="Pirate battle. Use W or the up arrow to sail, A and D to turn, Space to fire, Q and E for broadside, and Escape to pause." />
        {loading && <div className="battle-loading" role="status">Loading battle assets…</div>}
        {loadError && <div className="battle-overlay"><section className="game-panel compact-panel pause-panel"><h1>SHIPWRECKED</h1><p>{loadError}</p><button className="game-button primary" onClick={onMenu}>MAIN MENU</button></section></div>}
        {snapshot.paused && <div className="battle-overlay"><section className="game-panel compact-panel pause-panel"><h1>PAUSED</h1><p>Ready when you are.</p><button className="game-button primary" onClick={() => game.current?.setPaused(false)}>RESUME</button><button className="game-button primary" onClick={() => setShowOptions(true)}>OPTIONS</button><button className="game-button primary" onClick={onMenu}>MAIN MENU</button></section></div>}
        {showOptions && <div className="battle-overlay options-overlay"><Options onBack={() => setShowOptions(false)} /></div>}
    </main>;
}
