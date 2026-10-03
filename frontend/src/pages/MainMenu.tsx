import "./MainMenu.css";
import title from "../assets/png/default/ui/menu/title_pirate_battle.png";
import ship from "../assets/png/default/ship_parts/sail_small_1.png";
import logo from "../assets/logo_jungle_gaming.svg";

interface MainMenuProps {
    onPlay: () => void;
    onOptions: () => void;
    onRanking: () => void;
    onHistory: () => void;
}

export default function MainMenu({ onPlay, onOptions, onRanking, onHistory }: MainMenuProps) {
    return (
        <main className="game-ui main-menu">
            <section className="game-panel menu-panel" aria-label="Main menu">
                <img className="menu-title" src={title} alt="Pirate Battle" />
                <p className="menu-subtitle">SET SAIL. TAKE COMMAND.</p>
                <div className="main-actions">
                    <button className="game-button primary" onClick={onPlay}>PLAY</button>
                    <button className="game-button primary" onClick={onOptions}>OPTIONS</button>
                </div>
                <img className="menu-ship" src={ship} alt="" />
                <p className="menu-description">Navigate the islands. Survive the battle.</p>
                <div className="secondary-actions">
                    <button className="game-button secondary" onClick={onRanking}>RANKING</button>
                    <button className="game-button secondary" onClick={onHistory}>MATCH HISTORY</button>
                </div>
            </section>
            <img className="studio-logo" src={logo} alt="Jungle Gaming" />
        </main>
    );
}
