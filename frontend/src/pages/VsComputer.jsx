import React, {useMemo, useState} from "react";
import {Link} from "react-router-dom";
import TwoHandPicker from "../components/TwoHandPicker";
import MinusOnePhase from "../components/MinusOnePhase";
import {judge, computerTwoHands, computerRemoveIndex, EMOJI} from "../utils/game";
import "./game.css";

import computerWinImg from "./computerWin.png";
import playerWinImg from "./soloPlayerWin.png";

const PHASES = {PICK: "pick", SHOW: "show", MINUS: "minus", REVEAL: "reveal"};
const TARGET = 3;

export default function VsComputer() {
  const [p1Hands, setP1Hands] = useState([null, null]);
  const [p1Removed, setP1Removed] = useState(null);

  const [botHands, setBotHands] = useState(computerTwoHands());
  const [botRemoved, setBotRemoved] = useState(null);

  const [phase, setPhase] = useState(PHASES.PICK);
  const [score, setScore] = useState({p1: 0, p2: 0});
  const [matchWinner, setMatchWinner] = useState(null);

  const bothChosenTwo = useMemo(() => p1Hands[0] && p1Hands[1], [p1Hands]);

  const p1Final =
    phase !== PHASES.PICK && p1Removed !== null ? p1Hands[Number(!p1Removed)] : null;
  const p2Final =
    phase !== PHASES.PICK && botRemoved !== null ? botHands[Number(!botRemoved)] : null;

  function goShow() {
    if (!bothChosenTwo || matchWinner) return;
    setPhase(PHASES.SHOW);
  }

  function goMinus() {
    if (matchWinner) return;
    setBotRemoved(computerRemoveIndex());
    setPhase(PHASES.MINUS);
  }

  function doReveal() {
    if (p1Removed === null || botRemoved === null || matchWinner) return;

    const outcome = judge(
      p1Hands[Number(!p1Removed)],
      botHands[Number(!botRemoved)]
    );

    if (outcome === "p1") {
      const ns = {...score, p1: score.p1 + 1};
      setScore(ns);
      if (ns.p1 >= TARGET) setMatchWinner("p1");
    } else if (outcome === "p2") {
      const ns = {...score, p2: score.p2 + 1};
      setScore(ns);
      if (ns.p2 >= TARGET) setMatchWinner("p2");
    }
    setPhase(PHASES.REVEAL);
  }

  function nextRound() {
    if (matchWinner) return;
    setP1Hands([null, null]);
    setP1Removed(null);
    setBotHands(computerTwoHands());
    setBotRemoved(null);
    setPhase(PHASES.PICK);
  }

  function resetMatch() {
    setScore({p1: 0, p2: 0});
    setMatchWinner(null);
    setP1Hands([null, null]);
    setP1Removed(null);
    setBotHands(computerTwoHands());
    setBotRemoved(null);
    setPhase(PHASES.PICK);
  }

  const phaseText =
    phase === PHASES.PICK
      ? "Pick two hands to begin."
      : phase === PHASES.SHOW
      ? "Both selections revealed. Now remove one hand."
      : phase === PHASES.MINUS
      ? "Remove one hand to make your final choice."
      : "Reveal!";

  if (matchWinner) {
    const youWin = matchWinner === "p1";
    const winnerImg = youWin ? playerWinImg : computerWinImg;

    return (
      <div className="endpage">
        <div className={`end-result ${youWin ? "win" : "lose"}`}>
          {youWin ? "YOU WIN!" : "YOU LOSE!"}
        </div>

        <div className="end-media">
          <img
            src={winnerImg}
            alt={youWin ? "Player wins" : "Robot wins"}
            className="end-hero-img"
            draggable="false"
          />
        </div>

        <div className="end-scorecard">
          <div className="end-card-title">SCOREBOARD</div>
          <div className="end-card-grid">
            <div className="end-card-col">
              <div className="end-card-label">YOU</div>
              <div className="end-card-num">{score.p1}</div>
            </div>
            <div className="end-card-col">
              <div className="end-card-label">Robot</div>
              <div className="end-card-num">{score.p2}</div>
            </div>
          </div>
        </div>

        <div className="end-actions">
          <button className="btn primary end-btn" onClick={resetMatch}>
            PLAY ANOTHER GAME
          </button>
          <Link className="btn ghost end-btn outline" to="/">
            RETURN HOME
          </Link>
        </div>
      </div>
    );
  }

  function OriginalPicks({ p1Hands, botHands }) {
    return (
      <div className="peek-inline panel">
        <div className="muted" style={{ marginBottom: 6 }}>Original picks</div>
        <div className="peek-grid">
          <div>
            <div className="muted">You chose</div>
            <div className="peek-row">
              <div className="peek-emoji">{EMOJI[p1Hands[0]]}</div>
              <div className="peek-emoji">{EMOJI[p1Hands[1]]}</div>
            </div>
          </div>
          <div>
            <div className="muted">Robot chose</div>
            <div className="peek-row">
              <div className="peek-emoji">{EMOJI[botHands[0]]}</div>
              <div className="peek-emoji">{EMOJI[botHands[1]]}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vs-page">
      <div className="bottom-wrap">
        <aside className="scoreboard panel">
          <div className="sb-title">SCOREBOARD</div>

          <div className="sb-row">
            <div className="sb-label">You</div>
            <div className="sb-score">{score.p1}</div>
          </div>

          <div className="sb-divider" />

          <div className="sb-row">
            <div className="sb-label">Robot</div>
            <div className="sb-score">{score.p2}</div>
          </div>
        </aside>

        <div className="center-col">
          <h1 className="page-title">Single Player</h1>
          <div className="phase-callout panel">{phaseText}</div>

          {phase === PHASES.PICK && (
            <section className="panel vstack stage-center">
              <TwoHandPicker value={p1Hands} onChange={setP1Hands} />
              <div className="hstack" style={{marginTop: 10}}>
                <button
                  className="btn primary"
                  disabled={!bothChosenTwo}
                  onClick={goShow}
                >
                  Reveal
                </button>
                <button
                  className="btn ghost"
                  onClick={() => setP1Hands([null, null])}
                >
                  Clear
                </button>
              </div>
            </section>
          )}

          {phase === PHASES.SHOW && (
            <section className="panel vstack center stage-center peek-phase" style={{textAlign: "center"}}>
              <div className="peek-grid">
                <div>
                  <div className="muted">You chose</div>
                  <div className="peek-row">
                    <div className="peek-emoji">{EMOJI[p1Hands[0]]}</div>
                    <div className="peek-emoji">{EMOJI[p1Hands[1]]}</div>
                  </div>
                </div>
                <div>
                  <div className="muted">Robot chose</div>
                  <div className="peek-row">
                    <div className="peek-emoji">{EMOJI[botHands[0]]}</div>
                    <div className="peek-emoji">{EMOJI[botHands[1]]}</div>
                  </div>
                </div>
              </div>

              <button className="btn primary" style={{marginTop: 16}} onClick={goMinus}>
                Continue to Minus One
              </button>
            </section>
          )}

          {phase === PHASES.MINUS && (
            <section className="panel vstack minus-phase stage-center">
              <OriginalPicks p1Hands={p1Hands} botHands={botHands} />

              <MinusOnePhase
                hands={p1Hands}
                removedIndex={p1Removed}
                onRemove={setP1Removed}
              />
              <button
                className="btn primary"
                style={{marginTop: 10}}
                disabled={p1Removed === null}
                onClick={doReveal}
              >
                Reveal
              </button>
            </section>
          )}

          {phase === PHASES.REVEAL && (
            <section className="panel vstack center stage-center" style={{textAlign: "center"}}>
              <div className="reveal-row">
                <div>
                  <div className="round-caption">You</div>
                  <div className="reveal-emoji">{EMOJI[p1Final]}</div>
                </div>
                <div className="round-caption">vs</div>
                <div>
                  <div className="round-caption">Robot</div>
                  <div className="reveal-emoji">{EMOJI[p2Final]}</div>
                </div>
              </div>
              <div className="round-outcome">
                {judge(p1Final, p2Final) === "draw"
                  ? "Draw"
                  : judge(p1Final, p2Final) === "p1"
                  ? "You win the round!"
                  : "Robot wins the round"}
              </div>
              <button className="btn btn-wide" onClick={nextRound} style={{marginTop: 8}}>
                Next Round
              </button>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}