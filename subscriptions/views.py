import uuid
import requests

from django.conf import settings
from django.http import JsonResponse

from rest_framework import serializers
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import UserUsage, Transaction


# =========================
# Cashfree Config
# =========================
CASHFREE_PG_URL = "https://sandbox.cashfree.com/pg/orders"
CREDITS_PER_RUPEE = 1


# =========================
# Serializer
# =========================
class BuyCreditSerializer(serializers.Serializer):
    amount = serializers.FloatField(min_value=10)   # Min ₹10
    phone = serializers.CharField(min_length=10, max_length=15)


# =========================
# Create Order (Auth Required)
# =========================
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def buy_credits(request):
    user = request.user

    # 1. Validate input
    serializer = BuyCreditSerializer(data=request.data)
    if not serializer.is_valid():
        return JsonResponse(
            {"error": "Invalid input", "details": serializer.errors},
            status=400
        )

    amount = serializer.validated_data["amount"]
    phone = serializer.validated_data["phone"]

    # 2. Generate order id
    order_id = f"CREDIT_{user.id}_{uuid.uuid4().hex[:6]}"

    # 3. Cashfree payload
    payload = {
        "order_id": order_id,
        "order_amount": amount,
        "order_currency": "INR",
        "customer_details": {
            "customer_id": str(user.id),
            "customer_email": user.email,
            "customer_phone": phone,
        },
        "order_meta": {
            "return_url": f"http://localhost:8000/subscriptions/success?order_id={order_id}"
        }
    }

    headers = {
        "x-client-id": settings.CASHFREE_APP_ID,
        "x-client-secret": settings.CASHFREE_SECRET_KEY,
        "x-api-version": "2022-09-01",
        "Content-Type": "application/json",
    }

    # 4. Create Cashfree order
    try:
        response = requests.post(
            CASHFREE_PG_URL,
            json=payload,
            headers=headers,
            timeout=10
        )

        data = response.json()

        if response.status_code == 200:
            return JsonResponse({
                "order_id": order_id,
                "payment_session_id": data.get("payment_session_id"),
                "credits_expected": int(amount * CREDITS_PER_RUPEE),
                "message": "Use payment_session_id in frontend Cashfree SDK"
            })

        return JsonResponse(
            {"error": data.get("message", "Cashfree order failed")},
            status=400
        )

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# =========================
# Success Callback
# =========================
@api_view(['GET'])
@permission_classes([AllowAny])
@authentication_classes([])
def credit_success_callback(request):
    order_id = request.GET.get("order_id")

    if not order_id:
        return JsonResponse({"error": "order_id missing"}, status=400)

    try:
        # =====================================
        # DEV MODE
        # =====================================
        if settings.CASHFREE_DEV_FORCE_PAID:
            paid_amount = settings.CASHFREE_DEV_PAID_AMOUNT
            order_status = "PAID"
        else:
            headers = {
                "x-client-id": settings.CASHFREE_APP_ID,
                "x-client-secret": settings.CASHFREE_SECRET_KEY,
                "x-api-version": "2022-09-01",
                "Content-Type": "application/json",
            }

            resp = requests.get(
                f"{CASHFREE_PG_URL}/{order_id}",
                headers=headers,
                timeout=10
            )

            data = resp.json()
            order_status = data.get("order_status")
            paid_amount = float(data.get("order_amount", 0))

        # =====================================
        # VERIFY
        # =====================================
        if order_status != "PAID":
            return JsonResponse(
                {"error": "Payment not completed"},
                status=400
            )

        credits_to_add = int(paid_amount * CREDITS_PER_RUPEE)

        user_id = order_id.split("_")[1]
        profile, _ = UserUsage.objects.get_or_create(user_id=user_id)
        profile.credits_balance += credits_to_add
        profile.save()

        # =====================================
        # RECORD TRANSACTION (MERGED LOGIC)
        # =====================================
        Transaction.objects.create(
            user_id=user_id,
            order_id=order_id,
            amount=paid_amount,
            credits=credits_to_add,
            status="SUCCESS"
        )

        return JsonResponse({
            "status": "success",
            "env": "DEV" if settings.CASHFREE_DEV_FORCE_PAID else "PROD",
            "paid_amount": paid_amount,
            "credits_added": credits_to_add,
            "new_balance": profile.credits_balance,
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# =========================
# Billing Dashboard
# =========================
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_billing_dashboard(request):
    """Returns balance and recent transactions."""
    user = request.user

    # Get Balance
    usage, _ = UserUsage.objects.get_or_create(user=user)

    # Get History
    txns = Transaction.objects.filter(user=user).order_by('-created_at')[:10]
    history_data = [
        {
            "id": t.order_id,
            "date": t.created_at.strftime("%b %d, %Y"),
            "amount": float(t.amount),
            "credits": float(t.credits),
            "status": t.status
        }
        for t in txns
    ]

    return Response({
        "balance": float(usage.credits_balance),
        "history": history_data
    })
