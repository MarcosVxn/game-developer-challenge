import { Application, Assets, Container, Sprite, Texture } from "pixi.js";
import { defaultGameConfig, type GameConfig } from "../../config/gameConfig";
import { loadSettings } from "../../config/storage";
import playerUrl from "../../assets/png/default/ships/ship_1.png";
import chaserUrl from "../../assets/png/default/ships/ship_2.png";
import shooterUrl from "../../assets/png/default/ships/ship_4.png";
import ballUrl from "../../assets/png/default/ship_parts/cannon_ball.png";
import explosion1Url from "../../assets/png/default/effects/explosion_1.png";
import explosion2Url from "../../assets/png/default/effects/explosion_2.png";
import explosion3Url from "../../assets/png/default/effects/explosion_3.png";
import fire1Url from "../../assets/png/default/effects/fire_1.png";
import fire2Url from "../../assets/png/default/effects/fire_2.png";
import cannonUrl from "../../assets/png/default/ship_parts/cannon_mobile.png";
import wood1Url from "../../assets/png/default/ship_parts/wood_1.png";
import wood2Url from "../../assets/png/default/ship_parts/wood_2.png";
import wood3Url from "../../assets/png/default/ship_parts/wood_3.png";
import wood4Url from "../../assets/png/default/ship_parts/wood_4.png";
import crew1Url from "../../assets/png/default/ship_parts/crew_1.png";
import crew2Url from "../../assets/png/default/ship_parts/crew_2.png";
import crew3Url from "../../assets/png/default/ship_parts/crew_3.png";
import crew4Url from "../../assets/png/default/ship_parts/crew_4.png";
import crew5Url from "../../assets/png/default/ship_parts/crew_5.png";
import crew6Url from "../../assets/png/default/ship_parts/crew_6.png";
import enemyHealthFrameUrl from "../../assets/png/default/ui/hud/enemy_health_frame.png";
import enemyHealthFillUrl from "../../assets/png/default/ui/hud/enemy_health_fill_red.png";
import { InputManager, type GameControl } from "./InputManager";
import { GameLoop } from "./GameLoop";
import { SpawnManager } from "../world/SpawnManager";
import { CollisionSystem } from "./CollisionSystem";
import { Chaser } from "../entities/Chaser";
import { Shooter } from "../entities/Shooter";
import { Arena, createArena } from "../world/Arena";
import { GameHud } from "../ui/GameHud";

export type EndReason = "TIME UP" | "DEFEATED";
export interface GameSnapshot { score: number; health: number; maxHealth: number; remaining: number; duration: number; paused: boolean; }
export interface GameResult { score: number; duration: number; reason: EndReason; }
interface Obstacle { x: number; y: number; rx: number; ry: number; }
interface Shot { sprite: Sprite; x: number; y: number; vx: number; vy: number; life: number; hostile: boolean; damage: number; }
interface TimedEffect { sprite: Sprite; life: number; duration: number; vx?:number;vy?:number;spin?:number;follow?:Sprite;offsetX?:number;offsetY?:number;frames?:Texture[];frameTimer?:number; }
type Foe = { sprite: Chaser | Shooter; kind: "chaser" | "shooter"; touchTimer: number; bar: Container; fill: Sprite; damagedFire: boolean };

const obstacles: Obstacle[] = [
    { x: .259, y: .199, rx: .264, ry: .299 },
    { x: .858, y: .848, rx: .128, ry: .228 },
    { x: .495, y: 1.107, rx: .195, ry: .347 },
];

export class Game {
    private app: Application;
    private input = new InputManager();
    private loop = new GameLoop();
    private config: GameConfig;
    private world = new Container();
    private arena?: Arena;
    private hud?: GameHud;
    private player?: Sprite;
    private foes: Foe[] = [];
    private shots: Shot[] = [];
    private effects: TimedEffect[] = [];
    private spawn = new SpawnManager();
    private collisions = new CollisionSystem();
    private score = 0;
    private health: number;
    private remaining: number;
    private elapsed = 0;
    private paused = false;
    private ended = false;
    private destroyed = false;
    private emitTimer = 0;
    private fireTimer = 0;
    private viewportWidth = 0;
    private viewportHeight = 0;
    private chaserTexture!: Texture;
    private shooterTexture!: Texture;
    private cannonBallTexture!: Texture;
    private cannonTexture!: Texture;
    private enemyHealthFrame!: Texture;
    private enemyHealthFill!: Texture;
    private explosionFrames: Texture[] = [];
    private fireFrames: Texture[] = [];
    private debrisTextures: Texture[] = [];
    private crewTextures: Texture[] = [];
    private defeatDelay: number | null = null;
    private playerFireShown = false;
    private readonly onSnapshot: (snapshot: GameSnapshot) => void;
    private readonly onFinish: (result: GameResult) => void;

    constructor(app: Application, onSnapshot: (snapshot: GameSnapshot) => void, onFinish: (result: GameResult) => void) {
        this.app = app;
        this.onSnapshot = onSnapshot;
        this.onFinish = onFinish;
        const saved = loadSettings();
        this.config = { ...defaultGameConfig, sessionTime: saved.sessionTime, enemySpawnTime: saved.enemySpawnTime };
        this.health = this.config.player.health;
        this.remaining = this.config.sessionTime;
    }

    async start() {
        const arenaPromise=createArena(this.app.screen.width,this.app.screen.height);
        const urls=[playerUrl,chaserUrl,shooterUrl,ballUrl,explosion1Url,explosion2Url,explosion3Url,fire1Url,fire2Url,cannonUrl,wood1Url,wood2Url,wood3Url,wood4Url,crew1Url,crew2Url,crew3Url,crew4Url,crew5Url,crew6Url,enemyHealthFrameUrl,enemyHealthFillUrl];
        const [playerTexture,chaserTexture,shooterTexture,ball,...extras]=await Promise.all(urls.map(url=>Assets.load<Texture>(url)));
        const arena=await arenaPromise;
        if (this.destroyed) return;
        this.chaserTexture=chaserTexture;this.shooterTexture=shooterTexture;this.cannonBallTexture=ball;
        this.explosionFrames=extras.slice(0,3);this.fireFrames=extras.slice(3,5);this.cannonTexture=extras[5];
        this.debrisTextures=extras.slice(6,10);this.crewTextures=extras.slice(10,16);this.enemyHealthFrame=extras[16];this.enemyHealthFill=extras[17];
        this.arena = arena;
        this.world.addChild(arena);
        this.player = new Sprite(playerTexture);
        this.player.anchor.set(.5);
        this.player.width = Math.min(96, this.app.screen.width * .07);
        this.player.height = this.player.width;
        this.player.position.set(this.app.screen.width * .51, this.app.screen.height * .51);
        this.addCannons(this.player);
        this.world.addChild(this.player);
        this.hud = await GameHud.create(this.app.screen.width, this.app.screen.height, (control,active)=>this.setControl(control,active), ()=>this.togglePaused());
        if (this.destroyed) return;
        this.app.stage.addChild(this.world, this.hud);
        this.resize();
        this.input.start();
        this.app.renderer.on("resize", this.resize);
        window.addEventListener("resize", this.resize);
        window.addEventListener("blur", this.pauseOnBlur);
        document.addEventListener("visibilitychange", this.pauseWhenHidden);
        this.loop.start((dt) => this.update(Math.min(dt, .05)));
        this.publish();
    }

    private resize = () => {
        const width=this.app.screen.width, height=this.app.screen.height;
        if(this.viewportWidth>0&&this.viewportHeight>0){
            const sx=width/this.viewportWidth,sy=height/this.viewportHeight;
            if(this.player){this.player.x*=sx;this.player.y*=sy;}
            for(const foe of this.foes){foe.sprite.x*=sx;foe.sprite.y*=sy;}
            for(const shot of this.shots){shot.x*=sx;shot.y*=sy;shot.vx*=sx;shot.vy*=sy;}
        }
        this.viewportWidth=width;this.viewportHeight=height;
        this.arena?.resize(width,height);
        this.hud?.resize(width,height);
        if (this.player && this.player.x === 0 && this.player.y === 0) this.player.position.set(this.app.screen.width / 2, this.app.screen.height / 2);
    };

    setPaused(value: boolean) { if (!this.ended) { this.paused = value; this.publish(); } }
    togglePaused() { this.setPaused(!this.paused); }
    setControl(control: GameControl, active: boolean) { this.input.setVirtual(control, active); }
    private pauseOnBlur = () => this.setPaused(true);
    private pauseWhenHidden = () => { if (document.hidden) this.setPaused(true); };

    private update(dt: number) {
        if (this.ended) return;
        if (this.input.consumePressed("escape")) this.togglePaused();
        if (this.paused) return;
        this.arena?.update(dt);
        if(this.defeatDelay!==null) {
            this.updateEffects(dt);
            this.defeatDelay-=dt;
            if(this.defeatDelay<=0)this.finish("DEFEATED");
            return;
        }
        this.elapsed += dt;
        this.remaining = Math.max(0, this.remaining - dt);
        this.fireTimer = Math.max(0, this.fireTimer - dt);
        this.movePlayer(dt);
        this.spawn.update(dt, this.config.enemySpawnTime, () => this.spawnEnemy());
        this.updateFoes(dt);
        this.updateShots(dt);
        this.updateEffects(dt);
        this.updateBars();
        this.emitTimer += dt;
        if (this.emitTimer >= .12) { this.emitTimer = 0; this.publish(); }
        if (this.health <= 0) this.beginPlayerDefeat();
        else if (this.remaining <= 0) this.finish("TIME UP");
    }

    private addCannons(ship:Sprite) {
        const shipWidth=ship.width,shipHeight=ship.height;
        for(const side of [-1,1]) {
            const cannon=new Sprite(this.cannonTexture);cannon.anchor.set(.5);cannon.width=22;cannon.height=22;
            cannon.position.set(side*shipWidth*.27,shipHeight*.08);cannon.rotation=side*Math.PI/2;ship.addChild(cannon);
        }
    }

    private damagePlayer(amount:number) {
        this.health=Math.max(0,this.health-amount);
        if(!this.playerFireShown&&this.health<=this.config.player.health*.65&&this.player){this.playerFireShown=true;this.addFire(this.player,24);}
    }

    private addFire(target:Sprite,size:number) {
        const flame=new Sprite(this.fireFrames[0]);flame.anchor.set(.5);flame.width=size;flame.height=size;this.world.addChild(flame);
        this.effects.push({sprite:flame,life:2.2,duration:2.2,follow:target,offsetX:(Math.random()-.5)*18,offsetY:-16,frames:this.fireFrames,frameTimer:.1});
    }

    private beginPlayerDefeat() {
        if(this.defeatDelay!==null)return;
        if(this.player){this.createWreck(this.player.x,this.player.y);this.player.destroy();this.player=undefined;}
        this.defeatDelay=.95;
    }

    private movePlayer(dt: number) {
        const player = this.player;
        if (!player) return;
        if (this.input.isPressed("a") || this.input.isPressed("arrowleft")) player.rotation -= this.config.player.rotationSpeed * dt;
        if (this.input.isPressed("d") || this.input.isPressed("arrowright")) player.rotation += this.config.player.rotationSpeed * dt;
        if (this.input.isPressed("w") || this.input.isPressed("arrowup")) {
            const speed = this.config.player.speed;
            player.x += Math.cos(player.rotation - Math.PI / 2) * speed * dt;
            player.y += Math.sin(player.rotation - Math.PI / 2) * speed * dt;
        }
        if ((this.input.isPressed(" ") || this.input.isPressed("q") || this.input.isPressed("e")) && this.fireTimer <= 0) {
            if (this.input.isPressed(" ")) this.fire(false, 0);
            else this.fire(false, this.input.isPressed("q") ? -Math.PI / 2 : Math.PI / 2, 3);
            this.fireTimer = .42;
        }
        this.collisions.constrainActor(player, 24, this.app.screen.width, this.app.screen.height, obstacles);
    }

    private fire(hostile: boolean, offset = 0, count = 1) {
        if (!this.player) return;
        const base = this.player.rotation - Math.PI / 2 + offset;
        for (let i = 0; i < count; i++) {
            const angle = base + (count > 1 ? (i - 1) * .13 : 0);
            const sprite = new Sprite(this.cannonBallTexture);
            sprite.anchor.set(.5); sprite.width = 13; sprite.height = 13;
            const speed = this.config.projectile.speed;
            const shot: Shot = { sprite, x: this.player.x + Math.cos(angle) * 24, y: this.player.y + Math.sin(angle) * 24, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: this.config.projectile.lifetime, hostile, damage: hostile ? this.config.shooter.damage : this.config.projectile.damage };
            sprite.position.set(shot.x, shot.y); this.world.addChild(sprite); this.shots.push(shot);
        }
    }

    private spawnEnemy() {
        if (!this.player) return;
        const kind = Math.random() < .55 ? "chaser" : "shooter";
        const texture = kind === "chaser" ? this.chaserTexture : this.shooterTexture;
        const sprite = kind === "chaser"
            ? new Chaser(texture, this.config.chaser.health, this.config.chaser.speed)
            : new Shooter(texture, this.config.shooter.health, this.config.shooter.speed, this.config.shooter.cooldown);
        sprite.width = 74; sprite.height = 74;
        const width=this.app.screen.width,height=this.app.screen.height;
        let point:{x:number;y:number}|undefined;
        for(let attempt=0;attempt<40;attempt++) {
            const edge=Math.floor(Math.random()*4),margin=48;
            const x=edge===0?margin:edge===1?width-margin:margin+Math.random()*(width-margin*2);
            const y=edge===2?margin:edge===3?height-margin:margin+Math.random()*(height-margin*2);
            if(this.collisions.isInsideIsland(x,y,68,width,height,obstacles))continue;
            if(this.player&&Math.hypot(x-this.player.x,y-this.player.y)<220)continue;
            point={x,y};break;
        }
        if(!point){sprite.destroy();return;}
        sprite.position.set(point.x,point.y);this.addCannons(sprite);
        const bar=new Container();const frame=new Sprite(this.enemyHealthFrame);frame.width=48;frame.height=11;bar.addChild(frame);
        const fill=new Sprite(this.enemyHealthFill);fill.position.set(3,3);fill.width=42;fill.height=5;bar.addChild(fill);
        const foe:Foe={sprite,kind,touchTimer:0,bar,fill,damagedFire:false};bar.position.set(sprite.x-24,sprite.y-48);
        this.world.addChild(sprite,bar);this.foes.push(foe);
    }

    private updateFoes(dt: number) {
        if (!this.player) return;
        for (const foe of this.foes) {
            const dx = this.player.x - foe.sprite.x, dy = this.player.y - foe.sprite.y;
            const distance = Math.max(1, Math.hypot(dx, dy));
            const desired = foe.kind === "shooter" ? this.config.shooter.attackRange * .72 : 20;
            const shouldFire = foe.sprite.update(dt, this.player, desired);
            if(!foe.damagedFire&&foe.sprite.health<=foe.sprite.maxHealth*.65){foe.damagedFire=true;this.addFire(foe.sprite,24);}
            if (foe.kind === "shooter" && distance < this.config.shooter.attackRange && shouldFire) {
                this.fireFrom(foe.sprite.x, foe.sprite.y, Math.atan2(dy, dx), true);
            }
            foe.touchTimer = Math.max(0, foe.touchTimer - dt);
            if (distance < 38 && foe.touchTimer === 0) {
                this.damagePlayer(this.config.chaser.damage); foe.touchTimer = 1.05;
                foe.sprite.x -= dx / distance * 28; foe.sprite.y -= dy / distance * 28;
            }
            this.collisions.constrainActor(foe.sprite, 24, this.app.screen.width, this.app.screen.height, obstacles);
        }
    }

    private fireFrom(x: number, y: number, angle: number, hostile: boolean) {
        const sprite = new Sprite(this.cannonBallTexture); sprite.anchor.set(.5); sprite.width = 13; sprite.height = 13;
        const speed = this.config.projectile.speed * .68;
        const shot: Shot = { sprite, x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 2.3, hostile, damage: this.config.shooter.damage };
        this.world.addChild(sprite); this.shots.push(shot);
    }

    private updateShots(dt: number) {
        const width=this.app.screen.width,height=this.app.screen.height;
        for (const shot of [...this.shots]) {
            const x1=shot.x,y1=shot.y,x2=x1+shot.vx*dt,y2=y1+shot.vy*dt;
            shot.life-=dt;shot.x=x2;shot.y=y2;shot.sprite.position.set(x2,y2);
            if(shot.life<=0||x2<0||y2<0||x2>width||y2>height||this.collisions.segmentHitsIsland(x1,y1,x2,y2,5,width,height,obstacles)){this.removeShot(shot);continue;}
            if(shot.hostile&&this.player) {
                if(this.collisions.segmentCircleTime(x1,y1,x2,y2,this.player.x,this.player.y,28)!==null){this.damagePlayer(shot.damage);this.removeShot(shot);}
                continue;
            }
            const hits=this.foes.map(foe=>({foe,t:this.collisions.segmentCircleTime(x1,y1,x2,y2,foe.sprite.x,foe.sprite.y,32)})).filter((hit):hit is {foe:Foe;t:number}=>hit.t!==null).sort((a,b)=>a.t-b.t);
            const hit=hits[0];
            if(hit){hit.foe.sprite.takeDamage(shot.damage);this.removeShot(shot);if(hit.foe.sprite.isDead())this.destroyFoe(hit.foe);}
        }
    }

    private destroyFoe(foe: Foe) {
        this.score += 1;
        this.createWreck(foe.sprite.x,foe.sprite.y);
        foe.sprite.destroy({children:true});foe.bar.destroy({children:true});this.foes=this.foes.filter(item=>item!==foe);
    }

    private createWreck(x:number,y:number) {
        const blast=new Sprite(this.explosionFrames[0]);blast.anchor.set(.5);blast.position.set(x,y);blast.width=92;blast.height=92;this.world.addChild(blast);
        this.effects.push({sprite:blast,life:.54,duration:.54,frames:this.explosionFrames,frameTimer:.09});
        const fire=new Sprite(this.fireFrames[1]);fire.anchor.set(.5);fire.position.set(x,y);fire.width=54;fire.height=54;this.world.addChild(fire);
        this.effects.push({sprite:fire,life:1.8,duration:1.8,frames:this.fireFrames,frameTimer:.11,vx:(Math.random()-.5)*8,vy:-10});
        for(let i=0;i<this.debrisTextures.length;i++) {
            const wood=new Sprite(this.debrisTextures[i]);wood.anchor.set(.5);wood.position.set(x,y);wood.width=25+Math.random()*10;wood.height=17+Math.random()*8;this.world.addChild(wood);
            const angle=i*Math.PI/2+Math.random()*.4,speed=75+Math.random()*80;
            this.effects.push({sprite:wood,life:1.5,duration:1.5,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-24,spin:(Math.random()-.5)*5});
        }
        for(let i=0;i<3;i++) {
            const crew=new Sprite(this.crewTextures[(i+Math.floor(Math.random()*this.crewTextures.length))%this.crewTextures.length]);crew.anchor.set(.5);crew.position.set(x,y);crew.width=22;crew.height=22;this.world.addChild(crew);
            const angle=(i/3)*Math.PI*2,speed=55+Math.random()*55;
            this.effects.push({sprite:crew,life:1.25,duration:1.25,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-28,spin:(Math.random()-.5)*2});
        }
    }

    private updateEffects(dt: number) {
        for (const effect of [...this.effects]) {
            effect.life-=dt;
            if(effect.follow&&!effect.follow.destroyed)effect.sprite.position.set(effect.follow.x+(effect.offsetX??0),effect.follow.y+(effect.offsetY??0));
            else {effect.sprite.x+=(effect.vx??0)*dt;effect.sprite.y+=(effect.vy??0)*dt;}
            effect.sprite.rotation+=(effect.spin??0)*dt;
            if(effect.frames&&effect.frameTimer!==undefined){effect.frameTimer-=dt;if(effect.frameTimer<=0){const index=effect.frames.indexOf(effect.sprite.texture);effect.sprite.texture=effect.frames[(index+1)%effect.frames.length];effect.frameTimer=effect.frames.length===3?.09:.11;}}
            const progress=Math.max(0,effect.life/effect.duration);
            effect.sprite.alpha=effect.frames===this.explosionFrames?Math.min(1,progress*1.8):progress;
            if(!effect.follow)effect.sprite.scale.set(.78+(1-progress)*.35);
            if(effect.life<=0){effect.sprite.destroy();this.effects=this.effects.filter(item=>item!==effect);}
        }
    }

    private updateBars() {
        for (const foe of this.foes) {
            foe.bar.position.set(foe.sprite.x-24,foe.sprite.y-48);
            foe.fill.width=42*Math.max(0,foe.sprite.health/foe.sprite.maxHealth);
        }
    }

    private removeShot(shot: Shot) { shot.sprite.destroy(); this.shots = this.shots.filter(item => item !== shot); }
    private publish() {
        const snapshot={ score:this.score, health:Math.max(0,this.health), maxHealth:this.config.player.health, remaining:this.remaining, duration:this.elapsed, paused:this.paused };
        this.hud?.update(snapshot);
        this.onSnapshot(snapshot);
    }
    private finish(reason: EndReason) { if(this.ended)return; this.ended=true; this.paused=false; this.loop.stop(); this.publish(); this.onFinish({score:this.score,duration:this.elapsed,reason}); }
    destroy() { if(this.destroyed)return; this.destroyed=true; this.loop.stop(); this.input.stop(); this.app.renderer.off("resize", this.resize); window.removeEventListener("resize", this.resize); window.removeEventListener("blur", this.pauseOnBlur); document.removeEventListener("visibilitychange", this.pauseWhenHidden); this.effects=[];this.shots=[];this.foes=[]; this.app.destroy(true, { children: true, texture: false }); }
}
