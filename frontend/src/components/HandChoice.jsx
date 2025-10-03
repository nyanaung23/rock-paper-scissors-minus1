import React from "react";
import { EMOJI } from "../utils/game";

export default function HandChoice({move, selected=false, disabled=false, onClick}){
  return (
    <button className={"card" + (selected?" selected":"")} disabled={disabled} onClick={onClick}>
      <div style={{fontSize:36}}>{EMOJI[move]}</div>
      <div style={{marginTop:6, textTransform:"capitalize"}}>{move}</div>
    </button>
  );
}