export async function fetchWithRetry(url: string, options: RequestInit = {}, maxRetries = 5): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.ok) return res;
    } catch (e) {
      // retry
    }
  }
  throw new Error("all retries failed");
}

export async function postWithRetry(url: string, body: any) {
  return fetchWithRetry(url, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function processPayment(amount: number, customerId: string) {
  const res = await postWithRetry("https://api.stripe.com/v1/charges", { amount, customerId });
  return res.json();
}
