export const MOVES = ["rock","paper","scissors"];
export const EMOJI = { rock:"✊", paper:"✋", scissors:"✌️" };

export function beats(a,b){
  return (
    (a==="rock" && b==="scissors") ||
    (a==="paper" && b==="rock") ||
    (a==="scissors" && b==="paper")
  );
}

export function judge(a,b){
  if(!a || !b) return "pending";
  if(a===b) return "draw";
  return beats(a,b) ? "p1" : "p2";
}

export function computerTwoHands(){
  const shuffled = [...MOVES].sort(()=>Math.random()-0.5);
  return [shuffled[0], shuffled[1]];
}
export function computerRemoveIndex(){
  return Math.random()<0.5 ? 0 : 1;
}
