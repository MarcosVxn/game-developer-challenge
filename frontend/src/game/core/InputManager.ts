export type GameControl = "forward" | "left" | "right" | "fire" | "port" | "starboard";
const controlKeys: Record<GameControl, string[]> = {
    forward: ["w", "arrowup"], left: ["a", "arrowleft"], right: ["d", "arrowright"],
    fire: [" "], port: ["q"], starboard: ["e"],
};

export class InputManager {
    private keys = new Set<string>();
    private pressed = new Set<string>();
    private virtual = new Set<GameControl>();
    start() { window.addEventListener("keydown", this.handleKeyDown); window.addEventListener("keyup", this.handleKeyUp); window.addEventListener("blur", this.clear); }
    stop() { window.removeEventListener("keydown", this.handleKeyDown); window.removeEventListener("keyup", this.handleKeyUp); window.removeEventListener("blur", this.clear); this.clear(); }
    isPressed(key: string) { return this.keys.has(key) || Object.entries(controlKeys).some(([control, keys]) => keys.includes(key) && this.virtual.has(control as GameControl)); }
    setVirtual(control: GameControl, active: boolean) { if(active)this.virtual.add(control);else this.virtual.delete(control); }
    consumePressed(key: string) { const value=this.pressed.has(key); this.pressed.delete(key); return value; }
    private clear = () => { this.keys.clear(); this.pressed.clear(); this.virtual.clear(); };
    private handleKeyDown = (event: KeyboardEvent) => { const key=event.key.toLowerCase(); if(!this.keys.has(key))this.pressed.add(key); this.keys.add(key); if([" ","arrowup","arrowdown","arrowleft","arrowright"].includes(key))event.preventDefault(); };
    private handleKeyUp = (event: KeyboardEvent) => { this.keys.delete(event.key.toLowerCase()); };
}
