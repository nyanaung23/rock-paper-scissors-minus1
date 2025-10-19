import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = process.env.REACT_APP_API_URL || "http://localhost:8000";

export default function OnlineLobby() {
  const nav = useNavigate();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleCreate() {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch(`${API}/api/create-room/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const text = await res.text();
        alert(`Create failed: ${res.status} ${res.statusText}\n${text}`);
        return;
      }
      const data = await res.json();
      console.log("create-room ->", data);
      if (typeof data.code === "string" && data.code.length === 6) {
        nav(`/online/${data.code.toUpperCase()}`);
      } else {
        alert(
          `Server did not return a valid code.\nResponse:\n${JSON.stringify(
            data,
            null,
            2
          )}`
        );
      }
    } catch (e) {
      alert(`Could not reach server. Is backend running?\n${e?.message || e}`);
    } finally {
      setBusy(false);
    }
  }

  async function handleJoin(e) {
    e.preventDefault();
    const c = code.trim().toUpperCase();
    if (!c || c.length !== 6) return alert("Enter a 6-character code.");
    try {
      const res = await fetch(`${API}/api/room-exists/${c}/`);
      if (!res.ok) {
        const text = await res.text();
        alert(`Join check failed: ${res.status} ${res.statusText}\n${text}`);
        return;
      }
      const data = await res.json();
      if (data.exists) nav(`/online/${c}`);
      else alert("Room not found.");
    } catch (e) {
      alert(`Could not reach server. Is backend running?\n${e?.message || e}`);
    }
  }

  return (
    <div className="vs-page online-lobby-page">
      <div className="center-col">
        <h1 className="page-title" style={{ marginBottom: 24 }}>PLAY ONLINE</h1>
        <div className="phase-callout panel" style={{ marginBottom: 15 }}>
          Create a room or join a friend by entering room code.
        </div>

        <div className="vstack" style={{ gap: 20 }}>
          <button
            className="btn primary"
            onClick={handleCreate}
            disabled={busy}
            style={{ padding: "15px 24px", fontSize: "1rem", margin: "20px" }}
          >
            {busy ? "Creating…" : "Create Room"}
          </button>

          <form
            onSubmit={handleJoin}
            className="hstack"
            style={{
              gap: 12,
              justifyContent: "center",
              marginTop: 12,
            }}
          >
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="ENTER CODE (E.G., 3H7QZ9)"
              className="input"
              maxLength={6}
              style={{
                textTransform: "uppercase",
                width: 220,
              }}
            />
            <button className="btn" type="submit">
              Join
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
