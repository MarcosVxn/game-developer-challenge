export interface GameSettings {
    sessionTime: number;
    enemySpawnTime: number;
}

interface OptionsProps {
    onBack: () => void;
}

export function Options({
    onBack,
}: OptionsProps) {
    const settings: GameSettings = {
        sessionTime: 120,
        enemySpawnTime: 5,
    };

    return (
        <div>
            <h1>Opções</h1>

            <p>
                Tempo da partida: {settings.sessionTime}s
            </p>

            <p>
                Spawn dos inimigos: {settings.enemySpawnTime}s
            </p>

            <button>
                Salvar
            </button>

            <button onClick={onBack}>
                Voltar
            </button>
        </div>
    );
}