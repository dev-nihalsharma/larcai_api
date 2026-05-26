def build_response(success: bool, message: str = "", data=None, errors=None):
    """
    Standard API response format for the entire project.

    success: bool  -> Whether the operation succeeded
    message: str   -> Human-readable message
    data: dict     -> Success payload (optional)
    errors: dict   -> Validation or failure errors (optional)
    """
    response = {
        "success": success,
        "message": message,
        "data": data if data is not None else {},
        "errors": errors if errors is not None else {},
    }
    return response
