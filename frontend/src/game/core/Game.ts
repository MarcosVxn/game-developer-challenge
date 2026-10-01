import { Application } from "pixi.js";
import { createPlayer } from "../entities/Player";
import { createArena } from "../world/Arena";

export async function createGame(container: HTMLElement) {
    const app = new Application();

    await app.init({
        width: 2048,
        height: 1152,
        background: "#000000",
    });

    const arena = await createArena();

    app.stage.addChild(arena);

    const player = await createPlayer();

    app.stage.addChild(player);

    container.appendChild(app.canvas);

    return app;
}