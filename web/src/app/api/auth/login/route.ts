import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    const { password } = await req.json();

    // Simple Environment Variable Check
    // In production, user should set ADMIN_PASSWORD in Vercel
    const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'admin123';

    if (password === ADMIN_PASS) {
        (await cookies()).set('admin_session', 'true', { httpOnly: true, path: '/' });
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false }, { status: 401 });
}
