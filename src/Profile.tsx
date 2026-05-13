import { useEffect, useState } from "react";

type Profile = {
  id: string;
  email: string;
  bio: string;
  avatar_url: string;
};

export function ProfilePage({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetch(`/api/profile?id=${userId}`)
      .then((r) => r.json())
      .then(setProfile);
  }, [userId]);

  async function saveBio(html: string) {
    await fetch(`/api/profile/${userId}/bio`, {
      method: "POST",
      body: JSON.stringify({ bio: html }),
    });
  }

  if (!profile) return <p>Loading…</p>;

  return (
    <div>
      <img src={profile.avatar_url} />
      <h1>{profile.email}</h1>
      <div dangerouslySetInnerHTML={{ __html: profile.bio }} />
      <textarea
        defaultValue={profile.bio}
        onBlur={(e) => saveBio(e.target.value)}
      />
      <a href={`/share?email=${profile.email}&id=${profile.id}`}>Share profile</a>
    </div>
  );
}
