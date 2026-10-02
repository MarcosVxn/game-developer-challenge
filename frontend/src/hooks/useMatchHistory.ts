import { useQuery } from "@tanstack/react-query";
import { getMatchHistory } from "../api/historyApi";

export function useMatchHistory() {
    return useQuery({
        queryKey: ["match-history"],
        queryFn: getMatchHistory,
    });
}