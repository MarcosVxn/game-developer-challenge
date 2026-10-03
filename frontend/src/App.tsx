import { useState } from "react";

import MainMenu from "./pages/MainMenu";
import Options from "./pages/Options";
import Ranking from "./pages/Ranking";
import MatchHistory from "./pages/MatchHistory";
import ResultScreen from "./pages/ResultScreen";
import GameScreen from "./pages/GameScreen";
import type { GameResult } from "./game/core/Game";

type Screen =
    | "menu"
    | "options"
    | "ranking"
    | "history"
    | "game"
    | "result";

function App() {

    const [screen, setScreen] =
        useState<Screen>("menu");
    const [result, setResult] = useState<GameResult>({ score: 0, duration: 0, reason: "TIME UP" });

    switch (screen) {

        case "menu":

            return (
                <MainMenu
                    onPlay={() => setScreen("game")}
                    onOptions={() => setScreen("options")}
                    onRanking={() => setScreen("ranking")}
                    onHistory={() => setScreen("history")}
                />
            );

        case "options":

            return (
                <Options
                    onBack={() => setScreen("menu")}
                />
            );

        case "ranking":

            return (
                <Ranking
                    onBack={() => setScreen("menu")}
                    onHistory={() => setScreen("history")}
                />
            );

        case "history":

            return (
                <MatchHistory
                    onBack={() => setScreen("menu")}
                    onRanking={() => setScreen("ranking")}
                />
            );

        case "game":
            return <GameScreen onFinish={(match) => { setResult(match); setScreen("result"); }} onMenu={() => setScreen("menu")} />;

        case "result":

            return (
                <ResultScreen
                    score={result.score}
                    duration={result.duration}
                    reason={result.reason}
                    onPlayAgain={() => setScreen("game")}
                    onMenu={() => setScreen("menu")}
                />
            );

        default:

            return null;
    }
}

export default App;
