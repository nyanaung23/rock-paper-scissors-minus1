import React from "react";
import {Link} from "react-router-dom";
import "./home.css";

function Home() {
  return (
    <main className = "home-page">
      <div className = "home-wrap">
        <h1 className = "home-title">Welcome to RPS–1!</h1>

        <p className = "home-subtitle">
          Experience Rock Paper Scissors with a twist! Pick two hands, then minus
          one to outsmart your opponent.
        </p>

        <div className = "seg-row">
          <Link className = "seg-btn is-active" to = "/vs-computer">
            <span className = "seg-emoji">⚙️</span>
            <span>vs Computer</span>
          </Link>

          <Link className = "seg-btn" to = "/vs-local">
            <span className = "seg-emoji">👥</span>
            <span>vs Local</span>
          </Link>

          <span className = "seg-btn seg-item disabled">
            <span className = "seg-emoji">🌐</span>
            <span>Online (Coming Soon)</span>
          </span>
        </div>
      </div>
    </main>
  );
}

export default Home;