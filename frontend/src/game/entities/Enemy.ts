import { Sprite, Texture } from "pixi.js";
export interface TargetPosition { x: number; y: number; }

export abstract class Enemy extends Sprite {
    health: number;
    maxHealth: number;
    speed: number;

    constructor(
        texture: Texture,
        health: number,
        speed: number
    ) {
        super(texture);

        this.health = health;
        this.maxHealth = health;
        this.speed = speed;

        this.anchor.set(0.5);
    }

    takeDamage(amount: number) {
        this.health = Math.max(0, this.health - amount);
    }

    isDead() {
        return this.health <= 0;
    }

    abstract update(deltaTime: number, target?: TargetPosition, preferredDistance?: number): boolean;
}
