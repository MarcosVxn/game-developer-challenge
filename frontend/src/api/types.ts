export interface MatchRecord {
    id: string;
    playerId: string;
    date: string;
    score: number;
    duration: number;
    endReason: "time" | "death";
}

export interface RankingEntry {
    playerId: string;
    playerName: string;
    score: number;
}