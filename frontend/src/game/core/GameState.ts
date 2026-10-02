export interface GameState {
    running: boolean;
    paused: boolean;
    finished: boolean;

    score: number;
    remainingTime: number;

    playerHealth: number;

    enemies: number;
    projectiles: number;
}