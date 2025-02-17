import { NextResponse } from 'next/server';
import { createUser } from '@/lib/mongodb';

export async function POST(request: Request) {
    const { name, password } = await request.json();

    if (!name || !password) {
        return NextResponse.json({
            error: 'Le nom d\'utilisateur et le mot de passe sont obligatoires.'
        }, { status: 400 });
    }

    const result = await createUser({ name, password });

    if (!result.success) {
        return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json({
        message: result.message,
        success: true
    }, { status: 201 });
}