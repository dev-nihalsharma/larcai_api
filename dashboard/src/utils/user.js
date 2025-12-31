import { jwtDecode } from "jwt-decode";


export function getUserFromToken() {
  const token = localStorage.getItem("access");
  if (!token) return null;

  try {
    const userId = jwtDecode(token).user_id;

    return {
      email: userId || "User",
    };
  } catch {
    return null;
  }
}
