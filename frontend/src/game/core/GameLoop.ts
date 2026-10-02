export class GameLoop {
    private lastTime = 0;
    private running = false;

    start(update: (deltaTime: number) => void) {
        this.running = true;
        this.lastTime = performance.now();

        const loop = (currentTime: number) => {
            if (!this.running) {
                return;
            }

            const deltaTime =
                (currentTime - this.lastTime) / 1000;

            this.lastTime = currentTime;

            update(deltaTime);

            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
    }

    stop() {
        this.running = false;
    }
}