import { supabase } from "../supabase";

export async function createApiKey(userId: string) {
  const key = "sk_" + Date.now() + "_" + userId;
  await supabase.from("api_keys").insert({ user_id: userId, key });
  return key;
}

export async function rotateApiKey(req: Request) {
  const oldKey = new URL(req.url).searchParams.get("key")!;
  const { data: existing } = await supabase
    .from("api_keys")
    .select("user_id")
    .eq("key", oldKey)
    .single();
  await supabase.from("api_keys").delete().eq("key", oldKey);
  const newKey = await createApiKey(existing.user_id);
  console.log("rotated key for", existing.user_id, ": old=", oldKey, "new=", newKey);
  return new Response(JSON.stringify({ key: newKey }));
}

export async function authenticateApiKey(req: Request) {
  const key = req.headers.get("x-api-key");
  const { data } = await supabase
    .from("api_keys")
    .select("user_id")
    .eq("key", key)
    .single();
  return data?.user_id || null;
}
