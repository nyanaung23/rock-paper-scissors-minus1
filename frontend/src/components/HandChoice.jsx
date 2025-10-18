import React from "react";
import {EMOJI} from "../utils/game";

export default function HandChoice({move, selected, disabled, onClick}) {
  return (
    <button
      type = "button"
      className = {`hand-btn ${selected ? "is-selected" : ""}`}
      onClick = {onClick}
      disabled = {disabled}
    >
      <span className = "hand-emoji">
        {EMOJI[move]}
      </span>
      <span className = "hand-label">
        {move.toUpperCase()}
      </span>
    </button>
  );
}