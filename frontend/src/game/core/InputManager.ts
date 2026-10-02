export class InputManager {
    private keys = new Set<string>();

    start() {
        window.addEventListener("keydown", this.handleKeyDown);
        window.addEventListener("keyup", this.handleKeyUp);
    }

    stop() {
        window.removeEventListener("keydown", this.handleKeyDown);
        window.removeEventListener("keyup", this.handleKeyUp);

        this.keys.clear();
    }

    isPressed(key: string) {
        return this.keys.has(key);
    }

    private handleKeyDown = (event: KeyboardEvent) => {
        this.keys.add(event.key.toLowerCase());
    };

    private handleKeyUp = (event: KeyboardEvent) => {
        this.keys.delete(event.key.toLowerCase());
    };
}