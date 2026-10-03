import { Enemy, type TargetPosition } from "./Enemy";

export class Chaser extends Enemy {
    update(deltaTime: number, target?: TargetPosition): boolean {
        if (!target) return false;
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const distance = Math.max(1, Math.hypot(dx, dy));
        this.rotation = Math.atan2(dy, dx) + Math.PI / 2;
        this.x += dx / distance * this.speed * deltaTime;
        this.y += dy / distance * this.speed * deltaTime;
        return false;
    }
}
