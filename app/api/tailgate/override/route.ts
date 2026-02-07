import { NextResponse } from 'next/server';

/**
 * Dev-only tailgate override endpoint used to bypass the gate locally.
 */
export async function GET(request: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const configuredToken = process.env.TAILGATE_DEV_TOKEN;
  if (configuredToken) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    if (!token || token !== configuredToken) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
  }

  return NextResponse.json({ ok: true });
}
