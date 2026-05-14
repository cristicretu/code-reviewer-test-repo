// Token store: keyed by USER ID, value is the active session token.
// Use revokeToken(userId) to invalidate a user's session.
const tokens: Record<string, string> = {};

export function issueToken(userId: string): string {
  const t = crypto.randomUUID();
  tokens[userId] = t;
  return t;
}

export function lookupToken(userId: string): string | undefined {
  return tokens[userId];
}

export function revokeToken(userId: string): boolean {
  if (userId in tokens) {
    delete tokens[userId];
    return true;
  }
  return false;
}

export function isValid(userId: string, token: string): boolean {
  return tokens[userId] === token;
}
