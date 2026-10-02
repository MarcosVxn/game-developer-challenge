interface MainMenuProps {
    onPlay: () => void;
    onOptions: () => void;
}

export function MainMenu({
    onPlay,
    onOptions,
}: MainMenuProps) {
    return (
        <div>
            <h1>Jungle Gaming</h1>

            <button onClick={onPlay}>
                Jogar
            </button>

            <button>
                Histórico
            </button>

            <button>
                Ranking
            </button>

            <button onClick={onOptions}>
                Opções
            </button>
        </div>
    );
}