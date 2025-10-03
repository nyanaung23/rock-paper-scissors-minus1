import React from "react";
import { useParams, Link } from "react-router-dom";

export default function OnlineGame(){
  const { roomId } = useParams();
  return (
    <div className="vstack" style={{gap:16}}>
      <h2>Online Room</h2>
      <div className="panel vstack">
        <p>Online play is not enabled yet.</p>
        <div className="small">Room ID (placeholder): <span className="kbd">{roomId}</span></div>
        <div className="hstack" style={{marginTop:8}}>
          <Link className="btn" to="/online">Back</Link>
          <Link className="btn" to="/vs-local">Play vs Local</Link>
          <Link className="btn" to="/vs-computer">Play vs Computer</Link>
        </div>
      </div>
    </div>
  );
}
