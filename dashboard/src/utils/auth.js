export function isAuthenticated() {
  return !!localStorage.getItem("access");
}

export function logout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}
