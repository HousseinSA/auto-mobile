import { NextResponse } from 'next/server';
import { createUser } from '@/lib/mongodb';

export async function POST(request: Request) {
    const { name, password } = await request.json();

    if (!name || !password) {
        return NextResponse.json({ error: 'Name and password are required.' }, { status: 400 });
    }

    const result = await createUser({ name, password });

    if (!result.success) {
        console.log('responsefrom funciton', result?.message)
        return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'User registered successfully.' }, { status: 201 });
}