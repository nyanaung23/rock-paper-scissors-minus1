from __future__ import annotations
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Room
from .utils import initial_state

TARGET = 3

def winner_of_round(p1: str | None, p2: str | None) -> str:
    if p1 is None or p2 is None:
        return "draw"
    if p1 == p2:
        return "draw"
    beats = {"rock": "scissors", "scissors": "paper", "paper": "rock"}
    return "p1" if beats.get(p1) == p2 else "p2"

def _both_chosen(h):
    return bool(h and h[0] and h[1])

@database_sync_to_async
def get_room(code: str) -> Room | None:
    return Room.objects.filter(code=code.upper()).first()

@database_sync_to_async
def load_state(code: str) -> dict:
    room = Room.objects.filter(code=code.upper()).first()
    return dict(room.state or initial_state()) if room else initial_state()

@database_sync_to_async
def save_state(code: str, state: dict) -> None:
    Room.objects.filter(code=code.upper()).update(state=state)

class RPSConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.code = self.scope["url_route"]["kwargs"]["room_code"].upper()
        self.group_name = f"room_{self.code}"

        room = await get_room(self.code)
        if not room:
            await self.close()
            return

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        state = await load_state(self.code)
        state.setdefault("phase", "pick")
        state.setdefault("target", TARGET)
        state.setdefault("p1Hands", [None, None])
        state.setdefault("p2Hands", [None, None])
        state.setdefault("p1Removed", None)
        state.setdefault("p2Removed", None)
        state.setdefault("score", {"p1": 0, "p2": 0})
        state.setdefault("matchWinner", None)
        state.setdefault("lastOutcome", None)
        state.setdefault("roles", {})
        state.setdefault("ready", {
            "show": {"p1": False, "p2": False},
            "minus": {"p1": False, "p2": False},
        })

        roles = state["roles"]
        current = set(roles.values())
        if "p1" not in current:
            assigned = "p1"
            roles[self.channel_name] = "p1"
        elif "p2" not in current:
            assigned = "p2"
            roles[self.channel_name] = "p2"
        else:
            assigned = "spectator"

        state["roles"] = roles
        await save_state(self.code, state)

        await self.send_json({"type": "joined", "role": assigned, "state": state})
        await self.channel_layer.group_send(self.group_name, {"type": "state.broadcast", "state": state})

    async def disconnect(self, _code):
        if not await get_room(self.code):
            return
        state = await load_state(self.code)
        roles = state.get("roles", {})
        if self.channel_name in roles:
            del roles[self.channel_name]
            state["roles"] = roles
            await save_state(self.code, state)
            await self.channel_layer.group_send(self.group_name, {"type": "state.broadcast", "state": state})
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive_json(self, content, **kwargs):
        if not await get_room(self.code):
            return

        msg = content.get("type")
        state = await load_state(self.code)

        state.setdefault("phase", "pick")
        state.setdefault("target", TARGET)
        state.setdefault("p1Hands", [None, None])
        state.setdefault("p2Hands", [None, None])
        state.setdefault("p1Removed", None)
        state.setdefault("p2Removed", None)
        state.setdefault("score", {"p1": 0, "p2": 0})
        state.setdefault("matchWinner", None)
        state.setdefault("lastOutcome", None)
        roles = state.setdefault("roles", {})
        ready = state.setdefault("ready", {
            "show": {"p1": False, "p2": False},
            "minus": {"p1": False, "p2": False},
        })

        sender_role = roles.get(self.channel_name, "spectator")
        both_players = {"p1", "p2"}.issubset(set(roles.values()))

        if msg == "pick.set" and sender_role in ("p1", "p2"):
            state[f"{sender_role}Hands"] = content.get("hands", [None, None])
            # changing hands un-readies "show" for that sender
            ready["show"][sender_role] = False

        elif msg == "phase.show" and sender_role in ("p1", "p2"):
            if _both_chosen(state[f"{sender_role}Hands"]):
                ready["show"][sender_role] = True
            if (both_players and
                ready["show"]["p1"] and ready["show"]["p2"] and
                _both_chosen(state["p1Hands"]) and _both_chosen(state["p2Hands"])):
                state["phase"] = "show"
                ready["show"] = {"p1": False, "p2": False}
            else:
                state["phase"] = "pick"

        elif msg == "phase.minus":
            # Enter minus phase; clear any previous minus readiness
            state["phase"] = "minus"
            ready["minus"] = {"p1": False, "p2": False}
            # keep p1Removed/p2Removed as-is or reset as you prefer; here we keep them

        # --------- FIXED: allow simultaneous minus choices ----------
        elif msg == "minus.choice" and sender_role in ("p1", "p2"):
            if state.get("phase") == "minus":
                idx = content.get("index")
                if idx in (0, 1):
                    # If the player already pressed Reveal, ignore further changes
                    if not ready["minus"].get(sender_role, False):
                        state[f"{sender_role}Removed"] = idx
                        # Do NOT auto-ready here; the explicit "phase.reveal" drives readiness.
            # else: ignore if not in minus phase

        # --------- FIXED: each player can press Reveal independently ----------
        elif msg == "phase.reveal" and sender_role in ("p1", "p2"):
            if state.get("phase") == "minus":
                # Only set ready if this player has actually removed one
                if state.get(f"{sender_role}Removed") is not None:
                    ready["minus"][sender_role] = True

                # If both have revealed, compute outcome and move on
                if ready["minus"]["p1"] and ready["minus"]["p2"]:
                    p1_final = state["p1Hands"][1 - state["p1Removed"]]
                    p2_final = state["p2Hands"][1 - state["p2Removed"]]
                    w = winner_of_round(p1_final, p2_final)
                    if w == "p1":
                        state["score"]["p1"] += 1
                    elif w == "p2":
                        state["score"]["p2"] += 1
                    state["lastOutcome"] = w
                    state["phase"] = "reveal"
                    ready["minus"] = {"p1": False, "p2": False}
                    if state["score"]["p1"] >= TARGET:
                        state["matchWinner"] = "p1"
                    elif state["score"]["p2"] >= TARGET:
                        state["matchWinner"] = "p2"
                else:
                    # Stay in minus while waiting for the other player
                    state["phase"] = "minus"
            # else: ignore if not in minus phase

        elif msg == "round.next":
            state.update({
                "phase": "pick",
                "p1Hands": [None, None],
                "p2Hands": [None, None],
                "p1Removed": None,
                "p2Removed": None,
                "lastOutcome": None,
            })
            ready["show"] = {"p1": False, "p2": False}
            ready["minus"] = {"p1": False, "p2": False}

        elif msg == "match.reset":
            keep_roles = state.get("roles", {})
            state = initial_state()
            state["roles"] = keep_roles

        state["ready"] = ready
        await save_state(self.code, state)
        await self.channel_layer.group_send(self.group_name, {"type": "state.broadcast", "state": state})

    async def state_broadcast(self, event):
        await self.send_json({"type": "state", "state": event["state"]})