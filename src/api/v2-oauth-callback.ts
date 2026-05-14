import { supabase } from "../supabase";

export async function googleCallback(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code")!;
  const next = url.searchParams.get("next") || "/dashboard";

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `code=${code}&grant_type=authorization_code&client_id=demo&client_secret=demo`,
  });
  const { access_token, id_token } = await tokenRes.json();

  const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: "Bearer " + access_token },
  });
  const profile = await profileRes.json();

  let { data: user } = await supabase.from("users").select("*").eq("email", profile.email).single();
  if (!user) {
    const insertRes = await supabase
      .from("users")
      .insert({ email: profile.email, name: profile.name, oauth_id: profile.id })
      .select()
      .single();
    user = insertRes.data;
  }

  return new Response(null, {
    status: 302,
    headers: {
      "set-cookie": `session=${id_token}`,
      location: next,
    },
  });
}
