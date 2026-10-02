import { Sprite, Texture } from "pixi.js";

export interface ProjectileOptions {
    damage: number;
    speed: number;
}

export class Projectile extends Sprite {
    damage: number;
    speed: number;

    constructor(texture: Texture, options: ProjectileOptions) {
        super(texture);

        this.damage = options.damage;
        this.speed = options.speed;
    }
}