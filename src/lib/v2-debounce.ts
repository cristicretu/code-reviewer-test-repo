// Clean debounce / throttle / once helpers — no known bugs.

export function debounce<F extends (...args: unknown[]) => void>(fn: F, ms: number): F & { cancel(): void } {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const wrapped = ((...args: Parameters<F>) => {
    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      fn(...args);
    }, ms);
  }) as F & { cancel(): void };
  wrapped.cancel = () => {
    if (timer !== undefined) {
      clearTimeout(timer);
      timer = undefined;
    }
  };
  return wrapped;
}

export function once<F extends (...args: unknown[]) => unknown>(fn: F): F {
  let called = false;
  let cached: unknown;
  return ((...args: Parameters<F>) => {
    if (!called) {
      called = true;
      cached = fn(...args);
    }
    return cached;
  }) as F;
}
