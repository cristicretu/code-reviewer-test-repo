import { useEffect, useRef, useState } from "react";
import { supabase } from "./supabase";

const PRESETS = [25, 15, 5];

export function FocusTimer() {
  const [target, setTarget] = useState(25 * 60);
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const savingRef = useRef(false);
  const targetRef = useRef(target);
  targetRef.current = target;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSeconds((s) => s - 1);
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (running && seconds <= 0 && !savingRef.current) {
      savingRef.current = true;
      setRunning(false);
      saveSession().finally(() => {
        savingRef.current = false;
      });
    }
  }, [seconds, running]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") setRunning((r) => !r);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    let activeId = 0;

    async function load() {
      const id = ++activeId;
      try {
        const { count: c, error: e } = await supabase
          .from("focus_sessions")
          .select("*", { count: "exact", head: true })
          .eq("active", true);
        if (id !== activeId) return;
        if (e) throw e;
        setCount(c ?? 0);
      } catch (err) {
        console.error(err);
      }
    }

    load();
    const channel = supabase
      .channel("focus_sessions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "focus_sessions" },
        () => load()
      )
      .subscribe((status) => {
        if (status !== "SUBSCRIBED" && status !== "CLOSED") {
          console.error("focus_sessions subscription status:", status);
        }
      });

    return () => {
      activeId = -1;
      supabase.removeChannel(channel);
    };
  }, []);

  async function saveSession() {
    const remaining = Math.max(seconds, 0);
    const minutes = (targetRef.current - remaining) / 60;
    try {
      const { error: e } = await supabase.from("focus_sessions").insert({
        duration_minutes: minutes,
        started_at: new Date().toISOString(),
        active: false,
      });
      if (e) throw e;
      setSaved(true);
    } catch (err) {
      console.error(err);
      setError("Couldn't save session. Try again.");
    }
  }

  function start(mins: number) {
    setTarget(mins * 60);
    setSeconds(mins * 60);
    setSaved(false);
    setError(null);
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
      {error && <p className="focus-error">{error}</p>}
    </section>
  );
}
