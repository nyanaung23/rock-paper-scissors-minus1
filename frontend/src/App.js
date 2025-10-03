import React from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import VsComputer from "./pages/VsComputer";
import VsLocal from "./pages/VsLocal";
import OnlineLobby from "./pages/OnlineLobby";
import OnlineGame from "./pages/OnlineGame";

function Shell() {
  const { pathname } = useLocation();
  const active = (p) => (typeof p==="function" ? p() : pathname===p) ? {background:"#222643",borderRadius:10,padding:"6px 10px"} : {padding:"6px 10px"};

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", background:"#0f1220", color:"#e8ebff", fontFamily:"system-ui" }}>
      <header style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 20px", background:"#171a2b" }}>
        <Link to="/" style={{ color:"inherit", textDecoration:"none", fontWeight:800 }}>Rock Paper Scissors Minus 1</Link>
        <nav style={{ display:"flex", gap:12 }}>
          <Link to="/vs-computer" style={{ color:"inherit", textDecoration:"none", ...active("/vs-computer") }}>vs Computer</Link>
          <Link to="/vs-local" style={{ color:"inherit", textDecoration:"none", ...active("/vs-local") }}>vs Local</Link>
          <Link to="/online" style={{ color:"inherit", textDecoration:"none", ...active(() => pathname.startsWith("/online")) }}>Online</Link>
        </nav>
      </header>

      <main style={{ flex:1, padding:20 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vs-computer" element={<VsComputer />} />
          <Route path="/vs-local" element={<VsLocal />} />
          <Route path="/online" element={<OnlineLobby />} />
          <Route path="/online/:roomId" element={<OnlineGame />} />
        </Routes>
      </main>

      <footer style={{ padding:14, background:"#171a2b", color:"#9aa3c7" }}>
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