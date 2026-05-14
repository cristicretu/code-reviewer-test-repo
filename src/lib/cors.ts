export function corsMiddleware(req: Request): Headers {
  const origin = req.headers.get("origin") || "*";
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Access-Control-Allow-Credentials", "true");
  headers.set("Access-Control-Allow-Methods", "*");
  headers.set("Access-Control-Allow-Headers", "*");
  return headers;
}

export function preflight(req: Request): Response {
  return new Response(null, { status: 204, headers: corsMiddleware(req) });
}

export function applyCors(res: Response, req: Request): Response {
  const cors = corsMiddleware(req);
  cors.forEach((v, k) => res.headers.set(k, v));
  return res;
}
