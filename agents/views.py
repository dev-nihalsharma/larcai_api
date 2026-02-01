from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from api_keys.authentication import APIKeyAuthentication

from larc_dev_api.utils import resp_success, resp_fail
from agents.ai_agent.ai_agent import langgraph_pipeline

from subscriptions.utils import (
    has_sufficient_balance,
    deduct_credits,
    get_model_cost,
)


class ChatBotViewSet(viewsets.ViewSet):
    # =====================================================
    # AUTH: Allow BOTH Dashboard Auth (JWT/Session)
    #       AND API Key Auth (Programmatic Access)
    # =====================================================
    authentication_classes = [
        APIKeyAuthentication,]
    permission_classes = [IsAuthenticated]

    def create(self, request):
        user = request.user

        # =====================================================
        # 1. PRE-CHECK: Minimum credits to start conversation
        # =====================================================
        if not has_sufficient_balance(request.user, minimum_required=1.0):
                return resp_fail("Insufficient credits.", error_code=402)

        # =====================================================
        # 2. MODE SELECTION (Auto vs Manual)
        # =====================================================
        auto_mode = request.query_params.get("auto", "false").lower() == "true"
        client_thread_id = request.data.get("thread_id")
        requested_model = request.data.get("model")

        final_model = None if auto_mode else requested_model

        # =====================================================
        # 3. PRE-CHECK: Explicit model cost (manual mode)
        # =====================================================
        if final_model:
            estimated_cost = get_model_cost(final_model)
            if not has_sufficient_balance(user, minimum_required=estimated_cost):
                return resp_fail(
                    error_msg=(
                        f"Insufficient credits for {final_model}. "
                        f"Required: {estimated_cost}"
                    ),
                    error_code=402
                )

        # =====================================================
        # 4. EXECUTE AI PIPELINE
        # =====================================================
        data = {
            "prompt": request.data.get("prompt", ""),
            "model": final_model,
        }

        output = langgraph_pipeline(data, thread_id=client_thread_id)

        result_state = output.get("result", {})
        new_thread_id = output.get("thread_id")

        messages = result_state.get("messages", [])
        ai_response_content = messages[-1]["content"] if messages else ""

        # =====================================================
        # 5. BILLING DECISION
        # =====================================================
        used_model_id = result_state.get("model")
        model_used = used_model_id if used_model_id else "gpt-4.1-mini"

        failure_signatures = [
            "Error calling",
            "API key expired",
            "authentication failed",
            "model unavailable",
        ]

        is_unsuccessful_response = any(
            signature in str(ai_response_content)
            for signature in failure_signatures
        )

        if is_unsuccessful_response:
            actual_cost = 0.0
            billing_status = "FAILED_NOT_CHARGED"
        else:
            actual_cost = deduct_credits(user, model_used)
            billing_status = "CHARGED"

        # =====================================================
        # 6. RESPONSE
        # =====================================================
        return resp_success(
            "success",
            data={
                "response": ai_response_content,
                "thread_id": new_thread_id,
                "full_state": result_state,
                "billing": {
                    "status": billing_status,
                    "model_used": model_used,
                    "cost_deducted": actual_cost,
                    "credits_remaining": user.usage_profile.credits_balance,
                },
            },
            code=200
        )
