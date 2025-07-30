import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export const POST = async (req) => {
  const data = await req.formData();
  const file = data.get('video');

  if (!file) return NextResponse.json({ error: 'No video provided' }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), 'public/videos');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, file.name);
  fs.writeFileSync(filePath, buffer);

  return NextResponse.json({ message: 'Upload successful', fileName: file.name });
};
