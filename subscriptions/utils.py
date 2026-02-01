from decimal import Decimal  # <--- IMPORT THIS
from .models import UserUsage
import json
import os
from django.conf import settings

# Load your model costs once
BASE_DIR = settings.BASE_DIR
MODELS_FILE = os.path.join(BASE_DIR, 'agents', 'ai_agent', 'models.json')

def get_model_cost(model_id):
    """Reads cost from models.json. Default to 1.0 if not found."""
    try:
        with open(MODELS_FILE, 'r') as f:
            models = json.load(f)
        for m in models:
            if m["id"] == model_id:
                return m.get("cost", 1.0)
    except Exception:
        pass
    return 1.0 # Safe default

def has_sufficient_balance(user, minimum_required=1.0):
    profile, _ = UserUsage.objects.get_or_create(user=user)
    # Compare Decimal vs Decimal
    if profile.credits_balance < Decimal(str(minimum_required)):
        return False
    return True
    """
    Check if user can afford to start the request.
    """
    profile, _ = UserUsage.objects.get_or_create(user=user)
    if profile.credits_balance < minimum_required:
        return False
    return True

def deduct_credits(user, model_id):
    """
    Deducts the EXACT cost of the model used.
    """
    cost_float = get_model_cost(model_id) # This returns a float (e.g. 0.5)
    cost = Decimal(str(cost_float))       # <--- CONVERT TO DECIMAL
    
    profile = UserUsage.objects.get(user=user)
    
    # Ensure we don't go negative
    if profile.credits_balance >= cost:
        profile.credits_balance -= cost   # Now it is Decimal - Decimal (Safe)
        profile.save()
        return float(cost) # Return float for JSON serialization
    else:
        profile.credits_balance = Decimal("0.00")
        profile.save()
        return 0.0
    
