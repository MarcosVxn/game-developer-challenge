import "./MatchHistory.css";
import { useState } from "react";
import { readMatches } from "../config/matchStorage";
interface MatchHistoryProps { onBack: () => void; onRanking?: () => void; }
const matches = [
    { date: "08 SEP · 19:36", score: 24, duration: "02:00", reason: "TIME UP" },
    { date: "08 SEP · 19:28", score: 18, duration: "01:42", reason: "DEFEATED" },
    { date: "08 SEP · 19:20", score: 22, duration: "02:00", reason: "TIME UP" },
    { date: "08 SEP · 19:12", score: 11, duration: "01:18", reason: "DEFEATED" },
    { date: "07 SEP · 22:05", score: 20, duration: "02:00", reason: "TIME UP" },
    { date: "07 SEP · 21:41", score: 16, duration: "01:33", reason: "DEFEATED" },
    { date: "07 SEP · 20:10", score: 29, duration: "02:00", reason: "TIME UP" },
    { date: "06 SEP · 18:25", score: 14, duration: "01:10", reason: "DEFEATED" },
    { date: "06 SEP · 17:02", score: 31, duration: "02:00", reason: "TIME UP" },
];
export default function MatchHistory({ onBack, onRanking = onBack }: MatchHistoryProps) {
 const [page,setPage]=useState(0);
 const saved=readMatches().map(match=>{const date=new Date(match.date);const day=String(date.getDate()).padStart(2,"0");const month=date.toLocaleString("en-US",{month:"short"}).toUpperCase();const time=date.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"});return {date:`${day} ${month} · ${time}`,score:match.score,duration:`${String(Math.floor(match.duration/60)).padStart(2,"0")}:${String(Math.floor(match.duration%60)).padStart(2,"0")}`,reason:match.reason};});
 const allMatches=[...saved,...matches];const pages=Math.max(1,Math.ceil(allMatches.length/5));const visible=allMatches.slice(page*5,page*5+5);
 return <main className="game-ui log-screen"><section className="game-panel log-panel history-log">
    <h1>CAPTAIN'S LOG</h1><nav className="log-tabs"><button className="game-button secondary" onClick={onRanking}>RANKING</button><button className="game-button secondary active">MATCH HISTORY</button></nav>
    <p className="log-caption">CAPTAIN JACK · YOUR RECENT BATTLES</p>
    <div className="table-wrap"><div className="table-head history-grid"><span>DATE</span><span>POINTS</span><span>DURATION</span><span>RESULT</span></div>
      {visible.map((match,index) => <div className={`table-row history-grid${page===0&&index===0?" current":""}`} key={`${match.date}-${index}`}><span className="date">{match.date.split(" · ")[0]} <small>· {match.date.split(" · ")[1]}</small></span><strong className="points">{match.score}</strong><strong>{match.duration}</strong><strong className={match.reason === "TIME UP" ? "time-result" : "defeated-result"}>{match.reason}</strong></div>)}
    </div><div className="pagination"><button aria-label="Previous page" disabled={page===0} onClick={()=>setPage(value=>Math.max(0,value-1))}>‹</button><span>PAGE {page+1} OF {pages}</span><button aria-label="Next page" disabled={page===pages-1} onClick={()=>setPage(value=>Math.min(pages-1,value+1))}>›</button></div>
    <button className="game-button primary log-back" onClick={onBack}>MAIN MENU</button>
 </section></main>;
}
