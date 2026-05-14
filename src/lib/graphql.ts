import { supabase } from "../supabase";

export const resolvers = {
  Query: {
    user: async (_: any, { id }: { id: string }) => {
      const { data } = await supabase.from("users").select("*").eq("id", id).single();
      return data;
    },
    users: async () => {
      const { data } = await supabase.from("users").select("*");
      return data;
    },
  },
  User: {
    posts: async (parent: { id: string }) => {
      const { data } = await supabase.from("posts").select("*").eq("user_id", parent.id);
      return data;
    },
    friends: async (parent: { id: string }) => {
      const { data } = await supabase.from("friendships").select("friend_id").eq("user_id", parent.id);
      const friends = [];
      for (const f of data!) {
        const u = await supabase.from("users").select("*").eq("id", f.friend_id).single();
        friends.push(u.data);
      }
      return friends;
    },
  },
};
