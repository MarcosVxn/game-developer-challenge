import type { GameSettings } from "../pages/Options";

const STORAGE_KEY = "game-settings";

export function saveSettings(settings: GameSettings) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(settings)
    );
}

export function loadSettings(): GameSettings {
    const savedSettings = localStorage.getItem(STORAGE_KEY);

    if (!savedSettings) {
        return {
            sessionTime: 120,
            enemySpawnTime: 5,
        };
    }

    return JSON.parse(savedSettings);
}