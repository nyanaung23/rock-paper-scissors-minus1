import React, {useMemo, useState} from "react";
import {Link} from "react-router-dom";
import TwoHandPicker from "../components/TwoHandPicker";
import MinusOnePhase from "../components/MinusOnePhase";
import {judge, EMOJI} from "../utils/game";
import "./game.css";

import player1WinImg from "./player1Win.png";
import player2WinImg from "./player2Win.png";

const P = {P1_PICK: 0, P2_PICK: 1, SHOW: 2, P1_MINUS: 3, P2_MINUS: 4, REVEAL: 5};
const TARGET = 3;

export default function VsLocal() {
  const [phase, setPhase] = useState(P.P1_PICK);
  const [p1Hands, setP1Hands] = useState([null, null]);
  const [p2Hands, setP2Hands] = useState([null, null]);
  const [p1Removed, setP1Removed] = useState(null);
  const [p2Removed, setP2Removed] = useState(null);
  const [score, setScore] = useState({p1: 0, p2: 0});
  const [matchWinner, setMatchWinner] = useState(null);

  const p1Ready = useMemo(() => !!(p1Hands[0] && p1Hands[1]), [p1Hands]);
  const p2Ready = useMemo(() => !!(p2Hands[0] && p2Hands[1]), [p2Hands]);

  const p1Final = p1Removed !== null ? p1Hands[Number(!p1Removed)] : null;
  const p2Final = p2Removed !== null ? p2Hands[Number(!p2Removed)] : null;

  const outcome = useMemo(() => judge(p1Final, p2Final), [p1Final, p2Final]);

  function toReveal() {
    if (p1Removed === null || p2Removed === null || matchWinner) return;

    if (outcome === "p1") {
      const ns = {...score, p1: score.p1 + 1};
      setScore(ns);
      if (ns.p1 >= TARGET) setMatchWinner("p1");
    } else if (outcome === "p2") {
      const ns = {...score, p2: score.p2 + 1};
      setScore(ns);
      if (ns.p2 >= TARGET) setMatchWinner("p2");
    }
    setPhase(P.REVEAL);
  }

  function nextRound() {
    if (matchWinner) return;
    setPhase(P.P1_PICK);
    setP1Hands([null, null]);
    setP2Hands([null, null]);
    setP1Removed(null);
    setP2Removed(null);
  }

  function resetMatch() {
    setScore({p1: 0, p2: 0});
    setMatchWinner(null);
    setPhase(P.P1_PICK);
    setP1Hands([null, null]);
    setP2Hands([null, null]);
    setP1Removed(null);
    setP2Removed(null);
  }

  const phaseText =
    phase === P.P1_PICK ? "Player 1: Pick two hands." :
    phase === P.P2_PICK ? "Player 2: Pick two hands." :
    phase === P.SHOW ? "Both selections revealed. Now remove one hand." :
    phase === P.P1_MINUS ? "Player 1: Remove one hand." :
    phase === P.P2_MINUS ? "Player 2: Remove one hand." :
    "Reveal!";

  if (matchWinner) {
    const p1Wins = matchWinner === "p1";
    const winnerImg = p1Wins ? player1WinImg : player2WinImg;

    return (
      <div className = "endpage">
        <h1 className = "end-title">ROCK PAPER SCISSORS</h1>
        <div className = {`end-result ${p1Wins ? "win" : "lose"}`}>
          {p1Wins ? "PLAYER 1 WINS!" : "PLAYER 2 WINS!"}
        </div>

        <div className = "end-media">
          <img
            src = {winnerImg}
            alt = {p1Wins ? "Player 1 wins" : "Player 2 wins"}
            className = "end-hero-img"
            draggable = "false"
          />
        </div>

        <div className = "end-scorecard">
          <div className = "end-card-title">SCOREBOARD</div>
          <div className = "end-card-grid">
            <div className = "end-card-col">
              <div className = "end-card-label">PLAYER 1</div>
              <div className = "end-card-num">{score.p1}</div>
            </div>
            <div className = "end-card-col">
              <div className = "end-card-label">PLAYER 2</div>
              <div className = "end-card-num">{score.p2}</div>
            </div>
          </div>
        </div>

        <div className = "end-actions">
          <button className = "btn primary end-btn" onClick = {resetMatch}>
            PLAY NEXT ROUND
          </button>
          <Link className = "btn ghost end-btn outline" to = "/">
            RETURN TO MAIN MENU
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className = "vs-page">
      <div className = "bottom-wrap">
        <aside className = "scoreboard panel">
          <div className = "sb-title">SCOREBOARD</div>

          <div className = "sb-row">
            <div className = "sb-label">PLAYER 1</div>
            <div className = "sb-score">{score.p1}</div>
          </div>

          <div className = "sb-divider" />

          <div className = "sb-row">
            <div className = "sb-label">PLAYER 2</div>
            <div className = "sb-score">{score.p2}</div>
          </div>
        </aside>

        <div className = "center-col">
          <h1 className = "page-title">VS LOCAL</h1>
          <div className = "phase-callout panel">{phaseText}</div>

          {phase === P.P1_PICK && (
            <section className = "panel vstack stage-center">
              <TwoHandPicker value = {p1Hands} onChange = {setP1Hands} />
              <div className = "hstack center" style = {{marginTop: 12}}>
                <button
                  className = "btn primary"
                  disabled = {!p1Ready}
                  onClick = {() => setPhase(P.P2_PICK)}
                >
                  Next ▶
                </button>
                <button
                  className = "btn ghost"
                  onClick = {() => setP1Hands([null, null])}
                >
                  Clear
                </button>
              </div>
            </section>
          )}

          {phase === P.P2_PICK && (
            <section className = "panel vstack stage-center">
              <TwoHandPicker value = {p2Hands} onChange = {setP2Hands} />
              <div className = "hstack center" style = {{marginTop: 12}}>
                <button
                  className = "btn primary"
                  disabled = {!p2Ready}
                  onClick = {() => setPhase(P.SHOW)}
                >
                  Reveal ▶
                </button>
                <button
                  className = "btn ghost"
                  onClick = {() => setP2Hands([null, null])}
                >
                  Clear
                </button>
              </div>
            </section>
          )}

          {phase === P.SHOW && (
            <section className = "panel vstack center stage-center peek-phase" style = {{textAlign: "center"}}>
              <div className = "peek-grid">
                <div>
                  <div className = "muted">Player 1 chose</div>
                  <div className = "peek-row">
                    <div className = "peek-emoji">{EMOJI[p1Hands[0]]}</div>
                    <div className = "peek-emoji">{EMOJI[p1Hands[1]]}</div>
                  </div>
                </div>
                <div>
                  <div className = "muted">Player 2 chose</div>
                  <div className = "peek-row">
                    <div className = "peek-emoji">{EMOJI[p2Hands[0]]}</div>
                    <div className = "peek-emoji">{EMOJI[p2Hands[1]]}</div>
                  </div>
                </div>
              </div>
              <button
                className = "btn primary"
                style = {{marginTop: 16}}
                onClick = {() => setPhase(P.P1_MINUS)}
              >
                Continue to Minus One ▶
              </button>
            </section>
          )}

          {phase === P.P1_MINUS && (
            <section className = "panel vstack minus-phase stage-center">
              <MinusOnePhase
                hands = {p1Hands}
                removedIndex = {p1Removed}
                onRemove = {setP1Removed}
              />
              <div className = "hstack center" style = {{marginTop: 12}}>
                <button
                  className = "btn primary"
                  disabled = {p1Removed === null}
                  onClick = {() => setPhase(P.P2_MINUS)}
                >
                  Next ▶
                </button>
              </div>
            </section>
          )}

          {phase === P.P2_MINUS && (
            <section className = "panel vstack minus-phase stage-center">
              <MinusOnePhase
                hands = {p2Hands}
                removedIndex = {p2Removed}
                onRemove = {setP2Removed}
              />
              <div className = "hstack center" style = {{marginTop: 12}}>
                <button
                  className = "btn primary"
                  disabled = {p2Removed === null}
                  onClick = {toReveal}
                >
                  Reveal ▶
                </button>
              </div>
            </section>
          )}

          {phase === P.REVEAL && (
            <section className = "panel vstack center stage-center" style = {{textAlign: "center"}}>
              <div className = "reveal-row">
                <div>
                  <div className = "muted">P1</div>
                  <div className = "reveal-emoji">{EMOJI[p1Final]}</div>
                </div>
                <div className = "muted">vs</div>
                <div>
                  <div className = "muted">P2</div>
                  <div className = "reveal-emoji">{EMOJI[p2Final]}</div>
                </div>
              </div>
              <div className = "round-outcome">
                {outcome === "draw"
                  ? "Draw"
                  : outcome === "p1"
                  ? "Player 1 wins the round"
                  : "Player 2 wins the round"}
              </div>
              <button className = "btn btn-wide" onClick = {nextRound} style = {{marginTop: 8}}>
                Next Round
              </button>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}