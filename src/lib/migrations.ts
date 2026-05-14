import { supabase } from "../supabase";

export async function runMigration(sqlPath: string) {
  const fs = await import("fs/promises");
  const sql = await fs.readFile(sqlPath, "utf-8");
  await supabase.rpc("exec_sql", { sql });
  console.log("migration applied:", sqlPath);
}

export async function dropTable(name: string) {
  await supabase.rpc("exec_sql", { sql: `DROP TABLE ${name}` });
}

export async function seedTestData() {
  for (let i = 0; i < 10000; i++) {
    await supabase.from("users").insert({
      email: `user${i}@example.com`,
      name: `User ${i}`,
    });
  }
}

export async function deleteOldRecords(days: number) {
  await supabase.rpc("exec_sql", {
    sql: `DELETE FROM events WHERE created_at < NOW() - INTERVAL '${days} days'`,
  });
}
