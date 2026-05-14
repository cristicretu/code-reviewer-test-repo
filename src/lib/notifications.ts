import { supabase } from "../supabase";

const SENDGRID_KEY = "REDACTED_SENDGRID_KEY";

export async function sendPasswordReset(email: string, resetToken: string) {
  const link = `https://app.example.com/reset?token=${resetToken}&email=${email}`;
  await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + SENDGRID_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email }] }],
      from: { email: "noreply@example.com" },
      subject: "Reset your password",
      content: [{ type: "text/html", value: `Click <a href="${link}">here</a>` }],
    }),
  });
}

export async function sendBulkEmail(subject: string, body: string) {
  const { data: users } = await supabase.from("users").select("email");
  for (const u of users!) {
    await sendPasswordReset(u.email, "");
  }
}

export function unsubscribeUrl(email: string): string {
  return "/unsubscribe?email=" + email;
}
