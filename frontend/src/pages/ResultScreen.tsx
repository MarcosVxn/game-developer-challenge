interface ResultScreenProps {
    score: number;
    victory: boolean;
    onPlayAgain: () => void;
    onMenu: () => void;
}

export function ResultScreen({
    score,
    victory,
    onPlayAgain,
    onMenu,
}: ResultScreenProps) {
    return (
        <div>
            <h1>
                {victory ? "Vitória!" : "Derrota!"}
            </h1>

            <p>
                Pontuação: {score}
            </p>

            <button onClick={onPlayAgain}>
                Jogar novamente
            </button>

            <button onClick={onMenu}>
                Voltar ao menu
            </button>
        </div>
    );
}