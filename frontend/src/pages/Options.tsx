import { useState } from "react";
import { loadSettings, saveSettings } from "../config/storage";
import "./Options.css";

interface OptionsProps { onBack: () => void; }
export interface GameSettings { sessionTime: number; enemySpawnTime: number; }

export default function Options({ onBack }: OptionsProps) {
    const [settings, setSettings] = useState<GameSettings>(() => loadSettings());
    const change = (key: keyof GameSettings, delta: number, min: number, max?: number) =>
        setSettings(current => ({ ...current, [key]: Math.max(min, Math.min(max ?? Infinity, current[key] + delta)) }));
    const save = () => { saveSettings(settings); onBack(); };
    return <main className="game-ui">
        <section className="game-panel compact-panel options-panel">
            <h1>OPTIONS</h1>
            <div className="option-group"><label>Game session time</label><div className="option-control">
                <button aria-label="Decrease game session time" onClick={() => change("sessionTime", -10, 60, 180)}>−</button>
                <strong>{settings.sessionTime} s</strong>
                <button aria-label="Increase game session time" onClick={() => change("sessionTime", 10, 60, 180)}>+</button>
            </div></div>
            <div className="option-group"><label>Enemy spawn time</label><div className="option-control">
                <button aria-label="Decrease enemy spawn time" onClick={() => change("enemySpawnTime", -1, 1, 30)}>−</button>
                <strong>{settings.enemySpawnTime} s</strong>
                <button aria-label="Increase enemy spawn time" onClick={() => change("enemySpawnTime", 1, 1, 30)}>+</button>
            </div></div>
            <button className="game-button primary options-back" onClick={save}>MAIN MENU</button>
        </section>
    </main>;
}
