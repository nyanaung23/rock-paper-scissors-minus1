import React from "react";
import { EMOJI } from "../utils/game";

export default function MinusOnePhase({ hands, removedIndex, onRemove, disabled }) {
  return (
    <div className="deck">
      {hands.map((m,idx)=> (
        <button key={idx}
          className={"card" + (removedIndex===idx?" selected":"")}
          onClick={()=>onRemove(idx)} disabled={disabled}
        >
          <div style={{fontSize:36}}>{EMOJI[m]}</div>
          <div className="small">Remove this hand</div>
        </button>
      ))}
    </div>
  );
}
