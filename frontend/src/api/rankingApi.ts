import { api } from "./axios";
import type { RankingEntry } from "./types";

export async function getRanking() {
    const response =
        await api.get<RankingEntry[]>("/ranking");

    return response.data;
}