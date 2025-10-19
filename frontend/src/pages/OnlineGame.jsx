import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import TwoHandPicker from "../components/TwoHandPicker";
import MinusOnePhase from "../components/MinusOnePhase";
import { EMOJI } from "../utils/game";
import "./game.css";

import player1WinImg from "./player1Win.png";
import player2WinImg from "./player2Win.png";

const PHASES = { PICK: "pick", SHOW: "show", MINUS: "minus", REVEAL: "reveal" };
const e = (k) => (k && EMOJI?.[k]) || "❔";

function OriginalPicks({ p1Hands, p2Hands }) {
  return (
    <div className="peek-inline panel">
      <div className="muted" style={{ marginBottom: 6 }}>Original picks</div>
      <div className="peek-grid">
        <div>
          <div className="muted">Player 1 chose</div>
          <div className="peek-row">
            <div className="peek-emoji">{e(p1Hands?.[0])}</div>
            <div className="peek-emoji">{e(p1Hands?.[1])}</div>
          </div>
        </div>
        <div>
          <div className="muted">Player 2 chose</div>
          <div className="peek-row">
            <div className="peek-emoji">{e(p2Hands?.[0])}</div>
            <div className="peek-emoji">{e(p2Hands?.[1])}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WaitingForOpponent({ code, wsError, message = "Waiting for opponent to join…" }) {
  return (
    <section className="panel vstack center stage-center" style={{ textAlign: "center" }}>
      <div className="phase-callout panel">Share this code with your friend.</div>
      <div
        className="phase-callout panel"
        style={{ fontSize: 32, fontWeight: 900, letterSpacing: 3, marginTop: 10, padding: "10px 18px", display: "inline-block", minWidth: 220 }}
        aria-label="Room code"
      >
        {code}
      </div>
      <div className="hstack center" style={{ gap: 10, marginTop: 10 }}>
        <Link className="btn ghost" to="/online">Back</Link>
      </div>
      <div className="phase-callout panel" style={{ marginTop: 16, fontWeight: 800 }}>{message}</div>
      {wsError && <div className="phase-callout panel" style={{ marginTop: 10, color: "#ff8080" }}>{wsError}</div>}
    </section>
  );
}

export default function OnlineGame() {
  const { code: codeFromParams } = useParams();
  const pathMatch = window.location.pathname.match(/\/online\/([A-Za-z0-9]{6})\/?$/);
  const rawCode = codeFromParams || (pathMatch ? pathMatch[1] : "");
  const roomCode = (rawCode || "").toUpperCase();
  const hasValidCode = /^[A-Z0-9]{6}$/.test(roomCode);

  const [state, setState] = useState(null);
  const [role, setRole] = useState(null);
  const [wsError, setWsError] = useState(null);
  const wsRef = useRef(null);

  const [localMinusChosen, setLocalMinusChosen] = useState(false);
  const revealSentRef = useRef(false);

  function buildWsURL(room) {
    // Highest priority: dedicated WS base if provided
    const wsBase = process.env.REACT_APP_WS_URL || process.env.VITE_WS_URL;
    if (wsBase) {
      // Accept full ws(s):// URLs or http(s):// and convert
      try {
        const u = new URL(wsBase);
        if (u.protocol === "ws:" || u.protocol === "wss:") {
          return `${u.protocol}//${u.host}/ws/rps/${room}/`;
        }
        const wsOrigin = u.protocol === "https:" ? `wss://${u.host}` : `ws://${u.host}`;
        return `${wsOrigin}/ws/rps/${room}/`;
      } catch (_) {

        const host = wsBase.replace(/^\/+|\/+$/g, "");
        const { protocol } = window.location;
        const scheme = protocol === "https:" ? "wss://" : "ws://";
        return `${scheme}${host}/ws/rps/${room}/`;
      }
    }


    const base = process.env.REACT_APP_API_URL || process.env.VITE_API_URL;
    if (base) {
      const u = new URL(base);
      const wsOrigin = u.protocol === "https:" ? `wss://${u.host}` : `ws://${u.host}`;
      return `${wsOrigin}/ws/rps/${room}/`;
    }


    const { protocol, host } = window.location;
    const scheme = protocol === "https:" ? "wss://" : "ws://";
    return `${scheme}${host}/ws/rps/${room}/`;
  }

  useEffect(() => {
    if (!hasValidCode) {
      setState(null);
      setRole(null);
      setWsError(null);
      return;
    }
    setWsError(null);
    const url = buildWsURL(roomCode);
    console.log("Attempting WebSocket connection to:", url);
    let ws;
    try { ws = new WebSocket(url); } catch (err) { setWsError(`WebSocket create failed. ${String(err)}`); return; }
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WS open ✔");
      setWsError(null);
    };
    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        console.log("WS message:", msg);
        if (msg.type === "joined") { setRole(msg.role); setState(msg.state); }
        else if (msg.type === "state") { setState(msg.state); }
      } catch {
        setWsError("Bad message from server (parse error).");
      }
    };
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setWsError(`WebSocket error. URL: ${url}. Check backend logs.`);
    };
    ws.onclose = (event) => {
      console.warn("WS closed:", event.code, event.reason);
      if (event.code !== 1000) {
        setWsError(`Connection closed unexpectedly (${event.code}): ${event.reason || 'No reason provided'}`);
      }
    };

    return () => ws.close();
  }, [roomCode, hasValidCode]);

  const phase = state?.phase || PHASES.PICK;
  const score = state?.score || { p1: 0, p2: 0 };
  const p1Hands = state?.p1Hands || [null, null];
  const p2Hands = state?.p2Hands || [null, null];
  const p1Removed = state?.p1Removed ?? null;
  const p2Removed = state?.p2Removed ?? null;
  const matchWinner = state?.matchWinner ?? null;

  const rolesMap = state?.roles || {};
  const vals = Object.values(rolesMap);
  const bothPlayersPresent = vals.includes("p1") && vals.includes("p2");

  const youAreP1 = role === "p1";
  const youAreP2 = role === "p2";
  const spectator = role === "spectator";

  const youHands = youAreP1 ? p1Hands : youAreP2 ? p2Hands : [null, null];
  const oppHands = youAreP1 ? p2Hands : p1Hands;

  const readyShow = state?.ready?.show ?? { p1: false, p2: false };
  const youShowReady = youAreP1 ? readyShow.p1 : youAreP2 ? readyShow.p2 : false;
  const oppShowReady = youAreP1 ? readyShow.p2 : youAreP2 ? readyShow.p1 : false;

  const readyMinus = state?.ready?.minus ?? { p1: false, p2: false };
  const youMinusReady = youAreP1 ? readyMinus.p1 : youAreP2 ? readyMinus.p2 : false;
  const oppMinusReady = youAreP1 ? readyMinus.p2 : youAreP2 ? readyMinus.p1 : false;

  const bothChosen = (arr) => !!(arr?.[0] && arr?.[1]);

  const p1Final = p1Removed != null ? p1Hands[Number(!p1Removed)] : null;
  const p2Final = p2Removed != null ? p2Hands[Number(!p2Removed)] : null;

  const phaseText =
    phase === PHASES.PICK ? "Pick two hands simultaneously with your opponent."
    : phase === PHASES.SHOW ? "Both selections revealed. Now remove one hand."
    : phase === PHASES.MINUS ? "Remove one hand, then press Reveal when ready."
    : "Reveal!";

  const youRemoved = youAreP1 ? p1Removed != null : youAreP2 ? p2Removed != null : false;
  const oppRemoved = youAreP1 ? p2Removed != null : youAreP2 ? p1Removed != null : false;

  useEffect(() => {
    if (phase === PHASES.MINUS) {
      revealSentRef.current = false;
      setLocalMinusChosen(!!youRemoved);
    } else {
      setLocalMinusChosen(false);
    }
  }, [phase, youRemoved]);

  function send(type, payload = {}) {
    const ws = wsRef.current;
    if (ws && ws.readyState === 1) ws.send(JSON.stringify({ type, ...payload }));
  }

  if (!hasValidCode) {
    return (
      <div className="vs-page">
        <div className="center-col">
          <h1 className="page-title">ONLINE</h1>
          <div className="phase-callout panel">No valid room code in URL.</div>
          <Link className="btn" to="/online">Back to Online Lobby</Link>
        </div>
      </div>
    );
  }
  if (!state || !state.phase) {
    return (
      <div className="vs-page">
        <div className="center-col">
          <div className="phase-callout panel">Connecting to room {roomCode}…</div>
          {wsError && <div className="phase-callout panel" style={{ marginTop: 10, color: "#ff8080" }}>{wsError}</div>}
        </div>
      </div>
    );
  }

  if (!bothPlayersPresent || spectator) {
    return (
      <div className="vs-page">
        <div className="center-col">
          <h1 className="page-title">ONLINE: {roomCode}</h1>
          <WaitingForOpponent code={roomCode} wsError={wsError} />
        </div>
      </div>
    );
  }

  if (matchWinner) {
    const youWin = (matchWinner === "p1" && youAreP1) || (matchWinner === "p2" && youAreP2);
    const winnerImg = matchWinner === "p1" ? player1WinImg : player2WinImg;

    return (
      <div className="endpage">
        <div className={`end-result ${youWin ? "win" : "lose"}`}>{youWin ? "YOU WIN!" : "YOU LOSE!"}</div>

        <div className="end-media">
          <img
            src={winnerImg}
            alt={matchWinner === "p1" ? "Player 1 wins" : "Player 2 wins"}
            className="end-hero-img"
            draggable="false"
            style={{ width: "clamp(420px, 60vw, 700px)", maxHeight: "70vh", objectFit: "contain" }}
          />
        </div>

        <div className="end-scorecard">
          <div className="end-card-title">SCOREBOARD</div>
          <div className="end-card-grid">
            <div className="end-card-col"><div className="end-card-label">PLAYER 1</div><div className="end-card-num">{score.p1}</div></div>
            <div className="end-card-col"><div className="end-card-label">PLAYER 2</div><div className="end-card-num">{score.p2}</div></div>
          </div>
        </div>
        <div className="end-actions">
          <button className="btn primary end-btn" onClick={() => send("match.reset")}>PLAY ANOTHER GAME</button>
          <Link className="btn ghost end-btn outline" to="/">RETURN HOME</Link>
        </div>
      </div>
    );
  }

  const waitingPickBanner = false;
  const waitingMinusBanner = false;

  return (
    <div className="vs-page">
      <div className="bottom-wrap">
        <aside className="scoreboard panel">
          <div className="sb-title">SCOREBOARD</div>
          <div className="sb-row"><div className="sb-label">PLAYER 1</div><div className="sb-score">{score.p1}</div></div>
          <div className="sb-divider" />
          <div className="sb-row"><div className="sb-label">PLAYER 2</div><div className="sb-score">{score.p2}</div></div>
        </aside>

        <div className="center-col">
          <h1 className="page-title">ONLINE: {roomCode}</h1>

          {waitingPickBanner && (
            <div className="phase-callout panel" style={{ fontWeight: 800, textAlign: "center" }}>
              Waiting for opponent’s choice…
            </div>
          )}
          {waitingMinusBanner && (
            <div className="phase-callout panel" style={{ fontWeight: 800, textAlign: "center" }}>
              Waiting for opponent to reveal…
            </div>
          )}

          <div className="phase-callout panel">{phaseText}</div>
          {wsError && <div className="phase-callout panel" style={{ color: "#ff8080" }}>{wsError}</div>}

          {phase === PHASES.PICK && (
            <section className="panel vstack stage-center">
              <TwoHandPicker
                value={youHands}
                onChange={(v) => {
                  const key = youAreP1 ? "p1Hands" : "p2Hands";
                  setState((s) => ({ ...s, [key]: v }));
                  send("pick.set", { hands: v });
                }}
              />
              <div className="hstack" style={{ gap: 8, justifyContent: "center", marginTop: 10 }}>
                <button
                  className="btn primary"
                  disabled={!bothChosen(youHands)}
                  onClick={() => send("phase.show")}
                >
                  {youShowReady ? "Ready" : "Decide"}
                </button>
                <button
                  className="btn ghost"
                  onClick={() => {
                    const key = youAreP1 ? "p1Hands" : "p2Hands";
                    const cleared = [null, null];
                    setState((s) => ({ ...s, [key]: cleared }));
                    send("pick.set", { hands: cleared });
                  }}
                >
                  Clear
                </button>
              </div>
            </section>
          )}

          {phase === PHASES.SHOW && (
            <section className="panel vstack center stage-center" style={{ textAlign: "center" }}>
              <div className="peek-grid">
                <div>
                  <div className="muted">Player 1 chose</div>
                  <div className="peek-row">
                    <div className="peek-emoji">{e(p1Hands?.[0])}</div>
                    <div className="peek-emoji">{e(p1Hands?.[1])}</div>
                  </div>
                </div>
                <div>
                  <div className="muted">Player 2 chose</div>
                  <div className="peek-row">
                    <div className="peek-emoji">{e(p2Hands?.[0])}</div>
                    <div className="peek-emoji">{e(p2Hands?.[1])}</div>
                  </div>
                </div>
              </div>
              <button className="btn primary" style={{ marginTop: 16 }} onClick={() => send("phase.minus")}>
                Continue to Minus One
              </button>
            </section>
          )}

          {phase === PHASES.MINUS && (
            <section className="panel vstack minus-phase stage-center">
              <OriginalPicks p1Hands={p1Hands} p2Hands={p2Hands} />
              <MinusOnePhase
                hands={youHands}
                removedIndex={youAreP1 ? p1Removed : youAreP2 ? p2Removed : null}
                onRemove={(idx) => {
                  setLocalMinusChosen(true);
                  send("minus.choice", { index: idx });
                }}
              />
              <div className="hstack" style={{ gap: 8, justifyContent: "center", marginTop: 10 }}>
                <button
                  className="btn primary"
                  disabled={!youRemoved || youMinusReady}
                  onClick={() => send("phase.reveal")}
                >
                  {youMinusReady ? "Ready" : "Decide"}
                </button>
              </div>
            </section>
          )}

          {phase === PHASES.REVEAL && (
            <section className="panel vstack center stage-center" style={{ textAlign: "center" }}>
              <div className="reveal-row">
                <div><div className="muted">P1</div><div className="reveal-emoji">{e(p1Final)}</div></div>
                <div className="muted">vs</div>
                <div><div className="muted">P2</div><div className="reveal-emoji">{e(p2Final)}</div></div>
              </div>
              <div className="round-outcome">
                {state?.lastOutcome === "draw"
                  ? "Draw"
                  : state?.lastOutcome === "p1"
                  ? "Player 1 wins the round"
                  : "Player 2 wins the round"}
              </div>
              <button className="btn btn-wide" onClick={() => send("round.next")} style={{ marginTop: 8 }}>
                Next Round
              </button>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}