import React, { useMemo, useState } from "react";
import TwoHandPicker from "../components/TwoHandPicker";
import MinusOnePhase from "../components/MinusOnePhase";
import Scoreboard from "../components/Scoreboard";
import { judge, computerTwoHands, computerRemoveIndex, EMOJI } from "../utils/game";

const PHASES = { PICK:"pick", MINUS:"minus", REVEAL:"reveal" };
const TARGET = 3;

export default function VsComputer(){
  const [p1Hands, setP1Hands] = useState([null, null]);
  const [p1Removed, setP1Removed] = useState(null);

  const [botHands, setBotHands] = useState(computerTwoHands());
  const [botRemoved, setBotRemoved] = useState(null);

  const [phase, setPhase] = useState(PHASES.PICK);
  const [score, setScore] = useState({p1:0,p2:0});
  const [matchWinner, setMatchWinner] = useState(null); // "p1" | "p2" | null

  const bothChosenTwo = useMemo(()=> p1Hands[0] && p1Hands[1], [p1Hands]);

  function beginMinus(){
    if(!bothChosenTwo || matchWinner) return;
    setPhase(PHASES.MINUS);
    setBotRemoved(computerRemoveIndex());
  }

  function doReveal(){
    if(p1Removed===null || botRemoved===null || matchWinner) return;

    const p1Final = p1Hands[Number(!p1Removed)];
    const p2Final = botHands[Number(!botRemoved)];
    const outcome = judge(p1Final, p2Final);

    // update score immediately on reveal
    if(outcome === "p1"){
      const ns = { ...score, p1: score.p1 + 1 };
      setScore(ns);
      if(ns.p1 >= TARGET) setMatchWinner("p1");
    } else if(outcome === "p2"){
      const ns = { ...score, p2: score.p2 + 1 };
      setScore(ns);
      if(ns.p2 >= TARGET) setMatchWinner("p2");
    }
    setPhase(PHASES.REVEAL);
  }

  const p1Final = phase!==PHASES.PICK && p1Removed!==null ? p1Hands[Number(!p1Removed)] : null;
  const p2Final = phase!==PHASES.PICK && botRemoved!==null ? botHands[Number(!botRemoved)] : null;
  const roundOutcome = judge(p1Final, p2Final);

  function nextRound(){
    if(matchWinner) return; // lock until reset
    setP1Hands([null,null]); setP1Removed(null);
    setBotHands(computerTwoHands()); setBotRemoved(null);
    setPhase(PHASES.PICK);
  }

  function resetMatch(){
    setScore({p1:0,p2:0});
    setMatchWinner(null);
    setP1Hands([null,null]); setP1Removed(null);
    setBotHands(computerTwoHands()); setBotRemoved(null);
    setPhase(PHASES.PICK);
  }

  return (
    <div className="vstack" style={{gap:16}}>
      <h2>vs Computer</h2>
      <Scoreboard score={score} />

      {matchWinner && (
        <div className="panel vstack" style={{borderColor:"#39d98a"}}>
          <h3>Match Over</h3>
          <div style={{fontWeight:700}}>
            {matchWinner==="p1" ? "You win the match!" : "Computer wins the match"}
          </div>
          <button className="btn primary" onClick={resetMatch}>Play Again</button>
        </div>
      )}

      {phase===PHASES.PICK && (
        <div className="panel vstack">
          <h3>Your two hands</h3>
          <TwoHandPicker value={p1Hands} onChange={setP1Hands} disabled={!!matchWinner}/>
          <div className="hstack">
            <button className="btn primary" disabled={!bothChosenTwo || !!matchWinner} onClick={beginMinus}>Minus One ▶</button>
            <button className="btn ghost" onClick={()=>setP1Hands([null,null])} disabled={!!matchWinner}>Clear</button>
          </div>
        </div>
      )}

      {phase===PHASES.MINUS && (
        <div className="panel vstack">
          <h3>Remove one hand</h3>
          <MinusOnePhase hands={p1Hands} removedIndex={p1Removed} onRemove={setP1Removed} disabled={!!matchWinner}/>
          <button className="btn primary" disabled={p1Removed===null || !!matchWinner} onClick={doReveal}>Reveal ▶</button>
        </div>
      )}

      {phase===PHASES.REVEAL && (
        <div className="panel vstack" style={{textAlign:"center"}}>
          <h3>Reveal</h3>
          <div className="hstack center" style={{gap:26}}>
            <div><div className="muted">You</div><div style={{fontSize:48}}>{EMOJI[p1Final]}</div></div>
            <div className="muted">vs</div>
            <div><div className="muted">Computer</div><div style={{fontSize:48}}>{EMOJI[p2Final]}</div></div>
          </div>
          <div style={{fontSize:20, fontWeight:700, marginTop:8}}>
            {roundOutcome==="draw"?"Draw": roundOutcome==="p1"?"You win the round!":"Computer wins the round"}
          </div>
          <div className="hstack center" style={{marginTop:12}}>
            <button className="btn" onClick={nextRound} disabled={!!matchWinner}>Next Round</button>
          </div>
        </div>
      )}
    </div>
  );
}