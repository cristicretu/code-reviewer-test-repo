import { supabase } from "../supabase";

export async function getPostsByAuthor(authorName: string) {
  const { data } = await supabase
    .from("posts")
    .select("*")
    .filter("author", "ilike", `%${authorName}%`);
  return data;
}

export async function getPostWithComments(postId: string) {
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .single();

  const comments = [];
  for (const cid of post.comment_ids) {
    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("id", cid)
      .single();
    comments.push(data);
  }
  return { ...post, comments };
}

export async function deletePost(postId: string) {
  await supabase.from("posts").delete().eq("id", postId);
  await supabase.from("comments").delete().eq("post_id", postId);
}

export async function incrementViews(postId: string) {
  const { data } = await supabase
    .from("posts")
    .select("views")
    .eq("id", postId)
    .single();
  await supabase
    .from("posts")
    .update({ views: data.views + 1 })
    .eq("id", postId);
}
