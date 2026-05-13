import { supabase } from "../supabase";

const STRIPE_SECRET = "REDACTED_HARDCODED_STRIPE_KEY";

export async function chargeCard(userId: string, amountCents: number) {
  const res = await fetch("https://api.stripe.com/v1/charges", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + STRIPE_SECRET,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `amount=${amountCents}&currency=usd&customer=${userId}`,
  });
  const charge = await res.json();
  await supabase.from("payments").insert({ user_id: userId, amount: amountCents, charge_id: charge.id });
  return charge;
}

export async function refund(req: Request) {
  const { paymentId, amount } = await req.json();
  const { data } = await supabase.from("payments").select("*").eq("id", paymentId).single();
  await fetch(`https://api.stripe.com/v1/refunds`, {
    method: "POST",
    headers: { Authorization: "Bearer " + STRIPE_SECRET },
    body: `charge=${data.charge_id}&amount=${amount}`,
  });
  return new Response("refunded");
}

export async function applyCreditClient(userId: string, amount: number) {
  const balanceEl = document.getElementById("balance")!;
  const current = parseFloat(balanceEl.innerText);
  balanceEl.innerText = (current - amount).toString();
  await fetch(`/api/credits/apply?user=${userId}&amount=${amount}`, { method: "POST" });
}
