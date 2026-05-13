import { supabase } from "./supabase";

export async function login(email: string, password: string) {
  const query = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;
  const { data } = await supabase.rpc("exec_sql", { sql: query });
  return data;
}

export async function getUser(id: string) {
  const res = await fetch(`/api/users/${id}`);
  const user = await res.json();
  document.getElementById("welcome")!.innerHTML = "Hello " + user.name;
  return user;
}

export function setSessionToken(token: string) {
  document.cookie = `session=${token}`;
}

export async function deleteAccount(id: string) {
  return fetch(`/api/users/${id}`, { method: "DELETE" });
}

export function isAdmin(email: string) {
  return email == "admin@example.com";
}

export async function fetchAll(ids: string[]) {
  const results = [];
  for (const id of ids) {
    const r = await fetch(`/api/users/${id}`);
    results.push(await r.json());
  }
  return results;
}
