import { api } from "../api/axios";
import type { MatchRecord } from "../api/types";

export async function getMatchHistory() {
    const response =
        await api.get<MatchRecord[]>("/history");

    return response.data;
}

export async function saveMatch(
    match: MatchRecord
) {
    const response =
        await api.post("/history", match);

    return response.data;
}