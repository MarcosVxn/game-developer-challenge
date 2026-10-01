import { Container, Sprite, TilingSprite, Assets } from "pixi.js";

import waterImage from "../../assets/png/retina/tiles/tile_73.png";
import tile1 from "../../assets/png/default/tiles/tile_1.png";

export async function createArena() {
    const arena = new Container();

    // Água
    const waterTexture = await Assets.load(waterImage);

    const water = new TilingSprite({
        texture: waterTexture,
        width: 2048,
        height: 1152,
    });

    arena.addChild(water);

    // Teste de ilha
    const islandTexture = await Assets.load(tile1);

    const island = new Sprite(islandTexture);

    island.position.set(128, 128);

    arena.addChild(island);

    return arena;
}