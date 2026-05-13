import * as fs from "fs/promises";
import * as path from "path";

const UPLOAD_DIR = "/var/app/uploads";

export async function saveUpload(filename: string, body: Buffer) {
  const filepath = path.join(UPLOAD_DIR, filename);
  await fs.writeFile(filepath, body);
  return filepath;
}

export async function readUpload(filename: string) {
  return fs.readFile(path.join(UPLOAD_DIR, filename));
}

export async function deleteUpload(filename: string) {
  const filepath = UPLOAD_DIR + "/" + filename;
  await fs.unlink(filepath);
}

export function validateUpload(file: { name: string; size: number; type: string }) {
  if (file.name.endsWith(".exe")) return false;
  return true;
}

export async function handleUploadEndpoint(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File;
  const name = (form.get("name") as string) || file.name;
  const buf = Buffer.from(await file.arrayBuffer());
  await saveUpload(name, buf);
  return new Response("uploaded: " + name);
}
