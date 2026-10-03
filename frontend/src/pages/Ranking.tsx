import { useState } from "react";
import { readMatches } from "../config/matchStorage";
import "./Ranking.css";
interface RankingProps { onBack: () => void; onHistory?: () => void; }
const basePlayers = [
    ["Captain Flint",38],["Red Sparrow",32],["Captain Jack",24],["Storm Rider",21],["Sea Wolf",19],
    ["Black Gull",18],["Ironbeard",17],["Marina",16],["Old Salt",15],["The Corsair",14],
    ["Blue Dagger",13],["Misty Mae",12],["Crimson Tide",11],["Barnacle Bill",10],["Roughwater",9],
] as const;
export default function Ranking({ onBack, onHistory = onBack }: RankingProps) {
 const [page,setPage]=useState(0);
 const records=readMatches();
 const captainScore=Math.max(24,...records.map(match=>match.score));
 const players=basePlayers.map(([name,score])=>({name,score:name==="Captain Jack"?captainScore:score,current:name==="Captain Jack",played:"08 SEP · 19:36"})).sort((a,b)=>b.score-a.score).map((player,index)=>({...player,position:index+1}));
 const pages=Math.ceil(players.length/5);const visible=players.slice(page*5,page*5+5);
 return <main className="game-ui log-screen"><section className="game-panel log-panel">
    <h1>CAPTAIN'S LOG</h1><nav className="log-tabs"><button className="game-button secondary active">RANKING</button><button className="game-button secondary" onClick={onHistory}>MATCH HISTORY</button></nav>
    <p className="log-caption">120 SECOND BATTLES · 3 SECOND SPAWN INTERVAL</p>
    <div className="table-wrap"><div className="table-head ranking-grid"><span>RANK</span><span>CAPTAIN</span><span>POINTS</span><span>PLAYED</span></div>
      {visible.map(player => <div className={`table-row ranking-grid${player.current ? " current" : ""}`} key={player.position}><strong>{String(player.position).padStart(2,"0")}</strong><span>{player.current && <b className="star">★ </b>}{player.name}{player.current && <small className="you-tag">YOU</small>}</span><strong className="points">{player.score}</strong><span className="played">{player.played}</span></div>)}
    </div><div className="pagination"><button aria-label="Previous page" disabled={page===0} onClick={()=>setPage(value=>Math.max(0,value-1))}>‹</button><span>PAGE {page+1} OF {pages}</span><button aria-label="Next page" disabled={page===pages-1} onClick={()=>setPage(value=>Math.min(pages-1,value+1))}>›</button></div>
    <button className="game-button primary log-back" onClick={onBack}>MAIN MENU</button>
 </section></main>;
}
