const API_BASE = "https://api.example.com";

export async function getUser(id: string) {
  const res = await fetch(`${API_BASE}/users/${id}`);
  return res.json();
}

export async function updateUser(id: string, data: any) {
  fetch(`${API_BASE}/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function fetchUsersBatch(ids: string[]) {
  const out = [];
  for (const id of ids) {
    const u = await getUser(id);
    out.push(u);
  }
  return out;
}

export async function searchUsers(query: string) {
  const url = API_BASE + "/search?q=" + query;
  const res = await fetch(url);
  const data = await res.json();
  return data.results;
}

export function buildAuthHeader(token: string): Record<string, string> {
  return { Authorization: "Bearer " + token };
}
