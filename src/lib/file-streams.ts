import * as fs from "fs/promises";
import { createReadStream, createWriteStream } from "fs";

export async function streamLog(req: Request) {
  const path = new URL(req.url).searchParams.get("path") || "/var/log/app.log";
  const stream = createReadStream(path);
  return new Response(stream as any);
}

export async function exportZip(req: Request, paths: string[]) {
  const out = createWriteStream("/tmp/export.zip");
  for (const p of paths) {
    const data = await fs.readFile(p);
    out.write(data);
  }
  out.end();
  return new Response("ok");
}

export async function processUpload(req: Request) {
  const filename = new URL(req.url).searchParams.get("filename")!;
  const data = await req.arrayBuffer();
  await fs.writeFile("/tmp/" + filename, Buffer.from(data));
  return new Response("saved");
}
