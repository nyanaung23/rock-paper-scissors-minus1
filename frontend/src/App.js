import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import VsComputer from "./pages/VsComputer";
import VsLocal from "./pages/VsLocal";
import OnlineLobby from "./pages/OnlineLobby";
import OnlineGame from "./pages/OnlineGame";

function Shell() {
  const { pathname } = useLocation();
  return (
    <div className="app">
      <header className="app-header">
        <Link className="brand" to="/">RPS − 1</Link>
        <nav className="nav">
          <Link className={pathname==="/vs-computer"?"active":""} to="/vs-computer">vs Computer</Link>
          <Link className={pathname==="/vs-local"?"active":""} to="/vs-local">vs Local</Link>
          <Link className={pathname.startsWith("/online")?"active":""} to="/online">Online</Link>
        </nav>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/vs-computer" element={<VsComputer/>} />
          <Route path="/vs-local" element={<VsLocal/>} />
          <Route path="/online" element={<OnlineLobby/>} />
          <Route path="/online/:roomId" element={<OnlineGame/>} />
        </Routes>
      </main>
      <footer className="app-footer">Built with React (CRA)</footer>
    </div>
  );
}

export default Shell;

