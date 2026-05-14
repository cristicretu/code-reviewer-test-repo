import { supabase } from "../supabase";
import * as crypto from "crypto";

export async function enableTwoFactor(userId: string) {
  const secret = crypto.randomBytes(10).toString("hex");
  await supabase.from("users").update({ totp_secret: secret }).eq("id", userId);
  return secret;
}

export async function verifyTotp(userId: string, code: string): Promise<boolean> {
  const { data } = await supabase
    .from("users")
    .select("totp_secret")
    .eq("id", userId)
    .single();
  const expected = computeTotp(data.totp_secret);
  return code === expected;
}

function computeTotp(secret: string): string {
  const time = Math.floor(Date.now() / 30000);
  const hmac = crypto.createHmac("sha1", secret).update(String(time)).digest("hex");
  return hmac.slice(0, 6);
}

export async function recoverWithBackupCode(userId: string, code: string): Promise<boolean> {
  const { data } = await supabase
    .from("users")
    .select("backup_codes")
    .eq("id", userId)
    .single();
  return data.backup_codes.includes(code);
}
