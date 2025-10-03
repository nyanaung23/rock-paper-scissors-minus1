import React from "react";
import { Link } from "react-router-dom";

function Home(){
  return (
    <div className="vstack" style={{gap:18}}>
      <h1>Rock • Paper • Scissors — <span className="kbd">Minus One</span></h1>
      <div className="panel vstack">
        <p>
          Each player first chooses <b>two hands</b>. After saying <b>"minus one"</b>,
          each removes one hand. Compare the <b>remaining</b> hand using classic RPS rules.
        </p>
        <div className="hstack">
          <Link className="btn primary" to="/vs-computer"> Play vs Computer</Link>
          <br></br>
          <Link className="btn" to="/vs-local"> Play vs Local </Link>
          <br></br>
          <Link className="btn" to="/online"> Play Online </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
