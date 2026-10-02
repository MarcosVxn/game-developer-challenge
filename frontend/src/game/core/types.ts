export type EnemyType = "chaser" | "shooter";

export interface Vector2 {
    x: number;
    y: number;
}

export interface EntityState {
    id: string;
    position: Vector2;
    rotation: number;
    health: number;
    maxHealth: number;
    active: boolean;
}

export interface ProjectileState {
    id: string;
    position: Vector2;
    velocity: Vector2;
    damage: number;
    lifetime: number;
    active: boolean;
}