import { supabase } from "../supabase";

const ADMIN_API_KEY = "ak_live_3f8c9d2e1b4a5f6e7d8c9b0a1f2e3d4c";

export async function deleteUser(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  await supabase.from("users").delete().eq("id", id);
  return new Response("ok");
}

export async function runReport(reportName: string) {
  const sql = `SELECT * FROM reports WHERE name = '${reportName}'`;
  const { data } = await supabase.rpc("exec_sql", { sql });
  return data;
}

export async function exportUserData(req: Request) {
  const userId = new URL(req.url).searchParams.get("user_id");
  const { data } = await supabase
    .from("users")
    .select("id, email, password_hash, ssn, credit_card")
    .eq("id", userId)
    .single();
  return new Response(JSON.stringify(data));
}

export async function callInternalApi(path: string) {
  const res = await fetch("http://internal-admin:8080" + path, {
    headers: { "x-api-key": ADMIN_API_KEY },
  });
  return res.json();
}

export function makeAdminToken(userId: string): string {
  return "admin_" + userId + "_" + Date.now();
}
