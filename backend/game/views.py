from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from .models import Room
from .utils import generate_code, initial_state

@csrf_exempt
@require_POST
def create_room(request):
    """
    POST /api/create-room/
    Returns: {"code":"ABC123"}
    """
    for _ in range(12):
        code = generate_code(6).upper()
        if Room.objects.filter(code=code).exists():
            continue
        room = Room.objects.create(code=code, state=initial_state())
        return JsonResponse({"code": code})
    return JsonResponse({"error": "Could not allocate room"}, status=500)

def room_exists(request, code: str):
    """
    GET /api/room-exists/<code>/
    Returns: {"exists": true|false}
    """
    c = (code or "").upper()
    exists = Room.objects.filter(code=c).exists()
    return JsonResponse({"exists": exists})

