import React, { useState } from "react";
import TwoHandPicker from "../components/TwoHandPicker";
import MinusOnePhase from "../components/MinusOnePhase";
import Scoreboard from "../components/Scoreboard";
import { judge, EMOJI } from "../utils/game";

const P = { P1_PICK:0, P2_PICK:1, P1_MINUS:2, P2_MINUS:3, REVEAL:4 };
const TARGET = 3;

export default function VsLocal(){
  const [phase, setPhase] = useState(P.P1_PICK);
  const [p1Hands, setP1Hands] = useState([null,null]);
  const [p2Hands, setP2Hands] = useState([null,null]);
  const [p1Removed, setP1Removed] = useState(null);
  const [p2Removed, setP2Removed] = useState(null);
  const [score, setScore] = useState({p1:0,p2:0});
  const [matchWinner, setMatchWinner] = useState(null);

  const p1Ready = p1Hands[0] && p1Hands[1];
  const p2Ready = p2Hands[0] && p2Hands[1];

  const p1Final = p1Removed!==null ? p1Hands[Number(!p1Removed)] : null;
  const p2Final = p2Removed!==null ? p2Hands[Number(!p2Removed)] : null;
  const outcome = judge(p1Final, p2Final);

  function toReveal(){
    if(p1Removed===null || p2Removed===null || matchWinner) return;

    // update score at reveal time
    if(outcome==="p1"){
      const ns = { ...score, p1: score.p1 + 1 };
      setScore(ns);
      if(ns.p1 >= TARGET) setMatchWinner("p1");
    } else if(outcome==="p2"){
      const ns = { ...score, p2: score.p2 + 1 };
      setScore(ns);
      if(ns.p2 >= TARGET) setMatchWinner("p2");
    }
    setPhase(P.REVEAL);
  }

  function nextRound(){
    if(matchWinner) return;
    setPhase(P.P1_PICK);
    setP1Hands([null,null]);
    setP2Hands([null,null]);
    setP1Removed(null);
    setP2Removed(null);
  }

  function resetMatch(){
    setScore({p1:0,p2:0});
    setMatchWinner(null);
    setPhase(P.P1_PICK);
    setP1Hands([null,null]); setP2Hands([null,null]);
    setP1Removed(null); setP2Removed(null);
  }

  return (
    <div className="vstack" style={{gap:16}}>
      <h2>vs Local (same device)</h2>
      <Scoreboard p1Label="Player 1" p2Label="Player 2" score={score} />

      {matchWinner && (
        <div className="panel vstack" style={{borderColor:"#39d98a"}}>
          <h3>Match Over</h3>
          <div style={{fontWeight:700}}>
            {matchWinner==="p1" ? "Player 1 wins the match!" : "Player 2 wins the match!"}
          </div>
          <button className="btn primary" onClick={resetMatch}>Play Again</button>
        </div>
      )}

      {phase===P.P1_PICK && (
        <div className="panel vstack">
          <h3>Player 1: pick two hands</h3>
          <TwoHandPicker value={p1Hands} onChange={setP1Hands} disabled={!!matchWinner}/>
          <button className="btn primary" disabled={!p1Ready || !!matchWinner} onClick={()=>setPhase(P.P2_PICK)}>Done ▶</button>
        </div>
      )}

      {phase===P.P2_PICK && (
        <div className="panel vstack">
          <h3>Player 2: pick two hands</h3>
          <TwoHandPicker value={p2Hands} onChange={setP2Hands} disabled={!!matchWinner}/>
          <button className="btn primary" disabled={!p2Ready || !!matchWinner} onClick={()=>setPhase(P.P1_MINUS)}>Minus One ▶</button>
        </div>
      )}

      {phase===P.P1_MINUS && (
        <div className="panel vstack">
          <h3>Player 1: remove one hand</h3>
          <MinusOnePhase hands={p1Hands} removedIndex={p1Removed} onRemove={setP1Removed} disabled={!!matchWinner}/>
          <button className="btn primary" disabled={p1Removed===null || !!matchWinner} onClick={()=>setPhase(P.P2_MINUS)}>Next ▶</button>
        </div>
      )}

      {phase===P.P2_MINUS && (
        <div className="panel vstack">
          <h3>Player 2: remove one hand</h3>
          <MinusOnePhase hands={p2Hands} removedIndex={p2Removed} onRemove={setP2Removed} disabled={!!matchWinner}/>
          <button className="btn primary" disabled={p2Removed===null || !!matchWinner} onClick={toReveal}>Reveal ▶</button>
        </div>
      )}

      {phase===P.REVEAL && (
        <div className="panel vstack" style={{textAlign:"center"}}>
          <h3>Reveal</h3>
          <div className="hstack center" style={{gap:26}}>
            <div><div className="muted">P1</div><div style={{fontSize:48}}>{EMOJI[p1Final]}</div></div>
            <div className="muted">vs</div>
            <div><div className="muted">P2</div><div style={{fontSize:48}}>{EMOJI[p2Final]}</div></div>
          </div>
          <div style={{fontSize:20, fontWeight:700, marginTop:8}}>
            {outcome==="draw"?"Draw": outcome==="p1"?"Player 1 wins the round":"Player 2 wins the round"}
          </div>
          <div className="hstack center" style={{marginTop:12}}>
            <button className="btn" onClick={nextRound} disabled={!!matchWinner}>Next Round</button>
          </div>
        </div>
      )}
    </div>
  );
}