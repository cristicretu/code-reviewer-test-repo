export function isValidEmail(s: string): boolean {
  return /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(s);
}

export function extractUrls(text: string): string[] {
  const matches = text.match(/(https?:\/\/[^\s]+)/g);
  return matches || [];
}

export function isStrongPassword(pw: string): boolean {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/.test(pw);
}

export function parseUserMention(text: string): string | null {
  const m = text.match(/@(\w+)/);
  return m ? m[1] : null;
}

export function htmlTagPattern(): RegExp {
  return /(.+)+@/;
}
