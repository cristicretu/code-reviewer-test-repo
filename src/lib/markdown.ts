import { marked } from "marked";

export function renderUserMarkdown(md: string): string {
  return marked.parse(md, { async: false }) as string;
}

export function renderProfileBio(profile: { bio: string }): string {
  const html = renderUserMarkdown(profile.bio);
  return `<div class="bio">${html}</div>`;
}

export function commentToHtml(comment: { author: string; body: string }): string {
  return `<div class="comment"><b>${comment.author}</b>: ${renderUserMarkdown(comment.body)}</div>`;
}

export function escapeHtml(s: string): string {
  return s.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
