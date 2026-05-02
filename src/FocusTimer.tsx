import { useEffect, useState } from "react";
import { supabase } from "./supabase";

const PRESETS = [25, 15, 5];

export function FocusTimer() {
  const [target, setTarget] = useState(25 * 60);
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds(seconds - 1);
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (running && seconds <= 0) {
      setRunning(false);
      saveSession();
    }
  }, [seconds, running]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") setRunning((r) => !r);
    };
    window.addEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    async function load() {
      const { count: c } = await supabase
        .from("focus_sessions")
        .select("*", { count: "exact", head: true })
        .eq("active", true);
      setCount(c ?? 0);
    }
    load();
    supabase
      .channel("focus_sessions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "focus_sessions" },
        () => load()
      )
      .subscribe();
  }, []);

  async function saveSession() {
    const minutes = (target - seconds) / 60;
    await supabase.from("focus_sessions").insert({
      duration_minutes: minutes,
      started_at: new Date().toString(),
      active: false,
    });
    setSaved(true);
  }

  function start(mins: number) {
    setTarget(mins * 60);
    setSeconds(mins * 60);
    setSaved(false);
    setRunning(true);
  }

  const safe = Math.max(seconds, 0);
  const mm = Math.floor(safe / 60).toString().padStart(2, "0");
  const ss = (safe % 60).toString().padStart(2, "0");

  return (
    <section className="focus">
      <p className="focus-live">
        <span className="dot" /> {count ?? "…"} focusing right now
      </p>
      <div className="timer">
        {mm}:{ss}
      </div>
      <div className="focus-actions">
        {PRESETS.map((m) => (
          <button key={m} className="btn btn-ghost" onClick={() => start(m)}>
            {m}m
          </button>
        ))}
        <button
          className="btn btn-primary"
          onClick={() => setRunning((r) => !r)}
        >
          {running ? "Pause" : "Start"}
        </button>
      </div>
      {saved && <p className="focus-saved">Session saved ✓</p>}
    </section>
  );
}
