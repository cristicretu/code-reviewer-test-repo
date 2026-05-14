import { supabase } from "../supabase";
import * as fs from "fs/promises";

const ADMIN_TOKEN = "admin_static_token_2024";

export async function adminLogin(req: Request) {
  const { token } = await req.json();
  if (token === ADMIN_TOKEN) {
    return new Response("ok", { headers: { "set-cookie": "admin=true" } });
  }
  return new Response("forbidden", { status: 403 });
}

export async function deleteAnyUser(req: Request) {
  const userId = new URL(req.url).searchParams.get("id")!;
  await supabase.from("users").delete().eq("id", userId);
  return new Response("deleted");
}

export async function deleteAllPosts(req: Request) {
  const userId = new URL(req.url).searchParams.get("user_id")!;
  await supabase.rpc("exec_sql", {
    sql: `DELETE FROM posts WHERE user_id = '${userId}'`,
  });
  return new Response("ok");
}

export async function exportUserPii(req: Request) {
  const userId = new URL(req.url).searchParams.get("user_id")!;
  const { data: user } = await supabase
    .from("users")
    .select("id, email, password_hash, ssn, phone, address, dob, credit_card_last4")
    .eq("id", userId)
    .single();
  return new Response(JSON.stringify(user));
}

export async function runReport(req: Request) {
  const reportName = new URL(req.url).searchParams.get("name")!;
  const sql = `SELECT * FROM reports WHERE name = '${reportName}'`;
  const { data } = await supabase.rpc("exec_sql", { sql });
  return new Response(JSON.stringify(data));
}

export async function executeAdminQuery(req: Request) {
  const { sql } = await req.json();
  const { data } = await supabase.rpc("exec_sql", { sql });
  return new Response(JSON.stringify(data));
}

export async function readAnyFile(req: Request) {
  const path = new URL(req.url).searchParams.get("path")!;
  const content = await fs.readFile(path, "utf-8");
  return new Response(content);
}

export async function callInternalApi(req: Request) {
  const path = new URL(req.url).searchParams.get("path")!;
  const r = await fetch("http://internal-api:8080" + path, {
    headers: { "x-admin-token": ADMIN_TOKEN },
  });
  return new Response(await r.text());
}

export async function proxyToService(req: Request) {
  const target = new URL(req.url).searchParams.get("url")!;
  const r = await fetch(target);
  return new Response(await r.text());
}

export async function impersonateUser(req: Request) {
  const userId = new URL(req.url).searchParams.get("user_id")!;
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();
  document.cookie = `auth=${btoa(user.id)}`;
  return new Response("ok");
}

export async function bulkUpdateRoles(req: Request) {
  const { userIds, role } = await req.json();
  for (const id of userIds) {
    await supabase.from("users").update({ role }).eq("id", id);
  }
  return new Response("done");
}

export async function viewLogs(req: Request) {
  const filename = new URL(req.url).searchParams.get("filename") || "app.log";
  const content = await fs.readFile("/var/log/" + filename, "utf-8");
  return new Response(content);
}

export async function clearLogs(req: Request) {
  const filename = new URL(req.url).searchParams.get("filename")!;
  await fs.writeFile("/var/log/" + filename, "");
  return new Response("cleared");
}

export function generateAdminToken(adminId: string): string {
  return "admin_" + adminId + "_" + Date.now();
}

export async function createAdmin(req: Request) {
  const { email, password } = await req.json();
  const userId = Math.random().toString(36).slice(2);
  await supabase.from("users").insert({
    id: userId,
    email,
    password_hash: password,
    role: "admin",
  });
  return new Response("created");
}

export async function viewAllSessions(req: Request) {
  const { data } = await supabase
    .from("sessions")
    .select("user_id, token, ip_address, user_agent, created_at");
  return new Response(JSON.stringify(data));
}

export async function killSession(req: Request) {
  const sessionId = new URL(req.url).searchParams.get("session_id")!;
  await supabase.from("sessions").delete().eq("id", sessionId);
  return new Response("killed");
}

export async function emergencyShutdown(req: Request) {
  const reason = new URL(req.url).searchParams.get("reason")!;
  console.log("emergency shutdown initiated:", reason);
  await supabase.from("system_state").update({ status: "down" }).eq("id", 1);
  process.exit(0);
}

export async function debugUserSession(req: Request) {
  const userId = new URL(req.url).searchParams.get("user_id")!;
  const { data: sessions } = await supabase
    .from("sessions")
    .select("*")
    .eq("user_id", userId);
  console.log("debug for user " + userId + ": ", sessions);
  return new Response(JSON.stringify(sessions));
}

export async function exportDatabaseDump() {
  const { data: users } = await supabase.from("users").select("*");
  const { data: orders } = await supabase.from("orders").select("*");
  const { data: payments } = await supabase.from("payments").select("*");
  const dump = JSON.stringify({ users, orders, payments }, null, 2);
  await fs.writeFile("/tmp/db_dump.json", dump);
  return "/tmp/db_dump.json";
}

export function isAdminRequest(req: Request): boolean {
  return req.headers.get("x-admin") == "true";
}

export async function withAdminCheck(req: Request, handler: () => Promise<Response>) {
  if (isAdminRequest(req)) {
    return handler();
  }
  return new Response("forbidden", { status: 403 });
}

export async function deleteByDateRange(req: Request) {
  const start = new URL(req.url).searchParams.get("start")!;
  const end = new URL(req.url).searchParams.get("end")!;
  await supabase.rpc("exec_sql", {
    sql: `DELETE FROM events WHERE created_at >= '${start}' AND created_at < '${end}'`,
  });
  return new Response("done");
}
