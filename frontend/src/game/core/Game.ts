import { Application } from "pixi.js";

import { createArena } from "../world/Arena";
import { createPlayer } from "../entities/Player";
import { InputManager } from "./InputManager";
import { GameLoop } from "./GameLoop";

export class Game {
    private app: Application;
    private input: InputManager;
    private loop: GameLoop;

    constructor(app: Application) {
        this.app = app;
        this.input = new InputManager();
        this.loop = new GameLoop();
    }

    async start() {
        const arena = await createArena(
            this.app.screen.width,
            this.app.screen.height
        );

        this.app.stage.addChild(arena);

        const player = await createPlayer();

        player.position.set(
            this.app.screen.width / 2,
            this.app.screen.height / 2
        );

        this.app.stage.addChild(player);

        this.input.start();

        this.loop.start((deltaTime) => {
            this.update(deltaTime);
        });
    }

    private update(deltaTime: number) {
        // AQUI ENTRA SUA LÓGICA
        //
        // input
        // movimento
        // inimigos
        // projéteis
        // colisões
        // dano
        // spawn
        // timer
        // score
    }

    destroy() {
        this.loop.stop();
        this.input.stop();

        this.app.destroy(true);
    }
}