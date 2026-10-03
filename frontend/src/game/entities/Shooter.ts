import { Enemy, type TargetPosition } from "./Enemy";

export class Shooter extends Enemy {
    private cooldown = 0;
    private fireInterval: number;

    constructor(texture: import("pixi.js").Texture, health: number, speed: number, fireInterval = 1.5) {
        super(texture, health, speed);
        this.fireInterval = fireInterval;
    }

    update(deltaTime: number, target?: TargetPosition, preferredDistance = 350): boolean {
        this.cooldown = Math.max(0, this.cooldown - deltaTime);
        if (!target) return false;
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const distance = Math.max(1, Math.hypot(dx, dy));
        this.rotation = Math.atan2(dy, dx) + Math.PI / 2;
        if (distance > preferredDistance) {
            this.x += dx / distance * this.speed * deltaTime;
            this.y += dy / distance * this.speed * deltaTime;
        }
        if (distance <= preferredDistance * 1.4 && this.cooldown === 0) {
            this.cooldown = this.fireInterval;
            return true;
        }
        return false;
    }
}
