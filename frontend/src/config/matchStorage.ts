export interface LocalMatch { id: string; date: string; score: number; duration: number; reason: string; }
const STORAGE_KEY = "pirate-battle.matches";
export function readMatches(): LocalMatch[] {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as LocalMatch[]; }
    catch { return []; }
}
export function recordMatch(result: Omit<LocalMatch, "id" | "date">) {
    const matches = readMatches();
    const match: LocalMatch = { ...result, id: crypto.randomUUID(), date: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([match, ...matches]));
    return match;
}
