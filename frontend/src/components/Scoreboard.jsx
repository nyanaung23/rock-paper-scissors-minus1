import React from "react";

export default function Scoreboard({p1Label = "You", p2Label = "Opponent", score}) {
  return (
    <div className = "score">
      <div>
        <div className = "muted">{p1Label}</div>
        <div style = {{fontSize: 22, fontWeight: 700}}>{score.p1}</div>
      </div>
      <div>
        <div className = "muted">{p2Label}</div>
        <div style = {{fontSize: 22, fontWeight: 700}}>{score.p2}</div>
      </div>
    </div>
  );
}
