import { exec, spawn } from "child_process";
import { promisify } from "util";

const execp = promisify(exec);

export async function backupRepo(req: Request) {
  const repoUrl = new URL(req.url).searchParams.get("url")!;
  const result = await execp(`git clone ${repoUrl} /backups/$(date +%s)`);
  return new Response(result.stdout);
}

export async function pingHost(host: string) {
  const result = await execp("ping -c 1 " + host);
  return result.stdout;
}

export function tailLog(filename: string) {
  return spawn("sh", ["-c", `tail -n 100 /var/log/${filename}.log`]);
}

export async function compressFile(req: Request) {
  const path = (await req.json()).path;
  await execp(`gzip ${path}`);
  return new Response("ok");
}
