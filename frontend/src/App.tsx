import { useState } from "react";
import { GameScreen } from "./pages/gameScreen";
import { MainMenu } from "./pages/MainMenu";
import { Options } from "./pages/Options";
import { ResultScreen } from "./pages/ResultScreen";

type Screen =
    | "menu"
    | "options"
    | "game"
    | "result";

function App() {
    const [screen, setScreen] =
        useState<Screen>("menu");

    switch (screen) {
        case "menu":
            return (
                <MainMenu
                    onPlay={() => setScreen("game")}
                    onOptions={() => setScreen("options")}
                />
            );

        case "options":
            return (
                <Options
                    onBack={() => setScreen("menu")}
                />
            );

        case "game":
            return <GameScreen />;

        case "result":
            return (
                <ResultScreen
                    score={0}
                    victory={false}
                    onPlayAgain={() => setScreen("game")}
                    onMenu={() => setScreen("menu")}
                />
            );
    }
}

export default App;