import { useEffect, useRef } from "react";
import { Application } from "pixi.js";
import { Game } from "../game/core/Game";

export function GameScreen() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) {
            return;
        }

        const app = new Application();

        let game: Game;

        const start = async () => {
            await app.init({
                resizeTo: containerRef.current!,
                antialias: true,
            });

            containerRef.current!.appendChild(app.canvas);

            game = new Game(app);

            await game.start();
        };

        start();

        return () => {
            game?.destroy();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="game-container"
        />
    );
}