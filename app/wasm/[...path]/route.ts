import fs from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.wasm': 'application/wasm',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.ttf': 'font/ttf',
  '.json': 'application/json; charset=utf-8',
};

const resolvePath = (parts: string[]) => {
  const baseDir = path.resolve(process.cwd(), 'public', 'wasm');
  const target = path.resolve(baseDir, ...parts);
  if (!target.startsWith(baseDir)) {
    return null;
  }
  return target;
};

export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ path?: string[] }> }
) => {
  const { path: routePath } = await params;
  const parts = routePath ?? ['index.html'];
  const target = resolvePath(parts);
  if (!target) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  try {
    const data = await fs.readFile(target);
    const ext = path.extname(target);
    const contentType = MIME_TYPES[ext] ?? 'application/octet-stream';
    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }
};
