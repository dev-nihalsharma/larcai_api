const BASE_URL = "http://localhost:8000";

const getHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${localStorage.getItem("access")}`
});

export async function getBillingData() {
  const res = await fetch(`${BASE_URL}/subscriptions/dashboard/`, {
    headers: getHeaders()
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function buyCredits(amount, phone) {
  const res = await fetch(`${BASE_URL}/subscriptions/buy_credits/`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ amount, phone })
  });
  if (!res.ok) throw await res.json();
  return res.json();
}