import React from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import VsComputer from "./pages/VsComputer";
import VsLocal from "./pages/VsLocal";
import OnlineLobby from "./pages/OnlineLobby";
import OnlineGame from "./pages/OnlineGame";
import "./navbar.css";

function Shell() {
  const { pathname } = useLocation();
  const isActive = (path) => {
    if (typeof path === "function") {
      return path();
    }
    return pathname === path;
  };

  return (
    <div style={{ minHeight:"100vh", overflow:"auto", display:"flex", flexDirection:"column", background:"var(--gradient-bg)", color:"var(--text-primary)", fontFamily:"'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      <header className="navbar">
        <Link to="/" className="navbar-brand">RPS-1</Link>
        <nav className="navbar-nav">
          <Link 
            to="/vs-computer" 
            className={`navbar-link ${isActive("/vs-computer") ? "active" : ""}`}
          >
            SINGLE
          </Link>
          <Link 
            to="/online" 
            className={`navbar-link ${isActive(() => pathname.startsWith("/online")) ? "active" : ""}`}
          >
            ONLINE
          </Link>
          <Link 
            to="/vs-local" 
            className={`navbar-link ${isActive("/vs-local") ? "active" : ""}`}
          >
            LOCAL
          </Link>
        </nav>
      </header>

      <main className="page-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vs-computer" element={<VsComputer />} />
          <Route path="/vs-local" element={<VsLocal />} />
          <Route path="/online" element={<OnlineLobby />} />
          <Route path="/online/:roomId" element={<OnlineGame />} />
        </Routes>
      </main>

      <footer style={{ padding:14, background:"rgba(15, 18, 32, 0.95)", color:"var(--text-muted)", borderTop:"1px solid rgba(0, 58, 86, 0.3)" }}>
        By Nyan
      </footer>
    </div>
  );
}

export default function App(){
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}