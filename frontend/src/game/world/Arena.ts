import {
    Container,
    Sprite,
    TilingSprite,
    Assets,
} from "pixi.js";

import waterImage from "../../assets/png/retina/tiles/tile_73.png";
import tile1 from "../../assets/png/default/tiles/tile_1.png";

export async function createArena(
    width: number,
    height: number
) {
    const arena = new Container();

    const waterTexture = await Assets.load(waterImage);

    const water = new TilingSprite({
        texture: waterTexture,
        width,
        height,
    });

    arena.addChild(water);

    const islandTexture = await Assets.load(tile1);

    const island = new Sprite(islandTexture);

    island.position.set(128, 128);

    arena.addChild(island);

    return arena;
}