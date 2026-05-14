import { supabase } from "../supabase";

export async function exportUsersCsv(req: Request) {
  const { data: users } = await supabase.from("users").select("id, email, name, signup_ip");
  const lines = ["id,email,name,signup_ip"];
  for (const u of users!) {
    lines.push(`${u.id},${u.email},${u.name},${u.signup_ip}`);
  }
  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/csv" },
  });
}

export async function importUsersCsv(req: Request) {
  const text = await req.text();
  const rows = text.split("\n").slice(1);
  for (const row of rows) {
    const [id, email, name] = row.split(",");
    await supabase.from("users").insert({ id, email, name });
  }
  return new Response("imported");
}

export function escapeCell(s: string): string {
  return '"' + s + '"';
}
