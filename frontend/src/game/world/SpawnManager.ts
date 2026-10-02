export class SpawnManager {
    private timer = 0;

    update(
        deltaTime: number,
        spawnInterval: number,
        spawn: () => void
    ) {
        this.timer += deltaTime;

        if (this.timer >= spawnInterval) {
            this.timer = 0;

            spawn();
        }
    }

    reset() {
        this.timer = 0;
    }
}