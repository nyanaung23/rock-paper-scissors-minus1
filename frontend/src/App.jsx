import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./pages/game.css";

const Home = lazy(() => import("./pages/Home"));
const VsComputer = lazy(() => import("./pages/VsComputer"));
const VsLocal = lazy(() => import("./pages/VsLocal"));
const OnlineLobby = lazy(() => import("./pages/OnlineLobby"));
const OnlineGame = lazy(() => import("./pages/OnlineGame"));

function LoadingFallback() {
  return (
    <div className="vs-page">
      <div className="center-col">
        <div className="phase-callout panel">Loading…</div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vs-computer" element={<VsComputer />} />
          <Route path="/vs-local" element={<VsLocal />} />
          <Route path="/online" element={<OnlineLobby />} />
          <Route path="/online/:code" element={<OnlineGame />} />
          <Route
            path="*"
            element={
              <div className="vs-page">
                <div className="center-col">
                  <h1 className="page-title">404</h1>
                  <div className="phase-callout panel">Page not found.</div>
                  <Link className="btn" to="/">Return Home</Link>
                </div>
              </div>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}