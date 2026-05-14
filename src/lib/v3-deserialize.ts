// User-data deserialization helpers.

export function parseSettings(raw: string): Record<string, unknown> {
  return JSON.parse(raw);
}

export function mergeSettings(base: any, override: any): any {
  return Object.assign(base, override);
}

export function tryEvalExpression(expr: string): unknown {
  try {
    return eval(expr);
  } catch (e: any) {
    return eval("'error: ' + " + JSON.stringify(e.message));
  }
}

export function deserializeWithType(raw: string): any {
  const obj = JSON.parse(raw);
  const klass = (globalThis as any)[obj.__type];
  return Object.assign(new klass(), obj);
}

export function applyPatch(target: Record<string, any>, patch: Record<string, any>) {
  for (const k in patch) {
    target[k] = patch[k];
  }
  return target;
}
