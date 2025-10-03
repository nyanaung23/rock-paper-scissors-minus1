import React from "react";
import HandChoice from "./HandChoice";
import { MOVES } from "../utils/game";

export default function TwoHandPicker({ value, onChange, disabled }) {
  function toggle(move){
    if(disabled) return;
    const [a,b] = value;
    const has = [a,b].filter(Boolean).includes(move);
    if(has){
      const next = [a,b].filter(m=>m!==move);
      onChange([next[0]||null, next[1]||null]);
    } else {
      if(!a) onChange([move, b||null]);
      else if(!b) onChange([a, move]);
    }
  }
  const selectedSet = new Set(value.filter(Boolean));
  return (
    <div className="deck">
      {MOVES.map(m => (
        <HandChoice key={m} move={m} selected={selectedSet.has(m)} disabled={disabled} onClick={()=>toggle(m)} />
      ))}
    </div>
  );
}