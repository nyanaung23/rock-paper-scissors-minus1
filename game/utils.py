import random
import string

ALPHANUM = string.ascii_uppercase + string.digits

def generate_code(length: int = 6) -> str:
    return "".join(random.choices(ALPHANUM, k=length))

def initial_state() -> dict:
    return {
        "phase": "pick",
        "target": 3,
        "p1Hands": [None, None],
        "p2Hands": [None, None],
        "p1Removed": None,
        "p2Removed": None,
        "score": {"p1": 0, "p2": 0},
        "matchWinner": None,
        "lastOutcome": None,
        "roles": {},
        "ready": {"show": {"p1": False, "p2": False}},
    }