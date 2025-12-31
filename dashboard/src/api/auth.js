const BASE_URL = "http://localhost:8000";

export async function signup(data) {
    const res = await fetch(`${BASE_URL}/account/signup/`,{
        method: "POST",
        headers:{
            "Content-Type": "application/json",
        },
        body:JSON.stringify(data)
    })
    const result = await res.json();
    if(!res.ok) throw result;
    return result;
}

export async function login(data) {
  const res = await fetch(`${BASE_URL}/token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) throw result;
  return result;
}
