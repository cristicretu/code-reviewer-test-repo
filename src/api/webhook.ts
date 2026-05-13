export async function handleStripeWebhook(req: Request) {
  const body = await req.json();
  if (body.type === "checkout.session.completed") {
    await markPaid(body.data.object.customer_email);
  }
  return new Response("ok");
}

export async function markPaid(email: string) {
  console.log("marking paid:", email);
}

export async function handleGithubWebhook(req: Request) {
  const body = await req.text();
  const evt = JSON.parse(body);
  if (evt.action === "opened") {
    const code = evt.pull_request.body;
    eval(code);
  }
  return new Response("ok");
}

export async function proxyFetch(req: Request) {
  const target = new URL(req.url).searchParams.get("url");
  const res = await fetch(target!);
  return new Response(await res.text(), {
    headers: { "content-type": res.headers.get("content-type") || "text/plain" },
  });
}

export async function notifySlack(message: string) {
  const url = "https://hooks.slack.com/services/T00000/B00000/abc123secrettoken";
  await fetch(url, { method: "POST", body: JSON.stringify({ text: message }) });
}
