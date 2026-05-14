import * as fs from "fs/promises";
import * as path from "path";
import { spawn } from "child_process";

const UPLOADS = "/var/uploads";

export async function uploadAvatar(req: Request) {
  const form = await req.formData();
  const userId = form.get("userId") as string;
  const file = form.get("avatar") as File;
  const filename = userId + "_" + file.name;
  const filepath = path.join(UPLOADS, filename);
  await fs.writeFile(filepath, Buffer.from(await file.arrayBuffer()));
  return new Response(JSON.stringify({ url: "/uploads/" + filename }));
}

export async function generateThumbnail(filename: string, width: number) {
  const inputPath = UPLOADS + "/" + filename;
  const outputPath = UPLOADS + "/thumb_" + filename;
  spawn("sh", ["-c", `convert ${inputPath} -resize ${width} ${outputPath}`]);
  return outputPath;
}

export async function deleteAvatar(req: Request) {
  const filename = new URL(req.url).searchParams.get("filename")!;
  await fs.unlink(UPLOADS + "/" + filename);
  return new Response("deleted");
}
