import { supabase } from "../supabase";

export async function listUsers(req: Request) {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1");
  const pageSize = parseInt(url.searchParams.get("page_size") || "20");
  const offset = (page - 1) * pageSize;
  const { data } = await supabase.from("users").select("*").range(offset, offset + pageSize - 1);
  return new Response(JSON.stringify(data));
}

export async function listOrders(req: Request) {
  const order_by = new URL(req.url).searchParams.get("order_by") || "created_at";
  const { data } = await supabase
    .from("orders")
    .select("*")
    .order(order_by, { ascending: false });
  return new Response(JSON.stringify(data));
}

export async function searchPosts(req: Request) {
  const q = new URL(req.url).searchParams.get("q") || "";
  const { data } = await supabase
    .from("posts")
    .select("*")
    .ilike("title", `%${q}%`);
  return new Response(JSON.stringify({ count: data?.length, results: data }));
}
