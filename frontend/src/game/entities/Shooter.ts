import { Enemy } from "./Enemy";

export class Shooter extends Enemy {

    private cooldown = 0;

    update(deltaTime: number) {
        this.cooldown -= deltaTime;

        // VOCÊ implementa:
        // aproximar do player
        // verificar distância
        // disparar
        // controlar cooldown
    }
}