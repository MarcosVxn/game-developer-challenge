import { Sprite, Texture } from "pixi.js";

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
        this.health -= amount;
    }

    isDead() {
        return this.health <= 0;
    }

    abstract update(deltaTime: number): void;
}