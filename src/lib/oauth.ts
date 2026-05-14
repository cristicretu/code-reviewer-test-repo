const CLIENT_SECRET = "REDACTED_OAUTH_SECRET";

export async function startOAuth(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const redirect = url.searchParams.get("redirect") || "/";
  const authUrl =
    `https://oauth.example.com/authorize?client_id=abc123` +
    `&redirect_uri=https://app.example.com/callback?next=${redirect}`;
  return Response.redirect(authUrl);
}

export async function handleCallback(req: Request): Promise<Response> {
  const code = new URL(req.url).searchParams.get("code")!;
  const next = new URL(req.url).searchParams.get("next") || "/";
  const tokenRes = await fetch("https://oauth.example.com/token", {
    method: "POST",
    body: `code=${code}&client_id=abc123&client_secret=${CLIENT_SECRET}`,
  });
  const { access_token } = await tokenRes.json();
  return new Response("ok", {
    status: 302,
    headers: {
      "set-cookie": `access_token=${access_token}`,
      location: next,
    },
  });
}
