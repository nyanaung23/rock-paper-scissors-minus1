import React from "react";
import HandChoice from "./HandChoice";
import {MOVES} from "../utils/game";

export default function TwoHandPicker({value, onChange, disabled}) {

  function toggle(move) {
    if (disabled) return;

    let [a, b] = value;

    if ([a, b].includes(move)) {
      const next = [a, b].filter(m => m !== move);
      onChange([next[0] || null, next[1] || null]);
      return;
    }

    if (!a) {
      onChange([move, b || null]);
    } else if (!b) {
      onChange([a, move]);
    } else {
      onChange([b, move]);
    }
  }

  const selectedSet = new Set(value.filter(Boolean));

  return (
    <div className = "deck tp-row">
      {MOVES.map(m => (
        <HandChoice
          key = {m}
          move = {m}
          selected = {selectedSet.has(m)}
          disabled = {disabled}
          onClick = {() => toggle(m)}
        />
      ))}
    </div>
  );
}