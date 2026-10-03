import { Assets, Circle, Container, Graphics, Sprite, Text, Texture } from "pixi.js";
import heartUrl from "../../assets/png/default/ui/hud/icon_heart.png";
import scoreUrl from "../../assets/png/default/ui/hud/icon_score.png";
import timeUrl from "../../assets/png/default/ui/hud/icon_time.png";
import healthFrameUrl from "../../assets/png/default/ui/hud/health_frame.png";
import healthGreenUrl from "../../assets/png/default/ui/hud/health_fill_green.png";
import healthAmberUrl from "../../assets/png/default/ui/hud/health_fill_amber.png";
import healthRedUrl from "../../assets/png/default/ui/hud/health_fill_red.png";
import counterUrl from "../../assets/png/default/ui/hud/counter_panel.png";
import buttonUrl from "../../assets/png/default/ui/controls/button_round_normal.png";
import pauseUrl from "../../assets/png/default/ui/controls/icon_pause.png";
import forwardUrl from "../../assets/png/default/ui/controls/icon_forward.png";
import leftUrl from "../../assets/png/default/ui/controls/icon_turn_left.png";
import rightUrl from "../../assets/png/default/ui/controls/icon_turn_right.png";
import fireUrl from "../../assets/png/default/ui/controls/icon_fire_front.png";
import fireLeftUrl from "../../assets/png/default/ui/controls/icon_fire_left.png";
import fireRightUrl from "../../assets/png/default/ui/controls/icon_fire_right.png";
import type { GameControl } from "../core/InputManager";

export interface HudState { health: number; maxHealth: number; score: number; remaining: number; }

export class GameHud extends Container {
  private scoreText = new Text({ text: "0", style: { fontFamily: "Nunito, Arial, sans-serif", fontSize: 22, fontWeight: "900", fill: "#fff0cc" } });
  private timeText = new Text({ text: "02:00", style: { fontFamily: "Nunito, Arial, sans-serif", fontSize: 22, fontWeight: "900", fill: "#fff0cc" } });
  private healthFill!: Sprite;
  private greenFill!: Texture;
  private amberFill!: Texture;
  private redFill!: Texture;
  private constructor() { super(); }

  static async create(width: number, height: number, onControl: (control: GameControl, active: boolean) => void, onPause: () => void) {
    const hud = new GameHud();
    const urls=[heartUrl,scoreUrl,timeUrl,healthFrameUrl,healthGreenUrl,healthAmberUrl,healthRedUrl,counterUrl,buttonUrl,pauseUrl,forwardUrl,leftUrl,rightUrl,fireUrl,fireLeftUrl,fireRightUrl];
    const textures=await Promise.all(urls.map(url=>Assets.load<Texture>(url)));
    const [heart,score,time,frame,green,amber,red,counter,button,pause,forward,left,right,fire,fireLeft,fireRight]=textures;
    hud.greenFill=green; hud.amberFill=amber; hud.redFill=red;
    const sprite=(texture:Texture,x:number,y:number,w:number,h:number,parent:Container=hud)=>{const item=new Sprite(texture);item.position.set(x,y);item.width=w;item.height=h;parent.addChild(item);return item;};

    sprite(heart,26,24,48,48);
    sprite(frame,74,24,304,52);
    hud.healthFill=sprite(green,101,39,244,22);
    const fillMask=new Graphics().rect(101,39,244,22).fill(0xffffff);hud.addChild(fillMask);hud.healthFill.mask=fillMask;
    const healthLabel=new Text({text:"100 / 100",style:{fontFamily:"Nunito, Arial, sans-serif",fontSize:16,fontWeight:"900",fill:"#fff"}});healthLabel.anchor.set(.5);healthLabel.position.set(223,51);hud.addChild(healthLabel);
    // Keep all readouts and HUD assets in Pixi's scene graph.
    sprite(counter,width-390,26,144,50);sprite(score,width-366,34,32,32);
    hud.scoreText.anchor.set(.5);hud.scoreText.position.set(width-292,51);hud.addChild(hud.scoreText);
    sprite(counter,width-226,26,160,50);sprite(time,width-207,34,32,32);
    hud.timeText.anchor.set(.5);hud.timeText.position.set(width-130,51);hud.addChild(hud.timeText);
    hud.addButton(button,pause,width-82,24,"pause",onPause,onControl);
    hud.addButton(button,left,24,height-82,"left",onPause,onControl);
    hud.addButton(button,forward,96,height-136,"forward",onPause,onControl);
    hud.addButton(button,right,168,height-82,"right",onPause,onControl);
    hud.addButton(button,fireLeft,width-194,height-82,"port",onPause,onControl);
    hud.addButton(button,fire,width-122,height-136,"fire",onPause,onControl);
    hud.addButton(button,fireRight,width-50,height-82,"starboard",onPause,onControl);
    hud.update({health:100,maxHealth:100,score:0,remaining:120});
    return hud;
  }

  private addButton(frame:Texture, icon:Texture, x:number, y:number, control:"pause"|GameControl, onPause:()=>void, onControl:(control:GameControl,active:boolean)=>void) {
    const hit=new Container();hit.position.set(x,y);hit.eventMode="static";hit.cursor="pointer";hit.hitArea=new Circle(29,29,29);
    const bg=new Sprite(frame);bg.width=58;bg.height=58;hit.addChild(bg);
    const glyph=new Sprite(icon);glyph.position.set(14,14);glyph.width=30;glyph.height=30;hit.addChild(glyph);
    if(control==="pause") hit.on("pointertap",onPause);
    else {
      hit.on("pointerdown",()=>onControl(control,true));
      const release=()=>onControl(control,false);
      hit.on("pointerup",release);hit.on("pointerupoutside",release);hit.on("pointercancel",release);
    }
    this.addChild(hit);
  }

  resize(width:number,height:number) {
    const sx=width/1600,sy=height/900;
    this.scale.set(Math.min(sx,sy));
    // In normalized layout, the canvas scale is fixed and the HUD reanchors to the visible edges.
    const scale=this.scale.x; const designWidth=width/scale; const designHeight=height/scale;
    const items=this.children;
    items[5].position.x=designWidth-390;items[6].position.x=designWidth-366;items[7].position.x=designWidth-292;
    items[8].position.x=designWidth-226;items[9].position.x=designWidth-207;items[10].position.x=designWidth-130;
    (items[11] as Container).position.set(designWidth-82,24);
    (items[12] as Container).position.set(24,designHeight-82);
    (items[13] as Container).position.set(96,designHeight-136);
    (items[14] as Container).position.set(168,designHeight-82);
    (items[15] as Container).position.set(designWidth-194,designHeight-82);
    (items[16] as Container).position.set(designWidth-122,designHeight-136);
    (items[17] as Container).position.set(designWidth-50,designHeight-82);
  }

  update(state:HudState) {
    const health=Math.max(0,Math.min(1,state.health/state.maxHealth));
    this.healthFill.texture=health>0.6?this.greenFill:health>0.3?this.amberFill:this.redFill;
    this.healthFill.width=244*health;
    const label=this.children.find(child=>child instanceof Text && child.text.includes(" / ")) as Text | undefined;
    if(label) label.text=`${Math.ceil(state.health)} / ${state.maxHealth}`;
    this.scoreText.text=String(state.score);
    const seconds=Math.ceil(Math.max(0,state.remaining));
    this.timeText.text=`${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`;
  }
}
