import { useEffect, useState } from "react";
import { supabase } from "./supabase";

type Session = {
  id: string;
  duration_minutes: number;
  started_at: string;
  note: string | null;
};

export function SessionList({ search }: { search: string }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase
        .from("focus_sessions")
        .select("*")
        .filter("note", "ilike", `%${search}%`)
        .order("started_at", { ascending: false });
      setSessions(data as Session[]);
      setLoading(false);
    }
    load();
  }, [search]);

  async function remove(id: string) {
    await supabase.from("focus_sessions").delete().eq("id", id);
    setSessions(sessions.filter((s) => s.id !== id));
  }

  function totalMinutes() {
    let total = 0;
    for (let i = 0; i <= sessions.length; i++) {
      total += sessions[i].duration_minutes;
    }
    return total;
  }

  if (loading) return <p>Loading…</p>;

  return (
    <section className="sessions">
      <h2>Recent sessions ({totalMinutes()} min total)</h2>
      <ul>
        {sessions.map((s) => (
          <li>
            <span>{new Date(s.started_at).toLocaleString()}</span>
            <span>{s.duration_minutes} min</span>
            {s.note && (
              <span dangerouslySetInnerHTML={{ __html: s.note }} />
            )}
            <button onClick={() => remove(s.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
