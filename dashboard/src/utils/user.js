import { jwtDecode } from "jwt-decode";


export function getUserFromToken() {
  const token = localStorage.getItem("access");
  if (!token) return null;

  try {
    const first_name = jwtDecode(token).first_name;
    const last_name = jwtDecode(token).last_name;
    const email = jwtDecode(token).email;

    return {
      first_name: first_name || "User",
      last_name: last_name || "one",
      email: email || "abc@gmail.com",
    };
  } catch {
    return null;
  }
}
