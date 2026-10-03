import { Assets, Container, Rectangle, Sprite, Texture, TilingSprite } from "pixi.js";
import waterUrl from "../../assets/png/default/tiles/tile_73.png";
import atlasUrl from "../../assets/tilesheet/tiles_sheet_retina.png";
import rockAUrl from "../../assets/png/default/tiles/tile_49.png";
import rockBUrl from "../../assets/png/default/tiles/tile_50.png";
import palmUrl from "../../assets/png/default/tiles/tile_71.png";
import plantAUrl from "../../assets/png/default/tiles/tile_70.png";
import plantBUrl from "../../assets/png/default/tiles/tile_72.png";
import bridgeNodeUrl from "../../assets/png/default/tiles/tile_13.png";
import bridgeVerticalUrl from "../../assets/png/default/tiles/tile_15.png";
import bridgeHorizontalUrl from "../../assets/png/default/tiles/tile_16.png";
import cannonBridgeHorizontalUrl from "../../assets/png/default/tiles/tile_31.png";
import cannonBridgeVerticalUrl from "../../assets/png/default/tiles/tile_32.png";

type IslandPlacement = { sprite: Sprite; x: number; y: number };

/** The retina atlas contains the authored 4x4 lush island at x=640..1152, y=0..512. */
export class Arena extends Container {
  readonly water: TilingSprite;
  private waterTime = 0;
  private islandLayouts: IslandPlacement[] = [];

  private constructor(waterTexture: Texture, width: number, height: number) {
    super();
    this.water = new TilingSprite({ texture: waterTexture, width, height });
    this.addChild(this.water);
  }

  static async create(width: number, height: number) {
    const [water, atlas, rockA, rockB, palm, plantA, plantB, bridgeNode, bridgeVertical, bridgeHorizontal, cannonBridgeHorizontal, cannonBridgeVertical] = await Promise.all([
      waterUrl, atlasUrl, rockAUrl, rockBUrl, palmUrl, plantAUrl, plantBUrl, bridgeNodeUrl, bridgeVerticalUrl, bridgeHorizontalUrl, cannonBridgeHorizontalUrl, cannonBridgeVerticalUrl,
    ].map(url => Assets.load<Texture>(url)));
    const arena = new Arena(water, width, height);
    // Crop all 4x4 authored rows so the bottom beach closes naturally instead of ending at a tile seam.
    const lushIsland = new Texture({ source: atlas.source, frame: new Rectangle(640, 0, 512, 512) });
    const first = arena.addIsland(lushIsland, -.005, -.10, 1.65, 1.05, width, height);
    arena.addIsland(lushIsland, .73, .62, .80, .80, width, height);
    arena.addIsland(lushIsland, .30, .76, 1.22, 1.22, width, height);
    arena.decorate(first, rockA, plantA, palm);
    arena.addBridge(first, bridgeNode, bridgeVertical, bridgeHorizontal, cannonBridgeHorizontal, cannonBridgeVertical);
    // The bottom-right shore has only a light rock cluster, following the reference map's open beach.
    arena.addIslandDecorations(1, rockB, plantB);
    arena.addIslandDecorations(2, rockA, plantA);
    return arena;
  }

  private addIsland(texture: Texture, x: number, y: number, scaleX: number, scaleY: number, width: number, height: number) {
    const island = new Sprite(texture);
    island.position.set(width * x, height * y);
    island.scale.set(scaleX,scaleY);
    this.addChild(island);
    this.islandLayouts.push({ sprite: island, x, y });
    return island;
  }

  private addIslandDecorations(index: number, rock: Texture, plant: Texture) {
    const island = this.islandLayouts[index]?.sprite;
    if (!island) return;
    const add = (texture: Texture, x: number, y: number, size: number) => {
      const sprite = new Sprite(texture); sprite.anchor.set(.5); sprite.position.set(x, y); sprite.width = size; sprite.height = size; island.addChild(sprite);
    };
    add(rock, 302, 250, 52);
    add(plant, 216, 144, 44);
  }

  private decorate(island: Sprite, rock: Texture, plant: Texture, palm: Texture) {
    const add = (texture: Texture, x: number, y: number, size: number) => {
      const sprite = new Sprite(texture); sprite.anchor.set(.5); sprite.position.set(x, y); sprite.width = size; sprite.height = size; island.addChild(sprite);
    };
    // Assets are grouped over the atlas island's existing grass interior, not scattered over open water.
    add(palm, 188, 178, 78);
    add(plant, 284, 226, 48);
    add(rock, 140, 264, 48);
    add(plant, 248, 122, 42);
  }

  private addBridge(island:Sprite,node:Texture,vertical:Texture,horizontal:Texture,cannonHorizontal:Texture,cannonVertical:Texture) {
    const put=(texture:Texture,x:number,y:number,w=64,h=64)=>{const part=new Sprite(texture);part.position.set(x,y);part.width=w;part.height=h;island.addChild(part);};
    // A single connected stone crossing with two mounted cannon sections, based on the reference map.
    put(node,18,74);put(horizontal,82,74);put(node,146,74);put(cannonHorizontal,210,74);put(node,274,74);
    put(vertical,274,138);put(node,274,202);put(cannonVertical,274,266);
  }

  resize(width: number, height: number) {
    this.water.width = width;
    this.water.height = height;
    for (const { sprite, x, y } of this.islandLayouts) sprite.position.set(width * x, height * y);
  }

  update(dt: number) {
    this.waterTime += dt;
    this.water.tilePosition.x = Math.sin(this.waterTime * .12) * 10;
    this.water.tilePosition.y = this.waterTime * 2.2;
  }
}

export async function createArena(width: number, height: number) { return Arena.create(width, height); }
