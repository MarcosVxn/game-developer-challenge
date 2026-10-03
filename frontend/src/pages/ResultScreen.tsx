import "./ResultScreen.css";
interface ResultScreenProps { onPlayAgain: () => void; onMenu: () => void; score?: number; duration?: number; reason?: string; }
export default function ResultScreen({ onPlayAgain, onMenu, score = 0, duration = 0, reason = "TIME UP" }: ResultScreenProps) {
 const minutes = Math.floor(duration / 60);
 const seconds = Math.floor(duration % 60);
 return <main className="game-ui"><section className="game-panel compact-panel result-panel">
    <h1>BATTLE COMPLETE</h1><strong className="result-score">{score}</strong>
    <p className="result-summary">POINTS · {String(minutes).padStart(2,"0")}:{String(seconds).padStart(2,"0")} · {reason}</p>
    <button className="game-button primary" onClick={onPlayAgain}>PLAY AGAIN</button>
    <button className="game-button primary" onClick={onMenu}>MAIN MENU</button>
 </section></main>;
}
