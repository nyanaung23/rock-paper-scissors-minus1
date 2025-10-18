import React from "react";
import {EMOJI} from "../utils/game";

export default function MinusOnePhase({hands, removedIndex, onRemove, disabled}) {
  return (
    <div className = "deck tp-row minus-phase">
      {hands.map((m, idx) => {
        const isRemoved = removedIndex === idx;
        return (
          <button
            key = {idx}
            type = "button"
            className = {`hand-btn ${isRemoved ? "is-selected is-removed" : ""}`}
            onClick = {() => onRemove(idx)}
            disabled = {disabled}
          >
            <span className = "hand-emoji">
              {EMOJI[m]}
            </span>
            <span className = "hand-label small">
              {isRemoved ? "Removed" : "Keep"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
