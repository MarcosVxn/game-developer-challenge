import { Sprite, Assets } from "pixi.js";
import playerShip from "../../assets/png/retina/ships/ship_1.png";

export async function createPlayer() {
    const texture = await Assets.load(playerShip);

    const player = new Sprite(texture);

    player.anchor.set(0.5);

    return player;
}