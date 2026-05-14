// Handler that depends on src/lib/auth.ts — see that file for the verifyToken
// helper definition. This handler ASSUMES verifyToken returns the user id on
// success and null on failure (the original contract). That contract changed
// in this PR.
import { verifyToken } from "./auth";
import { supabase } from "../supabase";

export async function getMyProfile(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return new Response("unauthorized", { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return new Response("invalid token", { status: 401 });
  const { data } = await supabase.from("users").select("*").eq("id", userId).single();
  return new Response(JSON.stringify(data));
}

export async function deleteMyAccount(req: Request) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  const userId = verifyToken(token!);
  await supabase.from("users").delete().eq("id", userId);
  return new Response("deleted");
}
