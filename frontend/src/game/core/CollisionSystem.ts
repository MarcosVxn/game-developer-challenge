import type { Sprite } from "pixi.js";

export interface IslandCollider { x: number; y: number; rx: number; ry: number; }

/** Circle based collision helpers in normalized map coordinates. */
export class CollisionSystem {
    isInsideIsland(x: number, y: number, radius: number, width: number, height: number, islands: IslandCollider[]) {
        return islands.some(island => {
            const dx = (x - island.x * width) / (island.rx * width + radius);
            const dy = (y - island.y * height) / (island.ry * height + radius);
            return dx * dx + dy * dy < 1;
        });
    }

    segmentHitsIsland(x1: number, y1: number, x2: number, y2: number, radius: number, width: number, height: number, islands: IslandCollider[]) {
        const distance=Math.hypot(x2-x1,y2-y1);
        const steps=Math.max(1,Math.ceil(distance/8));
        for(let i=1;i<=steps;i++) {
            const t=i/steps;
            if(this.isInsideIsland(x1+(x2-x1)*t,y1+(y2-y1)*t,radius,width,height,islands)) return true;
        }
        return false;
    }

    segmentCircleTime(x1:number,y1:number,x2:number,y2:number,cx:number,cy:number,radius:number):number|null {
        const dx=x2-x1,dy=y2-y1;
        const lengthSq=dx*dx+dy*dy;
        const t=lengthSq===0?0:Math.max(0,Math.min(1,((cx-x1)*dx+(cy-y1)*dy)/lengthSq));
        const px=x1+dx*t,py=y1+dy*t;
        return Math.hypot(cx-px,cy-py)<=radius?t:null;
    }

    constrainActor(actor: Sprite, radius: number, width: number, height: number, islands: IslandCollider[]) {
        actor.x = Math.max(radius, Math.min(width - radius, actor.x));
        actor.y = Math.max(radius, Math.min(height - radius, actor.y));
        for (const island of islands) {
            const cx = island.x * width, cy = island.y * height;
            const rx = island.rx * width + radius, ry = island.ry * height + radius;
            let dx = (actor.x - cx) / rx, dy = (actor.y - cy) / ry;
            if (dx * dx + dy * dy >= 1) continue;
            if (Math.abs(dx) + Math.abs(dy) < .0001) { dx = 0; dy = -1; }
            const length = Math.hypot(dx, dy);
            actor.x = cx + dx / length * rx;
            actor.y = cy + dy / length * ry;
        }
    }

    circlesOverlap(ax: number, ay: number, ar: number, bx: number, by: number, br: number) {
        return Math.hypot(ax - bx, ay - by) < ar + br;
    }
}
