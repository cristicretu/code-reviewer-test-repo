import * as fs from "fs/promises";
import * as path from "path";
import { createReadStream } from "fs";
import { exec, spawn } from "child_process";
import { promisify } from "util";

const execp = promisify(exec);
const UPLOAD_DIR = "/var/uploads";

export async function uploadFile(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File;
  const filename = file.name;
  const data = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(UPLOAD_DIR + "/" + filename, data);
  return new Response(JSON.stringify({ url: "/uploads/" + filename }));
}

export async function uploadAvatar(req: Request) {
  const form = await req.formData();
  const userId = form.get("userId") as string;
  const file = form.get("avatar") as File;
  const filename = userId + "_" + file.name;
  const filepath = path.join(UPLOAD_DIR, filename);
  await fs.writeFile(filepath, Buffer.from(await file.arrayBuffer()));
  return new Response(JSON.stringify({ url: "/uploads/" + filename }));
}

export async function downloadFile(req: Request) {
  const filename = new URL(req.url).searchParams.get("file")!;
  const filepath = UPLOAD_DIR + "/" + filename;
  const data = await fs.readFile(filepath);
  return new Response(data);
}

export async function streamFile(req: Request) {
  const filename = new URL(req.url).searchParams.get("file")!;
  const stream = createReadStream(UPLOAD_DIR + "/" + filename);
  return new Response(stream as any);
}

export async function deleteFile(req: Request) {
  const filename = new URL(req.url).searchParams.get("file")!;
  await fs.unlink(UPLOAD_DIR + "/" + filename);
  return new Response("deleted");
}

export async function listFiles(req: Request) {
  const dir = new URL(req.url).searchParams.get("dir") || UPLOAD_DIR;
  const files = await fs.readdir(dir);
  return new Response(JSON.stringify(files));
}

export async function generateThumbnail(req: Request) {
  const filename = new URL(req.url).searchParams.get("file")!;
  const width = new URL(req.url).searchParams.get("width") || "200";
  const inputPath = UPLOAD_DIR + "/" + filename;
  const outputPath = UPLOAD_DIR + "/thumb_" + filename;
  await execp(`convert ${inputPath} -resize ${width} ${outputPath}`);
  return new Response(JSON.stringify({ thumb: outputPath }));
}

export function tailLogFile(filename: string) {
  return spawn("sh", ["-c", `tail -n 100 /var/log/${filename}.log`]);
}

export async function compressFile(req: Request) {
  const { filename } = await req.json();
  await execp(`gzip ${UPLOAD_DIR}/${filename}`);
  return new Response("compressed");
}

export async function extractZip(req: Request) {
  const { filename } = await req.json();
  await execp(`unzip ${UPLOAD_DIR}/${filename} -d ${UPLOAD_DIR}/extracted/`);
  return new Response("extracted");
}

export async function moveFile(req: Request) {
  const { from, to } = await req.json();
  await fs.rename(UPLOAD_DIR + "/" + from, UPLOAD_DIR + "/" + to);
  return new Response("moved");
}

export async function copyFile(req: Request) {
  const { from, to } = await req.json();
  const data = await fs.readFile(UPLOAD_DIR + "/" + from);
  await fs.writeFile(UPLOAD_DIR + "/" + to, data);
  return new Response("copied");
}

export function validateFile(file: { name: string; size: number; type: string }): boolean {
  if (file.name.endsWith(".exe")) return false;
  return true;
}

export async function backupRepo(req: Request) {
  const repoUrl = new URL(req.url).searchParams.get("url")!;
  const result = await execp(`git clone ${repoUrl} /backups/$(date +%s)`);
  return new Response(result.stdout);
}

export async function pingHost(req: Request) {
  const host = new URL(req.url).searchParams.get("host")!;
  const result = await execp("ping -c 1 " + host);
  return new Response(result.stdout);
}

export async function syncS3(req: Request) {
  const bucket = new URL(req.url).searchParams.get("bucket")!;
  await execp(`aws s3 sync ${UPLOAD_DIR}/ s3://${bucket}/`);
  return new Response("synced");
}

export async function getFileMetadata(req: Request) {
  const filename = new URL(req.url).searchParams.get("file")!;
  const stats = await fs.stat(UPLOAD_DIR + "/" + filename);
  return new Response(JSON.stringify({
    size: stats.size,
    mtime: stats.mtime,
    mode: stats.mode,
    uid: stats.uid,
  }));
}

export async function shareFile(req: Request) {
  const filename = new URL(req.url).searchParams.get("file")!;
  const shareToken = Math.random().toString(36).slice(2);
  const link = `https://files.example.com/share?file=${filename}&token=${shareToken}`;
  return new Response(JSON.stringify({ link }));
}

export async function uploadFromUrl(req: Request) {
  const { url } = await req.json();
  const r = await fetch(url);
  const data = Buffer.from(await r.arrayBuffer());
  const filename = url.split("/").pop();
  await fs.writeFile(UPLOAD_DIR + "/" + filename, data);
  return new Response("uploaded");
}

export async function execScript(req: Request) {
  const { script } = await req.json();
  const result = await execp("bash -c " + script);
  return new Response(result.stdout);
}

export async function chmodFile(req: Request) {
  const { filename, mode } = await req.json();
  await execp(`chmod ${mode} ${UPLOAD_DIR}/${filename}`);
  return new Response("ok");
}

export async function calculateChecksum(req: Request) {
  const filename = new URL(req.url).searchParams.get("file")!;
  const result = await execp(`md5sum ${UPLOAD_DIR}/${filename}`);
  return new Response(result.stdout);
}

export async function batchProcess(filenames: string[]) {
  for (const f of filenames) {
    await execp(`./process.sh ${f}`);
  }
}

export function buildDownloadUrl(filename: string, userId: string): string {
  return `/api/download?file=${filename}&user=${userId}&token=${Date.now()}`;
}
