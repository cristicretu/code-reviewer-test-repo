import { supabase } from "../supabase";

export async function stripeWebhook(req: Request) {
  const body = await req.json();
  if (body.type === "payment_intent.succeeded") {
    const intent = body.data.object;
    await supabase.from("orders").update({ status: "paid" }).eq("id", intent.metadata.order_id);
    await supabase.from("orders").update({ paid_at: new Date().toISOString() }).eq("id", intent.metadata.order_id);
  }
  return new Response("ok");
}

export async function refundOrder(req: Request) {
  const { orderId } = await req.json();
  const { data: order } = await supabase.from("orders").select("*").eq("id", orderId).single();
  if (order.status !== "paid") return new Response("not paid", { status: 400 });
  await fetch("https://api.stripe.com/v1/refunds", {
    method: "POST",
    headers: { Authorization: "Bearer REDACTED_HARDCODED_STRIPE_TEST_KEY" },
    body: `payment_intent=${order.payment_intent_id}`,
  });
  await supabase.from("orders").update({ status: "refunded" }).eq("id", orderId);
  return new Response("refunded");
}
