import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./home.css";

function Home() {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <main className="home-page">
      <div className="spinning-triangle-1"></div>
      <div className="spinning-triangle-2"></div>
      <div className="spinning-triangle-3"></div>
      <div className="spinning-triangle-4"></div>
      <div className="spinning-circle-1"></div>
      <div className="spinning-circle-2"></div>
      <div className="spinning-circle-3"></div>
      <div className="spinning-circle-4"></div>
      <div className="spinning-circle-5"></div>
      <div className="spinning-circle-6"></div>
      <div className="spinning-circle-7"></div>
      <div className="spinning-circle-8"></div>
      <div className="spinning-square"></div>
      
      <div className="home-wrap">
                <h1 className="home-title">ROCK PAPER SCISSORS</h1>
                <h2 className="home-title" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', marginTop: '-1rem' }}>MINUS ONE</h2>

                <p className="home-subtitle">
                  Choose your battleground. Only one survives.
                </p>

        <div className="game-modes">
          <Link className="game-mode-card" to="/vs-computer">
            <h3 className="game-mode-title">
              <span>SINGLE</span>
              <span>PLAYER</span>
            </h3>
            <p className="game-mode-description">
              Challenge the AI
            </p>
          </Link>

          <Link className="game-mode-card" to="/online">
            <h3 className="game-mode-title">
              <span>ONLINE</span>
              <span>MULTIPLAYER</span>
            </h3>
            <p className="game-mode-description">
              Battle online
            </p>
          </Link>

          <Link className="game-mode-card" to="/vs-local">
            <h3 className="game-mode-title">
              <span>LOCAL</span>
              <span>MULTIPLAYER</span>
            </h3>
            <p className="game-mode-description">
              Play with a friend
            </p>
          </Link>
        </div>
        <div className="vstack" style={{ marginTop: '2rem', gap: '1rem' }}>
          <button className="btn ghost" onClick={() => setShowInstructions(true)}>View Instructions</button>
        </div>

        {showInstructions && (
          <div className="modal-overlay" onClick={() => setShowInstructions(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">How to Play Rock Paper Scissors — Minus One</h2>
                <button className="modal-close" onClick={() => setShowInstructions(false)}>×</button>
              </div>
              <div className="modal-body">
                <p className="modal-text">
                  RPS–1 is an exciting variation inspired by the Korean Netflix series <em>Squid Game</em>.
                  Unlike traditional Rock Paper Scissors, each player secretly selects <strong>two</strong> hands 
                  (e.g., Rock &amp; Paper). After both players reveal their choices, each must strategically 
                  <strong>remove one</strong> of their picks, leaving a single final hand for the showdown.
                </p>
                <ol className="modal-steps">
                  <li><strong>Choose Two:</strong> Both players pick two hands in secret</li>
                  <li><strong>Reveal:</strong> Show both picks simultaneously</li>
                  <li><strong>Minus One:</strong> Each player removes one hand strategically</li>
                  <li><strong>Battle:</strong> The remaining hands compete using standard RPS rules</li>
                </ol>
                <p className="modal-text">
                  The key to victory lies in predicting your opponent's strategy and choosing which hand to remove!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Home;