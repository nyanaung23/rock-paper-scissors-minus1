import React from "react";

export default function OnlineLobby(){
  return (
    <div className="vstack" style={{gap:16}}>
      <h2>Online Play</h2>
      <div className="panel vstack">
        <p>Online vs Friend is coming soon. For now, try:</p>
        <div className="hstack">
          <a className="btn" href="/vs-local">Play vs Local</a>
          <a className="btn" href="/vs-computer">Play vs Computer</a>
        </div>
      </div>
    </div>
  );
}
